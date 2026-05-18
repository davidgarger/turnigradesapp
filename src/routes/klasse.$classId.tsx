import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Download,
  Plus,
  Search,
  Settings,
  Trash2,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  computeGrade,
  downloadCsv,
  exportClassCsv,
  turnActions,
  useTurnState,
  type ClassId,
  type Student,
} from "@/lib/turn-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";

const VALID: ClassId[] = ["1", "2", "3", "4"];

export const Route = createFileRoute("/klasse/$classId")({
  component: ClassPage,
  head: ({ params }) => ({
    meta: [
      { title: `${params.classId}. Klasse — Turnnoten` },
      { name: "description", content: `Schülerliste und Noten der ${params.classId}. Klasse.` },
    ],
  }),
});

type SortKey = "name" | "grade" | "total" | "fehl";

function ClassPage() {
  const { classId } = Route.useParams();
  const navigate = useNavigate();
  const state = useTurnState();

  if (!VALID.includes(classId as ClassId)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Unbekannte Klasse.</p>
          <Link to="/" className="mt-3 inline-block text-sm font-medium text-primary underline">
            Zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  const cls = state.classes[classId as ClassId];
  const settings = state.settings;

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const [newFirst, setNewFirst] = useState("");
  const [newLast, setNewLast] = useState("");
  const [studentOpen, setStudentOpen] = useState(false);

  const [discName, setDiscName] = useState("");
  const [discWeight, setDiscWeight] = useState(10);
  const [discOpen, setDiscOpen] = useState(false);

  const rows = useMemo(() => {
    const filtered = cls.students.filter((s) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        s.firstName.toLowerCase().includes(q) || s.lastName.toLowerCase().includes(q)
      );
    });
    const withGrade = filtered.map((s) => ({ s, g: computeGrade(s, cls.disciplines, settings) }));
    withGrade.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = `${a.s.lastName} ${a.s.firstName}`.localeCompare(`${b.s.lastName} ${b.s.firstName}`, "de");
          break;
        case "grade":
          cmp = a.g.grade - b.g.grade;
          break;
        case "total":
          cmp = a.g.total - b.g.total;
          break;
        case "fehl":
          cmp =
            a.s.forgottenKit + a.s.excusedNotParticipating + a.s.unexcusedNotParticipating -
            (b.s.forgottenKit + b.s.excusedNotParticipating + b.s.unexcusedNotParticipating);
          break;
      }
      return sortAsc ? cmp : -cmp;
    });
    return withGrade;
  }, [cls.students, cls.disciplines, settings, query, sortKey, sortAsc]);

  const handleSort = (k: SortKey) => {
    if (sortKey === k) setSortAsc((v) => !v);
    else {
      setSortKey(k);
      setSortAsc(true);
    }
  };

  const handleAddStudent = () => {
    if (!newFirst.trim() || !newLast.trim()) {
      toast.error("Bitte Vor- und Nachname angeben.");
      return;
    }
    turnActions.addStudent(cls.id, newFirst.trim(), newLast.trim());
    setNewFirst("");
    setNewLast("");
    setStudentOpen(false);
    toast.success("Schüler hinzugefügt");
  };

  const handleAddDiscipline = () => {
    if (!discName.trim()) {
      toast.error("Bitte einen Namen angeben.");
      return;
    }
    turnActions.addDiscipline(cls.id, discName.trim(), discWeight);
    setDiscName("");
    setDiscWeight(10);
    setDiscOpen(false);
    toast.success("Disziplin hinzugefügt");
  };

  const handleExport = () => {
    const csv = exportClassCsv(cls, settings);
    downloadCsv(`${cls.name.replace(/\s+/g, "_")}.csv`, csv);
    toast.success("CSV exportiert");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate({ to: "/" })}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input text-foreground transition-colors hover:bg-accent"
              aria-label="Zurück"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">{cls.name}</h1>
              <p className="text-xs text-muted-foreground">
                {cls.students.length} Schüler · {cls.disciplines.length} Disziplinen
              </p>
            </div>
          </div>
          <Link
            to="/einstellungen"
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Einstellungen</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Action bar */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Schüler suchen…"
              className="pl-9"
            />
          </div>

          <Dialog open={studentOpen} onOpenChange={setStudentOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" /> Schüler
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schüler hinzufügen</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="fn">Vorname</Label>
                  <Input id="fn" value={newFirst} onChange={(e) => setNewFirst(e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="ln">Nachname</Label>
                  <Input id="ln" value={newLast} onChange={(e) => setNewLast(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setStudentOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={handleAddStudent}>Hinzufügen</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={discOpen} onOpenChange={setDiscOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4" /> Disziplin
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
                    value={discName}
                    onChange={(e) => setDiscName(e.target.value)}
                    placeholder="z. B. Weitsprung"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="dw">Gewichtung (%)</Label>
                  <Input
                    id="dw"
                    type="number"
                    min={0}
                    max={100}
                    value={discWeight}
                    onChange={(e) => setDiscWeight(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Die Gewichtungen aller Disziplinen werden im Verhältnis zueinander gewertet.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDiscOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={handleAddDiscipline}>Hinzufügen</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>

        {/* Disciplines overview chip-row (with delete & weight edit) */}
        {cls.disciplines.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Disziplinen
            </span>
            {cls.disciplines.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1 text-sm"
              >
                <span className="font-medium text-foreground">{d.name}</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={d.weight}
                  onChange={(e) =>
                    turnActions.updateDiscipline(cls.id, d.id, { weight: Number(e.target.value) })
                  }
                  className="h-7 w-14 rounded border border-input bg-background px-1 text-right text-xs"
                />
                <span className="text-xs text-muted-foreground">%</span>
                <button
                  onClick={() => {
                    if (confirm(`Disziplin „${d.name}“ wirklich löschen?`)) {
                      turnActions.deleteDiscipline(cls.id, d.id);
                    }
                  }}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Disziplin löschen"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead className="bg-muted/60">
              <tr className="text-left">
                <th className="sticky left-0 z-[1] bg-muted/60 px-3 py-3 font-semibold">
                  <button
                    onClick={() => handleSort("name")}
                    className="inline-flex items-center gap-1 hover:text-primary"
                  >
                    Name <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                {cls.disciplines.map((d) => (
                  <th key={d.id} className="px-2 py-3 text-center font-semibold">
                    <div className="text-xs">{d.name}</div>
                    <div className="text-[10px] font-normal text-muted-foreground">{d.weight}%</div>
                  </th>
                ))}
                <th className="px-2 py-3 text-center font-semibold" title="Turnzeug vergessen">
                  <span className="text-status-danger">TV</span>
                </th>
                <th className="px-2 py-3 text-center font-semibold" title="Entschuldigt nicht mitgeturnt">
                  <span className="text-status-warning">E</span>
                </th>
                <th className="px-2 py-3 text-center font-semibold" title="Nicht entschuldigt">
                  <span className="text-status-danger-strong">NE</span>
                </th>
                <th className="px-2 py-3 text-center font-semibold">
                  Beteiligung
                </th>
                <th className="px-2 py-3 text-center font-semibold">
                  <button
                    onClick={() => handleSort("total")}
                    className="inline-flex items-center gap-1 hover:text-primary"
                  >
                    Punkte <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-2 py-3 text-center font-semibold">
                  <button
                    onClick={() => handleSort("grade")}
                    className="inline-flex items-center gap-1 hover:text-primary"
                  >
                    Note <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-2 py-3 text-center font-semibold">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={cls.disciplines.length + 8}
                    className="px-3 py-10 text-center text-muted-foreground"
                  >
                    Keine Schüler gefunden.
                  </td>
                </tr>
              )}
              {rows.map(({ s, g }) => (
                <StudentRow key={s.id} student={s} grade={g} classId={cls.id} disciplines={cls.disciplines} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <Legend color="status-danger" label="TV = Turnzeug vergessen" />
          <Legend color="status-warning" label="E = Entschuldigt nicht mitgeturnt" />
          <Legend color="status-danger-strong" label="NE = Nicht entschuldigt" />
          <Legend color="status-success" label="Beteiligung 4–5 = gut" />
        </div>
      </main>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: `var(--${color})` }} />
      {label}
    </span>
  );
}

function StudentRow({
  student,
  grade,
  classId,
  disciplines,
}: {
  student: Student;
  grade: ReturnType<typeof computeGrade>;
  classId: ClassId;
  disciplines: { id: string; name: string; weight: number }[];
}) {
  const gradeColor =
    grade.grade <= 2
      ? "bg-status-success-bg text-status-success"
      : grade.grade === 3
        ? "bg-status-warning-bg text-status-warning"
        : grade.grade === 4
          ? "bg-status-danger-bg text-status-danger"
          : "bg-status-danger-strong-bg text-status-danger-strong";

  return (
    <tr className="border-t border-border hover:bg-muted/30">
      <td className="sticky left-0 z-[1] bg-card px-3 py-2 font-medium text-foreground">
        <div className="flex flex-col">
          <span>
            {student.lastName} {student.firstName}
          </span>
        </div>
      </td>
      {disciplines.map((d) => (
        <td key={d.id} className="px-1 py-1 text-center">
          <input
            type="number"
            min={0}
            max={100}
            value={student.scores[d.id] ?? ""}
            placeholder="–"
            onChange={(e) => {
              const v = e.target.value === "" ? undefined : Math.max(0, Math.min(100, Number(e.target.value)));
              turnActions.setScore(classId, student.id, d.id, v);
            }}
            className="h-9 w-16 rounded-md border border-input bg-background px-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </td>
      ))}
      <StatusCell
        value={student.forgottenKit}
        tone="danger"
        onChange={(v) => turnActions.updateStudent(classId, student.id, { forgottenKit: v })}
      />
      <StatusCell
        value={student.excusedNotParticipating}
        tone="warning"
        onChange={(v) => turnActions.updateStudent(classId, student.id, { excusedNotParticipating: v })}
      />
      <StatusCell
        value={student.unexcusedNotParticipating}
        tone="danger-strong"
        onChange={(v) => turnActions.updateStudent(classId, student.id, { unexcusedNotParticipating: v })}
      />
      <td className="px-1 py-1 text-center">
        <div className="flex items-center justify-center gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => {
            const active = student.participation >= n;
            return (
              <button
                key={n}
                onClick={() => turnActions.updateStudent(classId, student.id, { participation: n })}
                className={`h-6 w-5 rounded-sm transition-colors ${
                  active
                    ? n >= 4
                      ? "bg-status-success"
                      : n === 3
                        ? "bg-status-warning"
                        : "bg-status-danger"
                    : "bg-muted"
                }`}
                aria-label={`Beteiligung ${n}`}
                title={`Beteiligung ${n}/5`}
              />
            );
          })}
        </div>
      </td>
      <td className="px-2 py-2 text-center font-semibold tabular-nums">{grade.total}</td>
      <td className="px-2 py-2 text-center">
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-base font-bold ${gradeColor}`}
        >
          {grade.grade}
        </span>
      </td>
      <td className="px-2 py-2 text-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              aria-label="Schüler löschen"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Schüler löschen?</AlertDialogTitle>
              <AlertDialogDescription>
                {student.firstName} {student.lastName} wird mit allen Werten endgültig entfernt.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  turnActions.deleteStudent(classId, student.id);
                  toast.success("Schüler gelöscht");
                }}
              >
                Löschen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </td>
    </tr>
  );
}

function StatusCell({
  value,
  tone,
  onChange,
}: {
  value: number;
  tone: "danger" | "warning" | "danger-strong";
  onChange: (v: number) => void;
}) {
  const toneClass =
    value === 0
      ? "border-input bg-background text-muted-foreground"
      : tone === "danger"
        ? "border-status-danger/40 bg-status-danger-bg text-status-danger"
        : tone === "warning"
          ? "border-status-warning/40 bg-status-warning-bg text-status-warning"
          : "border-status-danger-strong/40 bg-status-danger-strong-bg text-status-danger-strong";
  return (
    <td className="px-1 py-1 text-center">
      <div className="inline-flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="h-7 w-6 rounded-md border border-input text-sm text-muted-foreground hover:bg-accent"
          aria-label="weniger"
        >
          –
        </button>
        <span
          className={`inline-flex h-7 min-w-7 items-center justify-center rounded-md border px-2 text-sm font-semibold tabular-nums ${toneClass}`}
        >
          {value}
        </span>
        <button
          onClick={() => onChange(value + 1)}
          className="h-7 w-6 rounded-md border border-input text-sm text-muted-foreground hover:bg-accent"
          aria-label="mehr"
        >
          +
        </button>
      </div>
    </td>
  );
}
