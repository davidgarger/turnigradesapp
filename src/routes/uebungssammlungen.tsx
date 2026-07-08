import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, LayoutGrid, Activity, ShieldCheck } from "lucide-react";
import { TurniLogo } from "@/components/TurniLogo";
import { useCommunityExercises, useIsAdmin } from "@/lib/community-store";

export const Route = createFileRoute("/uebungssammlungen")({
  component: UebungssammlungenIndex,
  head: () => ({
    meta: [
      { title: "Übungssammlungen — Turni" },
      { name: "description", content: "Sammlungen von Übungen: Stationenkarten und Kondition." },
    ],
  }),
});

type Card = {
  to: "/stationenkarten" | "/kondition";
  title: string;
  description: string;
  gradient: string;
  glow: string;
  icon: React.ReactNode;
};

const CARDS: Card[] = [
  {
    to: "/stationenkarten",
    title: "Stationenkarten",
    description: "Karten für Postenläufe und Stationstraining.",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    glow: "shadow-teal-500/30",
    icon: <LayoutGrid className="h-6 w-6" />,
  },
  {
    to: "/kondition",
    title: "Kondition",
    description: "Laufspiele, Ausdauer, Sprint, Intervall, Staffel.",
    gradient: "from-lime-400 via-green-500 to-emerald-600",
    glow: "shadow-emerald-500/30",
    icon: <Activity className="h-6 w-6" />,
  },
];

function UebungssammlungenIndex() {
  const isAdmin = useIsAdmin();
  const { list } = useCommunityExercises();
  const pendingCount = list.filter((e) => e.status === "pending").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <TurniLogo className="h-10 w-10 rounded-lg shadow-md shadow-violet-500/20" />
            <div>
              <h1 className="hidden text-xl font-semibold tracking-tight text-foreground lg:block">Übungssammlungen</h1>
              <p className="hidden text-xs text-muted-foreground lg:block">Wähle eine Unterkategorie</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/admin/uebungen"
                className="relative inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 transition hover:opacity-95"
              >
                <ShieldCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Übungssammlungen freigeben</span>
                <span className="sm:hidden">Freigeben</span>
                {pendingCount > 0 && (
                  <span className="ml-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-amber-400 px-1.5 text-[10px] font-bold text-amber-950">
                    {pendingCount}
                  </span>
                )}
              </Link>
            )}
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Zurück</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Übungssammlungen
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Wähle eine Kategorie. Weitere folgen bald.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {CARDS.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className={`group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${c.gradient} p-6 text-white shadow-xl ${c.glow} ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-black/10 blur-2xl" />

              <div className="relative flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  {c.icon}
                </div>
              </div>
              <div className="relative mt-6">
                <div className="text-2xl font-bold">{c.title}</div>
                <p className="mt-1 text-sm text-white/85">{c.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
