import type { Discipline, Student, ClassData, ClassSchedule, GradingSettings } from './turn-store';

export function getDisciplineMax(d: Discipline): number {
  if (d.scoreMode === "points") return Math.max(1, d.scoreMax ?? 10);
  return 100;
}

export function getDisciplineUnit(d: Discipline): string {
  if (d.unit && d.unit.trim()) return d.unit.trim();
  return d.scoreMode === "points" ? "Pkt" : "%";
}


export function scoreToPercent(d: Discipline, raw: number): number {
  const max = getDisciplineMax(d);
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, (raw / max) * 100));
}



export function computeScheduledLessons(schedule: ClassSchedule): number {
  if (!schedule.startDate || !schedule.endDate || schedule.weekdays.length === 0) return 0;
  const start = new Date(schedule.startDate + "T00:00:00");
  const end = new Date(schedule.endDate + "T00:00:00");
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return 0;
  const weekdaySet = new Set(schedule.weekdays);
  let count = 0;
  const cur = new Date(start);
  // Sicherheitslimit ca. 5 Jahre
  let safety = 366 * 5;
  while (cur <= end && safety-- > 0) {
    if (weekdaySet.has(cur.getDay())) count++;
    cur.setDate(cur.getDate() + 1);
  }
  const planned = count * Math.max(1, schedule.lessonsPerDay || 1);
  return Math.max(0, planned - Math.max(0, schedule.cancelled));
}

export function getEffectiveTotalLessons(cls: ClassData): number {
  if (cls.schedule) return computeScheduledLessons(cls.schedule);
  return cls.totalLessons;
}


export interface GradeResult {
  disciplineAverage: number; // weighted avg of entered disciplines (0-100); 100 if none entered
  attendanceRate: number; // 0..1
  penalties: number;
  total: number; // clamped 0..100
  grade: number;
  measuredCount: number;
  hasDisciplineData: boolean;
  behaviorNet: number;   // rote − grüne Punkte (mind. 0)
  behaviorGrade: number; // Betragensnote 1..5 (je 3 Netto-Rotpunkte eine Note schlechter)
}

export function computeGrade(
  student: Student,
  disciplines: Discipline[],
  settings: GradingSettings,
  totalLessons: number,
): GradeResult {
  let weightedSum = 0;
  let weightTotal = 0;
  let measuredCount = 0;
  for (const d of disciplines) {
    const v = student.scores[d.id];
    if (typeof v === "number" && !Number.isNaN(v)) {
      const pct = scoreToPercent(d, v);
      weightedSum += pct * d.weight;
      weightTotal += d.weight;
      measuredCount++;
    }
  }

  const hasDisciplineData = weightTotal > 0;
  const disciplineAverage = hasDisciplineData ? weightedSum / weightTotal : 100;

  // Entschuldigte Stunden zählen nicht als „verpasst" – sie reduzieren die persönliche Soll-Stundenzahl.
  const personalLessons = Math.max(0, totalLessons - student.excusedNotParticipating);
  const attendanceRate =
    personalLessons > 0 ? Math.max(0, Math.min(1, student.attended / personalLessons)) : 1;

  const penalties =
    student.forgottenKit * settings.forgottenKitPenalty +
    student.excusedNotParticipating * settings.excusedPenalty +
    student.unexcusedNotParticipating * settings.unexcusedPenalty;

  const total = Math.max(
    0,
    Math.min(100, Math.round(disciplineAverage * attendanceRate - penalties)),
  );

  const sortedThresholds = [...settings.gradeThresholds].sort((a, b) => b.min - a.min);
  const grade = sortedThresholds.find((t) => total >= t.min)?.grade ?? 5;

  const behaviorNet = Math.max(0, student.redPoints - student.greenPoints);
  const behaviorGrade = Math.min(5, Math.max(1, 1 + Math.floor(behaviorNet / 3)));

  return {
    disciplineAverage,
    attendanceRate,
    penalties,
    total,
    grade,
    measuredCount,
    hasDisciplineData,
    behaviorNet,
    behaviorGrade,
  };
}

