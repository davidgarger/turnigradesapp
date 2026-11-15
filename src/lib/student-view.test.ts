import { describe, expect, it } from 'vitest';
import { makeStudentCode, normalizeStudentCode, normalizeStudentName, projectStudent } from './student-view';
import { defaultPassDevices } from './turni-pass';
import type { ClassData, Student, GradingSettings } from './turn-store';

const anna: Student = { id: 'anna', firstName: 'Anna', lastName: 'Privat', classId: '1', scores: { sprint: 8 }, attended: 3, excusedNotParticipating: 1, forgottenKit: 1, unexcusedNotParticipating: 0, redPoints: 0, greenPoints: 0, excuses: [{ id: 'private', date: '2026-11-15', note: 'private medical note', photoPath: 'private/photo' }] };
const cls: ClassData = { id: '1', name: '1A', students: [anna, { ...anna, id: 'other', firstName: 'Other' }], disciplines: [{ id: 'sprint', name: 'Sprint', weight: 1, scoreMode: 'points', scoreMax: 10, unit: 's' }], totalLessons: 5, turniPass: { aktiv: true, disciplineId: 'pass', geraete: defaultPassDevices() } };
const settings: GradingSettings = { forgottenKitPenalty: 3, excusedPenalty: 0, unexcusedPenalty: 8, gradeThresholds: [{ grade: 1, min: 90 }, { grade: 2, min: 75 }, { grade: 3, min: 60 }, { grade: 4, min: 45 }, { grade: 5, min: 0 }] };
describe('student access', () => {
  it('creates a longer random personal code rather than four digits', () => {
    const a = normalizeStudentCode(makeStudentCode());
    expect(a).toMatch(/^[A-HJ-NP-Z2-9]{20}$/);
    expect(a).not.toBe(normalizeStudentCode(makeStudentCode()));
  });
  it('allows first-name case and grouped code input', () => {
    expect(normalizeStudentName(' ANNA ')).toBe('anna');
    expect(normalizeStudentCode('abcd-efgh ijkl-mnpq-rstu')).toBe('ABCDEFGHIJKLMNPQRSTU');
  });
  it('exposes only the individual student and no private notes or photos', () => {
    const view = projectStudent(cls, anna, settings, '2026-11-15T17:00:00Z');
    expect(view.firstName).toBe('Anna');
    expect(view).not.toHaveProperty('students');
    expect(view).not.toHaveProperty('lastName');
    expect(view).not.toHaveProperty('excuses');
    expect(JSON.stringify(view)).not.toContain('Other');
    expect(JSON.stringify(view)).not.toContain('private medical note');
    expect(JSON.stringify(view)).not.toContain('private/photo');
  });
  it('shows discipline values and units', () => {
    expect(projectStudent(cls, anna, settings, '').disciplines).toEqual([{ name: 'Sprint', value: 8, unit: 's' }]);
  });
  it('shows individual attendance', () => {
    expect(projectStudent(cls, anna, settings, '').attendance).toEqual({ attended: 3, excused: 1, forgottenKit: 1, unexcused: 0, total: 5 });
  });
  it('shows the current teacher grade from discipline and attendance', () => {
    // 80% * (3 / (5 - 1)) - 3 = 57%, grade 4.
    expect(projectStudent(cls, anna, settings, '').grade).toBe(4);
  });
  it('shows the personal pass and its current entries', () => {
    const view = projectStudent(cls, { ...anna, passEintraege: { 'reck-p0': 'ok' } }, settings, '');
    expect(view.pass?.points).toBe(1);
    expect(view.pass?.geraete[0].pflicht[0].status).toBe('ok');
  });
});