import { useEffect, useState } from "react";
import { Trophy, Minus, Plus, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const COLORS = [
  { name: "Rot", hex: "#ef4444" },
  { name: "Blau", hex: "#3b82f6" },
  { name: "Grün", hex: "#22c55e" },
  { name: "Gelb", hex: "#eab308" },
  { name: "Orange", hex: "#f97316" },
  { name: "Lila", hex: "#a855f7" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Schwarz", hex: "#1f2937" },
];

type Team = { name: string; color: string; score: number };
const KEY = "turni-score-counter";
const defaults = (): Team[] =>
  [0, 1, 2, 3].map((i) => ({ name: `Team ${i + 1}`, color: COLORS[i].hex, score: 0 }));

export default function ScoreCounter() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(2);
  const [teams, setTeams] = useState<Team[]>(defaults);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (Array.isArray(d.teams) && d.teams.length === 4) setTeams(d.teams);
        if (d.count >= 2 && d.count <= 4) setCount(d.count);
      }
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ teams, count }));
  }, [teams, count]);

  const upd = (i: number, p: Partial<Team>) =>
    setTeams((t) => t.map((x, j) => (j === i ? { ...x, ...p } : x)));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Trophy className="h-4 w-4" /> Punkte
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" /> Punktezähler
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Teams:</span>
          {[2, 3, 4].map((n) => (
            <Button key={n} size="sm" variant={count === n ? "default" : "outline"} onClick={() => setCount(n)}>
              {n}
            </Button>
          ))}
          <Button size="sm" variant="ghost" className="ml-auto" onClick={() => setTeams((t) => t.map((x) => ({ ...x, score: 0 })))}>
            <RotateCcw className="h-4 w-4" /> Zurücksetzen
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {teams.slice(0, count).map((t, i) => (
            <div key={i} className="rounded-xl border-2 p-3" style={{ borderColor: t.color }}>
              <Input value={t.name} onChange={(e) => upd(i, { name: e.target.value })} className="mb-2 font-semibold" />
              <div className="mb-3 flex flex-wrap gap-1.5">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    title={c.name}
                    aria-label={c.name}
                    onClick={() => upd(i, { color: c.hex })}
                    className={`h-6 w-6 rounded-full border-2 ${t.color === c.hex ? "border-foreground scale-110" : "border-transparent"}`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between gap-2">
                <Button size="icon" variant="outline" className="h-12 w-12" onClick={() => upd(i, { score: Math.max(0, t.score - 1) })}>
                  <Minus className="h-5 w-5" />
                </Button>
                <span className="text-5xl font-black tabular-nums" style={{ color: t.color }}>{t.score}</span>
                <button
                  type="button"
                  onClick={() => upd(i, { score: t.score + 1 })}
                  className="grid h-12 w-12 place-items-center rounded-md text-background"
                  style={{ backgroundColor: t.color }}
                  aria-label="Punkt hinzufügen"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
