import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { konditionActions, useExercises, useFavorites } from "@/lib/kondition-store";
import { ExercisePosterModal } from "@/components/ExercisePosterModal";
import KonditionOverview from "./kondition.index";

export const Route = createFileRoute("/kondition/$exerciseId")({
  component: ExerciseDetail,
});

function ExerciseDetail() {
  const { exerciseId } = useParams({ from: "/kondition/$exerciseId" });
  const navigate = useNavigate();
  const exercises = useExercises();
  const favs = useFavorites();
  const ex = exercises.find((e) => e.id === exerciseId);

  const close = () => navigate({ to: "/kondition" });

  if (!ex) {
    return (
      <>
        <KonditionOverview />
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm" onClick={close}>
          <div className="rounded-2xl bg-white p-6 text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm text-slate-600">Übung nicht gefunden.</p>
            <button onClick={close} className="mt-3 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white">Zurück</button>
          </div>
        </div>
      </>
    );
  }

  const isFav = favs.has(ex.id);

  return (
    <>
      <KonditionOverview />
      <ExercisePosterModal
        exercise={ex}
        onClose={close}
        actions={
          <>
            <button
              type="button"
              onClick={() => konditionActions.toggleFav(ex.id)}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full shadow ${
                isFav ? "bg-rose-100 text-rose-600" : "bg-white/95 text-slate-700 hover:bg-white"
              }`}
              aria-label="Favorit"
            >
              <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm(`„${ex.title}" wirklich löschen?`)) {
                  konditionActions.remove(ex.id);
                  toast.success("Übung gelöscht");
                  navigate({ to: "/kondition" });
                }
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-rose-600 shadow hover:bg-white"
              aria-label="Löschen"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        }
      />
    </>
  );
}
