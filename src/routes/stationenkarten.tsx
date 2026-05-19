import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Printer, RefreshCw, LayoutGrid } from "lucide-react";
import {
  DISCIPLINE_LABEL,
  LEVEL_LABEL,
  SPORT_LABEL,
  SPORT_TO_DISCIPLINES,
  buildVideoQrUrl,
  generateStationCards,
  type StationCard,
  type StationDiscipline,
  type StationLevel,
  type StationSport,
} from "@/lib/station-cards";

export const Route = createFileRoute("/stationenkarten")({
  component: StationenkartenPage,
  head: () => ({
    meta: [
      { title: "Stationenkarten — Turni" },
      {
        name: "description",
        content:
          "Druckfertige Stationenkarten mit Vorübungen für Leichtathletik und Geräteturnen — inkl. QR-Code für Video.",
      },
    ],
  }),
});

const SPORTS: StationSport[] = ["leichtathletik", "geraeteturnen"];
const LEVELS: StationLevel[] = ["unterstufe", "mittelstufe", "oberstufe"];

function StationenkartenPage() {
  const navigate = useNavigate();
  const [sport, setSport] = useState<StationSport>("leichtathletik");
  const [discipline, setDiscipline] = useState<StationDiscipline>("sprint");
  const [level, setLevel] = useState<StationLevel>("mittelstufe");
  const [count, setCount] = useState<number>(4);
  const [seed, setSeed] = useState<number>(0);
  const [videoOverrides, setVideoOverrides] = useState<Record<number, string>>({});

  const disciplines = useMemo(() => SPORT_TO_DISCIPLINES[sport], [sport]);

  const onSportChange = (s: StationSport) => {
    setSport(s);
    const first = SPORT_TO_DISCIPLINES[s][0];
    if (first) setDiscipline(first);
  };

  const set = useMemo(
    () => generateStationCards({ sport, discipline, level, count, seed }),
    [sport, discipline, level, count, seed],
  );

  const onPrint = () => window.print();
  const onRegenerate = () => {
    setSeed((s) => s + 1);
    setVideoOverrides({});
  };

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
              Vorübungen für Leichtathletik & Geräteturnen — druckfertig mit QR-Code
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

      <main className="mx-auto max-w-5xl px-3 py-6 space-y-6">
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
                  <option key={s} value={s}>{SPORT_LABEL[s]}</option>
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
                  <option key={d} value={d}>{DISCIPLINE_LABEL[d]}</option>
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
                  <option key={l} value={l}>{LEVEL_LABEL[l]}</option>
                ))}
              </select>
            </Field>
            <Field label="Anzahl Stationen">
              <input
                type="number"
                min={1}
                max={8}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(8, Number(e.target.value) || 1)))}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </Field>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={onRegenerate}
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent"
            >
              <RefreshCw className="h-4 w-4" /> Andere Auswahl
            </button>
            <div className="text-xs text-muted-foreground self-center">
              Tipp: Pro Karte kannst du den QR-Code auf ein eigenes Video umlenken.
            </div>
          </div>
        </section>

        {/* Hinweis */}
        <section className="no-print rounded-lg border border-dashed border-border bg-muted/30 p-3 text-xs text-muted-foreground">
          Inhalte sind didaktische Vorschläge (Standard-Vorübungen). Bitte vor Einsatz fachlich prüfen.
          QR-Code zeigt standardmäßig auf eine YouTube-Suche — eigene Video-URL pro Karte möglich.
        </section>

        {/* Karten */}
        <section className="grid gap-4 sm:grid-cols-1">
          {set.cards.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
              Für diese Kombination sind noch keine Karten vorhanden.
            </div>
          ) : (
            set.cards.map((card, idx) => (
              <CardView
                key={`${card.title}-${idx}`}
                index={idx + 1}
                total={set.cards.length}
                sport={sport}
                discipline={discipline}
                level={level}
                card={card}
                videoUrl={videoOverrides[idx] ?? ""}
                onVideoUrlChange={(v) =>
                  setVideoOverrides((prev) => ({ ...prev, [idx]: v }))
                }
              />
            ))
          )}
        </section>
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

function CardView({
  index,
  total,
  sport,
  discipline,
  level,
  card,
  videoUrl,
  onVideoUrlChange,
}: {
  index: number;
  total: number;
  sport: StationSport;
  discipline: StationDiscipline;
  level: StationLevel;
  card: StationCard;
  videoUrl: string;
  onVideoUrlChange: (v: string) => void;
}) {
  const qr = buildVideoQrUrl(card.videoSearch, videoUrl);
  const targetUrl =
    videoUrl.trim().length > 0
      ? videoUrl.trim()
      : `https://www.youtube.com/results?search_query=${encodeURIComponent(card.videoSearch)}`;

  return (
    <article className="card-print rounded-xl border-2 border-border bg-white p-5 shadow-sm print:shadow-none">
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
            Station {index}/{total}: {card.title}
          </h2>
        </div>
        <div className="shrink-0 text-center">
          <img
            src={qr}
            alt="QR-Code zum Video"
            className="h-24 w-24 rounded border border-border"
          />
          <div className="mt-1 text-[10px] text-muted-foreground">Video scannen</div>
        </div>
      </header>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Ziel</h3>
          <p className="mt-1 text-sm text-foreground/80">{card.ziel}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Material</h3>
          <ul className="mt-1 list-disc pl-5 text-sm text-foreground/80">
            {card.material.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-foreground">Ablauf</h3>
        <ol className="mt-1 list-decimal pl-5 text-sm text-foreground/90">
          {card.ablauf.map((s, i) => (
            <li key={i} className="mb-0.5">{s}</li>
          ))}
        </ol>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
            Leichter
          </h3>
          <p className="mt-1 text-sm text-emerald-950">{card.variationLeichter}</p>
        </div>
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-800">
            Schwerer
          </h3>
          <p className="mt-1 text-sm text-amber-950">{card.variationSchwerer}</p>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-rose-800">
          Sicherheit
        </h3>
        <p className="mt-1 text-sm text-rose-950">{card.sicherheit}</p>
      </div>

      {/* Lehrer-Feld: eigene Video-URL — wird nicht gedruckt */}
      <div className="no-print mt-4 rounded-md border border-dashed border-border bg-muted/30 p-3">
        <label className="block text-xs font-medium text-muted-foreground">
          Eigene Video-URL (überschreibt QR-Code-Ziel)
        </label>
        <input
          type="url"
          placeholder={`Standard: YouTube-Suche „${card.videoSearch}"`}
          value={videoUrl}
          onChange={(e) => onVideoUrlChange(e.target.value)}
          className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
        />
        <div className="mt-1 truncate text-[11px] text-muted-foreground">
          QR-Code zeigt auf: <a href={targetUrl} target="_blank" rel="noreferrer" className="underline">{targetUrl}</a>
        </div>
      </div>
    </article>
  );
}
