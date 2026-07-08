import { useEffect } from "react";
import { X } from "lucide-react";
import { ExercisePoster } from "./ExercisePoster";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import type { Exercise } from "@/lib/kondition-store";

export function ExercisePosterModal({
  exercise,
  onClose,
  actions,
}: {
  exercise: Exercise;
  onClose: () => void;
  actions?: React.ReactNode;
}) {
  useScrollLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 px-4 py-6 backdrop-blur-sm sm:py-10" onClick={onClose}>
      <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-white/80">
            Vorschau · Übungsblatt
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow hover:bg-white"
              aria-label="Schließen"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <ExercisePoster exercise={exercise} />
      </div>
    </div>
  );
}
