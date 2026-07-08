import { useState } from "react";
import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { Heart, Trash2, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { konditionActions, useExercises, useFavorites } from "@/lib/kondition-store";
import { useCommunityExercises, useCloudFavorites, useCurrentUserId, deleteCommunityExercise } from "@/lib/community-store";
import { downloadExercisePdf } from "@/lib/pdf-exercise";
import { ExercisePosterModal } from "@/components/ExercisePosterModal";
import KonditionOverview from "./kondition.index";

export const Route = createFileRoute("/kondition/$exerciseId")({
  component: ExerciseDetail,
});

function ExerciseDetail() {
  const { exerciseId } = useParams({ from: "/kondition/$exerciseId" });
  const navigate = useNavigate();
  const localExercises = useExercises();
  const { list: community } = useCommunityExercises();
  const localFavs = useFavorites();
  const { favs: cloudFavs, toggle: toggleCloudFav } = useCloudFavorites();
  const uid = useCurrentUserId();
  const ex = localExercises.find((e) => e.id === exerciseId) ?? community.find((e) => e.id === exerciseId);
  const isCommunity = !!community.find((e) => e.id === exerciseId);

  const [pdfBusy, setPdfBusy] = useState(false);

  const close = () => navigate({ to: "/kondition" });

  const handlePdf = async () => {
    if (!ex || pdfBusy) return;
    setPdfBusy(true);
    try {
      await downloadExercisePdf(ex);
      toast.success("PDF heruntergeladen");
    } catch (err) {
      console.error(err);
      toast.error("PDF konnte nicht erstellt werden");
    } finally {
      setPdfBusy(false);
    }
  };

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

  const favs = new Set<string>([...localFavs, ...cloudFavs]);
  const isFav = favs.has(ex.id);

  const handleFav = () => {
    konditionActions.toggleFav(ex.id);
    if (uid) void toggleCloudFav(ex.id);
  };

  const handleDelete = async () => {
    if (!confirm(`„${ex.title}" wirklich löschen?`)) return;
    try {
      if (isCommunity) {
        await deleteCommunityExercise(ex.id);
      } else {
        konditionActions.remove(ex.id);
      }
      toast.success("Übung gelöscht");
      navigate({ to: "/kondition" });
    } catch (err) {
      console.error(err);
      toast.error("Löschen fehlgeschlagen");
    }
  };

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
              onClick={handlePdf}
              disabled={pdfBusy}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white/95 px-3 text-sm font-medium text-slate-700 shadow hover:bg-white disabled:opacity-60"
              aria-label="Als PDF herunterladen"
              title="Als PDF herunterladen"
            >
              {pdfBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              PDF
            </button>
            <button
              type="button"
              onClick={handleFav}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full shadow ${
                isFav ? "bg-rose-100 text-rose-600" : "bg-white/95 text-slate-700 hover:bg-white"
              }`}
              aria-label="Favorit"
            >
              <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
            </button>
            <button
              type="button"
              onClick={handleDelete}
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
