import type { ClassData, Student } from './turn-store';

export type DeviceId = 'reck' | 'barren' | 'balken' | 'boden' | 'kasten';
export type PassStatus = 'ok' | 'nein';
export interface PassExercise { id: string; name: string }
export interface PassDevice { id: DeviceId; name: string; pflicht: PassExercise[]; wahl: PassExercise[] }
export interface TurniPass { aktiv: boolean; disciplineId: string; geraete: PassDevice[]; linksAktiv?: boolean; templateVersion?: number }
export interface PassPayload {
  firstName: string; className: string; variante: 'barren' | 'balken'; points: number;
  geraete: { name: string; pflicht: { name: string; status: 'ok' | 'nein' | 'offen' }[]; wahl: { name: string; status: 'ok' | 'nein' | 'offen' }[] }[];
}

export function defaultPassDevices(): PassDevice[] {
  // Vorlage: hochgeladene Turni-Pass-Dokumente (Mädchen/Burschen) – 3 Pflicht + 2 freie Wahl-Felder pro Gerät
  const wahl: [string, string] = ['eigene Übung eintragen', 'eigene Übung eintragen'];
  const rows: [DeviceId, string, string[], string[]][] = [
    ['reck', 'Reck', ['Sprung in den Stütz', 'Sprung in den Stütz und abrollen', 'Hüftaufschwung'], wahl],
    ['barren', 'Barren', ['Schwingen im Stütz', 'Abgang vorne', 'Abgang hinten'], wahl],
    ['balken', 'Balken', ['Standwaage', 'Halbe Drehung im Ballenstand', 'Strecksprung als Abgang'], wahl],
    ['boden', 'Boden', ['Rolle vorwärts', 'Handstand', 'Standwaage'], wahl],
    ['kasten', 'Kasten', ['Aufhocken und Strecksprung ab', 'Hockwende', 'Sprunghocke über den Kasten quer'], wahl],
  ];
  return rows.map(([id, name, pflicht, wahl]) => ({ id, name, pflicht: pflicht.map((name, i) => ({ id: `${id}-p${i}`, name })), wahl: wahl.map((name, i) => ({ id: `${id}-w${i}`, name })) }));
}

// Apply the uploaded template once; retain IDs, marks and all custom optional exercises.
export function upgradePassTemplate(pass: TurniPass): TurniPass {
  if ((pass.templateVersion ?? 0) >= 1) return pass;
  const defaults = defaultPassDevices();
  return { ...pass, templateVersion: 1, geraete: pass.geraete.map(device => {
    const template = defaults.find(d => d.id === device.id);
    if (!template) return device;
    return { ...device, pflicht: template.pflicht.map((exercise, index) => ({
      ...exercise, id: device.pflicht[index]?.id ?? exercise.id,
    })) };
  }) };
}
export function studentDevices(pass: TurniPass, student: Pick<Student, 'passVariante'>) {
  return ['reck', student.passVariante ?? 'barren', 'boden', 'kasten'].flatMap(id => pass.geraete.filter(d => d.id === id));
}
export function selectedChoices(device: PassDevice, student: Pick<Student, 'passEintraege' | 'passWahl'>) {
  return device.wahl.filter(e => student.passWahl?.includes(e.id) || student.passEintraege?.[e.id] !== undefined).slice(0, 2);
}
export function canSelectChoice(device: PassDevice, student: Pick<Student, 'passEintraege' | 'passWahl'>, id: string) {
  return selectedChoices(device, student).some(e => e.id === id) || selectedChoices(device, student).length < 2;
}
export function devicePoints(device: PassDevice, student: Pick<Student, 'passEintraege' | 'passWahl'>) {
  return [...device.pflicht, ...selectedChoices(device, student)].filter(e => student.passEintraege?.[e.id] === 'ok').length;
}
export function passPoints(pass: TurniPass, student: Student) { return studentDevices(pass, student).reduce((n, d) => n + devicePoints(d, student), 0); }
export function passScore(pass: TurniPass, student: Student): number | undefined {
  const active = studentDevices(pass, student).flatMap(d => [...d.pflicht, ...selectedChoices(d, student)]);
  return active.some(e => student.passEintraege?.[e.id] !== undefined) ? passPoints(pass, student) : undefined;
}
export function buildPassPayload(cls: ClassData, student: Student): PassPayload | null {
  if (!cls.turniPass?.aktiv) return null;
  const status = (e: PassExercise) => ({ name: e.name, status: student.passEintraege?.[e.id] ?? 'offen' as const });
  return { firstName: student.firstName, className: cls.name, variante: student.passVariante ?? 'barren', points: passPoints(cls.turniPass, student), geraete: studentDevices(cls.turniPass, student).map(d => ({ name: d.name, pflicht: d.pflicht.map(status), wahl: selectedChoices(d, student).map(status) })) };
}
export function csvCell(value: string | number) { return `"${String(value).replace(/"/g, '""')}"`; }
export function passCsv(cls: ClassData) {
  if (!cls.turniPass) return '';
  const pass = cls.turniPass;
  return [['Vorname','Nachname','Klasse','Variante','Reck','Barren / Balken','Boden','Kasten','Gesamtpunkte','Prozent'].map(csvCell).join(';'), ...cls.students.map(s => [s.firstName, s.lastName, cls.name, s.passVariante === 'balken' ? 'Balken' : 'Barren', ...studentDevices(pass, s).map(d => devicePoints(d, s)), passScore(pass, s) ?? '', passScore(pass, s) === undefined ? '' : passPoints(pass, s) * 5].map(csvCell).join(';'))].join('\n');
}