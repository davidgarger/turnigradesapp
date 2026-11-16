import { describe, it, expect } from 'vitest';
import { defaultPassDevices, passPoints, passScore, canSelectChoice, studentDevices, buildPassPayload, type TurniPass } from './turni-pass';
import type { Student, ClassData } from './turn-store';
const pass: TurniPass = { aktiv: true, disciplineId: 'pass', geraete: defaultPassDevices() };
const student = (patch: Partial<Student> = {}): Student => ({id:'s',classId:'1',firstName:'Anna',lastName:'Geheim',scores:{math:12},attended:8,forgottenKit:1,excusedNotParticipating:2,unexcusedNotParticipating:1,redPoints:0,greenPoints:0,...patch});
describe('Turni-Pass Regeln',()=>{
  it('has five devices with exactly three required and two optional exercises',()=>{ expect(pass.geraete).toHaveLength(5); for(const d of pass.geraete){expect(d.pflicht).toHaveLength(3);expect(d.wahl).toHaveLength(2);} });
  it('starts with Barren and counts four devices',()=>{expect(studentDevices(pass,student()).map(d=>d.id)).toEqual(['reck','barren','boden','kasten']);});
  it('rejects a third selected optional exercise even when failed',()=>{const d=pass.geraete[0];const s=student({passEintraege:{'reck-w0':'nein','reck-w1':'ok'}});expect(canSelectChoice(d,s,'reck-w2')).toBe(false);expect(canSelectChoice(d,s,'reck-w0')).toBe(true);});
  it('counts one point per success and at most 20 total',()=>{const entries:Record<string,'ok'>={};for(const d of pass.geraete)for(const e of [...d.pflicht,...d.wahl])entries[e.id]='ok';expect(passPoints(pass,student({passEintraege:entries}))).toBe(20);});
  it('leaves an untouched score empty, but a failed entry scores zero',()=>{expect(passScore(pass,student())).toBeUndefined();expect(passScore(pass,student({passEintraege:{'reck-p0':'nein'}}))).toBe(0);});
  it('keeps inactive device entries without counting them',()=>{const s=student({passVariante:'balken',passEintraege:{'barren-p0':'ok','balken-p0':'ok','balken-p1':'ok'}});expect(passPoints(pass,s)).toBe(2);expect(s.passEintraege?.['barren-p0']).toBe('ok');});
  it('projects only allowed public fields without surname, scores or absences',()=>{const cls:ClassData={id:'1',name:'1. Klasse',turniPass:pass,disciplines:[],students:[],totalLessons:20};const payload=buildPassPayload(cls,student());expect(Object.keys(payload??{}).sort()).toEqual(['className','firstName','geraete','points','variante']);expect(JSON.stringify(payload)).not.toContain('Geheim');expect(JSON.stringify(payload)).not.toContain('attended');expect(payload?.geraete[0].pflicht[0].status).toBe('offen');});
});