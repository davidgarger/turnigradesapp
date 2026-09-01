import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ShieldCheck, Check, X, Trash2, Loader2, Activity, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import {
  useCommunityExercises,
  useIsAdmin,
  useCurrentUserId,
  setCommunityStatus,
  deleteCommunityExercise,
  COMMUNITY_CATEGORIES,
  type CommunityCategory,
  type CommunityExercise,
} from "@/lib/community-store";


export const Route = createFileRoute("/admin/uebungen")({
  component: AdminExercises,
  head: () => ({ meta: [{ title: "Admin — Community-Übungen" }] }),
});

function AdminExercises() {
  const navigate = useNavigate();
  const uid = useCurrentUserId();
  const isAdmin = useIsAdmin();
  const { list, loading, refresh } = useCommunityExercises();
  const [categoryFilter, setCategoryFilter] = useState<CommunityCategory | "all">("all");

  useEffect(() => {
    if (uid === null) return;
    if (!isAdmin) {
      // Give a tiny moment for role fetch
    }
  }, [uid, isAdmin]);

  const filtered = useMemo(
    () => list.filter((e) => categoryFilter === "all" || e.category === categoryFilter),
    [list, categoryFilter],
  );
  const pending = filtered.filter((e) => e.status === "pending");
  const approved = filtered.filter((e) => e.status === "approved");
  const rejected = filtered.filter((e) => e.status === "rejected");

  const countByCat = (cat: CommunityCategory | "all") =>
    list.filter((e) => e.status === "pending" && (cat === "all" || e.category === cat)).length;

  const doApprove = async (id: string) => {
    try {
      await setCommunityStatus(id, "approved");
      toast.success("Freigegeben");
      refresh();
    } catch (e) {
      console.error(e);
      toast.error("Fehler bei der Freigabe");
    }
  };
  const doReject = async (id: string) => {
    try {
      await setCommunityStatus(id, "rejected");
      toast.success("Abgelehnt");
      refresh();
    } catch (e) {
      console.error(e);
      toast.error("Fehler beim Ablehnen");
    }
  };
  const doDelete = async (id: string) => {
    if (!confirm("Wirklich löschen?")) return;
    try {
      await deleteCommunityExercise(id);
      toast.success("Gelöscht");
      refresh();
    } catch (e) {
      console.error(e);
      toast.error("Löschen fehlgeschlagen");
    }
  };

  if (!uid) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 p-6 text-center">
        <div>
          <p className="text-sm text-slate-600">Bitte einloggen.</p>
          <button onClick={() => navigate({ to: "/login" })} className="mt-3 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white">Zum Login</button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 p-6 text-center">
        <div>
          <p className="text-sm text-slate-600">Kein Zugriff. Nur Admins.</p>
          <Link to="/uebungssammlungen" className="mt-3 inline-block rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white">Zurück</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-4">
          <Link to="/uebungssammlungen" className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4" /> Zurück
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h1 className="text-base font-semibold text-slate-900">Übungssammlungen freigeben</h1>
          </div>
          <div className="w-10" />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip active={categoryFilter === "all"} onClick={() => setCategoryFilter("all")} count={countByCat("all")}>
            Alle
          </FilterChip>
          {COMMUNITY_CATEGORIES.map((c) => (
            <FilterChip
              key={c.value}
              active={categoryFilter === c.value}
              onClick={() => setCategoryFilter(c.value)}
              count={countByCat(c.value)}
            >
              {c.label}
            </FilterChip>
          ))}
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Lädt…</div>
        )}

        <Section title={`Freizugeben (${pending.length})`} tone="amber">
          {pending.length === 0 ? (
            <Empty>Keine offenen Einreichungen.</Empty>
          ) : (
            pending.map((e) => (
              <ExerciseRow key={e.id} ex={e}>
                <button onClick={() => doApprove(e.id)} className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
                  <Check className="h-3.5 w-3.5" /> Freigeben
                </button>
                <button onClick={() => doReject(e.id)} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <X className="h-3.5 w-3.5" /> Ablehnen
                </button>
                {e.category === "kondition" && (
                  <Link to="/kondition/$exerciseId" params={{ exerciseId: e.id }} className="text-xs font-medium text-teal-700 hover:underline">Ansehen</Link>
                )}
              </ExerciseRow>
            ))
          )}
        </Section>

        <Section title={`Freigegeben (${approved.length})`} tone="emerald">
          {approved.length === 0 ? <Empty>Noch keine freigegebenen Community-Übungen.</Empty> : approved.map((e) => (
            <ExerciseRow key={e.id} ex={e}>
              <button onClick={() => doReject(e.id)} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                <X className="h-3.5 w-3.5" /> Verbergen
              </button>
              <button onClick={() => doDelete(e.id)} className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-white px-2 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              {e.category === "kondition" && (
                <Link to="/kondition/$exerciseId" params={{ exerciseId: e.id }} className="text-xs font-medium text-teal-700 hover:underline">Ansehen</Link>
              )}
            </ExerciseRow>
          ))}
        </Section>

        <Section title={`Abgelehnt (${rejected.length})`} tone="slate">
          {rejected.length === 0 ? <Empty>—</Empty> : rejected.map((e) => (
            <ExerciseRow key={e.id} ex={e}>
              <button onClick={() => doApprove(e.id)} className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
                <Check className="h-3.5 w-3.5" /> Doch freigeben
              </button>
              <button onClick={() => doDelete(e.id)} className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-white px-2 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </ExerciseRow>
          ))}
        </Section>
      </main>
    </div>
  );
}

function FilterChip({ active, onClick, count, children }: { active: boolean; onClick: () => void; count: number; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      {children}
      {count > 0 && (
        <span className={`inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] ${active ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function CategoryBadge({ category }: { category: CommunityCategory | null }) {
  if (category === "spiele") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-fuchsia-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-fuchsia-700 ring-1 ring-fuchsia-200">
        <Gamepad2 className="h-3 w-3" /> Spiele
      </span>
    );
  }
  if (category === "stationenkarten") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200">
        <LayoutGrid className="h-3 w-3" /> Stationenkarten
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-lime-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-lime-700 ring-1 ring-lime-200">
      <Activity className="h-3 w-3" /> Kondition
    </span>
  );
}

function ExerciseRow({ ex, children }: { ex: CommunityExercise; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-sm font-semibold text-slate-900">{ex.title}</div>
          <CategoryBadge category={ex.category} />
        </div>
        <div className="mt-0.5 text-[11px] uppercase tracking-wider text-slate-500">
          {ex.subcategory} · {ex.duration} · von {ex.authorName ?? "unbekannt"}
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-slate-600">{ex.shortDescription}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}


function Section({ title, tone, children }: { title: string; tone: "amber" | "emerald" | "slate"; children: React.ReactNode }) {
  const dot = tone === "amber" ? "bg-amber-500" : tone === "emerald" ? "bg-emerald-500" : "bg-slate-400";
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}


function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-dashed border-slate-200 bg-white p-4 text-center text-xs text-slate-500">{children}</div>;
}
