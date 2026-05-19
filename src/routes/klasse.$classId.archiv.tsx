import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowLeft, Trash2, History } from "lucide-react";
import { toast } from "sonner";
import { turnActions, useTurnState, type ClassId } from "@/lib/turn-store";
import { Button } from "@/components/ui/button";

const VALID: ClassId[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

export const Route = createFileRoute("/klasse/$classId/archiv")({
  component: ArchivPage,
  head: ({ params }) => ({
    meta: [
      { title: `Archiv — ${params.classId}. Klasse` },
      { name: "description", content: "Archivierte Disziplin-Resultate dieser Klasse." },
    ],
  }),
});

function ArchivPage() {
  const { classId: raw } = Route.useParams();
  const navigate = useNavigate();
  const state = useTurnState();

  const isValid = VALID.includes(raw as ClassId);
  const classId = raw as ClassId;
  const cls = isValid ? state.classes[classId] : undefined;

  const snapshots = useMemo(
    () =>
      [...(cls?.snapshots ?? [])].sort((a, b) =>
        a.date === b.date ? b.createdAt.localeCompare(a.createdAt) : b.date.localeCompare(a.date),
      ),
    [cls?.snapshots],
  );

  // Gruppieren nach Disziplin (Name als Schlüssel, da disciplineId nach Löschung evtl. weg)
  const groups = useMemo(() => {
    const m = new Map<string, typeof snapshots>();
    for (const s of snapshots) {
      const arr = m.get(s.disciplineName) ?? [];
      arr.push(s);
      m.set(s.disciplineName, arr);
    }
    return Array.from(m.entries());
  }, [snapshots]);

  if (!isValid || !cls) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Unbekannte Klasse.</p>
        <Link to="/" className="text-primary underline">Zurück</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/klasse/$classId", params: { classId } })}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-input hover:bg-accent"
            aria-label="Zurück zur Klasse"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Archiv · {cls.name}</h1>
            <p className="text-sm text-muted-foreground">
              Gespeicherte Disziplin-Resultate mit Datum.
            </p>
          </div>
        </div>

        {snapshots.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
            <History className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Noch keine Snapshots</p>
            <p className="mt-1 text-xs text-muted-foreground">
              In der Klassenansicht bei einer Disziplin auf{" "}
              <History className="inline h-3 w-3" /> klicken, um die aktuellen Resultate zu archivieren.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {groups.map(([name, snaps]) => (
              <section key={name}>
                <h2 className="mb-3 text-lg font-semibold text-foreground">{name}</h2>
                <div className="space-y-4">
                  {snaps.map((snap) => {
                    const unit = snap.scoreMode === "points" ? "Pkt" : "%";
                    const dateLabel = new Date(snap.date + "T00:00:00").toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    });
                    return (
                      <div
                        key={snap.id}
                        className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
                          <div>
                            <div className="text-sm font-semibold text-foreground">{dateLabel}</div>
                            <div className="text-xs text-muted-foreground">
                              Skala: 0–{snap.scoreMax} {unit} · {snap.entries.length} Schüler
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Snapshot vom ${dateLabel} wirklich löschen?`)) {
                                turnActions.deleteDisciplineSnapshot(classId, snap.id);
                                toast.success("Snapshot gelöscht");
                              }
                            }}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-sm">
                            <thead className="bg-background">
                              <tr className="text-left">
                                <th className="px-4 py-2 font-medium text-muted-foreground">Name</th>
                                <th className="px-4 py-2 text-right font-medium text-muted-foreground">
                                  Wert ({unit})
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {snap.entries.map((e) => (
                                <tr key={e.studentId} className="border-t border-border">
                                  <td className="px-4 py-2 text-foreground">
                                    {e.firstName} {e.lastName}
                                  </td>
                                  <td className="px-4 py-2 text-right font-mono tabular-nums">
                                    {e.value === undefined || e.value === null ? (
                                      <span className="text-muted-foreground">—</span>
                                    ) : (
                                      e.value
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
