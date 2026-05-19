import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Download,
  Plus,
  Search,
  Settings,
  Trash2,
  ArrowUpDown,
  Zap,
  Undo2,
  Upload,
  Dumbbell,
} from "lucide-react";
import { toast } from "sonner";
import {
  computeGrade,
  downloadCsv,
  exportClassCsv,
  getDisciplineMax,
  getDisciplineUnit,
  getEffectiveTotalLessons,
  computeScheduledLessons,
  turnActions,
  useTurnState,
  undo,
  canUndo,
  type ClassId,
  type ClassSchedule,
  type DisciplineScoreMode,
  type Student,
  type Excuse,
} from "@/lib/turn-store";

import { supabase } from "@/integrations/supabase/client";
import QuickSession from "@/components/QuickSession";
import ImportStudentsDialog, { type ParsedStudent } from "@/components/ImportStudentsDialog";
import TeamGenerator from "@/components/TeamGenerator";
import ExcusesDialog from "@/components/ExcusesDialog";
import { Camera } from "lucide-react";
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

  const handleImportStudents = (list: ParsedStudent[]) => {
    for (const s of list) {
      turnActions.addStudent(cls.id, s.firstName, s.lastName);
    }
    toast.success(`${list.length} Schüler importiert`);
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
              to="/arbeitsauftrag"
              search={{ classId: cls.id }}
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Arbeitsauftrag</span>
            </Link>
            <Link
              to="/klasse/$classId/disziplinen"
              params={{ classId: cls.id }}
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              title="Disziplinen verwalten"
            >
              <Dumbbell className="h-4 w-4" />
              <span className="hidden sm:inline">Disziplinen</span>
            </Link>

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

          <Button variant="outline" onClick={() => setImportOpen(true)} title="Aus Datei oder Foto importieren">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Importieren</span>
          </Button>

          <TeamGenerator cls={cls} />
        </div>

        <ImportStudentsDialog
          open={importOpen}
          onOpenChange={setImportOpen}
          onConfirm={handleImportStudents}
        />





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
                {cls.disciplines.map((d) => {
                  const isPoints = (d.scoreMode ?? "percent") === "points";
                  return (
                    <th key={d.id} className="px-2 py-3 text-center font-semibold">
                      <div className="text-xs">{d.name}</div>
                      <div className="text-[10px] font-normal text-muted-foreground">
                        {d.weight}% · {isPoints ? `0–${getDisciplineMax(d)} Pkt` : "0–100 %"}
                      </div>
                    </th>
                  );
                })}

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
          <Link
            to="/klasse/$classId/disziplinen"
            params={{ classId: cls.id }}
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Dumbbell className="h-4 w-4" /> Disziplinen verwalten
          </Link>

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
            max={getDisciplineMax(d)}
            unit={getDisciplineUnit(d)}
            onChange={(v) => turnActions.setScore(classId, student.id, d.id, v)}
          />
        </td>

      ))}
      <StatusCell
        value={student.forgottenKit}
        tone="danger"
        onChange={(v) => turnActions.updateStudent(classId, student.id, { forgottenKit: v })}
      />
      <ExcusedCell student={student} classId={classId} />
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
        <div className="inline-flex items-center gap-1">
          <StudentHistoryDialog student={student} classId={classId} />
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
        </div>
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

function ExcusedCell({ student, classId }: { student: Student; classId: ClassId }) {
  const [open, setOpen] = useState(false);
  const count = student.excuses?.length ?? student.excusedNotParticipating;
  const hasPhoto = (student.excuses ?? []).some((e) => e.photoPath);
  const toneClass =
    count === 0
      ? "border-input bg-background text-muted-foreground"
      : "border-status-warning/40 bg-status-warning-bg text-status-warning";
  return (
    <td className="px-1 py-1 text-center">
      <div className="inline-flex items-center gap-1">
        <button
          onClick={() => {
            const list = student.excuses ?? [];
            if (list.length > 0) {
              // Letzten Eintrag entfernen (Foto bleibt im Storage, kann im Dialog gezielt gelöscht werden)
              turnActions.removeExcuse(classId, student.id, list[list.length - 1].id);
            } else {
              turnActions.updateStudent(classId, student.id, {
                excusedNotParticipating: Math.max(0, student.excusedNotParticipating - 1),
              });
            }
          }}
          className="h-7 w-6 rounded-md border border-input text-sm text-muted-foreground hover:bg-accent"
          aria-label="weniger"
        >
          –
        </button>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`relative inline-flex h-7 min-w-7 items-center justify-center rounded-md border px-2 text-sm font-semibold tabular-nums ${toneClass}`}
          title="Entschuldigungen mit Foto verwalten"
        >
          {count}
          {hasPhoto && (
            <span
              className="absolute -right-1 -top-1 inline-flex h-3 w-3 items-center justify-center rounded-full bg-status-warning text-white"
              aria-hidden
            >
              <Camera className="h-2 w-2" />
            </span>
          )}
        </button>
        <button
          onClick={() => setOpen(true)}
          className="h-7 w-7 rounded-md border border-status-warning/40 bg-status-warning text-white hover:opacity-90"
          aria-label="Entschuldigung mit Foto hinzufügen"
          title="Entschuldigung hinzufügen (mit Foto)"
        >
          <Camera className="mx-auto h-3.5 w-3.5" />
        </button>
      </div>
      <ExcusesDialog open={open} onOpenChange={setOpen} student={student} classId={classId} />
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
  max = 100,
  unit = "%",
}: {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  max?: number;
  unit?: string;
}) {
  const [text, setText] = useState<string>(value === undefined ? "" : String(value));

  useEffect(() => {
    setText(value === undefined ? "" : String(value));
  }, [value]);

  const commit = (raw: string) => {
    const trimmed = raw.trim().replace(",", ".");
    if (trimmed === "") {
      onChange(undefined);
      return;
    }
    const n = Number(trimmed);
    if (Number.isNaN(n)) {
      onChange(undefined);
      return;
    }
    const clamped = Math.max(0, Math.min(max, n));
    onChange(Math.round(clamped * 100) / 100);
  };

  return (
    <div className="inline-flex items-center gap-1">
      <input
        type="text"
        inputMode="decimal"
        value={text}
        placeholder="–"
        onChange={(e) => {
          let v = e.target.value.replace(/[^\d.,]/g, "").replace(",", ".");
          // only one decimal separator
          const parts = v.split(".");
          if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");
          setText(v);
          commit(v);
        }}
        onBlur={(e) => commit(e.target.value)}
        className="h-9 w-16 rounded-md border border-input bg-background px-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        title={`0–${max} ${unit}`}
      />
      <span className="text-[10px] text-muted-foreground">{unit}</span>
    </div>
  );
}

function MaxInput({ value, onCommit }: { value: number; onCommit: (v: number) => void }) {
  const [text, setText] = useState<string>(String(value));
  useEffect(() => { setText(String(value)); }, [value]);
  return (
    <input
      type="text"
      inputMode="decimal"
      value={text}
      onChange={(e) => {
        let v = e.target.value.replace(/[^\d.,]/g, "").replace(",", ".").slice(0, 6);
        const parts = v.split(".");
        if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");
        setText(v);
        if (v !== "" && !Number.isNaN(Number(v))) {
          const n = Math.max(0.01, Math.min(1000, Number(v)));
          onCommit(Math.round(n * 100) / 100);
        }
      }}
      onBlur={() => {
        if (text === "" || Number(text) < 0.01 || Number.isNaN(Number(text))) {
          setText(String(value));
        }
      }}
      className="h-7 w-16 rounded border border-input bg-background px-1 text-right text-xs"
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

function StudentHistoryDialog({ student, classId }: { student: Student; classId: ClassId }) {
  const [open, setOpen] = useState(false);
  const state = useTurnState();
  const cls = state.classes[classId];
  const lessons = useMemo(() => {
    const list = cls.lessons ?? [];
    return [...list].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, [cls.lessons]);

  const typeLabel: Record<string, { label: string; cls: string }> = {
    attended: { label: "Mitgeturnt", cls: "bg-status-success-bg text-status-success" },
    forgottenKit: { label: "Turnsachen vergessen", cls: "bg-status-danger-bg text-status-danger" },
    excused: { label: "Entschuldigt", cls: "bg-status-warning-bg text-status-warning" },
    unexcused: { label: "Unentschuldigt", cls: "bg-status-danger-strong-bg text-status-danger-strong" },
  };

  const counts = lessons.reduce(
    (acc, l) => {
      const e = l.entries.find((x) => x.studentId === student.id);
      if (!e) acc.missing++;
      else acc[e.type as keyof typeof acc]++;
      return acc;
    },
    { attended: 0, forgottenKit: 0, excused: 0, unexcused: 0, missing: 0 },
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Stunden­übersicht"
          title="Alle Stunden des Schuljahres"
        >
          <History className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {student.firstName} {student.lastName} – Stunden im Schuljahr
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <SummaryTile label="Stunden" value={lessons.length} />
          <SummaryTile label="Mitgeturnt" value={counts.attended} tone="success" />
          <SummaryTile label="Vergessen" value={counts.forgottenKit} tone="danger" />
          <SummaryTile label="Entsch." value={counts.excused} tone="warning" />
          <SummaryTile label="Unentsch." value={counts.unexcused} tone="danger-strong" />
        </div>

        <div className="mt-4 max-h-[55vh] overflow-y-auto rounded-md border border-border">
          {lessons.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              Noch keine Stunden erfasst.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/60 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Datum</th>
                  <th className="px-3 py-2 text-left font-semibold">Thema</th>
                  <th className="px-3 py-2 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((l) => {
                  const entry = l.entries.find((e) => e.studentId === student.id);
                  const info = entry ? typeLabel[entry.type] : null;
                  return (
                    <tr key={l.id} className="border-t border-border">
                      <td className="px-3 py-2 tabular-nums text-foreground">
                        {new Date(l.date).toLocaleDateString("de-AT", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-3 py-2 text-foreground">
                        {l.topic || <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-3 py-2">
                        {info ? (
                          <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${info.cls}`}>
                            {info.label}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">nicht erfasst</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <ExcusePhotosSection studentExcuses={student.excuses ?? []} open={open} />

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Schließen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SummaryTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "success" | "danger" | "warning" | "danger-strong";
}) {
  const toneCls =
    tone === "success"
      ? "bg-status-success-bg text-status-success"
      : tone === "danger"
        ? "bg-status-danger-bg text-status-danger"
        : tone === "warning"
          ? "bg-status-warning-bg text-status-warning"
          : tone === "danger-strong"
            ? "bg-status-danger-strong-bg text-status-danger-strong"
            : "bg-muted text-foreground";
  return (
    <div className={`rounded-md px-3 py-2 ${toneCls}`}>
      <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{label}</div>
      <div className="text-lg font-bold tabular-nums">{value}</div>
    </div>
  );
}

function ExcusePhotosSection({ studentExcuses, open }: { studentExcuses: Excuse[]; open: boolean }) {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [zoom, setZoom] = useState<string | null>(null);
  const withPhoto = useMemo(
    () => studentExcuses.filter((e) => e.photoPath).sort((a, b) => b.date.localeCompare(a.date)),
    [studentExcuses],
  );

  useEffect(() => {
    if (!open || withPhoto.length === 0) return;
    let cancelled = false;
    (async () => {
      const out: Record<string, string> = {};
      await Promise.all(
        withPhoto.map(async (e) => {
          const { data } = await supabase.storage
            .from("excuses")
            .createSignedUrl(e.photoPath!, 60 * 60);
          if (data?.signedUrl) out[e.id] = data.signedUrl;
        }),
      );
      if (!cancelled) setUrls(out);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, withPhoto]);

  if (withPhoto.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Entschuldigungs-Fotos ({withPhoto.length})
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {withPhoto.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => urls[e.id] && setZoom(urls[e.id])}
            className="group relative aspect-square overflow-hidden rounded-md border border-border bg-muted"
            title={`${new Date(e.date + "T00:00:00").toLocaleDateString("de-AT")}${e.note ? " · " + e.note : ""}`}
          >
            {urls[e.id] ? (
              <img
                src={urls[e.id]}
                alt="Entschuldigung"
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                lädt…
              </div>
            )}
            <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 py-1 text-left text-[10px] font-semibold text-white">
              {new Date(e.date + "T00:00:00").toLocaleDateString("de-AT", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}
            </span>
          </button>
        ))}
      </div>
      {zoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setZoom(null)}
        >
          <img src={zoom} alt="Vergrößert" className="max-h-full max-w-full rounded-md" />
        </div>
      )}
    </div>
  );
}
