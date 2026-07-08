import { Clock, Users, Package, Baby, Gauge, Target, ListChecks, Image as ImageIcon, Video } from "lucide-react";
import type { Exercise, Subcategory } from "@/lib/kondition-store";

// Sanfte Pastellfarben pro Unterkategorie – wirkt wie ein Merkblatt.
const PASTELS: Record<Subcategory, { bg: string; accent: string; chip: string; ring: string }> = {
  Ausdauer:            { bg: "bg-emerald-50",  accent: "text-emerald-700",  chip: "bg-emerald-100 text-emerald-800",   ring: "ring-emerald-200" },
  Sprint:              { bg: "bg-orange-50",   accent: "text-orange-700",   chip: "bg-orange-100 text-orange-800",     ring: "ring-orange-200" },
  Intervall:           { bg: "bg-rose-50",     accent: "text-rose-700",     chip: "bg-rose-100 text-rose-800",         ring: "ring-rose-200" },
  Staffel:             { bg: "bg-sky-50",      accent: "text-sky-700",      chip: "bg-sky-100 text-sky-800",           ring: "ring-sky-200" },
  Laufparcours:        { bg: "bg-amber-50",    accent: "text-amber-700",    chip: "bg-amber-100 text-amber-800",       ring: "ring-amber-200" },
  "Aufwärm-Laufspiele":{ bg: "bg-violet-50",   accent: "text-violet-700",   chip: "bg-violet-100 text-violet-800",     ring: "ring-violet-200" },
};

export function ExercisePoster({ exercise }: { exercise: Exercise }) {
  const p = PASTELS[exercise.subcategory];

  return (
    <article className={`relative overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ${p.ring}`}>
      {/* Sanfter Farbrand oben – Merkblatt-Optik */}
      <div className={`${p.bg} px-8 pb-10 pt-8 sm:px-12`}>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${p.chip}`}>
            {exercise.subcategory}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
            Übungsblatt
          </span>
        </div>
        <h1 className={`mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl ${p.accent}`}>
          {exercise.title}
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">
          {exercise.shortDescription}
        </p>
      </div>

      <div className="px-8 pb-10 pt-8 sm:px-12">
        {/* Kennzahlen */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetaTile icon={<Clock className="h-4 w-4" />} label="Dauer" value={exercise.duration} />
          <MetaTile icon={<Users className="h-4 w-4" />} label="Gruppe" value={exercise.groupSize} />
          <MetaTile icon={<Baby className="h-4 w-4" />} label="Alter" value={exercise.ageGroup} />
          <MetaTile icon={<Gauge className="h-4 w-4" />} label="Schwierigkeit" value={exercise.difficulty} />
        </div>

        {/* Ziel + Material */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <PosterSection icon={<Target className="h-4 w-4" />} title="Ziel der Übung" tone={p}>
            <p className="text-[15px] leading-relaxed text-slate-700">{exercise.goal || "—"}</p>
          </PosterSection>
          <PosterSection icon={<Package className="h-4 w-4" />} title="Material" tone={p}>
            <p className="text-[15px] leading-relaxed text-slate-700">{exercise.material || "—"}</p>
          </PosterSection>
        </div>

        {/* Ablauf */}
        <PosterSection icon={<ListChecks className="h-4 w-4" />} title="Ablauf" tone={p} className="mt-6">
          <ol className="space-y-3">
            {exercise.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-4 rounded-2xl bg-slate-50/70 p-4">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${p.chip}`}>
                  {i + 1}
                </span>
                <span className="pt-1 text-[15px] leading-relaxed text-slate-700">{step}</span>
              </li>
            ))}
            {exercise.steps.length === 0 && (
              <li className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-400">
                Noch keine Schritte hinterlegt.
              </li>
            )}
          </ol>
        </PosterSection>

        {/* Bilder / Platzhalter */}
        <PosterSection icon={<ImageIcon className="h-4 w-4" />} title="Bilder" tone={p} className="mt-6">
          {exercise.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {exercise.images.map((src, i) => (
                <img key={i} src={src} alt={`${exercise.title} – Bild ${i + 1}`} className="aspect-[4/3] w-full rounded-xl object-cover ring-1 ring-slate-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-300">
                  <ImageIcon className="h-6 w-6" />
                </div>
              ))}
            </div>
          )}
          <p className="mt-2 text-xs text-slate-400">Platz für eigene Fotos oder Symbole – später frei ergänzbar.</p>
        </PosterSection>

        {/* Medien */}
        {exercise.videoUrl && (
          <PosterSection icon={<Video className="h-4 w-4" />} title="Medien" tone={p} className="mt-6">
            {exercise.videoUrl.startsWith("data:video") ? (
              <video controls src={exercise.videoUrl} className="w-full rounded-xl ring-1 ring-slate-200" />
            ) : (
              <a href={exercise.videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <Video className="h-4 w-4" /> Video öffnen
              </a>
            )}
          </PosterSection>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] uppercase tracking-[0.14em] text-slate-400">
          <span>Turni · Übungssammlung</span>
          <span>Kondition / Laufspiele</span>
        </div>
      </div>
    </article>
  );
}

function MetaTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-800">{value || "—"}</div>
    </div>
  );
}

function PosterSection({
  icon, title, tone, className = "", children,
}: {
  icon: React.ReactNode;
  title: string;
  tone: { chip: string; accent: string };
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={className}>
      <div className="mb-3 flex items-center gap-2">
        <span className={`grid h-7 w-7 place-items-center rounded-lg ${tone.chip}`}>{icon}</span>
        <h2 className={`text-sm font-semibold uppercase tracking-[0.14em] ${tone.accent}`}>{title}</h2>
      </div>
      {children}
    </section>
  );
}
