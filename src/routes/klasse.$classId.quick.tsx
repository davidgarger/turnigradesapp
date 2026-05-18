import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, Check, X, Shirt, AlertTriangle, Undo2, Play, UserCheck } from "lucide-react";
import { turnActions, useTurnState, type ClassId, type Student, undo, canUndo } from "@/lib/turn-store";
import { toast } from "sonner";

export const Route = createFileRoute("/klasse/$classId/quick")({
  component: QuickEntry,
  head: () => ({
    meta: [{ title: "Schnelleingabe — Turnnoten" }],
  }),
});

const SWIPE_THRESHOLD = 90; // px

type AttendanceMark = "present" | "excused" | "unexcused" | "kit";

function QuickEntry() {
  const { classId } = Route.useParams() as { classId: ClassId };
  const navigate = useNavigate();
  const state = useTurnState();
  const cls = state.classes[classId];

  const students = cls?.students ?? [];

  const [phase, setPhase] = useState<"attendance" | "swipe">("attendance");
  const [marks, setMarks] = useState<Record<string, AttendanceMark>>({});

  // Default alle als anwesend markieren, wenn Schülerliste sich ändert
  useEffect(() => {
    setMarks((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const s of students) {
        if (!next[s.id]) {
          next[s.id] = "present";
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [students]);

  // Nur anwesende Schüler durchwischen
  const swipeStudents = useMemo(
    () => students.filter((s) => marks[s.id] === "present" || !marks[s.id]),
    [students, marks],
  );

  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [animating, setAnimating] = useState<null | "left" | "right">(null);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const lockedAxis = useRef<"x" | "y" | null>(null);

  const student: Student | undefined = swipeStudents[index];

  useEffect(() => {
    if (index >= swipeStudents.length && swipeStudents.length > 0) {
      setIndex(swipeStudents.length - 1);
    }
  }, [swipeStudents.length, index]);

  if (!cls) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-sm text-muted-foreground">
        Klasse nicht gefunden.{" "}
        <Link to="/" className="ml-2 underline">
          Zurück
        </Link>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center">
        <p className="text-sm text-muted-foreground">Diese Klasse hat noch keine Schüler.</p>
        <Link
          to="/klasse/$classId"
          params={{ classId }}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Zur Klasse
        </Link>
      </div>
    );
  }

  // ===== ATTENDANCE PHASE =====
  if (phase === "attendance") {
    const counts = {
      present: students.filter((s) => (marks[s.id] ?? "present") === "present").length,
      excused: students.filter((s) => marks[s.id] === "excused").length,
      unexcused: students.filter((s) => marks[s.id] === "unexcused").length,
      kit: students.filter((s) => marks[s.id] === "kit").length,
    };

    const startSwipe = () => {
      // Markierte Abwesenheiten in den Store schreiben
      let applied = 0;
      for (const s of students) {
        const m = marks[s.id];
        if (m === "excused") {
          turnActions.updateStudent(classId, s.id, { excusedNotParticipating: s.excusedNotParticipating + 1 });
          applied++;
        } else if (m === "unexcused") {
          turnActions.updateStudent(classId, s.id, { unexcusedNotParticipating: s.unexcusedNotParticipating + 1 });
          applied++;
        } else if (m === "kit") {
          turnActions.updateStudent(classId, s.id, { forgottenKit: s.forgottenKit + 1 });
          applied++;
        }
      }
      if (applied > 0) toast.success(`${applied} Abwesenheit${applied === 1 ? "" : "en"} eingetragen`);
      setIndex(0);
      setPhase("swipe");
    };

    const presentCount = counts.present;

    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white">
        <div className="flex items-center gap-2 border-b border-border bg-background/80 px-3 py-3 backdrop-blur">
          <button
            type="button"
            onClick={() => navigate({ to: "/klasse/$classId", params: { classId } })}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-accent"
            aria-label="Zurück"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {cls.name} · Anwesenheit
            </div>
            <div className="text-sm font-medium text-foreground">
              {presentCount} anwesend · {students.length - presentCount} fehlen
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          <p className="mx-auto mb-3 max-w-md text-center text-xs text-muted-foreground">
            Tippe auf einen Status, wenn jemand fehlt. Alle anderen sind anwesend und werden gleich durchgewischt.
          </p>
          <ul className="mx-auto flex max-w-md flex-col gap-2">
            {students.map((s) => {
              const m: AttendanceMark = marks[s.id] ?? "present";
              const setMark = (val: AttendanceMark) =>
                setMarks((prev) => ({ ...prev, [s.id]: prev[s.id] === val ? "present" : val }));
              return (
                <li
                  key={s.id}
                  className={`rounded-2xl border bg-card p-3 shadow-sm transition ${
                    m === "present" ? "border-border" : "border-amber-300 bg-amber-50/50"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-bold text-white">
                      {s.firstName.charAt(0)}
                      {s.lastName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-foreground">
                        {s.firstName} {s.lastName}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {m === "present"
                          ? "anwesend"
                          : m === "excused"
                            ? "entschuldigt"
                            : m === "unexcused"
                              ? "nicht entschuldigt"
                              : "Turnzeug vergessen"}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <PillBtn active={m === "excused"} onClick={() => setMark("excused")} tone="amber" icon={<AlertTriangle className="h-3.5 w-3.5" />}>
                      Entsch.
                    </PillBtn>
                    <PillBtn active={m === "unexcused"} onClick={() => setMark("unexcused")} tone="rose" icon={<X className="h-3.5 w-3.5" />}>
                      Unentsch.
                    </PillBtn>
                    <PillBtn active={m === "kit"} onClick={() => setMark("kit")} tone="orange" icon={<Shirt className="h-3.5 w-3.5" />}>
                      Turnzeug
                    </PillBtn>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="sticky bottom-0 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
          <button
            type="button"
            onClick={startSwipe}
            disabled={presentCount === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3.5 text-base font-bold text-white shadow-lg transition active:scale-[0.98] disabled:opacity-40"
          >
            <Play className="h-5 w-5" />
            {presentCount > 0 ? `${presentCount} Anwesende durchwischen` : "Niemand anwesend"}
          </button>
        </div>
      </div>
    );
  }

  // ===== SWIPE PHASE =====
  const next = () => setIndex((i) => Math.min(swipeStudents.length - 1, i + 1));
  const prev = () => setIndex((i) => Math.max(0, i - 1));

  const markAttended = (st: Student) => {
    turnActions.updateStudent(classId, st.id, { attended: st.attended + 1 });
    toast.success(`${st.firstName} ${st.lastName}: mitgeturnt`, { duration: 1200 });
  };

  const finishSwipe = (dir: "left" | "right") => {
    if (!student) return;
    if (dir === "right") {
      markAttended(student);
      setAnimating("right");
      setTimeout(() => {
        setAnimating(null);
        setDragX(0);
        next();
      }, 180);
    } else {
      setAnimating("left");
      setTimeout(() => {
        setAnimating(null);
        setDragX(0);
        prev();
      }, 180);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (animating) return;
    startX.current = e.clientX;
    startY.current = e.clientY;
    lockedAxis.current = null;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startX.current === null || startY.current === null) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    if (!lockedAxis.current) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        lockedAxis.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }
    }
    if (lockedAxis.current === "x") {
      e.preventDefault();
      setDragX(dx);
    }
  };
  const onPointerUp = () => {
    const dx = dragX;
    startX.current = null;
    startY.current = null;
    lockedAxis.current = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      finishSwipe(dx > 0 ? "right" : "left");
    } else {
      setDragX(0);
    }
  };

  const progress = swipeStudents.length > 0 ? ((index + 1) / swipeStudents.length) * 100 : 0;
  const rotation = Math.max(-12, Math.min(12, dragX / 14));
  const cardTransform = animating
    ? `translateX(${animating === "right" ? "120vw" : "-120vw"}) rotate(${animating === "right" ? 20 : -20}deg)`
    : `translateX(${dragX}px) rotate(${rotation}deg)`;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white">
      <div className="flex items-center gap-2 border-b border-border bg-background/80 px-3 py-3 backdrop-blur">
        <button
          type="button"
          onClick={() => setPhase("attendance")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-accent"
          aria-label="Zurück zur Anwesenheit"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {cls.name} · Schnelleingabe
          </div>
          <div className="text-sm font-medium text-foreground">
            {Math.min(index + 1, swipeStudents.length)} von {swipeStudents.length}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPhase("attendance")}
          className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-accent"
        >
          <UserCheck className="h-3.5 w-3.5" />
          Anwesenheit
        </button>
        <button
          type="button"
          onClick={() => {
            if (undo()) toast.success("Letzte Änderung rückgängig gemacht");
          }}
          disabled={!canUndo()}
          className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-accent disabled:opacity-40"
        >
          <Undo2 className="h-3.5 w-3.5" />
          Undo
        </button>
      </div>

      <div className="h-1 w-full bg-muted">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 py-6">
        <div
          className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 rounded-xl border-2 border-rose-400 bg-rose-50 px-3 py-1.5 text-sm font-bold text-rose-600 transition"
          style={{ opacity: dragX < -20 ? Math.min(1, -dragX / SWIPE_THRESHOLD) : 0 }}
        >
          ← zurück
        </div>
        <div
          className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 rounded-xl border-2 border-emerald-400 bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-600 transition"
          style={{ opacity: dragX > 20 ? Math.min(1, dragX / SWIPE_THRESHOLD) : 0 }}
        >
          mitgeturnt ✓
        </div>

        {student ? (
          <StudentCard
            key={student.id}
            student={student}
            transform={cardTransform}
            animating={!!animating}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            classId={classId}
            onAfterMark={() => {
              setAnimating("right");
              setTimeout(() => {
                setAnimating(null);
                setDragX(0);
                next();
              }, 180);
            }}
          />
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            Keine anwesenden Schüler.
          </div>
        )}
      </div>

      <div className="border-t border-border bg-background px-4 py-3 text-center text-xs text-muted-foreground">
        Nach rechts wischen = <span className="font-semibold text-emerald-600">mitgeturnt</span>{" "}
        · nach links = <span className="font-semibold text-rose-600">zurück</span>
      </div>
    </div>
  );
}

function PillBtn({
  active,
  onClick,
  tone,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  tone: "amber" | "rose" | "orange";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    amber: active ? "bg-amber-500 text-white border-amber-500" : "bg-white text-amber-700 border-amber-200",
    rose: active ? "bg-rose-500 text-white border-rose-500" : "bg-white text-rose-700 border-rose-200",
    orange: active ? "bg-orange-500 text-white border-orange-500" : "bg-white text-orange-700 border-orange-200",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1 rounded-lg border-2 px-2 py-2 text-[11px] font-bold transition active:scale-95 ${tones[tone]}`}
    >
      {icon}
      {children}
    </button>
  );
}

interface StudentCardProps {
  student: Student;
  classId: ClassId;
  transform: string;
  animating: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
  onAfterMark: () => void;
}

function StudentCard({
  student,
  classId,
  transform,
  animating,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onAfterMark,
}: StudentCardProps) {
  const initials = useMemo(
    () =>
      `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toUpperCase(),
    [student.firstName, student.lastName],
  );

  const markAndNext = (
    field: "excusedNotParticipating" | "unexcusedNotParticipating" | "forgottenKit",
    label: string,
  ) => {
    turnActions.updateStudent(classId, student.id, {
      [field]: student[field] + 1,
    } as Partial<Student>);
    toast.success(`${student.firstName}: ${label}`, { duration: 1200 });
    onAfterMark();
  };

  return (
    <div
      className="w-full max-w-md select-none touch-none"
      style={{
        transform,
        transition: animating ? "transform 180ms ease-out" : "transform 60ms",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <div className="bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-black backdrop-blur-sm">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-2xl font-bold leading-tight">
                {student.firstName}
              </div>
              <div className="truncate text-lg font-medium text-white/90">
                {student.lastName}
              </div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <Stat label="Mitgeturnt" value={student.attended} />
            <Stat label="Entsch." value={student.excusedNotParticipating} />
            <Stat label="Unentsch." value={student.unexcusedNotParticipating} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 p-4">
          <button
            type="button"
            onClick={() => {
              turnActions.updateStudent(classId, student.id, { attended: student.attended + 1 });
              toast.success(`${student.firstName}: mitgeturnt`, { duration: 1200 });
              onAfterMark();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-4 text-base font-bold text-white shadow-md transition active:scale-95"
          >
            <Check className="h-5 w-5" /> Mitgeturnt
          </button>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => markAndNext("excusedNotParticipating", "entschuldigt")}
              className="inline-flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-amber-200 bg-amber-50 px-2 py-3 text-xs font-bold text-amber-700 transition active:scale-95"
            >
              <AlertTriangle className="h-4 w-4" />
              Entschuldigt
            </button>
            <button
              type="button"
              onClick={() => markAndNext("unexcusedNotParticipating", "nicht entschuldigt")}
              className="inline-flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-rose-200 bg-rose-50 px-2 py-3 text-xs font-bold text-rose-700 transition active:scale-95"
            >
              <X className="h-4 w-4" />
              Nicht entsch.
            </button>
            <button
              type="button"
              onClick={() => markAndNext("forgottenKit", "Turnzeug vergessen")}
              className="inline-flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-orange-200 bg-orange-50 px-2 py-3 text-xs font-bold text-orange-700 transition active:scale-95"
            >
              <Shirt className="h-4 w-4" />
              Turnzeug
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white/15 px-2 py-1.5 backdrop-blur-sm">
      <div className="text-xl font-black leading-none">{value}</div>
      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/80">
        {label}
      </div>
    </div>
  );
}

void ChevronLeft;
