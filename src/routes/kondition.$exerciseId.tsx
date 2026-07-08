import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Clock, Users, Package, Heart, Target, Baby, Gauge, Play, Trash2, Video } from "lucide-react";
import { toast } from "sonner";
import { konditionActions, useExercises, useFavorites, type Subcategory } from "@/lib/kondition-store";

export const Route = createFileRoute("/kondition/$exerciseId")({
  component: ExerciseDetail,
});

const SUB_COLORS: Record<Subcategory, string> = {
  Ausdauer: "from-emerald-500 to-teal-600",
  Sprint: "from-orange-500 to-red-500",
  Intervall: "from-fuchsia-500 to-rose-500",
  Staffel: "from-sky-500 to-blue-600",
  Laufparcours: "from-amber-500 to-orange-500",
  "Aufwärm-Laufspiele": "from-indigo-500 to-violet-500",
};

function ExerciseDetail() {
  const { exerciseId } = useParams({ from: "/kondition/$exerciseId" });
  const navigate = useNavigate();
  const exercises = useExercises();
  const favs = useFavorites();
  const ex = exercises.find((e) => e.id === exerciseId);

  if (!ex) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <p className="text-muted-foreground">Übung nicht gefunden.</p>
          <Link to="/kondition" className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
            <ArrowLeft className="h-4 w-4" /> Zurück
          </Link>
        </div>
      </div>
    );
  }

  const isFav = favs.has(ex.id);
  const gradient = SUB_COLORS[ex.subcategory];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-4">
          <Link to="/kondition" className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">
            <ArrowLeft className="h-4 w-4" />
            <span>Zurück</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => konditionActions.toggleFav(ex.id)}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition ${
                isFav ? "border-rose-300 bg-rose-50 text-rose-500" : "border-input bg-background text-foreground hover:bg-accent"
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
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-destructive transition hover:bg-destructive/10"
              aria-label="Löschen"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-6 text-white shadow-xl`}>
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-black/10 blur-3xl" />
          <div className="relative">
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-sm">
              {ex.subcategory}
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">{ex.title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/90">{ex.shortDescription}</p>
          </div>
        </div>

        {/* Info-Kacheln */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <InfoTile icon={<Clock className="h-4 w-4" />} label="Dauer" value={ex.duration} />
          <InfoTile icon={<Users className="h-4 w-4" />} label="Gruppe" value={ex.groupSize} />
          <InfoTile icon={<Baby className="h-4 w-4" />} label="Alter" value={ex.ageGroup} />
          <InfoTile icon={<Gauge className="h-4 w-4" />} label="Schwierigkeit" value={ex.difficulty} />
        </div>

        {/* Ziel */}
        <Section title="Ziel der Übung" icon={<Target className="h-4 w-4" />}>
          <p className="text-sm leading-relaxed text-foreground">{ex.goal}</p>
        </Section>

        {/* Material */}
        <Section title="Material" icon={<Package className="h-4 w-4" />}>
          <p className="text-sm leading-relaxed text-foreground">{ex.material || "—"}</p>
        </Section>

        {/* Ablauf */}
        <Section title="Ablauf" icon={<Play className="h-4 w-4" />}>
          <ol className="space-y-3">
            {ex.steps.map((step, i) => (
              <li key={i} className="flex gap-3 rounded-xl bg-muted/50 p-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-sm text-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </Section>

        {/* Medien */}
        {(ex.images.length > 0 || ex.videoUrl) && (
          <Section title="Medien" icon={<Video className="h-4 w-4" />}>
            {ex.images.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {ex.images.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={src} alt={`${ex.title} – Bild ${i + 1}`} className="aspect-video w-full rounded-xl border border-border object-cover" />
                ))}
              </div>
            )}
            {ex.videoUrl && (
              <div className="mt-3">
                {ex.videoUrl.startsWith("data:video") ? (
                  <video controls src={ex.videoUrl} className="w-full rounded-xl border border-border" />
                ) : (
                  <a href={ex.videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent">
                    <Video className="h-4 w-4" /> Video öffnen
                  </a>
                )}
              </div>
            )}
          </Section>
        )}
      </main>
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mt-5 rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 text-white">{icon}</span>
        {title}
      </div>
      {children}
    </section>
  );
}
