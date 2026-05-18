import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, Check, X, Shirt, AlertTriangle, Undo2 } from "lucide-react";
import { turnActions, useTurnState, type ClassId, type Student, undo, canUndo } from "@/lib/turn-store";
import { toast } from "sonner";

export const Route = createFileRoute("/klasse/$classId/quick")({
  component: QuickEntry,
  head: () => ({
    meta: [{ title: "Schnelleingabe — Turnnoten" }],
  }),
});

const SWIPE_THRESHOLD = 90; // px

function QuickEntry() {
  const { classId } = Route.useParams() as { classId: ClassId };
  const navigate = useNavigate();
  const state = useTurnState();
  const cls = state.classes[classId];

  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [animating, setAnimating] = useState<null | "left" | "right">(null);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const lockedAxis = useRef<"x" | "y" | null>(null);

  const students = cls?.students ?? [];
  const student: Student | undefined = students[index];

  // Reset Index, falls Schülerliste schrumpft
  useEffect(() => {
    if (index >= students.length && students.length > 0) setIndex(students.length - 1);
  }, [students.length, index]);

  const next = () => setIndex((i) => Math.min(students.length - 1, i + 1));
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

  // Pointer-Handler (Touch + Maus)
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

  const progress = ((index + 1) / students.length) * 100;
  const rotation = Math.max(-12, Math.min(12, dragX / 14));
  const cardTransform = animating
    ? `translateX(${animating === "right" ? "120vw" : "-120vw"}) rotate(${animating === "right" ? 20 : -20}deg)`
    : `translateX(${dragX}px) rotate(${rotation}deg)`;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
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
            {cls.name} · Schnelleingabe
          </div>
          <div className="text-sm font-medium text-foreground">
            {index + 1} von {students.length}
          </div>
        </div>
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

      {/* Progress */}
      <div className="h-1 w-full bg-muted">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Card */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-6">
        {/* Swipe-Hinweise */}
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

        {student && (
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
        )}
      </div>

      {/* Footer-Hinweis */}
      <div className="border-t border-border bg-background px-4 py-3 text-center text-xs text-muted-foreground">
        Nach rechts wischen = <span className="font-semibold text-emerald-600">mitgeturnt</span>{" "}
        · nach links = <span className="font-semibold text-rose-600">zurück</span>
      </div>
    </div>
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

// Vermeidet ungenutzten Import (für eventuellen späteren Einsatz)
void ChevronLeft;
