import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  Plus,
  Search,
  Settings,
  Trash2,
  ArrowUpDown,
  Zap,
  Undo2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import {
  computeGrade,
  downloadCsv,
  exportClassCsv,
  getEffectiveTotalLessons,
  computeScheduledLessons,
  turnActions,
  useTurnState,
  undo,
  canUndo,
  type ClassId,
  type ClassSchedule,
  type Student,
} from "@/lib/turn-store";
import QuickSession from "@/components/QuickSession";
import ImportStudentsDialog, { type ParsedStudent } from "@/components/ImportStudentsDialog";
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
  const [sessionOpen, setSessionOpen] = useState(false);


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
  const [importOpen, setImportOpen] = useState(false);

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
    const effectiveLessons = getEffectiveTotalLessons(cls);
    const withGrade = filtered.map((s) => ({
      s,
      g: computeGrade(s, cls.disciplines, settings, effectiveLessons),
    }));
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
  }, [cls.students, cls.disciplines, cls.totalLessons, cls.schedule, settings, query, sortKey, sortAsc]);

  const effectiveLessons = getEffectiveTotalLessons(cls);

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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-2 py-4 sm:px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate({ to: "/" })}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-input text-foreground transition-colors hover:bg-accent"
              aria-label="Zurück"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="min-w-0">
              <input
                value={cls.name}
                onChange={(e) => turnActions.renameClass(cls.id, e.target.value)}
                className="w-full max-w-xs rounded-md border border-transparent bg-transparent px-1 py-0.5 text-lg font-semibold tracking-tight text-foreground hover:border-input focus:border-input focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Klassenname bearbeiten"
              />
              <p className="px-1 text-xs text-muted-foreground">
                {cls.students.length} Schüler · {cls.disciplines.length} Disziplinen
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSessionOpen(true)}
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/30 transition hover:opacity-95"
            >
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Neue Stunde</span>
            </button>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <SchedulePanel cls={cls} effectiveLessons={effectiveLessons} />
            <UndoButton />
            <Link
              to="/einstellungen"
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Einstellungen</span>
            </Link>
          </div>


        </div>
      </header>

      <main className="mx-auto max-w-7xl px-2 py-6 sm:px-4">
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
                <th className="px-2 py-3 text-center text-xs font-semibold">
                  <span className="text-status-danger">Turnzeug vergessen</span>
                </th>
                <th className="px-2 py-3 text-center text-xs font-semibold">
                  <span className="text-status-warning">Entschuldigt</span>
                </th>
                <th className="px-2 py-3 text-center text-xs font-semibold">
                  <span className="text-status-danger-strong">Nicht entschuldigt</span>
                </th>
                <th className="px-2 py-3 text-center font-semibold" title="Rote Disziplin-Punkte (3 = eine Betragens-Note schlechter)">
                  <span className="text-status-danger-strong">●</span>
                </th>
                <th className="px-2 py-3 text-center font-semibold" title="Grüne (positive) Punkte – heben rote Punkte auf">
                  <span className="text-status-success">●</span>
                </th>
                <th className="px-2 py-3 text-center font-semibold" title="Mitgeturnte Stunden">
                  Mitgeturnt
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
                <StudentRow
                  key={s.id}
                  student={s}
                  grade={g}
                  classId={cls.id}
                  disciplines={cls.disciplines}
                  totalLessons={effectiveLessons}
                />
              ))}

            </tbody>
          </table>
        </div>

        {/* Aktionen unterhalb der Tabelle */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
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



        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <Legend color="status-danger" label="Turnzeug vergessen" />
          <Legend color="status-warning" label="Entschuldigt nicht mitgeturnt" />
          <Legend color="status-danger-strong" label="Nicht entschuldigt" />
          <Legend color="status-success" label="Mitgeturnt / Stunden gesamt" />
          <Legend color="status-danger-strong" label="● Rote Punkte (3 = Betragens-Note ↓)" />
          <Legend color="status-success" label="● Grüne Punkte (heben rote auf)" />

        </div>
      </main>
      {sessionOpen && (
        <QuickSession classId={cls.id} onClose={() => setSessionOpen(false)} />
      )}
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
  totalLessons,
}: {
  student: Student;
  grade: ReturnType<typeof computeGrade>;
  classId: ClassId;
  disciplines: { id: string; name: string; weight: number }[];
  totalLessons: number;
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
      <td className="sticky left-0 z-[1] bg-card px-2 py-2 font-medium text-foreground">
        <div className="flex gap-0 sm:gap-1">
          <input
            value={student.lastName}
            onChange={(e) => turnActions.updateStudent(classId, student.id, { lastName: e.target.value })}
            placeholder="Nachname"
            className="h-9 w-24 rounded-md border border-transparent bg-transparent px-1 text-sm font-semibold hover:border-input focus:border-input focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring sm:w-28 sm:px-2"
            aria-label="Nachname"
          />
          <input
            value={student.firstName}
            onChange={(e) => turnActions.updateStudent(classId, student.id, { firstName: e.target.value })}
            placeholder="Vorname"
            className="h-9 w-24 rounded-md border border-transparent bg-transparent px-1 text-sm hover:border-input focus:border-input focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring sm:w-28 sm:px-2"
            aria-label="Vorname"
          />
        </div>
      </td>
      {disciplines.map((d) => (
        <td key={d.id} className="px-1 py-1 text-center">
          <ScoreInput
            value={student.scores[d.id]}
            onChange={(v) => turnActions.setScore(classId, student.id, d.id, v)}
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
      <StatusCell
        value={student.redPoints}
        tone="danger-strong"
        onChange={(v) => turnActions.updateStudent(classId, student.id, { redPoints: v })}
      />
      <StatusCell
        value={student.greenPoints}
        tone="success"
        onChange={(v) => turnActions.updateStudent(classId, student.id, { greenPoints: v })}
      />
      <td className="px-1 py-1 text-center">
        <div className="inline-flex items-center gap-1">
          <button
            onClick={() =>
              turnActions.updateStudent(classId, student.id, {
                attended: Math.max(0, student.attended - 1),
              })
            }
            className="h-7 w-6 rounded-md border border-input text-sm text-muted-foreground hover:bg-accent"
            aria-label="weniger mitgeturnt"
          >
            –
          </button>
          <span
            className="inline-flex h-7 min-w-[3.25rem] items-center justify-center rounded-md border border-status-success/40 bg-status-success-bg px-2 text-sm font-semibold tabular-nums text-status-success"
            title={`${student.attended} von ${totalLessons} Stunden mitgeturnt`}
          >
            {student.attended}/{totalLessons}
          </span>
          <button
            onClick={() =>
              turnActions.updateStudent(classId, student.id, {
                attended: student.attended + 1,
              })
            }
            className="h-7 w-7 rounded-md border border-status-success/40 bg-status-success text-sm font-bold text-white hover:opacity-90"
            aria-label="Stunde mitgeturnt – Plus"
            title="Heute mitgeturnt (+1)"
          >
            +
          </button>
        </div>
      </td>
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
  tone: "danger" | "warning" | "danger-strong" | "success";
  onChange: (v: number) => void;
}) {
  const toneClass =
    value === 0
      ? "border-input bg-background text-muted-foreground"
      : tone === "danger"
        ? "border-status-danger/40 bg-status-danger-bg text-status-danger"
        : tone === "warning"
          ? "border-status-warning/40 bg-status-warning-bg text-status-warning"
          : tone === "success"
            ? "border-status-success/40 bg-status-success-bg text-status-success"
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

const WEEKDAY_LABELS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

function defaultSchedule(): ClassSchedule {
  const now = new Date();
  const year = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
  return {
    startDate: `${year}-09-01`,
    endDate: `${year + 1}-06-30`,
    weekdays: [2], // Dienstag als sinnvoller Default
    lessonsPerDay: 1,
    cancelled: 0,
  };
}

function SchedulePanel({
  cls,
  effectiveLessons,
}: {
  cls: { id: ClassId; totalLessons: number; schedule?: ClassSchedule };
  effectiveLessons: number;
}) {
  const [open, setOpen] = useState(false);
  const hasSchedule = !!cls.schedule;
  const draftInit: ClassSchedule = cls.schedule ?? defaultSchedule();
  const [draft, setDraft] = useState<ClassSchedule>(draftInit);

  // Reset draft on open
  const onOpenChange = (v: boolean) => {
    if (v) setDraft(cls.schedule ?? defaultSchedule());
    setOpen(v);
  };

  const previewPlanned = computeScheduledLessons({ ...draft, cancelled: 0 });
  const previewEffective = computeScheduledLessons(draft);

  return (
    <div className="flex items-center gap-2">
      {hasSchedule ? (
        <div className="flex items-center gap-1 rounded-md border border-input bg-background px-2 py-1">
          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Stunden</span>
          <span className="text-sm font-semibold tabular-nums">{effectiveLessons}</span>
          {cls.schedule!.cancelled > 0 && (
            <span className="text-[10px] text-status-warning">
              (−{cls.schedule!.cancelled} entfallen)
            </span>
          )}
          <button
            onClick={() => turnActions.incrementCancelled(cls.id, 1)}
            className="ml-1 h-7 rounded border border-status-warning/40 bg-status-warning-bg px-2 text-xs font-semibold text-status-warning hover:opacity-90"
            title="Eine Stunde ist entfallen"
          >
            Entfall +1
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1 rounded-md border border-input bg-background px-2 py-1">
          <span className="text-xs font-medium text-muted-foreground">Stunden gesamt</span>
          <button
            onClick={() => turnActions.incrementTotalLessons(cls.id, -1)}
            className="h-7 w-6 rounded text-sm text-muted-foreground hover:bg-accent"
            aria-label="weniger Stunden"
          >
            –
          </button>
          <input
            type="number"
            min={0}
            value={cls.totalLessons}
            onChange={(e) => turnActions.setTotalLessons(cls.id, Number(e.target.value))}
            className="h-7 w-12 rounded border border-input bg-background px-1 text-center text-sm tabular-nums"
            aria-label="Gehaltene Turnstunden gesamt"
          />
          <button
            onClick={() => turnActions.incrementTotalLessons(cls.id, 1)}
            className="h-7 w-7 rounded bg-primary text-sm font-bold text-primary-foreground hover:opacity-90"
            title="Eine Turnstunde gehalten (+1)"
          >
            +
          </button>
        </div>
      )}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">Stundenplan</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Stundenplan & Schuljahr</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="sd">Schuljahresbeginn</Label>
                <Input
                  id="sd"
                  type="date"
                  value={draft.startDate}
                  onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="ed">Schuljahresende</Label>
                <Input
                  id="ed"
                  type="date"
                  value={draft.endDate}
                  onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label>Turntage (Wochentage)</Label>
              <div className="flex flex-wrap gap-1.5">
                {WEEKDAY_LABELS.map((lbl, i) => {
                  const active = draft.weekdays.includes(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          weekdays: active
                            ? draft.weekdays.filter((w) => w !== i)
                            : [...draft.weekdays, i].sort(),
                        })
                      }
                      className={`h-9 w-12 rounded-md border text-sm font-medium transition-colors ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-background text-foreground hover:bg-accent"
                      }`}
                    >
                      {lbl}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="lpd">Stunden pro Termin</Label>
                <Input
                  id="lpd"
                  type="number"
                  min={1}
                  max={6}
                  value={draft.lessonsPerDay}
                  onChange={(e) =>
                    setDraft({ ...draft, lessonsPerDay: Math.max(1, Number(e.target.value)) })
                  }
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="canc">Entfallene Stunden</Label>
                <Input
                  id="canc"
                  type="number"
                  min={0}
                  value={draft.cancelled}
                  onChange={(e) =>
                    setDraft({ ...draft, cancelled: Math.max(0, Number(e.target.value)) })
                  }
                />
              </div>
            </div>

            <div className="rounded-md border border-border bg-muted/40 p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Geplante Stunden im Schuljahr</span>
                <span className="font-semibold tabular-nums">{previewPlanned}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">− Entfallen</span>
                <span className="font-semibold tabular-nums">{draft.cancelled}</span>
              </div>
              <div className="mt-1 flex items-center justify-between border-t border-border pt-1">
                <span className="font-medium">= Tatsächliche Turnstunden</span>
                <span className="text-base font-bold tabular-nums">{previewEffective}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            {hasSchedule && (
              <Button
                variant="outline"
                onClick={() => {
                  turnActions.setSchedule(cls.id, undefined);
                  setOpen(false);
                  toast.success("Stundenplan entfernt – manuelle Zählung aktiv");
                }}
              >
                Stundenplan entfernen
              </Button>
            )}
            <Button variant="outline" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={() => {
                turnActions.setSchedule(cls.id, draft);
                setOpen(false);
                toast.success("Stundenplan gespeichert");
              }}
            >
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ScoreInput({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}) {
  const [text, setText] = useState<string>(value === undefined ? "" : String(value));

  // Externe Änderungen (z. B. Reset, Import) übernehmen, solange das Feld nicht editiert wird.
  useEffect(() => {
    setText(value === undefined ? "" : String(value));
  }, [value]);

  const commit = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed === "") {
      onChange(undefined);
      return;
    }
    const n = Number(trimmed);
    if (Number.isNaN(n)) {
      onChange(undefined);
      return;
    }
    onChange(Math.max(0, Math.min(100, Math.round(n))));
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={text}
      placeholder="–"
      onChange={(e) => {
        const v = e.target.value.replace(/[^\d]/g, "").slice(0, 3);
        setText(v);
        commit(v);
      }}
      onBlur={(e) => commit(e.target.value)}
      className="h-9 w-16 rounded-md border border-input bg-background px-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-ring"
    />
  );
}

function UndoButton() {
  // re-render bei state-Änderungen, damit canUndo() aktuell ist
  useTurnState();
  const disabled = !canUndo();
  return (
    <button
      type="button"
      onClick={() => {
        if (undo()) toast.success("Rückgängig gemacht");
      }}
      disabled={disabled}
      title="Letzte Änderung rückgängig (Strg+Z)"
      aria-label="Rückgängig"
      className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-40"
    >
      <Undo2 className="h-4 w-4" />
      <span className="hidden sm:inline">Undo</span>
    </button>
  );
}
