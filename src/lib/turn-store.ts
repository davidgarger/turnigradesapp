import { useSyncExternalStore } from "react";

// ---------- Types ----------
export type ClassId = "1" | "2" | "3" | "4";

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
}

export interface ClassSchedule {
  startDate: string; // ISO yyyy-mm-dd – Schuljahresbeginn
  endDate: string;   // ISO yyyy-mm-dd – Schuljahresende
  weekdays: number[]; // 0=So, 1=Mo, ... 6=Sa – Tage mit Turnstunden
  lessonsPerDay: number; // Anzahl Turnstunden pro Termin (z. B. 1 oder 2)
  cancelled: number; // entfallene Stunden
}

export interface ClassData {
  id: ClassId;
  name: string;
  disciplines: Discipline[];
  students: Student[];
  totalLessons: number; // manuelle Gesamtzahl (Fallback falls kein Stundenplan)
  schedule?: ClassSchedule;
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

const sampleNames: Record<ClassId, [string, string][]> = {
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
  return sampleNames[classId].map(([fn, ln], i) => ({
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
  }));
}

function defaultState(): TurnState {
  const mk = (id: ClassId, name: string): ClassData => ({
    id,
    name,
    disciplines: defaultDisciplines(),
    students: seedStudents(id),
    totalLessons: DEFAULT_TOTAL_LESSONS,
  });
  return {
    classes: {
      "1": mk("1", "1. Klasse"),
      "2": mk("2", "2. Klasse"),
      "3": mk("3", "3. Klasse"),
      "4": mk("4", "4. Klasse"),
    },
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

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota */
  }
}

function setState(updater: (s: TurnState) => TurnState) {
  state = updater(state);
  persist();
  listeners.forEach((l) => l());
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
      };
      return {
        ...s,
        classes: { ...s.classes, [classId]: { ...cls, students: [...cls.students, student] } },
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
            students: cls.students.map((st) =>
              st.id === studentId ? { ...st, scores: { ...st.scores, [disciplineId]: value } } : st,
            ),
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

  return {
    disciplineAverage,
    attendanceRate,
    penalties,
    total,
    grade,
    measuredCount,
    hasDisciplineData,
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
    "Mitgeturnt",
    "Stunden gesamt",
    "Teilnahme %",
    "Gesamtpunkte",
    "Note",
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
        st.attended,
        eff,
        Math.round(g.attendanceRate * 100),
        g.total,
        g.grade,
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
