import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings, Users, ClipboardList } from "lucide-react";
import { useTurnState } from "@/lib/turn-store";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Turnnoten — Startseite" },
      { name: "description", content: "Wähle eine Klasse zur Verwaltung von Schülern und Noten." },
    ],
  }),
});

const CLASSES = ["1", "2", "3", "4"] as const;

function Index() {
  const state = useTurnState();
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">Turnnoten</h1>
              <p className="text-xs text-muted-foreground">Bewertung im Turnunterricht</p>
            </div>
          </div>
          <Link
            to="/einstellungen"
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Settings className="h-4 w-4" />
            Bewertungseinstellungen
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Klasse auswählen</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Wähle eine Klasse, um Schüler, Disziplinen und Noten zu verwalten.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CLASSES.map((id) => {
            const cls = state.classes[id];
            return (
              <Link
                key={id}
                to="/klasse/$classId"
                params={{ classId: id }}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-5xl font-bold tracking-tight text-foreground">{id}</span>
                  <Users className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                </div>
                <div className="mt-4">
                  <div className="text-lg font-semibold text-foreground">{cls.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {cls.students.length} Schüler · {cls.disciplines.length} Disziplinen
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
