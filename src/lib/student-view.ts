import type { ClassData, Student, GradingSettings } from './turn-store';
import { computeGrade, getDisciplineUnit, getEffectiveTotalLessons } from './grading';
import { buildPassPayload } from './turni-pass';

export function normalizeStudentName(name: string) { return name.trim().normalize('NFKC').toLocaleLowerCase('de-AT'); }
export function normalizeStudentCode(code: string) { return code.toUpperCase().replace(/[\s-]/g, ''); }
export function makeStudentCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  const raw = Array.from(bytes, b => alphabet[b % 32]).join('');
  return raw.match(/.{1,4}/g)?.join('-') ?? raw;
}
export function projectStudent(cls: ClassData, student: Student, settings: GradingSettings, updatedAt: string) {
  return {
    firstName: student.firstName, className: cls.name, updatedAt,
    grade: computeGrade(student, cls.disciplines, settings, getEffectiveTotalLessons(cls)).grade,
    disciplines: cls.disciplines.map(d => ({ name: d.name, value: student.scores[d.id] ?? null, unit: getDisciplineUnit(d) })),
    attendance: { attended: student.attended, excused: student.excusedNotParticipating, forgottenKit: student.forgottenKit, unexcused: student.unexcusedNotParticipating, total: getEffectiveTotalLessons(cls) },
    pass: buildPassPayload(cls, student),
  };
}
export type StudentView = ReturnType<typeof projectStudent>;