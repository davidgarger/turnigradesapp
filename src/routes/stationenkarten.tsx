import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LayoutGrid, Clock } from "lucide-react";
import { TurniLogo } from "@/components/TurniLogo";

export const Route = createFileRoute("/stationenkarten")({
  component: StationenkartenSoonPage,
  head: () => ({
    meta: [
      { title: "Stationenkarten · bald verfügbar · turni.live" },
      {
        name: "description",
        content:
          "Die Stationenkarten für Leichtathletik und Geräteturnen sind bald wieder verfügbar.",
      },
    ],
  }),
});

function StationenkartenSoonPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate({ to: "/" })}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100"
            aria-label="Zurück"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <TurniLogo className="h-7 w-7" />
            <h1 className="text-base font-bold leading-tight text-slate-900 sm:text-lg">
              Stationenkarten
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-400/30 blur-2xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl shadow-teal-500/30">
            <LayoutGrid className="h-12 w-12 text-white" />
          </div>
        </div>

        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
          <Clock className="h-3.5 w-3.5" />
          Bald verfügbar
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Stationenkarten kommen bald
        </h2>
        <p className="mt-4 max-w-md text-base text-slate-600">
          Wir feilen noch an den Karten für Leichtathletik und Geräteturnen.
          Schau bald wieder vorbei – es lohnt sich!
        </p>

        <button
          onClick={() => navigate({ to: "/" })}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zur Startseite
        </button>
      </main>
    </div>
  );
}
