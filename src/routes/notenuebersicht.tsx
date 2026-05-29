import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, IdCard, List, Award, Activity, ShieldCheck, Sparkles, User } from "lucide-react";
import {
  computeGrade,
  getDisciplineUnit,
  getEffectiveTotalLessons,
  scoreToPercent,
  useTurnState,
  type ClassData,
  type ClassId,
  type Student,
} from "@/lib/turn-store";

export const Route = createFileRoute("/notenuebersicht")({
  component: NotenUebersicht,
  head: () => ({
    meta: [
      { title: "Notenübersicht — Turni" },
      { name: "description", content: "Grafische Notenübersicht pro Schüler oder als Liste." },
    ],
  }),
});

type Mode = "card" | "list";

function gradeColor(g: number): string {
  if (g <= 1) return "from-emerald-500 to-teal-500";
  if (g <= 2) return "from-lime-500 to-emerald-500";
  if (g <= 3) return "from-amber-400 to-orange-500";
  if (g <= 4) return "from-orange-500 to-rose-500";
  return "from-rose-500 to-red-600";
}

function gradeText(g: number): string {
  return ["Sehr gut", "Gut", "Befriedigend", "Genügend", "Nicht genügend"][Math.min(4, Math.max(0, g - 1))];
}

function NotenUebersicht() {
  const state = useTurnState();
  const [mode, setMode] = useState<Mode>("card");
  const [selectedClass, setSelectedClass] = useState<ClassId | "">("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");

  const classList = useMemo(
    () =>
      (Object.values(state.classes) as ClassData[]).filter(
        (c) => c.students.length > 0,
      ),
    [state.classes],
  );

  const currentClass = selectedClass ? state.classes[selectedClass] : undefined;
  const currentStudent = currentClass?.students.find((s) => s.id === selectedStudent);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Link>
          <h1 className="text-lg font-semibold tracking-tight">Notenübersicht</h1>
          <div className="w-[88px]" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Mode toggle */}
        <div className="mx-auto mb-8 inline-flex w-full max-w-md items-center rounded-xl border border-border bg-card p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setMode("card")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === "card"
                ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            <IdCard className="h-4 w-4" /> Visitenkarte
          </button>
          <button
            type="button"
            onClick={() => setMode("list")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === "list"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            <List className="h-4 w-4" /> Liste
          </button>
        </div>

        {mode === "card" ? (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Klasse
                </span>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value as ClassId);
                    setSelectedStudent("");
                  }}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">— Klasse wählen —</option>
                  {classList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.students.length})
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Schüler
                </span>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  disabled={!currentClass}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                >
                  <option value="">— Schüler wählen —</option>
                  {currentClass &&
                    [...currentClass.students]
                      .sort((a, b) =>
                        (a.lastName + a.firstName).localeCompare(b.lastName + b.firstName, "de"),
                      )
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.lastName}, {s.firstName}
                        </option>
                      ))}
                </select>
              </label>
            </div>

            {currentClass && currentStudent ? (
              <StudentCard cls={currentClass} student={currentStudent} settings={state.settings} />
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-sm text-muted-foreground">
                Bitte Klasse und Schüler wählen, um die Visitenkarte anzuzeigen.
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {classList.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-sm text-muted-foreground">
                Noch keine Schüler erfasst.
              </div>
            )}
            {classList.map((cls) => (
              <ClassList key={cls.id} cls={cls} settings={state.settings} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function StudentCard({
  cls,
  student,
  settings,
}: {
  cls: ClassData;
  student: Student;
  settings: ReturnType<typeof useTurnState>["settings"];
}) {
  const eff = getEffectiveTotalLessons(cls);
  const g = computeGrade(student, cls.disciplines, settings, eff);
  const initials = `${student.firstName[0] ?? ""}${student.lastName[0] ?? ""}`.toUpperCase();
  const grad = gradeColor(g.grade);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
      {/* Header band */}
      <div className={`relative bg-gradient-to-br ${grad} p-6 text-white`}>
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-black/10 blur-2xl" />

        <div className="relative flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/25 text-3xl font-black backdrop-blur-sm ring-2 ring-white/40">
            {initials || <User className="h-8 w-8" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-white/85">
              {cls.name}
            </div>
            <div className="truncate text-2xl font-bold leading-tight">
              {student.firstName} {student.lastName}
            </div>
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" /> Turnnoten-Visitenkarte
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
              Note
            </div>
            <div className="text-6xl font-black leading-none drop-shadow">{g.grade}</div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-white/90">
              {gradeText(g.grade)}
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">
        <StatTile
          icon={<Award className="h-4 w-4" />}
          label="Leistung"
          value={`${Math.round(g.disciplineAverage)} %`}
          hint={`${g.measuredCount}/${cls.disciplines.length} Disz.`}
          tone="from-indigo-500 to-violet-500"
        />
        <StatTile
          icon={<Activity className="h-4 w-4" />}
          label="Teilnahme"
          value={`${Math.round(g.attendanceRate * 100)} %`}
          hint={`${student.attended}/${eff} Std.`}
          tone="from-sky-500 to-cyan-500"
        />
        <StatTile
          icon={<ShieldCheck className="h-4 w-4" />}
          label="Betragen"
          value={String(g.behaviorGrade)}
          hint={`Netto ${g.behaviorNet} (🟥${student.redPoints} / 🟢${student.greenPoints})`}
          tone="from-emerald-500 to-teal-500"
        />
      </div>

      {/* Disciplines */}
      <div className="border-t border-border px-6 pb-6">
        <h3 className="mb-3 mt-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Disziplinen
        </h3>
        {cls.disciplines.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            Keine Disziplinen erfasst.
          </div>
        ) : (
          <div className="space-y-3">
            {cls.disciplines.map((d) => {
              const v = student.scores[d.id];
              const pct = typeof v === "number" ? scoreToPercent(d, v) : 0;
              const measured = typeof v === "number";
              return (
                <div key={d.id}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {d.name}
                    </span>
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {measured ? `${v} ${getDisciplineUnit(d)}` : "—"}
                      {measured && (
                        <span className="ml-2 text-xs font-semibold text-foreground">
                          {Math.round(pct)}%
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${grad} transition-all`}
                      style={{ width: `${measured ? pct : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/40 px-6 py-3 text-xs text-muted-foreground">
        <div>
          Gesamtpunkte:{" "}
          <span className="font-bold text-foreground tabular-nums">{g.total}</span> / 100
        </div>
        <div>
          Abzüge:{" "}
          <span className="font-bold text-foreground tabular-nums">−{g.penalties}</span>
        </div>
        <div>
          Turnzeug vergessen:{" "}
          <span className="font-bold text-foreground tabular-nums">{student.forgottenKit}</span>
        </div>
      </div>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  tone: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tone}`} />
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-2xl font-black tabular-nums text-foreground">{value}</div>
      {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

function ClassList({
  cls,
  settings,
}: {
  cls: ClassData;
  settings: ReturnType<typeof useTurnState>["settings"];
}) {
  const eff = getEffectiveTotalLessons(cls);
  const rows = [...cls.students]
    .map((s) => ({ s, g: computeGrade(s, cls.disciplines, settings, eff) }))
    .sort((a, b) =>
      (a.s.lastName + a.s.firstName).localeCompare(b.s.lastName + b.s.firstName, "de"),
    );

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3">
        <h2 className="text-base font-bold tracking-tight">{cls.name}</h2>
        <span className="text-xs text-muted-foreground">{cls.students.length} Schüler</span>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Name</th>
              <th className="px-3 py-2 text-right font-semibold">Leistung</th>
              <th className="px-3 py-2 text-right font-semibold">Teilnahme</th>
              <th className="px-3 py-2 text-right font-semibold">Punkte</th>
              <th className="px-3 py-2 text-right font-semibold">Betragen</th>
              <th className="px-3 py-2 text-right font-semibold">Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ s, g }) => {
              const grad = gradeColor(g.grade);
              return (
                <tr key={s.id} className="border-t border-border hover:bg-accent/40">
                  <td className="px-4 py-2 font-medium">
                    {s.lastName}, {s.firstName}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {Math.round(g.disciplineAverage)}%
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {Math.round(g.attendanceRate * 100)}%
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">{g.total}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{g.behaviorGrade}</td>
                  <td className="px-3 py-2 text-right">
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${grad} text-sm font-black text-white shadow`}
                    >
                      {g.grade}
                    </span>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-xs text-muted-foreground">
                  Keine Schüler.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
