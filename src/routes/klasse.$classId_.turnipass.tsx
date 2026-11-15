import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { ArrowLeft, Download, Printer, Pencil, Zap, Copy, Undo2, Dumbbell } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TurniPassSheet, PassMark, StatusButtons } from '@/components/TurniPassSheet';
import { turnActions, useTurnState, flushCloudSave, downloadCsv, undo, type ClassId } from '@/lib/turn-store';
import { studentDevices, selectedChoices, passPoints, passScore, buildPassPayload, passCsv, csvCell, canSelectChoice, type DeviceId, type PassStatus } from '@/lib/turni-pass';
import { downloadPassPdf } from '@/lib/turni-pass-pdf';
import { ensurePassLinks, revokePassLinks } from '@/lib/pass-shares.functions';

export const Route = createFileRoute('/klasse/$classId_/turnipass')({
  component: PassClassPage,
  head: ({ params }) => ({ meta: [
    { title: `Turni-Pass Winter · Klasse ${params.classId} — Turni` },
    { name: 'description', content: 'Geräteturnen erfassen und individuelle Turni-Pässe verwalten.' },
    { property: 'og:title', content: 'Turni-Pass Winter — Turni' },
    { property: 'og:description', content: 'Die Geräte-Pässe deiner Klasse.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }),
});

function PassClassPage() {
  const { classId } = Route.useParams();
  const state = useTurnState();
  const cls = state.classes[classId as ClassId];
  const [studentId, setStudentId] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [quick, setQuick] = useState(false);
  const [deviceId, setDeviceId] = useState<DeviceId>('reck');
  const [exerciseId, setExerciseId] = useState('reck-p0');
  const [busy, setBusy] = useState(false);
  const ensure = useServerFn(ensurePassLinks);
  const revoke = useServerFn(revokePassLinks);
  if (!cls) return <main className="p-6">Unbekannte Klasse.</main>;
  const pass = cls.turniPass;
  const student = cls.students.find(s=>s.id===studentId);
  const payload = student ? buildPassPayload(cls,student) : null;
  const device = pass?.geraete.find(d=>d.id===deviceId);
  const exercise = device ? [...device.pflicht,...device.wahl].find(e=>e.id===exerciseId) : undefined;
  const quickStudents = cls.students.filter(s=>deviceId!=='barren' && deviceId!=='balken' || (s.passVariante??'barren')===deviceId);
  const report = (error?: string) => { if (error) toast.error(error); };
  const entry = (id: string,d: DeviceId,e: string,s: PassStatus) => report(turnActions.setPassEntry(cls.id,id,d,e,s));
  const withBusy = async (action: ()=>Promise<void>) => { setBusy(true); try { await action(); } catch(error) { toast.error(error instanceof Error ? error.message : 'Bitte erneut versuchen.'); } finally { setBusy(false); } };
  const linkUrl = (token: string) => `https://turni.live/pass/${token}`;
  const toggleLinks = (enabled: boolean) => void withBusy(async()=> {
    turnActions.setPassLinks(cls.id,enabled);
    try { await flushCloudSave(); if (enabled) await ensure({data:{classId:cls.id}}); else await revoke({data:{classId:cls.id}}); toast.success(enabled ? 'Pass-Links aktiviert' : 'Alle Links dieser Klasse gelöscht'); }
    catch(error) { if (enabled) { turnActions.setPassLinks(cls.id,false); await flushCloudSave(); } throw error; }
  });
  const exportLinks = () => void withBusy(async()=> {
    await flushCloudSave(); const links = await ensure({data:{classId:cls.id}});
    const rows = cls.students.map(s=>{const link=links.find(l=>l.student_id===s.id); return [s.firstName,s.lastName,link?linkUrl(link.token):''].map(csvCell).join(';');});
    downloadCsv(`Pass-Links_${cls.name}.csv`,[['Vorname','Nachname','Link'].map(csvCell).join(';'),...rows].join('\n'));
  });
  const copyLink = () => void withBusy(async()=> {
    if (!student) return; await flushCloudSave(); const links = await ensure({data:{classId:cls.id}}); const link = links.find(l=>l.student_id===student.id);
    if (!link) throw new Error('Link nicht gefunden.');
    await navigator.clipboard.writeText(linkUrl(link.token)); toast.success('Link kopiert');
  });

  return <div className="min-h-screen bg-background">
    <header className="border-b border-border"><div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-5"><Button asChild variant="outline" size="icon"><Link to="/klasse/$classId" params={{classId}} aria-label="Zurück zur Klasse"><ArrowLeft/></Link></Button><div className="min-w-0"><h1 className="text-2xl font-bold">Turni-Pass Winter</h1><p className="text-sm text-muted-foreground">Geräteturnen · {cls.name} · {cls.students.length} Schüler:innen</p></div></div></header>
    <main className="mx-auto max-w-7xl px-4 py-6">
      {!pass?.aktiv ? <section className="py-12 text-center"><Dumbbell className="mx-auto mb-4 h-12 w-12 text-primary"/><h2 className="mb-5 text-xl font-bold">Turni-Pass Winter · {cls.name}</h2><Button onClick={()=>turnActions.activatePass(cls.id)}>Turni-Pass aktivieren</Button></section> : <>
        <div className="mb-6 flex flex-wrap gap-2"><Button onClick={()=>setQuick(true)}><Zap/> Schnell eintragen</Button><Button variant="outline" onClick={()=>setEdit(true)}><Pencil/> Übungen bearbeiten</Button><Button variant="outline" disabled={!cls.students.length} onClick={()=>downloadPassPdf(cls,cls.students)}><Printer/> Pässe drucken (PDF)</Button><Button variant="outline" onClick={()=>downloadCsv(`Turni-Pass_${cls.name}.csv`,passCsv(cls))}><Download/> Export für LMS (CSV)</Button><Button variant="ghost" size="icon" title="Rückgängig" aria-label="Rückgängig" onClick={()=>undo()}><Undo2/></Button></div>
        <div className="mb-6 flex flex-wrap items-center gap-4 border-y border-border py-4"><div className="flex items-center gap-2"><Switch id="pass-links" checked={!!pass.linksAktiv} disabled={busy} onCheckedChange={toggleLinks}/><Label htmlFor="pass-links">Pass-Links aktivieren</Label></div>{pass.linksAktiv && <Button variant="outline" disabled={busy} onClick={exportLinks}><Download/> Alle Links exportieren (CSV)</Button>}</div>
        <div className="overflow-x-auto"><table className="w-full min-w-[810px] text-sm"><thead><tr className="border-b border-border bg-muted/50 text-left"><th className="px-3 py-3">Name / Variante</th>{['Reck','Barren / Balken','Boden','Kasten'].map(n=><th className="px-3 py-3" key={n}>{n}</th>)}<th className="px-3 py-3">Punkte</th></tr></thead><tbody>{cls.students.map(s=><tr key={s.id} className="border-b border-border"><td className="px-3 py-3"><Button variant="link" className="h-auto max-w-56 whitespace-normal p-0 text-left" onClick={()=>setStudentId(s.id)}>{s.firstName} {s.lastName}</Button><p className="mt-1 text-xs text-muted-foreground">Mit {s.passVariante==='balken'?'Balken':'Barren'}</p></td>{studentDevices(pass,s).map(d=><td className="px-3 py-3" key={d.id}><div className="flex gap-1">{d.pflicht.map(e=><PassMark key={e.id} status={s.passEintraege?.[e.id]}/>)}{Array.from({length:2},(_,i)=><PassMark key={i} round status={s.passEintraege?.[selectedChoices(d,s)[i]?.id ?? '']}/>)}</div></td>)}<td className="px-3 py-3"><p className="font-bold">{passScore(pass,s)===undefined ? '–' : passPoints(pass,s)} / 20</p><progress className="h-2 w-20 accent-primary" max={20} value={passPoints(pass,s)} aria-label={`Punkte ${s.firstName}`}/></td></tr>)}</tbody></table></div>
        {!cls.students.length && <p className="py-8 text-center text-muted-foreground">Noch keine Schüler:innen in dieser Klasse.</p>}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1"><PassMark status="ok"/> Geschafft</span><span className="flex items-center gap-1"><PassMark status="nein"/> Nicht geschafft</span><span className="flex items-center gap-1"><PassMark/> Offen · Pflicht</span><span className="flex items-center gap-1"><PassMark round/> Wahl</span></div>
      </>}
    </main>
    <Dialog open={!!student && !!payload} onOpenChange={open=>{if(!open)setStudentId(null);}}><DialogContent className="max-h-[92dvh] max-w-4xl overflow-y-auto"><DialogHeader><DialogTitle>Schüler-Pass</DialogTitle></DialogHeader>{student && payload && pass && <><div className="flex flex-wrap items-center gap-2"><div className="flex gap-1">{(['barren','balken'] as const).map(v=><Button key={v} variant={(student.passVariante??'barren')===v?'default':'outline'} onClick={()=>turnActions.setPassVariant(cls.id,student.id,v)}>Mit {v==='barren'?'Barren':'Balken'}</Button>)}</div><Button variant="outline" onClick={()=>downloadPassPdf(cls,[student])}><Printer/> PDF</Button>{pass.linksAktiv && <Button variant="outline" disabled={busy} onClick={copyLink}><Copy/> Link kopieren</Button>}</div><TurniPassSheet payload={payload} fullName={`${student.firstName} ${student.lastName}`} editor={{pass,student,onEntry:(d,e,s)=>entry(student.id,d,e,s),onChoice:(d,e,r)=>report(turnActions.selectPassChoice(cls.id,student.id,d,e,r))}}/></>}</DialogContent></Dialog>
    <Dialog open={edit} onOpenChange={setEdit}><DialogContent className="max-h-[90dvh] max-w-2xl overflow-y-auto"><DialogHeader><DialogTitle>Übungen bearbeiten</DialogTitle></DialogHeader>{pass?.geraete.map(d=><section key={d.id} className="space-y-2 border-b border-border pb-4"><h2 className="text-lg font-bold">{d.name}</h2>{(['pflicht','wahl'] as const).map(kind=><div className="space-y-2" key={kind}><h3 className="text-xs font-semibold uppercase text-muted-foreground">{kind==='pflicht'?'Pflicht':'Wahl'}</h3>{d[kind].map((e,i)=><Input key={e.id} aria-label={`${d.name} ${kind} ${i+1}`} value={e.name} onChange={event=>turnActions.renamePassExercise(cls.id,e.id,event.target.value)}/>)}</div>)}</section>)}<Button onClick={()=>setEdit(false)}>Fertig</Button></DialogContent></Dialog>
    <Dialog open={quick} onOpenChange={setQuick}><DialogContent className="max-h-[90dvh] max-w-2xl overflow-y-auto"><DialogHeader><DialogTitle>Schnell eintragen</DialogTitle></DialogHeader><div className="grid gap-3 sm:grid-cols-2"><Label className="grid gap-1">Gerät<select className="h-11 min-w-0 rounded-md border border-input bg-background px-2" value={deviceId} onChange={e=>{const id=e.target.value as DeviceId;setDeviceId(id);setExerciseId(pass?.geraete.find(d=>d.id===id)?.pflicht[0]?.id??'');}}>{pass?.geraete.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></Label><Label className="grid gap-1">Übung<select className="h-11 min-w-0 rounded-md border border-input bg-background px-2" value={exerciseId} onChange={e=>setExerciseId(e.target.value)}>{device && (['pflicht','wahl'] as const).map(kind=><optgroup label={kind==='pflicht'?'Pflicht':'Wahl'} key={kind}>{device[kind].map(e=><option value={e.id} key={e.id}>{e.name}</option>)}</optgroup>)}</select></Label></div><div>{quickStudents.map(s=><div key={s.id} className="flex items-center justify-between gap-2 border-b border-border py-3"><span className="min-w-0 break-words text-sm">{s.firstName} {s.lastName}</span><StatusButtons label={`${s.firstName} ${s.lastName}`} status={s.passEintraege?.[exerciseId]} disabled={!!device?.wahl.some(e=>e.id===exerciseId) && !canSelectChoice(device,s,exerciseId)} onChange={status=>entry(s.id,deviceId,exerciseId,status)}/></div>)}</div><p className="text-sm text-muted-foreground">{quickStudents.filter(s=>s.passEintraege?.[exercise?.id??'']!==undefined).length} von {quickStudents.length} eingetragen · wird automatisch gespeichert</p></DialogContent></Dialog>
  </div>;
}