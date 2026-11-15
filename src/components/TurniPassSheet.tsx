import { Check, X, Plus, Trash2, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PassPayload } from '@/lib/turni-pass';
import { studentDevices, selectedChoices, type TurniPass, type PassStatus, type DeviceId } from '@/lib/turni-pass';
import type { Student } from '@/lib/turn-store';

export function PassMark({ status, round = false }: { status?: string; round?: boolean }) {
  return <span aria-label={status === 'ok' ? 'Geschafft' : status === 'nein' ? 'Nicht geschafft' : 'Offen'} className={`inline-flex h-7 w-7 shrink-0 items-center justify-center border-2 ${round ? 'rounded-full' : 'rounded-sm'} ${status === 'ok' ? 'border-status-success bg-status-success-bg text-status-success' : status === 'nein' ? 'border-status-danger bg-status-danger-bg text-status-danger' : 'border-dashed border-border text-muted-foreground'}`}>{status === 'ok' ? <Check className="h-4 w-4"/> : status === 'nein' ? <X className="h-4 w-4"/> : null}</span>;
}
export function StatusButtons({ status, disabled, onChange, label }: { status?: PassStatus; disabled?: boolean; onChange: (s: PassStatus) => void; label: string }) {
  return <div className="flex shrink-0 gap-1"><Button size="icon" variant="outline" className={`h-11 w-11 ${status === 'ok' ? 'border-status-success bg-status-success-bg text-status-success' : 'text-status-success'}`} disabled={disabled} aria-label={`${label}: geschafft`} aria-pressed={status === 'ok'} onClick={() => onChange('ok')}><Check/></Button><Button size="icon" variant="outline" className={`h-11 w-11 ${status === 'nein' ? 'border-status-danger bg-status-danger-bg text-status-danger' : 'text-status-danger'}`} disabled={disabled} aria-label={`${label}: nicht geschafft`} aria-pressed={status === 'nein'} onClick={() => onChange('nein')}><X/></Button></div>;
}
export function TurniPassSheet({ payload, fullName, updatedAt, editor }: { payload: PassPayload; fullName?: string; updatedAt?: string; editor?: { pass: TurniPass; student: Student; onEntry: (device: DeviceId,id: string,status: PassStatus) => void; onChoice: (device: DeviceId,id: string,remove?: boolean) => void } }) {
  const open = payload.geraete.reduce((sum,d) => sum + [...d.pflicht,...d.wahl].filter(e=>e.status==='offen').length + 2-d.wahl.length,0);
  return <div className="space-y-5">
    <section className="bg-primary px-5 py-6 text-primary-foreground rounded-lg">
      <div className="flex items-start justify-between gap-3"><div><p className="text-sm opacity-80">Turni-Pass Winter · {payload.className}</p><h1 className="mt-1 break-words text-2xl font-bold">{fullName ?? payload.firstName}</h1></div><Dumbbell className="h-8 w-8 shrink-0 opacity-70"/></div>
      <p className="mt-4 text-3xl font-bold">{payload.points} <span className="text-lg font-normal">/ 20 Punkte</span></p>
      <progress aria-label="Fortschritt" value={payload.points} max={20} className="mt-3 h-2 w-full accent-primary-foreground"/>
      <p className="mt-2 text-sm opacity-80">{open} offene Übungen · Mit {payload.variante === 'barren' ? 'Barren' : 'Balken'}</p>
    </section>
    {updatedAt && <p className="text-sm text-muted-foreground">Stand: {new Intl.DateTimeFormat('de-AT',{dateStyle:'medium',timeStyle:'short',timeZone:'Europe/Vienna'}).format(new Date(updatedAt))}</p>}
    <div className="grid gap-4 sm:grid-cols-2">
      {payload.geraete.map((device,i) => {
        const editable = editor ? studentDevices(editor.pass,editor.student)[i] : undefined;
        return <article key={device.name} className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-2 border-b border-border pb-3"><h2 className="text-lg font-bold">{device.name}</h2><span className="font-semibold text-primary">{[...device.pflicht,...device.wahl].filter(e=>e.status==='ok').length} / 5</span></div>
          {(['pflicht','wahl'] as const).map(kind => <div key={kind} className="mt-4"><h3 className="mb-2 text-xs font-bold uppercase text-muted-foreground">{kind==='pflicht' ? 'Pflicht' : 'Wahl · 1 bis 2 aus 5'}</h3><ul className="space-y-2">{device[kind].map((e,j) => {
            const source = editable ? (kind==='pflicht' ? editable.pflicht : selectedChoices(editable,editor?.student ?? {}))[j] : undefined;
            return <li key={j} className="flex items-center justify-between gap-2 py-1"><span className="min-w-0 text-sm">{e.name}</span>{editor && editable && source ? <div className="flex items-center gap-1"><StatusButtons label={e.name} status={editor.student.passEintraege?.[source.id]} onChange={s=>editor.onEntry(editable.id,source.id,s)}/>{kind==='wahl' && <Button variant="ghost" size="icon" className="h-11 w-8" aria-label={`${e.name} entfernen`} onClick={()=>editor.onChoice(editable.id,source.id,true)}><Trash2/></Button>}</div> : <PassMark status={e.status} round={kind==='wahl'}/>}</li>;
          })}</ul>{kind==='wahl' && <>{Array.from({length: Math.max(0,2-device.wahl.length)},(_,j)=><div className="mt-2 flex items-center justify-between py-1 text-sm text-muted-foreground" key={j}><span>Wahlübung offen</span><PassMark round/></div>)}{editor && editable && device.wahl.length<2 && <details className="mt-3"><summary className="flex cursor-pointer items-center gap-1 text-sm font-medium text-primary"><Plus className="h-4 w-4"/> Wahlübung auswählen</summary><div className="mt-2 grid gap-1">{editable.wahl.filter(e=>!selectedChoices(editable,editor.student).some(s=>s.id===e.id)).map(e=><Button variant="outline" className="h-auto min-h-11 justify-start whitespace-normal text-left" key={e.id} onClick={()=>editor.onChoice(editable.id,e.id)}>{e.name}</Button>)}</div></details>}</>}</div>)}
        </article>;
      })}
    </div>
  </div>;
}