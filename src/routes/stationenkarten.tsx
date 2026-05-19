import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Printer, LayoutGrid, Target, ArrowRight } from "lucide-react";
import {
  DISCIPLINE_LABEL,
  LEVEL_LABEL,
  SPORT_LABEL,
  SPORT_TO_DISCIPLINES,
  buildVideoQrUrl,
  listProgressions,
  type Progression,
  type ProgressionStep,
  type StationDiscipline,
  type StationLevel,
  type StationSport,
} from "@/lib/station-cards";
import { StationGraphic } from "@/components/StationGraphic";

export const Route = createFileRoute("/stationenkarten")({
  component: ComingSoonPage,
  head: () => ({
    meta: [
      { title: "Stationenkarten — Coming Soon" },
      { name: "description", content: "Stationenkarten – in Arbeit." },
    ],
  }),
});

function ComingSoonPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LayoutGrid className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Stationenkarten</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Coming soon – wir feilen noch an dieser Funktion. Schau bald wieder vorbei.
        </p>
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="mt-6 inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" /> Zurück zur Startseite
        </button>
      </div>
    </div>
  );
}


const SPORTS: StationSport[] = ["leichtathletik", "geraeteturnen"];
const LEVELS: StationLevel[] = ["unterstufe", "mittelstufe", "oberstufe"];

function StationenkartenPage() {
  const navigate = useNavigate();
  const [sport, setSport] = useState<StationSport>("geraeteturnen");
  const [discipline, setDiscipline] = useState<StationDiscipline>("reck");
  const [level, setLevel] = useState<StationLevel>("mittelstufe");
  const [progressionId, setProgressionId] = useState<string>("reck-aufschwung");
  const [videoOverrides, setVideoOverrides] = useState<Record<number, string>>({});

  const disciplines = useMemo(() => SPORT_TO_DISCIPLINES[sport], [sport]);
  const progressions = useMemo(
    () => listProgressions(sport, discipline, level),
    [sport, discipline, level],
  );

  // Auto-select first progression when filters change.
  useEffect(() => {
    if (progressions.length === 0) return;
    if (!progressions.find((p) => p.id === progressionId)) {
      setProgressionId(progressions[0].id);
      setVideoOverrides({});
    }
  }, [progressions, progressionId]);

  const onSportChange = (s: StationSport) => {
    setSport(s);
    const first = SPORT_TO_DISCIPLINES[s][0];
    if (first) setDiscipline(first);
  };

  const progression = progressions.find((p) => p.id === progressionId) ?? progressions[0];
  const onPrint = () => window.print();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 print:bg-white">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .card-print { page-break-inside: avoid; break-inside: avoid; }
          .card-print + .card-print { page-break-before: always; }
        }
      `}</style>

      <header className="no-print sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-4">
          <button
            onClick={() => navigate({ to: "/" })}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-input text-foreground transition hover:bg-accent"
            aria-label="Zurück"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold sm:text-xl">Stationenkarten-Generator</h1>
            <p className="truncate text-xs text-muted-foreground sm:text-sm">
              Übungsreihe Vorübung → Zielübung, mit Grafiken & QR-Code
            </p>
          </div>
          <button
            onClick={onPrint}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Drucken</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-3 py-6">
        {/* Steuerung */}
        <section className="no-print rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Sportart">
              <select
                value={sport}
                onChange={(e) => onSportChange(e.target.value as StationSport)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {SPORTS.map((s) => (
                  <option key={s} value={s}>
                    {SPORT_LABEL[s]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Disziplin">
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value as StationDiscipline)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {disciplines.map((d) => (
                  <option key={d} value={d}>
                    {DISCIPLINE_LABEL[d]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Stufe">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as StationLevel)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {LEVEL_LABEL[l]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Zielübung">
              <select
                value={progression?.id ?? ""}
                onChange={(e) => {
                  setProgressionId(e.target.value);
                  setVideoOverrides({});
                }}
                disabled={progressions.length === 0}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50"
              >
                {progressions.length === 0 ? (
                  <option value="">— keine verfügbar —</option>
                ) : (
                  progressions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.target}
                    </option>
                  ))
                )}
              </select>
            </Field>
          </div>
        </section>

        {/* Hinweis */}
        <section className="no-print rounded-lg border border-dashed border-border bg-muted/30 p-3 text-xs text-muted-foreground">
          Die Karten sind als Übungsreihe aufgebaut: jede Karte = ein Schritt näher zur Zielübung. Die
          letzte Karte ist die fertige Zielübung. Inhalte sind didaktische Vorschläge — bitte vor
          Einsatz fachlich prüfen.
        </section>

        {/* Karten */}
        {!progression ? (
          <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            Für diese Kombination ist noch keine Übungsreihe hinterlegt. Wähle eine andere Disziplin
            oder Stufe.
          </div>
        ) : (
          <>
            <ProgressionOverview progression={progression} />
            <section className="grid gap-4">
              {progression.steps.map((s, idx) => (
                <CardView
                  key={`${progression.id}-${idx}`}
                  index={idx + 1}
                  total={progression.steps.length}
                  step={s}
                  sport={sport}
                  discipline={discipline}
                  level={level}
                  target={progression.target}
                  videoSearch={progression.videoSearch}
                  videoUrl={videoOverrides[idx] ?? ""}
                  onVideoUrlChange={(v) =>
                    setVideoOverrides((prev) => ({ ...prev, [idx]: v }))
                  }
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ProgressionOverview({ progression }: { progression: Progression }) {
  return (
    <section className="no-print rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Target className="h-4 w-4 text-primary" />
        Zielübung: <span className="text-primary">{progression.target}</span>
      </div>
      <ol className="flex flex-wrap items-center gap-2">
        {progression.steps.map((s, i) => {
          const isLast = i === progression.steps.length - 1;
          return (
            <li key={i} className="flex items-center gap-2">
              <span
                className={`rounded-md border px-2.5 py-1 text-xs ${
                  isLast
                    ? "border-primary bg-primary/10 font-semibold text-primary"
                    : "border-border bg-background text-foreground/80"
                }`}
              >
                {i + 1}. {s.title}
              </span>
              {!isLast ? <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" /> : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function CardView({
  index,
  total,
  step,
  sport,
  discipline,
  level,
  target,
  videoSearch,
  videoUrl,
  onVideoUrlChange,
}: {
  index: number;
  total: number;
  step: ProgressionStep;
  sport: StationSport;
  discipline: StationDiscipline;
  level: StationLevel;
  target: string;
  videoSearch: string;
  videoUrl: string;
  onVideoUrlChange: (v: string) => void;
}) {
  const isTarget = index === total;
  const qr = buildVideoQrUrl(videoSearch, videoUrl);
  const targetUrl =
    videoUrl.trim().length > 0
      ? videoUrl.trim()
      : `https://www.youtube.com/results?search_query=${encodeURIComponent(videoSearch)}`;

  return (
    <article
      className={`card-print rounded-xl border-2 bg-white p-5 shadow-sm print:shadow-none ${
        isTarget ? "border-primary" : "border-border"
      }`}
    >
      <header className="flex items-start justify-between gap-4 border-b border-border pb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>{SPORT_LABEL[sport]}</span>
            <span>·</span>
            <span>{DISCIPLINE_LABEL[discipline]}</span>
            <span>·</span>
            <span>{LEVEL_LABEL[level]}</span>
          </div>
          <h2 className="mt-1 text-xl font-bold leading-tight text-foreground">
            {isTarget ? (
              <span className="inline-flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Zielübung {index}/{total}: {step.title}
              </span>
            ) : (
              <>
                Vorübung {index}/{total}: {step.title}
              </>
            )}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Hinführung zu: <strong className="text-foreground/80">{target}</strong>
          </p>
        </div>
        <div className="shrink-0 text-center">
          <img src={qr} alt="QR-Code zum Video" className="h-24 w-24 rounded border border-border" />
          <div className="mt-1 text-[10px] text-muted-foreground">Video scannen</div>
        </div>
      </header>

      <div className="mt-4 grid gap-4 sm:grid-cols-[160px_1fr]">
        <div className="flex items-start justify-center">
          {step.graphicKey ? (
            <StationGraphic kind={step.graphicKey} />
          ) : (
            <div className="flex aspect-square w-full max-w-[160px] items-center justify-center rounded-md border border-dashed border-border bg-muted/30 text-[10px] text-muted-foreground">
              keine Grafik
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Ziel</h3>
            <p className="mt-1 text-sm text-foreground/80">{step.ziel}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Bewegung</h3>
            <p className="mt-1 text-sm text-foreground/90">{step.beschreibung}</p>
          </div>
          {step.material && step.material.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold text-foreground">Material</h3>
              <ul className="mt-1 list-disc pl-5 text-sm text-foreground/80">
                {step.material.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      {step.sicherheit ? (
        <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-rose-800">
            Sicherheit
          </h3>
          <p className="mt-1 text-sm text-rose-950">{step.sicherheit}</p>
        </div>
      ) : null}

      {/* Lehrer-Feld: eigene Video-URL — wird nicht gedruckt */}
      <div className="no-print mt-4 rounded-md border border-dashed border-border bg-muted/30 p-3">
        <label className="block text-xs font-medium text-muted-foreground">
          Eigene Video-URL (überschreibt QR-Code-Ziel)
        </label>
        <input
          type="url"
          placeholder={`Standard: YouTube-Suche „${videoSearch}"`}
          value={videoUrl}
          onChange={(e) => onVideoUrlChange(e.target.value)}
          className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
        />
        <div className="mt-1 truncate text-[11px] text-muted-foreground">
          QR-Code zeigt auf:{" "}
          <a href={targetUrl} target="_blank" rel="noreferrer" className="underline">
            {targetUrl}
          </a>
        </div>
      </div>
    </article>
  );
}
