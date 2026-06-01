import { useMemo, useState } from "react";
import { Shuffle, Users, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { turnActions, type ClassData, type Student } from "@/lib/turn-store";

type Level = 1 | 2 | 3;

const LEVEL_META: Record<Level, { label: string; dots: string; cls: string }> = {
  1: { label: "Niveau A", dots: "●●●", cls: "border-status-success/40 bg-status-success-bg text-status-success" },
  2: { label: "Niveau B", dots: "●●○", cls: "border-status-warning/40 bg-status-warning-bg text-status-warning" },
  3: { label: "Niveau C", dots: "●○○", cls: "border-status-danger/40 bg-status-danger-bg text-status-danger" },
};

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Faire Aufteilung per Snake-Draft nach Niveau (1=stark .. 3=im Aufbau, undefined = mittel)
function buildTeams(students: Student[], teamCount: number): Student[][] {
  const sorted = shuffle(students).sort(
    (a, b) => (a.skillLevel ?? 2) - (b.skillLevel ?? 2),
  );
  const teams: Student[][] = Array.from({ length: teamCount }, () => []);
  let dir = 1;
  let idx = 0;
  for (const st of sorted) {
    teams[idx].push(st);
    if (dir === 1) {
      if (idx === teamCount - 1) dir = -1;
      else idx++;
    } else {
      if (idx === 0) dir = 1;
      else idx--;
    }
  }
  return teams;
}

export default function TeamGenerator({ cls }: { cls: ClassData }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"count" | "size">("count");
  const [teamCount, setTeamCount] = useState(2);
  const [teamSize, setTeamSize] = useState(4);
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [teams, setTeams] = useState<Student[][] | null>(null);

  // Aus einer laufenden Stunde (heutige, zuletzt gestartete Lesson) die
  // entschuldigten / nicht aktiven Schüler bestimmen.
  const sessionInactive = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todays = (cls.lessons ?? []).filter((l) => l.date === today);
    if (todays.length === 0) return new Set<string>();
    const latest = todays.reduce((a, b) =>
      a.createdAt > b.createdAt ? a : b,
    );
    const ids = new Set<string>();
    for (const e of latest.entries) {
      if (e.type === "excused" || e.type === "unexcused") ids.add(e.studentId);
    }
    return ids;
  }, [cls.lessons]);

  // Anzeige-Reihenfolge: aktive Schüler zuerst, inaktive ans Ende
  const orderedStudents = useMemo(() => {
    const list = cls.students.slice();
    list.sort((a, b) => {
      const ai = sessionInactive.has(a.id) ? 1 : 0;
      const bi = sessionInactive.has(b.id) ? 1 : 0;
      return ai - bi;
    });
    return list;
  }, [cls.students, sessionInactive]);

  const active = useMemo(
    () => cls.students.filter((s) => !excluded.has(s.id)),
    [cls.students, excluded],
  );

  const effectiveCount = useMemo(() => {
    if (active.length === 0) return 0;
    if (mode === "count") return Math.min(Math.max(2, teamCount), active.length);
    const size = Math.max(2, teamSize);
    return Math.max(1, Math.round(active.length / size));
  }, [mode, teamCount, teamSize, active.length]);

  const toggle = (id: string) => {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const setLevel = (id: string, level: Level | undefined) => {
    turnActions.updateStudent(cls.id, id, { skillLevel: level });
  };

  const generate = () => {
    if (active.length < 2) {
      toast.error("Mindestens 2 Teilnehmer nötig.");
      return;
    }
    if (effectiveCount < 2) {
      toast.error("Mindestens 2 Teams nötig.");
      return;
    }
    setTeams(buildTeams(active, effectiveCount));
  };

  const onOpenChange = (v: boolean) => {
    setOpen(v);
    if (v) {
      setTeams(null);
      setExcluded(new Set(sessionInactive));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-fuchsia-400/40 bg-gradient-to-r from-fuchsia-50 to-indigo-50 text-fuchsia-700 hover:from-fuchsia-100 hover:to-indigo-100 dark:from-fuchsia-950/40 dark:to-indigo-950/40 dark:text-fuchsia-200"
        >
          <Shuffle className="h-4 w-4" /> Teams
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Teams generieren
          </DialogTitle>
        </DialogHeader>

        {!teams && (
          <div className="grid gap-4">
            {/* Mode toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode("count")}
                className={`rounded-md border px-3 py-2 text-sm font-medium ${
                  mode === "count"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background"
                }`}
              >
                Anzahl Teams
              </button>
              <button
                type="button"
                onClick={() => setMode("size")}
                className={`rounded-md border px-3 py-2 text-sm font-medium ${
                  mode === "size"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background"
                }`}
              >
                Teamgröße
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {mode === "count" ? (
                <div className="grid gap-1.5">
                  <Label htmlFor="tc">Anzahl Teams</Label>
                  <Input
                    id="tc"
                    type="number"
                    inputMode="numeric"
                    min={2}
                    max={Math.max(2, active.length)}
                    value={teamCount === 0 ? "" : teamCount}
                    onChange={(e) => {
                      const v = e.target.value;
                      setTeamCount(v === "" ? 0 : Math.max(0, Number(v)));
                    }}
                    onBlur={() => setTeamCount((c) => Math.max(2, c || 2))}
                  />
                </div>
              ) : (
                <div className="grid gap-1.5">
                  <Label htmlFor="ts">Spieler pro Team</Label>
                  <Input
                    id="ts"
                    type="number"
                    inputMode="numeric"
                    min={2}
                    value={teamSize === 0 ? "" : teamSize}
                    onChange={(e) => {
                      const v = e.target.value;
                      setTeamSize(v === "" ? 0 : Math.max(0, Number(v)));
                    }}
                    onBlur={() => setTeamSize((c) => Math.max(2, c || 2))}
                  />
                </div>
              )}
              <div className="grid gap-1.5">
                <Label>Ergibt</Label>
                <div className="flex h-10 items-center rounded-md border border-input bg-muted/30 px-3 text-sm">
                  {effectiveCount} Teams · {active.length} Teilnehmer
                </div>
              </div>
            </div>

            {/* Participant list with level + exclude */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label>Teilnehmer & Niveau</Label>
                <span className="text-xs text-muted-foreground">
                  Tippe A / B / C zur Einstufung
                </span>
              </div>
              <div className="max-h-72 divide-y divide-border overflow-y-auto rounded-md border border-border">
                {cls.students.length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Keine Schüler in dieser Klasse.
                  </div>
                )}
                {orderedStudents.map((s) => {
                  const isOut = excluded.has(s.id);
                  return (
                    <div
                      key={s.id}
                      className={`flex items-center gap-2 px-3 py-2 ${isOut ? "opacity-50" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={!isOut}
                        onChange={() => toggle(s.id)}
                        className="h-4 w-4 accent-primary"
                        aria-label="Teilnahme"
                      />
                      <span className="flex-1 truncate text-sm">
                        {s.firstName} {s.lastName}
                      </span>
                      <div className="flex gap-1">
                        {([1, 2, 3] as Level[]).map((lv) => {
                          const meta = LEVEL_META[lv];
                          const active = s.skillLevel === lv;
                          return (
                            <button
                              key={lv}
                              type="button"
                              disabled={isOut}
                              onClick={() => setLevel(s.id, active ? undefined : lv)}
                              title={meta.label}
                              className={`h-7 w-9 rounded-md border text-[10px] font-bold tracking-wider ${
                                active
                                  ? meta.cls
                                  : "border-input bg-background text-muted-foreground hover:bg-accent"
                              }`}
                            >
                              {meta.dots}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Das Niveau bleibt gespeichert und wird für künftige Teamaufteilungen wiederverwendet.
                Schüler ohne Einstufung gelten als Niveau B.
              </p>
            </div>
          </div>
        )}

        {teams && (
          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {teams.map((team, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-card p-3 shadow-sm"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Team {i + 1}</h3>
                    <span className="text-xs text-muted-foreground">{team.length} Spieler</span>
                  </div>
                  <ul className="space-y-1 text-sm">
                    {team.map((s) => (
                      <li key={s.id} className="flex items-center justify-between">
                        <span>
                          {s.firstName} {s.lastName}
                        </span>
                        {s.skillLevel && (
                          <span className="text-[10px] text-muted-foreground">
                            {LEVEL_META[s.skillLevel].dots}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          {teams ? (
            <>
              <Button variant="outline" onClick={() => setTeams(null)}>
                Zurück
              </Button>
              <Button onClick={generate}>
                <Shuffle className="h-4 w-4" /> Neu mischen
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={generate}>
                <Sparkles className="h-4 w-4" /> Teams bilden
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
