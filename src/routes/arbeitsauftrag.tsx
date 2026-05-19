import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Printer, Share2, Copy, RefreshCw, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { useTurnState } from "@/lib/turn-store";
import {
  SPORT_LABEL,
  STATUS_LABEL,
  TASK_LABEL,
  formatAssignmentText,
  generateAssignment,
  type GeneratedAssignment,
  type Sport,
  type Status,
  type TaskType,
} from "@/lib/work-assignments";

type Search = {
  classId?: string;
  studentId?: string;
  status?: Status;
};

export const Route = createFileRoute("/arbeitsauftrag")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    classId: typeof s.classId === "string" ? s.classId : undefined,
    studentId: typeof s.studentId === "string" ? s.studentId : undefined,
    status:
      s.status === "entschuldigt" ||
      s.status === "unentschuldigt" ||
      s.status === "turnzeug_vergessen"
        ? s.status
        : undefined,
  }),
  component: ArbeitsauftragPage,
  head: () => ({
    meta: [
      { title: "Arbeitsauftrag — Turni" },
      {
        name: "description",
        content:
          "Erstelle in Sekunden einen Alternativ-Arbeitsauftrag für Schülerinnen und Schüler, die im Sportunterricht nicht mitturnen.",
      },
    ],
  }),
});

const SPORTS: Sport[] = ["basketball", "fussball", "geraeteturnen", "leichtathletik", "allgemein"];
const TASK_TYPES: TaskType[] = [
  "beobachtung",
  "regeln",
  "technik",
  "reflexion",
  "lueckentext",
  "quiz",
  "steckbrief",
  "sportgeschichte",
  "zufaellig",
];
const STATUSES: Status[] = ["entschuldigt", "unentschuldigt", "turnzeug_vergessen"];

function todayIso() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 10);
}

function formatDateDe(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("de-DE", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function ArbeitsauftragPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/arbeitsauftrag" });
  const state = useTurnState();

  const allStudents = useMemo(() => {
    const list: { id: string; name: string; classId: string; className: string }[] = [];
    Object.values(state.classes).forEach((c) => {
      c.students.forEach((s) =>
        list.push({
          id: s.id,
          classId: c.id,
          className: c.name,
          name: `${s.firstName} ${s.lastName}`.trim(),
        }),
      );
    });
    return list.sort((a, b) => a.name.localeCompare(b.name, "de"));
  }, [state.classes]);

  // Mappe den jüngsten Schnellcheck-Eintrag eines Schülers auf einen Status.
  const latestStatusByStudent = useMemo(() => {
    const map = new Map<string, Status>();
    type Hit = { at: string; status: Status };
    const latest = new Map<string, Hit>();
    Object.values(state.classes).forEach((c) => {
      (c.lessons ?? []).forEach((lesson) => {
        lesson.entries.forEach((e) => {
          let st: Status | null = null;
          if (e.type === "excused") st = "entschuldigt";
          else if (e.type === "unexcused") st = "unentschuldigt";
          else if (e.type === "forgottenKit") st = "turnzeug_vergessen";
          if (!st) return;
          const prev = latest.get(e.studentId);
          if (!prev || prev.at < e.at) {
            latest.set(e.studentId, { at: e.at, status: st });
          }
        });
      });
    });
    latest.forEach((v, k) => map.set(k, v.status));
    return map;
  }, [state.classes]);

  const initialStudent = useMemo(() => {
    if (search.studentId) return allStudents.find((s) => s.id === search.studentId);
    return undefined;
  }, [allStudents, search.studentId]);

  const [name, setName] = useState(initialStudent?.name ?? "");
  const [klasse, setKlasse] = useState(
    initialStudent?.className ??
      (search.classId && state.classes[search.classId as keyof typeof state.classes]
        ? state.classes[search.classId as keyof typeof state.classes].name
        : ""),
  );
  const [datum, setDatum] = useState(todayIso());
  const [status, setStatus] = useState<Status>(
    search.status ??
      (initialStudent ? latestStatusByStudent.get(initialStudent.id) : undefined) ??
      "entschuldigt",
  );
  const [sport, setSport] = useState<Sport>("allgemein");
  const [taskType, setTaskType] = useState<TaskType>("zufaellig");
  const [assignment, setAssignment] = useState<GeneratedAssignment | null>(null);

  const onPickStudent = (id: string) => {
    if (!id) return;
    const st = allStudents.find((s) => s.id === id);
    if (!st) return;
    setName(st.name);
    setKlasse(st.className);
    const auto = latestStatusByStudent.get(st.id);
    if (auto) setStatus(auto);
  };

  const onGenerate = () => {
    if (!name.trim()) {
      toast.error("Bitte Name eingeben.");
      return;
    }
    setAssignment(generateAssignment(sport, taskType));
  };

  const fullText = assignment
    ? formatAssignmentText({
        name: name.trim(),
        klasse: klasse.trim() || "—",
        datum: formatDateDe(datum),
        sport,
        status,
        assignment,
      })
    : "";

  const onCopy = async () => {
    if (!fullText) return;
    try {
      await navigator.clipboard.writeText(fullText);
      toast.success("Text kopiert");
    } catch {
      toast.error("Kopieren nicht möglich");
    }
  };

  const onShare = async () => {
    if (!fullText) return;
    const title = "Arbeitsauftrag Sportunterricht";
    const nav = navigator as Navigator & {
      share?: (data: { title?: string; text?: string; files?: File[] }) => Promise<void>;
      canShare?: (data: { files?: File[] }) => boolean;
    };
    try {
      const file = new File([fullText], `arbeitsauftrag-${name || "schueler"}.txt`, {
        type: "text/plain",
      });
      if (nav.canShare?.({ files: [file] }) && nav.share) {
        await nav.share({ title, text: fullText, files: [file] });
        return;
      }
      if (nav.share) {
        await nav.share({ title, text: fullText });
        return;
      }
      await navigator.clipboard.writeText(fullText);
      toast.success("Teilen nicht verfügbar — Text wurde kopiert");
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(fullText);
        toast.success("Text kopiert (Teilen nicht verfügbar)");
      } catch {
        toast.error("Teilen und Kopieren nicht möglich");
      }
    }
  };

  const onPrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 print:bg-white">
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; }
        }
        .print-only { display: none; }
      `}</style>

      <header className="no-print sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-3 py-4">
          <button
            onClick={() => navigate({ to: "/" })}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-input text-foreground transition hover:bg-accent"
            aria-label="Zurück"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
              Arbeitsauftrag erstellen
            </h1>
            <p className="text-xs text-muted-foreground">
              Für Schüler, die nicht mitturnen
            </p>
          </div>
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
          >
            Startseite
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3 py-6">
        {/* FORM */}
        <section className="no-print rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
              <ClipboardList className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-foreground">Auswahl</h2>
          </div>

          {allStudents.length > 0 && (
            <Field label="Schüler aus Liste übernehmen (optional)">
              <select
                onChange={(e) => onPickStudent(e.target.value)}
                defaultValue={initialStudent?.id ?? ""}
                className="h-12 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">— bitte wählen —</option>
                {allStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} · {s.className}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Schülername">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vor- und Nachname"
                className="h-12 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
            <Field label="Klasse">
              <input
                value={klasse}
                onChange={(e) => setKlasse(e.target.value)}
                placeholder="z. B. 3a"
                className="h-12 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
            <Field label="Datum">
              <input
                type="date"
                value={datum}
                onChange={(e) => setDatum(e.target.value)}
                className="h-12 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
            <Field label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="h-12 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Sportart">
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value as Sport)}
                className="h-12 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                {SPORTS.map((s) => (
                  <option key={s} value={s}>
                    {SPORT_LABEL[s]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Auftragstyp">
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value as TaskType)}
                className="h-12 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                {TASK_TYPES.map((s) => (
                  <option key={s} value={s}>
                    {TASK_LABEL[s]}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <button
            type="button"
            onClick={onGenerate}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-4 text-base font-bold text-white shadow-md transition active:scale-95"
          >
            <RefreshCw className="h-5 w-5" />
            {assignment ? "Neuen Auftrag erzeugen" : "Arbeitsauftrag erzeugen"}
          </button>
        </section>

        {/* PREVIEW */}
        {assignment && (
          <>
            <section
              id="auftrag-print"
              className="mt-6 rounded-2xl border border-border bg-white p-6 text-slate-900 shadow-sm print:mt-0 print:rounded-none print:border-0 print:p-0 print:shadow-none"
            >
              <h2 className="text-center text-2xl font-black tracking-tight">
                Arbeitsauftrag Sportunterricht
              </h2>
              <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 print:bg-slate-900" />

              <dl className="mt-6 grid grid-cols-1 gap-y-2 text-base sm:grid-cols-2">
                <Info label="Name" value={name.trim() || "—"} />
                <Info label="Klasse" value={klasse.trim() || "—"} />
                <Info label="Datum" value={formatDateDe(datum)} />
                <Info label="Status" value={STATUS_LABEL[status]} />
                <Info label="Sportart" value={SPORT_LABEL[sport]} />
                <Info label="Auftragstyp" value={TASK_LABEL[assignment.resolvedTaskType]} />
              </dl>

              <h3 className="mt-6 text-lg font-bold">Deine Aufgaben</h3>
              <ol className="mt-2 list-decimal space-y-2 pl-6 text-base leading-relaxed">
                {assignment.tasks.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ol>

              <h3 className="mt-6 text-lg font-bold">Abschlussfrage</h3>
              <p className="mt-1 text-base leading-relaxed">{assignment.closing}</p>

              <h3 className="mt-6 text-lg font-bold">Antwort</h3>
              <div className="mt-2 space-y-4">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-b border-slate-400" style={{ height: "1.6rem" }} />
                ))}
              </div>
            </section>

            <section className="no-print mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <BigButton onClick={onPrint} icon={<Printer className="h-6 w-6" />} label="Drucken / PDF" />
              <BigButton onClick={onShare} icon={<Share2 className="h-6 w-6" />} label="Teilen" />
              <BigButton onClick={onCopy} icon={<Copy className="h-6 w-6" />} label="Text kopieren" />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="min-w-[7rem] font-semibold text-slate-700">{label}:</dt>
      <dd className="text-slate-900">{value}</dd>
    </div>
  );
}

function BigButton({
  onClick,
  icon,
  label,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-input bg-card px-4 py-5 text-base font-bold text-foreground shadow-sm transition active:scale-95 hover:bg-accent"
    >
      {icon}
      {label}
    </button>
  );
}
