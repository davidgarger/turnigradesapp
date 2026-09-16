import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Archive as ArchiveIcon, Trash2, GraduationCap, Users } from "lucide-react";
import { turnActions, useTurnState, getDisciplineUnit, type ArchivedClass } from "@/lib/turn-store";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/archiv")({
  component: ArchivPage,
  head: () => ({
    meta: [
      { title: "Archiv — Turnnoten" },
      { name: "description", content: "Archivierte Klassen aus früheren Schuljahren." },
    ],
  }),
});

function ArchivPage() {
  const state = useTurnState();
  const archive = state.archive ?? [];
  const [openId, setOpenId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, ArchivedClass[]>();
    for (const a of archive) {
      const key = a.schoolYear ?? "Ohne Schuljahr";
      const arr = map.get(key) ?? [];
      arr.push(a);
      map.set(key, arr);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [archive]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Link>
          <div className="flex items-center gap-2">
            <ArchiveIcon className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-lg font-semibold tracking-tight">Archiv</h1>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {archive.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border bg-background/50 p-12 text-center">
            <ArchiveIcon className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-semibold text-foreground">Noch keine archivierten Klassen</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Über „Schuljahr beenden" auf der Startseite werden Klassen ins Archiv verschoben.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map(([year, items]) => (
              <section key={year}>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Schuljahr {year}
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((a) => {
                    const isOpen = openId === a.id;
                    return (
                      <div key={a.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                        <div className="flex items-start justify-between gap-2 p-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {a.reason === "advanced" ? (
                                <><GraduationCap className="h-3 w-3" /> Aufgestiegen</>
                              ) : (
                                <><ArchiveIcon className="h-3 w-3" /> Entfernt</>
                              )}
                            </div>
                            <div className="mt-1 truncate text-base font-bold">{a.data.name}</div>
                            <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
                                <Users className="h-3 w-3" /> {a.data.students.length}
                              </span>
                              <span className="rounded-full bg-muted px-2 py-0.5">
                                {a.data.disciplines.length} Disz.
                              </span>
                              <span className="rounded-full bg-muted px-2 py-0.5">
                                {(a.data.lessons ?? []).length} Stunden
                              </span>
                            </div>
                            <div className="mt-2 text-[11px] text-muted-foreground">
                              {new Date(a.archivedAt).toLocaleDateString("de-AT", { day: "2-digit", month: "2-digit", year: "numeric" })}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`„${a.data.name}" endgültig aus dem Archiv löschen?`)) {
                                turnActions.removeFromArchive(a.id);
                                toast.success("Aus Archiv entfernt");
                              }
                            }}
                            className="text-muted-foreground transition hover:text-destructive"
                            aria-label="Aus Archiv löschen"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => setOpenId(isOpen ? null : a.id)}
                          className="flex w-full items-center justify-center gap-1 border-t border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
                        >
                          {isOpen ? "Details ausblenden" : "Schüler & Disziplinen anzeigen"}
                        </button>
                        {isOpen && (
                          <div className="max-h-72 overflow-y-auto border-t border-border bg-background p-3">
                            {a.data.disciplines.length > 0 && (
                              <div className="mb-3">
                                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                  Disziplinen
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {a.data.disciplines.map((d) => (
                                    <span
                                      key={d.id}
                                      className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-foreground"
                                    >
                                      {d.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {a.data.disciplines.length > 0 ? "Schüler & Werte" : "Schüler"}
                            </p>
                            {a.data.students.length === 0 ? (
                              <p className="text-center text-xs text-muted-foreground">Keine Schüler</p>
                            ) : a.data.disciplines.length > 0 ? (
                              <div className="-mx-1 overflow-x-auto px-1">
                                <table className="w-full min-w-max text-left text-xs">
                                  <thead>
                                    <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                      <th className="py-1 pr-3 font-semibold">Schüler</th>
                                      {a.data.disciplines.map((d) => (
                                        <th key={d.id} className="px-2 py-1 text-center font-semibold">
                                          {d.name}
                                          <span className="block text-[9px] font-normal normal-case text-muted-foreground">
                                            {getDisciplineUnit(d)}
                                          </span>
                                        </th>
                                      ))}
                                      <th className="px-2 py-1 text-center font-semibold">Anw.</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {a.data.students.map((st) => (
                                      <tr key={st.id} className="border-t border-border/60">
                                        <td className="py-1 pr-3 whitespace-nowrap">
                                          {st.firstName} {st.lastName}
                                        </td>
                                        {a.data.disciplines.map((d) => {
                                          const v = st.scores?.[d.id];
                                          return (
                                            <td key={d.id} className="px-2 py-1 text-center font-mono tabular-nums">
                                              {typeof v === "number" && !Number.isNaN(v) ? v : <span className="text-muted-foreground">–</span>}
                                            </td>
                                          );
                                        })}
                                        <td className="px-2 py-1 text-center text-muted-foreground">{st.attended ?? 0}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <ul className="space-y-1 text-xs">
                                {a.data.students.map((st) => (
                                  <li key={st.id} className="flex items-center justify-between rounded px-2 py-1 hover:bg-muted">
                                    <span>{st.firstName} {st.lastName}</span>
                                    <span className="font-mono text-[10px] text-muted-foreground">
                                      {st.attended ?? 0} anw.
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
