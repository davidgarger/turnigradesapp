import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

// ---------- Types ----------
export type ClassId = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";

export interface Discipline {
  id: string;
  name: string;
  weight: number; // relative weight (any positive number; only ratios matter)
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  classId: ClassId;
  // discipline scores: id -> points 0-100 (undefined = nicht gemessen, wird nicht gewertet)
  scores: Record<string, number | undefined>;
  forgottenKit: number;
  excusedNotParticipating: number;
  unexcusedNotParticipating: number;
  attended: number; // Anzahl tatsächlich mitgeturnter Stunden
  redPoints: number;   // Disziplin-Minuspunkte (3 = eine Note schlechter im Betragen)
  greenPoints: number; // positive Punkte (heben rote Punkte auf)
}

export interface ClassSchedule {
  startDate: string; // ISO yyyy-mm-dd – Schuljahresbeginn
  endDate: string;   // ISO yyyy-mm-dd – Schuljahresende
  weekdays: number[]; // 0=So, 1=Mo, ... 6=Sa – Tage mit Turnstunden
  lessonsPerDay: number; // Anzahl Turnstunden pro Termin (z. B. 1 oder 2)
  cancelled: number; // entfallene Stunden
}

export type LessonEntryType =
  | "attended"
  | "forgottenKit"
  | "excused"
  | "unexcused";

export interface LessonEntry {
  studentId: string;
  type: LessonEntryType;
  at: string; // ISO timestamp
}

export interface Lesson {
  id: string;
  date: string; // ISO yyyy-mm-dd (Datum der Stunde)
  createdAt: string; // ISO Zeitstempel beim Start
  topic: string; // optionales Thema
  entries: LessonEntry[];
}

export interface ClassData {
  id: ClassId;
  name: string;
  disciplines: Discipline[];
  students: Student[];
  totalLessons: number; // manuelle Gesamtzahl (Fallback falls kein Stundenplan)
  schedule?: ClassSchedule;
  lessons?: Lesson[]; // Verlauf gehaltener Stunden
}

export interface GradingSettings {
  forgottenKitPenalty: number;
  excusedPenalty: number;
  unexcusedPenalty: number;
  // grade thresholds (>= threshold → that grade). Sorted desc.
  gradeThresholds: { grade: number; min: number }[];
}

export interface TurnState {
  classes: Record<ClassId, ClassData>;
  settings: GradingSettings;
}

// Zählt die Termine im Datumsbereich, die auf einen der Wochentage fallen,
// multipliziert mit lessonsPerDay, abzüglich entfallener Stunden.
export function computeScheduledLessons(schedule: ClassSchedule): number {
  if (!schedule.startDate || !schedule.endDate || schedule.weekdays.length === 0) return 0;
  const start = new Date(schedule.startDate + "T00:00:00");
  const end = new Date(schedule.endDate + "T00:00:00");
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return 0;
  const weekdaySet = new Set(schedule.weekdays);
  let count = 0;
  const cur = new Date(start);
  // Sicherheitslimit ca. 5 Jahre
  let safety = 366 * 5;
  while (cur <= end && safety-- > 0) {
    if (weekdaySet.has(cur.getDay())) count++;
    cur.setDate(cur.getDate() + 1);
  }
  const planned = count * Math.max(1, schedule.lessonsPerDay || 1);
  return Math.max(0, planned - Math.max(0, schedule.cancelled));
}

export function getEffectiveTotalLessons(cls: ClassData): number {
  if (cls.schedule) return computeScheduledLessons(cls.schedule);
  return cls.totalLessons;
}

// ---------- Defaults ----------
const defaultDisciplines = (): Discipline[] => [
  { id: "shuttle", name: "Shuttle Run", weight: 1 },
  { id: "cooper", name: "Cooper-Test", weight: 1 },
];

const defaultSettings: GradingSettings = {
  forgottenKitPenalty: 3,
  excusedPenalty: 0,
  unexcusedPenalty: 8,
  gradeThresholds: [
    { grade: 1, min: 90 },
    { grade: 2, min: 75 },
    { grade: 3, min: 60 },
    { grade: 4, min: 45 },
    { grade: 5, min: 0 },
  ],
};

const sampleNames: Partial<Record<ClassId, [string, string][]>> = {
  "1": [
    ["Anna", "Bauer"],
    ["Leon", "Huber"],
    ["Mia", "Gruber"],
    ["Paul", "Steiner"],
    ["Lena", "Mayer"],
  ],
  "2": [
    ["Felix", "Wagner"],
    ["Sophie", "Berger"],
    ["Jonas", "Pichler"],
    ["Emma", "Hofer"],
  ],
  "3": [
    ["Tobias", "Schmid"],
    ["Laura", "Auer"],
    ["David", "Reiter"],
    ["Hannah", "Lang"],
  ],
  "4": [
    ["Maximilian", "Eder"],
    ["Sarah", "Köhler"],
    ["Lukas", "Wolf"],
    ["Julia", "Aigner"],
  ],
};

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

const DEFAULT_TOTAL_LESSONS = 10;

function seedStudents(classId: ClassId): Student[] {
  return (sampleNames[classId] ?? []).map(([fn, ln], i) => ({
    id: genId(),
    firstName: fn,
    lastName: ln,
    classId,
    scores: {
      shuttle: 60 + ((i * 7) % 35),
      cooper: 55 + ((i * 11) % 40),
    },
    forgottenKit: i % 3 === 0 ? 1 : 0,
    excusedNotParticipating: i % 4 === 0 ? 1 : 0,
    unexcusedNotParticipating: i === 1 ? 1 : 0,
    attended: Math.max(0, DEFAULT_TOTAL_LESSONS - (i % 4)),
    redPoints: i === 1 ? 2 : 0,
    greenPoints: i % 2 === 0 ? 1 : 0,
  }));
}

const ALL_CLASS_IDS: ClassId[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

function defaultState(): TurnState {
  const mk = (id: ClassId, name: string): ClassData => ({
    id,
    name,
    disciplines: defaultDisciplines(),
    students: seedStudents(id),
    totalLessons: DEFAULT_TOTAL_LESSONS,
  });
  const classes = {} as Record<ClassId, ClassData>;
  for (const id of ALL_CLASS_IDS) {
    classes[id] = mk(id, `${id}. Klasse`);
  }
  return {
    classes,
    settings: defaultSettings,
  };
}

// ---------- Store ----------
const STORAGE_KEY = "turn-app-state-v2";

function load(): TurnState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as TurnState;
    if (!parsed.classes || !parsed.settings) return defaultState();
    return parsed;
  } catch {
    return defaultState();
  }
}

let state: TurnState = typeof window === "undefined" ? defaultState() : load();
const listeners = new Set<() => void>();

// ---------- Undo history ----------
const HISTORY_LIMIT = 30;
const history: TurnState[] = [];
let lastHistoryPush = 0;

function pushHistory(prev: TurnState) {
  const now = Date.now();
  // Aufeinanderfolgende schnelle Änderungen (≤ 400 ms) zu einem Schritt zusammenfassen
  if (now - lastHistoryPush > 400) {
    history.push(prev);
    if (history.length > HISTORY_LIMIT) history.shift();
  }
  lastHistoryPush = now;
}

export function canUndo() {
  return history.length > 0;
}

export function undo(): boolean {
  const prev = history.pop();
  if (!prev) return false;
  state = prev;
  persist();
  scheduleCloudSave();
  listeners.forEach((l) => l());
  return true;
}

// ---------- Cloud sync ----------
let currentUserId: string | null = null;
let isApplyingRemote = false;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let lastSavedAt: string | null = null;
let realtimeChannel: ReturnType<typeof supabase.channel> | null = null;

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota */
  }
}

function scheduleCloudSave() {
  if (!currentUserId || isApplyingRemote) return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    if (!currentUserId) return;
    const { data, error } = await supabase
      .from("app_state")
      .upsert({ user_id: currentUserId, state: JSON.parse(JSON.stringify(state)) })
      .select("updated_at")
      .single();
    if (!error && data) {
      lastSavedAt = data.updated_at as string;
    } else if (error) {
      console.error("Cloud-Sync (Speichern) fehlgeschlagen:", error.message);
    }
  }, 600);
}

function setState(updater: (s: TurnState) => TurnState) {
  const prev = state;
  state = updater(state);
  if (!isApplyingRemote) pushHistory(prev);
  persist();
  scheduleCloudSave();
  listeners.forEach((l) => l());
}

function applyRemoteState(next: TurnState, updatedAt: string | null) {
  isApplyingRemote = true;
  state = next;
  lastSavedAt = updatedAt;
  persist();
  listeners.forEach((l) => l());
  isApplyingRemote = false;
}

async function loadFromCloud(userId: string) {
  const { data, error } = await supabase
    .from("app_state")
    .select("state, updated_at")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("Cloud-Sync (Laden) fehlgeschlagen:", error.message);
    return;
  }
  if (data && data.state && typeof data.state === "object" && (data.state as unknown as TurnState).classes) {
    applyRemoteState(data.state as unknown as TurnState, data.updated_at as string);
  } else {
    // Erste Anmeldung – aktuellen lokalen Zustand in die Cloud hochladen
    const { data: inserted, error: insErr } = await supabase
      .from("app_state")
      .upsert({ user_id: userId, state: JSON.parse(JSON.stringify(state)) })
      .select("updated_at")
      .single();
    if (!insErr && inserted) lastSavedAt = inserted.updated_at as string;
  }
}

function subscribeRealtime(userId: string) {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }
  realtimeChannel = supabase
    .channel(`app_state:${userId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "app_state", filter: `user_id=eq.${userId}` },
      (payload) => {
        const row = payload.new as { state?: unknown; updated_at?: string } | undefined;
        if (!row || !row.state) return;
        if (lastSavedAt && row.updated_at === lastSavedAt) return; // unsere eigene Schreibung
        const incoming = row.state as TurnState;
        if (!incoming.classes) return;
        applyRemoteState(incoming, row.updated_at ?? null);
      },
    )
    .subscribe();
}

export async function initCloudSync(userId: string | null) {
  currentUserId = userId;
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  if (realtimeChannel) {
    await supabase.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }
  lastSavedAt = null;
  if (!userId) {
    // Beim Logout lokalen Zustand auf Default zurücksetzen
    applyRemoteState(defaultState(), null);
    return;
  }
  await loadFromCloud(userId);
  subscribeRealtime(userId);
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useTurnState(): TurnState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
}

// ---------- Actions ----------
export const turnActions = {
  reset() {
    setState(() => defaultState());
  },
  renameClass(classId: ClassId, name: string) {
    setState((s) => ({
      ...s,
      classes: { ...s.classes, [classId]: { ...s.classes[classId], name } },
    }));
  },
  resetClass(classId: ClassId) {
    setState((s) => {
      const cls = s.classes[classId];
      return {
        ...s,
        classes: {
          ...s.classes,
          [classId]: {
            ...cls,
            lessons: [],
            schedule: cls.schedule ? { ...cls.schedule, cancelled: 0 } : cls.schedule,
            students: cls.students.map((st) => ({
              ...st,
              scores: {},
              forgottenKit: 0,
              excusedNotParticipating: 0,
              unexcusedNotParticipating: 0,
              attended: 0,
              redPoints: 0,
              greenPoints: 0,
            })),
          },
        },
      };
    });
  },
  swapClasses(a: ClassId, b: ClassId) {
    if (a === b) return;
    setState((s) => {
      const ca = s.classes[a];
      const cb = s.classes[b];
      // Inhalt tauschen, IDs/Namen der Slots bleiben
      const swappedA: ClassData = {
        ...cb,
        id: ca.id,
        name: ca.name,
        students: cb.students.map((st) => ({ ...st, classId: ca.id })),
      };
      const swappedB: ClassData = {
        ...ca,
        id: cb.id,
        name: cb.name,
        students: ca.students.map((st) => ({ ...st, classId: cb.id })),
      };
      return {
        ...s,
        classes: { ...s.classes, [a]: swappedA, [b]: swappedB },
      };
    });
  },
  setTotalLessons(classId: ClassId, totalLessons: number) {
    setState((s) => ({
      ...s,
      classes: {
        ...s.classes,
        [classId]: { ...s.classes[classId], totalLessons: Math.max(0, Math.round(totalLessons)) },
      },
    }));
  },
  incrementTotalLessons(classId: ClassId, delta: number) {
    setState((s) => {
      const cls = s.classes[classId];
      return {
        ...s,
        classes: {
          ...s.classes,
          [classId]: { ...cls, totalLessons: Math.max(0, (cls.totalLessons ?? 0) + delta) },
        },
      };
    });
  },
  setSchedule(classId: ClassId, schedule: ClassSchedule | undefined) {
    setState((s) => ({
      ...s,
      classes: { ...s.classes, [classId]: { ...s.classes[classId], schedule } },
    }));
  },
  incrementCancelled(classId: ClassId, delta: number) {
    setState((s) => {
      const cls = s.classes[classId];
      if (!cls.schedule) return s;
      return {
        ...s,
        classes: {
          ...s.classes,
          [classId]: {
            ...cls,
            schedule: {
              ...cls.schedule,
              cancelled: Math.max(0, cls.schedule.cancelled + delta),
            },
          },
        },
      };
    });
  },
  addStudent(classId: ClassId, firstName: string, lastName: string) {
    setState((s) => {
      const cls = s.classes[classId];
      const student: Student = {
        id: genId(),
        firstName,
        lastName,
        classId,
        scores: {},
        forgottenKit: 0,
        excusedNotParticipating: 0,
        unexcusedNotParticipating: 0,
        attended: 0,
        redPoints: 0,
        greenPoints: 0,
      };
      return {
        ...s,
        classes: { ...s.classes, [classId]: { ...cls, students: [...cls.students, student] } },
      };
    });
  },
  startLesson(classId: ClassId, topic: string): string {
    const id = genId();
    const now = new Date();
    const dateIso = now.toISOString().slice(0, 10);
    setState((s) => {
      const cls = s.classes[classId];
      const lesson: Lesson = {
        id,
        date: dateIso,
        createdAt: now.toISOString(),
        topic: topic.trim(),
        entries: [],
      };
      return {
        ...s,
        classes: {
          ...s.classes,
          [classId]: { ...cls, lessons: [...(cls.lessons ?? []), lesson] },
        },
      };
    });
    return id;
  },
  updateLessonTopic(classId: ClassId, lessonId: string, topic: string) {
    setState((s) => {
      const cls = s.classes[classId];
      return {
        ...s,
        classes: {
          ...s.classes,
          [classId]: {
            ...cls,
            lessons: (cls.lessons ?? []).map((l) =>
              l.id === lessonId ? { ...l, topic: topic.trim() } : l,
            ),
          },
        },
      };
    });
  },
  recordLessonEntry(
    classId: ClassId,
    lessonId: string,
    studentId: string,
    type: LessonEntryType,
  ) {
    setState((s) => {
      const cls = s.classes[classId];
      const lessons = cls.lessons ?? [];
      const nextLessons = lessons.map((l) =>
        l.id === lessonId
          ? {
              ...l,
              entries: [
                ...l.entries.filter((e) => e.studentId !== studentId),
                { studentId, type, at: new Date().toISOString() },
              ],
            }
          : l,
      );
      const students = cls.students.map((st) => {
        if (st.id !== studentId) return st;
        const next = { ...st };
        if (type === "attended") next.attended = st.attended + 1;
        else if (type === "forgottenKit") next.forgottenKit = st.forgottenKit + 1;
        else if (type === "excused")
          next.excusedNotParticipating = st.excusedNotParticipating + 1;
        else if (type === "unexcused")
          next.unexcusedNotParticipating = st.unexcusedNotParticipating + 1;
        return next;
      });
      return {
        ...s,
        classes: {
          ...s.classes,
          [classId]: { ...cls, lessons: nextLessons, students },
        },
      };
    });
  },
  updateStudent(classId: ClassId, studentId: string, patch: Partial<Student>) {
    setState((s) => {
      const cls = s.classes[classId];
      return {
        ...s,
        classes: {
          ...s.classes,
          [classId]: {
            ...cls,
            students: cls.students.map((st) => (st.id === studentId ? { ...st, ...patch } : st)),
          },
        },
      };
    });
  },
  setScore(classId: ClassId, studentId: string, disciplineId: string, value: number | undefined) {
    setState((s) => {
      const cls = s.classes[classId];
      return {
        ...s,
        classes: {
          ...s.classes,
          [classId]: {
            ...cls,
            students: cls.students.map((st) => {
              if (st.id !== studentId) return st;
              const nextScores = { ...st.scores };
              if (value === undefined || Number.isNaN(value)) {
                delete nextScores[disciplineId];
              } else {
                nextScores[disciplineId] = value;
              }
              return { ...st, scores: nextScores };
            }),
          },
        },
      };
    });
  },
  deleteStudent(classId: ClassId, studentId: string) {
    setState((s) => {
      const cls = s.classes[classId];
      return {
        ...s,
        classes: {
          ...s.classes,
          [classId]: { ...cls, students: cls.students.filter((st) => st.id !== studentId) },
        },
      };
    });
  },
  addDiscipline(classId: ClassId, name: string, weight = 1) {
    setState((s) => {
      const cls = s.classes[classId];
      return {
        ...s,
        classes: {
          ...s.classes,
          [classId]: {
            ...cls,
            disciplines: [...cls.disciplines, { id: genId(), name, weight }],
          },
        },
      };
    });
  },
  updateDiscipline(classId: ClassId, disciplineId: string, patch: Partial<Discipline>) {
    setState((s) => {
      const cls = s.classes[classId];
      return {
        ...s,
        classes: {
          ...s.classes,
          [classId]: {
            ...cls,
            disciplines: cls.disciplines.map((d) =>
              d.id === disciplineId ? { ...d, ...patch } : d,
            ),
          },
        },
      };
    });
  },
  deleteDiscipline(classId: ClassId, disciplineId: string) {
    setState((s) => {
      const cls = s.classes[classId];
      return {
        ...s,
        classes: {
          ...s.classes,
          [classId]: {
            ...cls,
            disciplines: cls.disciplines.filter((d) => d.id !== disciplineId),
            students: cls.students.map((st) => {
              const { [disciplineId]: _, ...rest } = st.scores;
              return { ...st, scores: rest };
            }),
          },
        },
      };
    });
  },
  updateSettings(patch: Partial<GradingSettings>) {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  },
};

// ---------- Grading logic ----------
export interface GradeResult {
  disciplineAverage: number; // weighted avg of entered disciplines (0-100); 100 if none entered
  attendanceRate: number; // 0..1
  penalties: number;
  total: number; // clamped 0..100
  grade: number;
  measuredCount: number;
  hasDisciplineData: boolean;
  behaviorNet: number;   // rote − grüne Punkte (mind. 0)
  behaviorGrade: number; // Betragensnote 1..5 (je 3 Netto-Rotpunkte eine Note schlechter)
}

export function computeGrade(
  student: Student,
  disciplines: Discipline[],
  settings: GradingSettings,
  totalLessons: number,
): GradeResult {
  let weightedSum = 0;
  let weightTotal = 0;
  let measuredCount = 0;
  for (const d of disciplines) {
    const v = student.scores[d.id];
    if (typeof v === "number" && !Number.isNaN(v)) {
      weightedSum += v * d.weight;
      weightTotal += d.weight;
      measuredCount++;
    }
  }
  const hasDisciplineData = weightTotal > 0;
  const disciplineAverage = hasDisciplineData ? weightedSum / weightTotal : 100;

  // Entschuldigte Stunden zählen nicht als „verpasst" – sie reduzieren die persönliche Soll-Stundenzahl.
  const personalLessons = Math.max(0, totalLessons - student.excusedNotParticipating);
  const attendanceRate =
    personalLessons > 0 ? Math.max(0, Math.min(1, student.attended / personalLessons)) : 1;

  const penalties =
    student.forgottenKit * settings.forgottenKitPenalty +
    student.excusedNotParticipating * settings.excusedPenalty +
    student.unexcusedNotParticipating * settings.unexcusedPenalty;

  const total = Math.max(
    0,
    Math.min(100, Math.round(disciplineAverage * attendanceRate - penalties)),
  );

  const sortedThresholds = [...settings.gradeThresholds].sort((a, b) => b.min - a.min);
  const grade = sortedThresholds.find((t) => total >= t.min)?.grade ?? 5;

  const behaviorNet = Math.max(0, student.redPoints - student.greenPoints);
  const behaviorGrade = Math.min(5, Math.max(1, 1 + Math.floor(behaviorNet / 3)));

  return {
    disciplineAverage,
    attendanceRate,
    penalties,
    total,
    grade,
    measuredCount,
    hasDisciplineData,
    behaviorNet,
    behaviorGrade,
  };
}

// ---------- CSV Export ----------
export function exportClassCsv(cls: ClassData, settings: GradingSettings): string {
  const headers = [
    "Vorname",
    "Nachname",
    "Klasse",
    ...cls.disciplines.map((d) => d.name),
    "Turnzeug vergessen",
    "Entschuldigt n. mitgeturnt",
    "Nicht entschuldigt",
    "Rote Punkte",
    "Grüne Punkte",
    "Mitgeturnt",
    "Stunden gesamt",
    "Teilnahme %",
    "Gesamtpunkte",
    "Note",
    "Betragensnote",
  ];
  const escape = (v: unknown) => {
    const s = String(v ?? "");
    return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(";")];
  for (const st of cls.students) {
    const eff = getEffectiveTotalLessons(cls);
    const g = computeGrade(st, cls.disciplines, settings, eff);
    lines.push(
      [
        st.firstName,
        st.lastName,
        cls.name,
        ...cls.disciplines.map((d) => st.scores[d.id] ?? ""),
        st.forgottenKit,
        st.excusedNotParticipating,
        st.unexcusedNotParticipating,
        st.redPoints,
        st.greenPoints,
        st.attended,
        eff,
        Math.round(g.attendanceRate * 100),
        g.total,
        g.grade,
        g.behaviorGrade,
      ]
        .map(escape)
        .join(";"),
    );
  }
  return lines.join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
