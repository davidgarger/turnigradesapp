import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, Users, Search, Plus, X, Gamepad2, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useCommunityExercises, useIsAdmin, type CommunityExercise } from "@/lib/community-store";
import { SPIELE_SUBCATEGORIES } from "@/lib/spiele";
import { ExercisePosterModal } from "@/components/ExercisePosterModal";

export const Route = createFileRoute("/spiele/")({
  component: SpieleOverview,
  head: () => ({
    meta: [
      { title: "Spiele — Turni" },
      { name: "description", content: "Spielesammlung für den Sportunterricht: Aufwärmspiele, Fangspiele, Ballspiele und mehr." },
      { property: "og:title", content: "Spiele — Turni" },
      { property: "og:description", content: "Spielesammlung für den Sportunterricht: Aufwärmspiele, Fangspiele, Ballspiele und mehr." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SpieleOverview() {
  const { list, loading } = useCommunityExercises();
  const isAdmin = useIsAdmin();
  const [q, setQ] = useState("");
  const [sub, setSub] = useState<string>("all");
  const [open, setOpen] = useState<CommunityExercise | null>(null);

  const spiele = useMemo(
    () => list.filter((e) => e.category === "spiele" && e.status === "approved"),
    [list],
  );
  const pendingCount = useMemo(
    () => list.filter((e) => e.status === "pending").length,
    [list],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return spiele.filter((e) => {
      if (sub !== "all" && e.subcategory !== sub) return false;
      if (needle && !e.title.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [spiele, q, sub]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <Link
            to="/uebungssammlungen"
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Zurück</span>
          </Link>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-md shadow-fuchsia-500/30">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl">Spiele</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">Spielesammlung für den Sportunterricht</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/admin/uebungen"
                className="relative inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
              >
                <ShieldCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
                {pendingCount > 0 && (
                  <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {pendingCount}
                  </span>
                )}
              </Link>
            )}
            <Link
              to="/spiele/neu"
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-fuchsia-500 to-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-fuchsia-500/30 transition hover:opacity-95"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Neues Spiel</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Spiel suchen…"
              className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-10 text-sm outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Suche leeren"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <Chip active={sub === "all"} onClick={() => setSub("all")}>Alle</Chip>
            {SPIELE_SUBCATEGORIES.map((s) => (
              <Chip key={s} active={sub === s} onClick={() => setSub(s)}>{s}</Chip>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="py-16 text-center text-sm text-muted-foreground">Lädt…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background/60 px-6 py-16 text-center">
            <Gamepad2 className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              Noch keine Spiele vorhanden. Reiche das erste Spiel ein!
            </p>
            <Link
              to="/spiele/neu"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" /> Neues Spiel
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setOpen(e)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                {e.images[0] ? (
                  <img src={e.images[0]} alt={e.title} loading="lazy" className="aspect-video w-full object-cover" />
                ) : (
                  <div className="aspect-video w-full bg-gradient-to-br from-fuchsia-500 to-purple-600" />
                )}
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-fuchsia-600">{e.subcategory}</div>
                  <div className="text-base font-bold text-foreground">{e.title}</div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{e.shortDescription}</p>
                  <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{e.duration}</span>
                    <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{e.groupSize}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {open && <ExercisePosterModal exercise={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}
