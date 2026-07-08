import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, Users, Package, Search, Plus, Heart, Filter, X, Activity, ShieldCheck, Sparkles, Clock3 } from "lucide-react";
import { useMemo, useState } from "react";
import { SUBCATEGORIES, type Subcategory, konditionActions, useExercises, useFavorites, type Exercise } from "@/lib/kondition-store";
import { useCommunityExercises, useIsAdmin, useCloudFavorites, useCurrentUserId } from "@/lib/community-store";

export const Route = createFileRoute("/kondition/")({
  component: KonditionOverview,
  head: () => ({
    meta: [
      { title: "Kondition & Laufspiele — Turni" },
      { name: "description", content: "Übungsbibliothek für Kondition und Laufspiele im Sportunterricht." },
    ],
  }),
});

const SUB_COLORS: Record<Subcategory, string> = {
  Ausdauer: "from-emerald-500 to-teal-600",
  Sprint: "from-orange-500 to-red-500",
  Intervall: "from-fuchsia-500 to-rose-500",
  Staffel: "from-sky-500 to-blue-600",
  Laufparcours: "from-amber-500 to-orange-500",
  "Aufwärm-Laufspiele": "from-indigo-500 to-violet-500",
};

const DURATION_FILTERS = [
  { key: "all", label: "Alle", min: 0, max: 999 },
  { key: "short", label: "≤ 10 Min", min: 0, max: 10 },
  { key: "mid", label: "10–20 Min", min: 10, max: 20 },
  { key: "long", label: "> 20 Min", min: 20, max: 999 },
] as const;

const AGE_FILTERS = [
  { key: "all", label: "Alle Altersgruppen", min: 0, max: 99 },
  { key: "kids", label: "6–10 Jahre", min: 6, max: 10 },
  { key: "middle", label: "10–14 Jahre", min: 10, max: 14 },
  { key: "teens", label: "14–18 Jahre", min: 14, max: 18 },
] as const;

export default function KonditionOverview() {
  const localExercises = useExercises();
  const { list: communityAll } = useCommunityExercises();
  const localFavs = useFavorites();
  const { favs: cloudFavs, toggle: toggleCloudFav } = useCloudFavorites();
  const isAdmin = useIsAdmin();
  const uid = useCurrentUserId();

  const [q, setQ] = useState("");
  const [sub, setSub] = useState<Subcategory | "all">("all");
  const [duration, setDuration] = useState<(typeof DURATION_FILTERS)[number]["key"]>("all");
  const [age, setAge] = useState<(typeof AGE_FILTERS)[number]["key"]>("all");
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [source, setSource] = useState<"all" | "official" | "community">("all");

  const pendingCount = useMemo(
    () => communityAll.filter((e) => e.status === "pending").length,
    [communityAll],
  );

  // Vereinigte Liste: lokale (offizielle) + freigegebene Community-Übungen
  const exercises = useMemo(() => {
    const approvedCommunity = communityAll.filter((e) => e.status === "approved");
    const combined: (Exercise & { isCommunity?: boolean; authorName?: string | null })[] = [
      ...localExercises,
      ...approvedCommunity,
    ];
    return combined;
  }, [localExercises, communityAll]);

  // Favoriten aus beiden Quellen zusammenführen (Cloud, wenn eingeloggt; sonst nur lokal)
  const favs = useMemo(() => {
    const s = new Set<string>();
    localFavs.forEach((f) => s.add(f));
    cloudFavs.forEach((f) => s.add(f));
    return s;
  }, [localFavs, cloudFavs]);

  const toggleFav = (id: string) => {
    konditionActions.toggleFav(id);
    if (uid) void toggleCloudFav(id);
  };

  const filtered = useMemo(() => {
    const dur = DURATION_FILTERS.find((d) => d.key === duration)!;
    const ag = AGE_FILTERS.find((a) => a.key === age)!;
    const needle = q.trim().toLowerCase();
    return exercises.filter((e) => {
      if (sub !== "all" && e.subcategory !== sub) return false;
      if (source === "official" && (e as { isCommunity?: boolean }).isCommunity) return false;
      if (source === "community" && !(e as { isCommunity?: boolean }).isCommunity) return false;
      if (e.durationMinutes < dur.min || e.durationMinutes > dur.max) return false;
      if (e.ageMax < ag.min || e.ageMin > ag.max) return false;
      if (onlyFavs && !favs.has(e.id)) return false;
      if (needle && !e.title.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [exercises, sub, duration, age, q, onlyFavs, favs, source]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Zurück</span>
          </Link>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-teal-500/30">
              <Activity className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                Kondition & Laufspiele
              </h1>
              <p className="hidden text-xs text-muted-foreground sm:block">Übungsbibliothek – Testversion</p>
            </div>
          </div>
          <Link
            to="/kondition/neu"
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-teal-500/30 transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Neue Übung</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Suche + Filter */}
        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Übung suchen…"
              className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-10 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            />
            {q && (
              <button type="button" onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Suche leeren">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Unterkategorie-Chips */}
          <div className="flex flex-wrap gap-1.5">
            <FilterChip active={sub === "all"} onClick={() => setSub("all")}>Alle</FilterChip>
            {SUBCATEGORIES.map((s) => (
              <FilterChip key={s} active={sub === s} onClick={() => setSub(s)}>{s}</FilterChip>
            ))}
          </div>

          {/* Dauer + Alter + Favoriten */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Filter className="h-3.5 w-3.5" /> Filter:
            </div>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value as typeof duration)}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium"
            >
              {DURATION_FILTERS.map((d) => (
                <option key={d.key} value={d.key}>Dauer: {d.label}</option>
              ))}
            </select>
            <select
              value={age}
              onChange={(e) => setAge(e.target.value as typeof age)}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium"
            >
              {AGE_FILTERS.map((a) => (
                <option key={a.key} value={a.key}>{a.label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setOnlyFavs((v) => !v)}
              className={`inline-flex h-8 items-center gap-1.5 rounded-md border px-2 text-xs font-semibold transition ${
                onlyFavs ? "border-rose-300 bg-rose-50 text-rose-600" : "border-input bg-background text-foreground hover:bg-accent"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${onlyFavs ? "fill-current" : ""}`} />
              Favoriten
            </button>
            <div className="ml-auto text-xs text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "Übung" : "Übungen"}
            </div>
          </div>
        </div>

        {/* Karten */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background/50 p-10 text-center text-sm text-muted-foreground">
            Keine Übungen gefunden. Passe die Filter an oder lege eine neue Übung an.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => {
              const isFav = favs.has(e.id);
              const gradient = SUB_COLORS[e.subcategory];
              return (
                <div key={e.id} className="relative">
                  <Link
                    to="/kondition/$exerciseId"
                    params={{ exerciseId: e.id }}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-black/[0.02] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    {/* Farbiger Header-Streifen */}
                    <div className={`relative h-24 bg-gradient-to-br ${gradient} p-4 text-white`}>
                      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
                      <div className="pointer-events-none absolute -bottom-8 -left-6 h-20 w-20 rounded-full bg-black/10 blur-2xl" />
                      <div className="relative flex items-start justify-between">
                        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
                          {e.subcategory}
                        </span>
                      </div>
                      <div className="relative mt-3 text-lg font-bold leading-tight drop-shadow-sm line-clamp-2">
                        {e.title}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-3 p-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">{e.shortDescription}</p>
                      <div className="mt-auto flex flex-wrap gap-2 text-[11px] font-medium text-foreground/80">
                        <Chip icon={<Clock className="h-3 w-3" />}>{e.duration}</Chip>
                        <Chip icon={<Users className="h-3 w-3" />}>{e.groupSize}</Chip>
                        <Chip icon={<Package className="h-3 w-3" />}>{truncate(e.material, 22)}</Chip>
                      </div>
                    </div>
                  </Link>

                  {/* Favoriten-Button */}
                  <button
                    type="button"
                    onClick={(ev) => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      konditionActions.toggleFav(e.id);
                    }}
                    aria-label={isFav ? "Favorit entfernen" : "Als Favorit speichern"}
                    className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-sm transition hover:bg-white/40"
                  >
                    <Heart className={`h-4 w-4 ${isFav ? "fill-rose-400 text-rose-400" : ""}`} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
        active
          ? "border-teal-500 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm shadow-teal-500/30"
          : "border-input bg-background text-foreground hover:bg-accent"
      }`}
    >
      {children}
    </button>
  );
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
      {icon}
      {children}
    </span>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
