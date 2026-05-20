import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, LayoutGrid, Printer, Share2, Square } from "lucide-react";
import {
  CARD_SETS,
  DISCIPLINE_LABEL,
  SPORT_COLORS,
  SPORT_LABEL,
  SPORT_TO_DISCIPLINES,
  getCardSet,
  type CardDiscipline,
  type CardSport,
} from "@/lib/station-cards-v2";
import { StationCard } from "@/components/StationCard";
import { TurniLogo } from "@/components/TurniLogo";

export const Route = createFileRoute("/stationenkarten")({
  component: StationenkartenPage,
  head: () => ({
    meta: [
      { title: "Stationenkarten · turni.live" },
      {
        name: "description",
        content:
          "Druckbare, einheitliche Stationenkarten für Leichtathletik und Geräteturnen.",
      },
    ],
  }),
});

type ViewMode = "single" | "set";

function StationenkartenPage() {
  const navigate = useNavigate();
  const [sport, setSport] = useState<CardSport>("leichtathletik");
  const [discipline, setDiscipline] = useState<CardDiscipline>("sprint");
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<ViewMode>("set");

  const disciplines = useMemo(() => SPORT_TO_DISCIPLINES[sport], [sport]);
  const set = useMemo(() => getCardSet(sport, discipline), [sport, discipline]);
  const color = SPORT_COLORS[sport];

  const onSportChange = (s: CardSport) => {
    setSport(s);
    setDiscipline(SPORT_TO_DISCIPLINES[s][0]);
    setActiveIndex(0);
  };
  const onDisciplineChange = (d: CardDiscipline) => {
    setDiscipline(d);
    setActiveIndex(0);
  };

  const onPrint = () => window.print();
  const onShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Stationenkarten · turni.live",
          text: set ? `${SPORT_LABEL[sport]} – ${set.title}` : "Stationenkarten",
          url,
        });
      } catch {
        /* abgebrochen */
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-grid { grid-template-columns: 1fr 1fr !important; gap: 8mm !important; }
          .station-card { box-shadow: none !important; }
          @page { size: A4; margin: 10mm; }
        }
      `}</style>

      {/* Top Bar */}
      <header className="no-print sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate({ to: "/" })}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100"
            aria-label="Zurück"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <TurniLogo className="h-7 w-7" />
            <div className="min-w-0">
              <h1 className="text-base font-bold leading-tight text-slate-900 sm:text-lg">
                Stationenkarten
              </h1>
              <p className="text-[11px] text-slate-500">
                Leichtathletik & Geräteturnen — 4er-Set pro Disziplin
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onShare}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Teilen</span>
            </button>
            <button
              onClick={onPrint}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              style={{ background: color.base }}
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Drucken / PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Filter */}
        <section className="no-print mb-6 space-y-4">
          {/* Sport */}
          <div className="flex gap-2">
            {(Object.keys(SPORT_LABEL) as CardSport[]).map((s) => {
              const active = s === sport;
              const sc = SPORT_COLORS[s];
              return (
                <button
                  key={s}
                  onClick={() => onSportChange(s)}
                  className="flex-1 rounded-xl border px-4 py-3 text-left transition"
                  style={{
                    borderColor: active ? sc.base : "#e2e8f0",
                    background: active ? sc.base : "white",
                    color: active ? "white" : "#0f172a",
                  }}
                >
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                    Bereich
                  </div>
                  <div className="text-base font-bold">{SPORT_LABEL[s]}</div>
                </button>
              );
            })}
          </div>

          {/* Disziplinen */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CARD_SETS.filter((s) => s.sport === sport).map((s) => {
              const active = s.discipline === discipline;
              return (
                <button
                  key={s.discipline}
                  onClick={() => onDisciplineChange(s.discipline)}
                  className="rounded-lg border px-3 py-2.5 text-sm font-semibold transition"
                  style={{
                    borderColor: active ? color.base : "#e2e8f0",
                    background: active ? color.soft : "white",
                    color: active ? color.ink : "#0f172a",
                  }}
                >
                  {DISCIPLINE_LABEL[s.discipline]}
                </button>
              );
            })}
          </div>

          {/* View-Mode */}
          <div className="flex items-center justify-between">
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                onClick={() => setMode("set")}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  mode === "set"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> 4er-Set
              </button>
              <button
                onClick={() => setMode("single")}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  mode === "single"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Square className="h-3.5 w-3.5" /> Einzelkarte
              </button>
            </div>
            {mode === "single" && set ? (
              <div className="flex gap-1">
                {set.cards.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className="h-8 w-8 rounded-md text-xs font-bold transition"
                    style={{
                      background:
                        activeIndex === i ? color.base : color.soft,
                      color: activeIndex === i ? "white" : color.ink,
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* Cards */}
        {!set ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Diese Disziplin ist noch nicht hinterlegt.
          </div>
        ) : mode === "set" ? (
          <section className="print-grid grid gap-4 md:grid-cols-2">
            {set.cards.map((card, i) => (
              <StationCard
                key={i}
                card={card}
                set={set}
                index={i + 1}
              />
            ))}
          </section>
        ) : (
          <section className="grid">
            <StationCard
              card={set.cards[activeIndex]}
              set={set}
              index={activeIndex + 1}
            />
          </section>
        )}
      </main>
    </div>
  );
}
