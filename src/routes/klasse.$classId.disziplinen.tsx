import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Plus, Trash2, GripVertical, Dumbbell } from "lucide-react";
import { toast } from "sonner";
import {
  turnActions,
  useTurnState,
  getDisciplineMax,
  suggestUnit,
  type ClassId,
  type DisciplineScoreMode,
} from "@/lib/turn-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const VALID: ClassId[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

export const Route = createFileRoute("/klasse/$classId/disziplinen")({
  component: DisziplinenPage,
  head: ({ params }) => ({
    meta: [
      { title: `Disziplinen — ${params.classId}. Klasse` },
      { name: "description", content: "Disziplinen dieser Klasse verwalten." },
    ],
  }),
});

function DisziplinenPage() {
  const { classId: raw } = Route.useParams();
  const navigate = useNavigate();
  const state = useTurnState();

  const isValid = VALID.includes(raw as ClassId);
  const classId = raw as ClassId;
  const cls = isValid ? state.classes[classId] : undefined;

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [weight, setWeight] = useState(10);
  const [mode, setMode] = useState<DisciplineScoreMode>("percent");
  const [max, setMax] = useState<number>(10);
  const [unit, setUnit] = useState<string>("");
  const [unitTouched, setUnitTouched] = useState(false);

  if (!isValid || !cls) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Unbekannte Klasse.</p>
        <Link to="/" className="text-primary underline">Zurück</Link>
      </div>
    );
  }

  const handleAdd = () => {
    if (!name.trim()) {
      toast.error("Bitte einen Namen angeben.");
      return;
    }
    const finalUnit = unit.trim() || suggestUnit(name);
    turnActions.addDiscipline(cls.id, name.trim(), weight, {
      scoreMode: mode,
      scoreMax: mode === "points" ? Math.max(1, max) : undefined,
      unit: finalUnit || undefined,
    });
    setName("");
    setWeight(10);
    setMode("percent");
    setMax(10);
    setUnit("");
    setUnitTouched(false);
    setOpen(false);
    toast.success("Disziplin hinzugefügt");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate({ to: "/klasse/$classId", params: { classId } })}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-input hover:bg-accent"
              aria-label="Zurück zur Klasse"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Disziplinen · {cls.name}</h1>
              <p className="text-xs text-muted-foreground">
                {cls.disciplines.length} Disziplinen
              </p>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" /> Neue Disziplin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Disziplin hinzufügen</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="dn">Name</Label>
                  <Input
                    id="dn"
                    value={name}
                    onChange={(e) => {
                      const v = e.target.value;
                      setName(v);
                      if (!unitTouched) setUnit(suggestUnit(v));
                    }}
                    placeholder="z. B. Weitsprung"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="du">Einheit</Label>
                  <Input
                    id="du"
                    value={unit}
                    onChange={(e) => {
                      setUnit(e.target.value);
                      setUnitTouched(true);
                    }}
                    placeholder="z. B. m, Level, s, Wdh – leer = Standard"
                  />
                  <p className="text-xs text-muted-foreground">
                    Wird in der Tabelle hinter dem Wert angezeigt. Aus dem Namen vorgeschlagen.
                  </p>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="dw">Gewichtung (%)</Label>
                  <Input
                    id="dw"
                    type="number"
                    min={0}
                    max={100}
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Die Gewichtungen aller Disziplinen werden im Verhältnis zueinander gewertet.
                  </p>
                </div>
                <div className="grid gap-1.5">
                  <Label>Bewertung</Label>
                  <div className="grid grid-cols-2 gap-1 rounded-md bg-muted p-1 text-sm">
                    <button
                      type="button"
                      onClick={() => setMode("percent")}
                      className={`rounded px-2 py-1.5 transition ${mode === "percent" ? "bg-background font-semibold text-foreground shadow-sm" : "text-muted-foreground"}`}
                    >
                      Prozent (0–100 %)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("points")}
                      className={`rounded px-2 py-1.5 transition ${mode === "points" ? "bg-background font-semibold text-foreground shadow-sm" : "text-muted-foreground"}`}
                    >
                      Punkte / Zahl
                    </button>
                  </div>
                  {mode === "points" ? (
                    <div className="grid gap-1.5">
                      <Label htmlFor="dmax">Maximaler Wert (= 100 %)</Label>
                      <Input
                        id="dmax"
                        type="number"
                        min={1}
                        max={1000}
                        value={max}
                        onChange={(e) => setMax(Math.max(1, Number(e.target.value) || 1))}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={handleAdd}>Hinzufügen</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {cls.disciplines.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
            <Dumbbell className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Noch keine Disziplinen</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Lege deine erste Disziplin an, um Resultate zu erfassen.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {cls.disciplines.map((d) => {
              const mode = d.scoreMode ?? "percent";
              const max = getDisciplineMax(d);
              return (
                <div
                  key={d.id}
                  className="rounded-lg border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <input
                      value={d.name}
                      onChange={(e) =>
                        turnActions.updateDiscipline(cls.id, d.id, { name: e.target.value })
                      }
                      className="flex-1 min-w-[180px] rounded-md border border-transparent bg-transparent px-2 py-1.5 text-base font-semibold text-foreground hover:border-input focus:border-input focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      aria-label="Name der Disziplin"
                    />
                    <button
                      onClick={() => {
                        if (confirm(`Disziplin „${d.name}" wirklich löschen? Alle erfassten Werte gehen verloren.`)) {
                          turnActions.deleteDiscipline(cls.id, d.id);
                          toast.success("Disziplin gelöscht");
                        }
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Disziplin löschen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="grid gap-1">
                      <Label className="text-xs text-muted-foreground">Gewichtung (%)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={d.weight}
                        onChange={(e) =>
                          turnActions.updateDiscipline(cls.id, d.id, {
                            weight: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label className="text-xs text-muted-foreground">Bewertung</Label>
                      <select
                        value={mode}
                        onChange={(e) => {
                          const next = e.target.value as DisciplineScoreMode;
                          turnActions.updateDiscipline(cls.id, d.id, {
                            scoreMode: next,
                            scoreMax: next === "points" ? (d.scoreMax ?? 10) : undefined,
                          });
                        }}
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                      >
                        <option value="percent">Prozent (0–100 %)</option>
                        <option value="points">Punkte / Zahl</option>
                      </select>
                    </div>
                    {mode === "points" ? (
                      <div className="grid gap-1">
                        <Label className="text-xs text-muted-foreground">Max-Wert</Label>
                        <Input
                          type="number"
                          min={1}
                          max={1000}
                          value={max}
                          onChange={(e) =>
                            turnActions.updateDiscipline(cls.id, d.id, {
                              scoreMax: Math.max(1, Number(e.target.value) || 1),
                            })
                          }
                        />
                      </div>
                    ) : (
                      <div className="hidden sm:block" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
