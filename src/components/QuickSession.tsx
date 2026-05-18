import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, X, Shirt, AlertTriangle, Undo2 } from "lucide-react";
import { turnActions, useTurnState, type ClassId, type Student, undo, canUndo } from "@/lib/turn-store";
import { toast } from "sonner";

const SWIPE_THRESHOLD = 90;

interface Props {
  classId: ClassId;
  onClose: () => void;
}

export default function QuickSession({ classId, onClose }: Props) {
  const state = useTurnState();
  const cls = state.classes[classId];
  const students = cls?.students ?? [];

  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [animating, setAnimating] = useState<null | "left" | "right">(null);
  const [started, setStarted] = useState(false);
  const [topic, setTopic] = useState("");
  const [lessonId, setLessonId] = useState<string | null>(null);
  const today = useMemo(
    () =>
      new Date().toLocaleDateString("de-DE", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    [],
  );
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const lockedAxis = useRef<"x" | "y" | null>(null);

  const student: Student | undefined = students[index];
  const done = students.length > 0 && index >= students.length;

  // Body-Scroll sperren, solange das Fenster offen ist
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (index > students.length && students.length > 0) {
      setIndex(students.length);
    }
  }, [students.length, index]);

  const advance = () => setIndex((i) => Math.min(students.length, i + 1));
  const goBack = () => setIndex((i) => Math.max(0, i - 1));

  const markAttended = (st: Student) => {
    if (lessonId) {
      turnActions.recordLessonEntry(classId, lessonId, st.id, "attended");
    } else {
      turnActions.updateStudent(classId, st.id, { attended: st.attended + 1 });
    }
    toast.success(`${st.firstName}: mitgeturnt`, { duration: 900 });
  };

  const finishSwipe = (dir: "left" | "right") => {
    if (!student) return;
    setAnimating(dir);
    if (dir === "right") markAttended(student);
    setTimeout(() => {
      setAnimating(null);
      setDragX(0);
      if (dir === "right") advance();
      else goBack();
    }, 180);
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

  const progress = students.length > 0 ? (Math.min(index, students.length) / students.length) * 100 : 0;
  const rotation = Math.max(-12, Math.min(12, dragX / 14));
  const cardTransform = animating
    ? `translateX(${animating === "right" ? "120vw" : "-120vw"}) rotate(${animating === "right" ? 20 : -20}deg)`
    : `translateX(${dragX}px) rotate(${rotation}deg)`;

  const nextStudent = students[index + 1];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <div className="flex items-center gap-2 border-b border-border bg-background/90 px-3 py-3 backdrop-blur">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-accent"
          aria-label="Stunde beenden"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {cls?.name ?? ""} · {today}
          </div>
          <div className="text-sm font-medium text-foreground">
            {!started
              ? "Stunde vorbereiten"
              : topic
                ? topic
                : students.length > 0
                  ? `${Math.min(index + 1, students.length)} von ${students.length}`
                  : "Keine Schüler"}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (undo()) {
              toast.success("Letzte Änderung rückgängig gemacht");
              goBack();
            }
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
        {!started ? (
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Neue Stunde
              </div>
              <div className="mt-1 text-2xl font-bold text-foreground">{cls?.name}</div>
              <div className="mt-1 text-sm text-muted-foreground capitalize">{today}</div>

              <label className="mt-6 block text-sm font-medium text-foreground">
                Thema der Stunde <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="z. B. Geräteturnen, Ballspiele …"
                autoFocus
                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-base text-foreground outline-none focus:ring-2 focus:ring-ring"
              />

              <button
                type="button"
                onClick={() => {
                  if (students.length === 0) {
                    toast.error("Diese Klasse hat noch keine Schüler.");
                    return;
                  }
                  const id = turnActions.startLesson(classId, topic);
                  setLessonId(id);
                  setStarted(true);
                }}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-4 text-base font-bold text-white shadow-md transition active:scale-95"
              >
                Stunde starten · {students.length} Schüler
              </button>
            </div>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground">
            Diese Klasse hat noch keine Schüler.
          </div>
        ) : done ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="h-10 w-10" />
            </div>
            <div className="text-xl font-bold text-foreground">Fertig!</div>
            <p className="max-w-xs text-sm text-muted-foreground">
              Alle {students.length} Schüler durchgewischt.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIndex(0)}
                className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-accent"
              >
                Nochmal von vorne
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Stunde beenden
              </button>
            </div>
          </div>
        ) : (
          <>
            {nextStudent && (
              <div
                className="pointer-events-none absolute inset-x-4 top-6"
                style={{ transform: "scale(0.95) translateY(8px)", opacity: 0.5 }}
              >
                <StudentCardBackdrop student={nextStudent} />
              </div>
            )}

            <div
              className="pointer-events-none absolute left-6 top-12 rounded-xl border-2 border-rose-400 bg-rose-50 px-3 py-1.5 text-sm font-bold text-rose-600 transition"
              style={{ opacity: dragX < -20 ? Math.min(1, -dragX / SWIPE_THRESHOLD) : 0, transform: "rotate(-12deg)" }}
            >
              ← zurück
            </div>
            <div
              className="pointer-events-none absolute right-6 top-12 rounded-xl border-2 border-emerald-400 bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-600 transition"
              style={{ opacity: dragX > 20 ? Math.min(1, dragX / SWIPE_THRESHOLD) : 0, transform: "rotate(12deg)" }}
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
                lessonId={lessonId}
                onAfterMark={() => {
                  setAnimating("right");
                  setTimeout(() => {
                    setAnimating(null);
                    setDragX(0);
                    advance();
                  }, 180);
                }}
              />
            )}
          </>
        )}
      </div>

      {!done && students.length > 0 && (
        <div className="border-t border-border bg-background px-4 py-3 text-center text-xs text-muted-foreground">
          → wischen = <span className="font-semibold text-emerald-600">mitgeturnt</span>{" "}
          · ← wischen = <span className="font-semibold text-rose-600">zurück</span>
        </div>
      )}
    </div>
  );
}

function StudentCardBackdrop({ student }: { student: Student }) {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
        <div className="bg-gradient-to-br from-indigo-400 via-violet-400 to-fuchsia-400 p-6 text-white">
          <div className="text-2xl font-bold">
            {student.firstName} {student.lastName}
          </div>
        </div>
        <div className="h-32" />
      </div>
    </div>
  );
}

interface StudentCardProps {
  student: Student;
  classId: ClassId;
  lessonId: string | null;
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
  lessonId,
  transform,
  animating,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onAfterMark,
}: StudentCardProps) {
  const initials = useMemo(
    () => `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toUpperCase(),
    [student.firstName, student.lastName],
  );

  const markAndNext = (
    type: "forgottenKit" | "excused" | "unexcused",
    fallbackField: "forgottenKit" | "excusedNotParticipating" | "unexcusedNotParticipating",
    label: string,
  ) => {
    if (lessonId) {
      turnActions.recordLessonEntry(classId, lessonId, student.id, type);
    } else {
      turnActions.updateStudent(classId, student.id, {
        [fallbackField]: student[fallbackField] + 1,
      } as Partial<Student>);
    }
    toast.success(`${student.firstName}: ${label}`, { duration: 900 });
    onAfterMark();
  };

  return (
    <div
      className="relative z-10 w-full max-w-md select-none touch-none"
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
        <div className="grid grid-cols-3 gap-2 border-b border-border bg-muted/40 p-3">
          <button
            type="button"
            onClick={() => markAndNext("forgottenKit", "forgottenKit", "Turnzeug vergessen")}
            className="inline-flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 border-orange-300 bg-orange-50 px-2 py-2.5 font-bold text-orange-700 transition active:scale-95"
          >
            <Shirt className="h-4 w-4" />
            <span className="text-base leading-none">TV</span>
            <span className="text-[10px] font-medium opacity-70">Turnzeug</span>
          </button>
          <button
            type="button"
            onClick={() => markAndNext("excused", "excusedNotParticipating", "entschuldigt")}
            className="inline-flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 border-amber-300 bg-amber-50 px-2 py-2.5 font-bold text-amber-700 transition active:scale-95"
          >
            <AlertTriangle className="h-4 w-4" />
            <span className="text-base leading-none">E</span>
            <span className="text-[10px] font-medium opacity-70">entsch.</span>
          </button>
          <button
            type="button"
            onClick={() => markAndNext("unexcused", "unexcusedNotParticipating", "nicht entschuldigt")}
            className="inline-flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 border-rose-300 bg-rose-50 px-2 py-2.5 font-bold text-rose-700 transition active:scale-95"
          >
            <X className="h-4 w-4" />
            <span className="text-base leading-none">NE</span>
            <span className="text-[10px] font-medium opacity-70">nicht entsch.</span>
          </button>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-black backdrop-blur-sm">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-2xl font-bold leading-tight">{student.firstName}</div>
              <div className="truncate text-lg font-medium text-white/90">{student.lastName}</div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <Stat label="Mitgeturnt" value={student.attended} />
            <Stat label="Entsch." value={student.excusedNotParticipating} />
            <Stat label="Unentsch." value={student.unexcusedNotParticipating} />
          </div>
        </div>

        <div className="p-4">
          <button
            type="button"
            onClick={() => {
              turnActions.updateStudent(classId, student.id, { attended: student.attended + 1 });
              toast.success(`${student.firstName}: mitgeturnt`, { duration: 900 });
              onAfterMark();
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-5 text-base font-bold text-white shadow-md transition active:scale-95"
          >
            <Check className="h-5 w-5" /> Mitgeturnt → nächster
          </button>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Tipp: nach rechts wischen = mitgeturnt
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white/15 px-2 py-1.5 backdrop-blur-sm">
      <div className="text-xl font-black leading-none">{value}</div>
      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/80">{label}</div>
    </div>
  );
}
