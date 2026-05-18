import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { turnActions, useTurnState } from "@/lib/turn-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/einstellungen")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Bewertungseinstellungen — Turnnoten" },
      { name: "description", content: "Gewichtungen, Abzüge und Notenschlüssel anpassen." },
    ],
  }),
});

function SettingsPage() {
  const { settings } = useTurnState();

  const updateThreshold = (grade: number, min: number) => {
    turnActions.updateSettings({
      gradeThresholds: settings.gradeThresholds.map((t) =>
        t.grade === grade ? { ...t, min } : t,
      ),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input text-foreground transition-colors hover:bg-accent"
              aria-label="Zurück"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                Bewertungseinstellungen
              </h1>
              <p className="text-xs text-muted-foreground">
                Gewichtungen, Abzüge und Notenschlüssel
              </p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4" /> Alle Daten zurücksetzen
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Alle Daten zurücksetzen?</AlertDialogTitle>
                <AlertDialogDescription>
                  Alle Klassen, Schüler, Disziplinen und Einstellungen werden auf die Standardwerte
                  und Beispieldaten zurückgesetzt.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    turnActions.reset();
                    toast.success("Daten zurückgesetzt");
                  }}
                >
                  Zurücksetzen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <Section
          title="Benotungs-Logik"
          description="Punkte = Disziplin-Schnitt × Teilnahmequote − Abzüge. Disziplinen, die nicht eingetragen sind, zählen nicht mit. Wenn keine Disziplin eingetragen ist, gilt der Disziplin-Schnitt als 100 (= Note hängt nur an Anwesenheit und Abzügen)."
        >
          <p className="text-sm text-muted-foreground">
            Die Anzahl der gehaltenen Turnstunden pro Klasse wird direkt in der Klassenansicht
            eingestellt. Pro Schüler wird über den „+"-Button gezählt, wie oft er mitgeturnt hat.
          </p>
        </Section>


        <Section title="Abzüge" description="Punkteabzüge pro Vorfall (jeweils einmalig multipliziert).">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Turnzeug vergessen">
              <Input
                type="number"
                min={0}
                value={settings.forgottenKitPenalty}
                onChange={(e) =>
                  turnActions.updateSettings({ forgottenKitPenalty: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Entschuldigt nicht mitgeturnt">
              <Input
                type="number"
                min={0}
                value={settings.excusedPenalty}
                onChange={(e) =>
                  turnActions.updateSettings({ excusedPenalty: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Nicht entschuldigt">
              <Input
                type="number"
                min={0}
                value={settings.unexcusedPenalty}
                onChange={(e) =>
                  turnActions.updateSettings({ unexcusedPenalty: Number(e.target.value) })
                }
              />
            </Field>
          </div>
        </Section>

        <Section
          title="Notenschlüssel"
          description="Mindestpunkte für jede Note. Werte zwischen 0 und 100."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {settings.gradeThresholds
              .slice()
              .sort((a, b) => a.grade - b.grade)
              .map((t) => (
                <Field key={t.grade} label={`Note ${t.grade} ab`}>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={t.min}
                    onChange={(e) => updateThreshold(t.grade, Number(e.target.value))}
                  />
                </Field>
              ))}
          </div>
        </Section>

        <Section title="Disziplin-Gewichtungen" description="Werden direkt in der jeweiligen Klassenansicht angepasst.">
          <p className="text-sm text-muted-foreground">
            Öffne eine Klasse und ändere die Gewichtung jeder Disziplin in der Disziplinen-Leiste
            oberhalb der Tabelle.
          </p>
        </Section>
      </main>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
