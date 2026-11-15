import { useEffect, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { KeyRound, Copy, RotateCcw, Ban } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { createStudentAccess, listStudentAccess, revokeStudentAccess } from '@/lib/student-access.functions';
import { flushCloudSave, type ClassData } from '@/lib/turn-store';

export function StudentAccessDialog({ cls }: { cls: ClassData }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string[]>([]);
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const list = useServerFn(listStudentAccess);
  const create = useServerFn(createStudentAccess);
  const revoke = useServerFn(revokeStudentAccess);
  useEffect(() => {
    if (!open) return;
    setBusy(true);
    list({ data: { classId: cls.id } }).then(rows => setActive(rows.map(r => r.student_id))).catch(() => toast.error('Zugänge konnten nicht geladen werden.')).finally(() => setBusy(false));
  }, [open, cls.id, list]);
  async function generate(studentId: string) {
    setBusy(true);
    try {
      await flushCloudSave();
      const result = await create({ data: { classId: cls.id, studentId } });
      setCodes(prev => ({ ...prev, [studentId]: result.code }));
      setActive(prev => [...new Set([...prev, studentId])]);
      setConfirmId(null);
      toast.success('Neuer Code erstellt. Bisherige Anmeldungen sind ungültig.');
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Zugang konnte nicht erstellt werden.'); }
    finally { setBusy(false); }
  }
  async function block(studentId: string) {
    setBusy(true);
    try {
      await revoke({ data: { classId: cls.id, studentId } });
      setActive(prev => prev.filter(id => id !== studentId));
      setCodes(prev => { const next = { ...prev }; delete next[studentId]; return next; });
      toast.success('Zugang gesperrt.');
    } catch { toast.error('Zugang konnte nicht gesperrt werden.'); }
    finally { setBusy(false); }
  }
  return <Dialog open={open} onOpenChange={value => { setOpen(value); if (!value) { setCodes({}); setConfirmId(null); } }}>
    <DialogTrigger asChild><Button className="h-auto min-h-12 w-full whitespace-normal px-5 py-3 text-base font-semibold sm:w-auto"><KeyRound /> Codes für Schülerseite erstellen</Button></DialogTrigger>
    <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader><DialogTitle>Schülerzugänge · {cls.name}</DialogTitle><DialogDescription>Persönliche Codes einmal sicher weitergeben. Sie werden nur hier nach dem Erstellen angezeigt. Schüler melden sich auf turni.live unter „Schüler“ an.</DialogDescription></DialogHeader>
      {!cls.students.length && <p className="py-6 text-muted-foreground">Noch keine Schüler in dieser Klasse.</p>}
      <ul className="divide-y divide-border">{cls.students.map(s => <li key={s.id} className="py-4">
        <div className="flex flex-wrap items-center justify-between gap-3"><div className="min-w-0"><p className="break-words font-semibold">{s.firstName} {s.lastName}</p><p className="text-xs text-muted-foreground">{active.includes(s.id) ? 'Zugang aktiv' : 'Kein Zugang'}</p></div>
          <div className="flex gap-2"><Button disabled={busy} variant="outline" onClick={() => active.includes(s.id) ? setConfirmId(s.id) : void generate(s.id)}><RotateCcw />{active.includes(s.id) ? 'Code zurücksetzen' : 'Code erstellen'}</Button>{active.includes(s.id) && <Button variant="ghost" size="icon" disabled={busy} aria-label={`Zugang von ${s.firstName} sperren`} title="Zugang sperren" onClick={() => void block(s.id)}><Ban /></Button>}</div>
        </div>
        {confirmId === s.id && <div className="mt-3 flex flex-wrap items-center gap-2"><p className="w-full text-sm text-muted-foreground">Bisheriger Code und angemeldete Sitzungen werden ungültig.</p><Button disabled={busy} onClick={() => void generate(s.id)}>Neuen Code erstellen</Button><Button variant="ghost" onClick={() => setConfirmId(null)}>Abbrechen</Button></div>}
        {codes[s.id] && <div className="mt-3 flex items-center gap-2 rounded-md bg-muted p-3"><code className="min-w-0 flex-1 break-all text-sm font-bold">{codes[s.id]}</code><Button variant="outline" size="icon" aria-label={`Code für ${s.firstName} kopieren`} onClick={async () => { try { await navigator.clipboard.writeText(`Vorname: ${s.firstName}\nZugangscode: ${codes[s.id]}\nhttps://turni.live/schueler`); toast.success('Zugang kopiert.'); } catch { toast.error('Bitte den Code manuell kopieren.'); } }}><Copy /></Button></div>}
      </li>)}</ul>
    </DialogContent>
  </Dialog>;
}