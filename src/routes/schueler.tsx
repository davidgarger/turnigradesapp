import { createFileRoute, Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useState } from 'react';
import { queryOptions, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, KeyRound, LogOut, RefreshCw, Trophy, ClipboardCheck, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TurniPassSheet } from '@/components/TurniPassSheet';
import { readStudentView, studentLogin, studentLogout } from '@/lib/student-access.functions';
import { toast } from 'sonner';

const studentQuery = queryOptions({ queryKey: ['student-view'], queryFn: () => readStudentView(), staleTime: 0, refetchInterval: 30000, retry: false });
export const Route = createFileRoute('/schueler')({
  loader: ({ context }) => context.queryClient.ensureQueryData(studentQuery),
  component: StudentPage,
  head: () => ({ meta: [
    { title: 'Mein Turni · Schülerzugang' }, { name: 'description', content: 'Dein persönlicher Turni-Pass, deine Leistungen und Anwesenheit.' },
    { property: 'og:title', content: 'Mein Turni · Schülerzugang' }, { property: 'og:description', content: 'Deine persönliche Übersicht im Sportunterricht.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex, nofollow' },
  ] }),
});
function StudentPage() {
  const { data } = useSuspenseQuery(studentQuery);
  const queryClient = useQueryClient();
  const login = useServerFn(studentLogin);
  const logout = useServerFn(studentLogout);
  const [firstName, setFirstName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<'overview' | 'pass'>('overview');
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const result = await login({ data: { firstName, code } });
      if (!result.ok) { setError(result.error); return; }
      setCode('');
      await queryClient.invalidateQueries({ queryKey: studentQuery.queryKey });
    } catch { setError('Anmeldung ist gerade nicht möglich. Bitte erneut versuchen.'); }
    finally { setBusy(false); }
  }
  if (!data) return <main className="min-h-screen bg-background px-5 py-8">
    <Button asChild variant="ghost"><Link to="/login"><ArrowLeft />Zurück</Link></Button>
    <div className="mx-auto mt-16 max-w-sm"><div className="mb-8 flex h-14 w-14 items-center justify-center rounded-lg bg-status-success-bg text-status-success"><KeyRound className="h-7 w-7" /></div><p className="text-sm font-semibold text-muted-foreground">turni.live</p><h1 className="mt-2 text-3xl font-bold">Mein Turni</h1>
      <form className="mt-8 space-y-5" onSubmit={submit}><div className="space-y-2"><Label htmlFor="student-first">Vorname</Label><Input id="student-first" autoComplete="given-name" value={firstName} onChange={e => setFirstName(e.target.value)} required maxLength={100} className="h-12" /></div><div className="space-y-2"><Label htmlFor="student-code">Zugangscode</Label><Input id="student-code" type="password" autoComplete="current-password" value={code} onChange={e => setCode(e.target.value)} required maxLength={100} className="h-12" /></div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button className="h-12 w-full" disabled={busy} type="submit">{busy ? 'Anmelden…' : 'Anmelden'}</Button></form>
    </div>
  </main>;
  return <div className="min-h-screen bg-background">
    <header className="border-b border-border"><div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-5 py-4"><Link to="/schueler" className="text-xl font-bold text-primary">turni.live</Link><div className="flex gap-2"><Button variant="ghost" size="icon" title="Aktualisieren" aria-label="Aktualisieren" onClick={() => void queryClient.invalidateQueries({ queryKey: studentQuery.queryKey })}><RefreshCw /></Button><Button variant="outline" onClick={async () => { try { await logout(); queryClient.setQueryData(studentQuery.queryKey, null); queryClient.removeQueries({ queryKey: studentQuery.queryKey, type: 'inactive' }); } catch { toast.error('Abmelden fehlgeschlagen.'); } }}><LogOut />Abmelden</Button></div></div></header>
    <main className="mx-auto max-w-4xl px-5 py-7"><p className="text-sm text-muted-foreground">{data.className}</p><h1 className="mt-1 break-words text-3xl font-bold">Hallo, {data.firstName}!</h1><p className="mt-2 text-xs text-muted-foreground">Stand: {new Intl.DateTimeFormat('de-AT', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Vienna' }).format(new Date(data.updatedAt))}</p>
      <nav className="mt-6 flex gap-2 border-b border-border pb-3" aria-label="Meine Bereiche"><Button variant={tab === 'overview' ? 'default' : 'ghost'} aria-pressed={tab === 'overview'} onClick={() => setTab('overview')}><Activity />Meine Übersicht</Button><Button variant={tab === 'pass' ? 'default' : 'ghost'} aria-pressed={tab === 'pass'} onClick={() => setTab('pass')}>Turni-Pass</Button></nav>
      {tab === 'pass' ? <div className="mt-6">{data.pass ? <TurniPassSheet payload={data.pass} /> : <p className="py-8 text-muted-foreground">Dein Turni-Pass ist noch nicht aktiviert.</p>}</div> : <>
        <section className="flex items-center justify-between gap-4 border-b border-border py-8"><div><div className="flex items-center gap-2 text-primary"><Trophy /><h2 className="text-lg font-semibold">Aktuelle Note</h2></div><p className="mt-2 text-sm text-muted-foreground">Aktueller Stand deiner Leistungen</p></div><span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-status-success-bg text-5xl font-bold text-foreground">{data.grade}</span></section>
        <section className="py-7"><h2 className="flex items-center gap-2 text-lg font-bold"><ClipboardCheck />Anwesenheit</h2><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{[{ label: 'Mitgeturnt', value: data.attendance.attended, style: 'bg-status-success-bg' }, { label: 'Entschuldigt', value: data.attendance.excused, style: 'bg-muted' }, { label: 'Turnzeug vergessen', value: data.attendance.forgottenKit, style: 'bg-status-warning-bg' }, { label: 'Unentschuldigt', value: data.attendance.unexcused, style: 'bg-status-danger-bg' }].map(item => <article key={item.label} className={`rounded-lg p-4 ${item.style}`}><p className="text-3xl font-bold">{item.value}</p><p className="mt-2 break-words text-sm">{item.label}</p></article>)}</div><p className="mt-3 text-xs text-muted-foreground">{data.attendance.total} Turnstunden insgesamt</p></section>
        <section className="border-t border-border py-7"><h2 className="text-lg font-bold">Meine Disziplinen</h2>{!data.disciplines.length && <p className="mt-4 text-sm text-muted-foreground">Noch keine Disziplinen eingetragen.</p>}<ul className="mt-3 divide-y divide-border">{data.disciplines.map((d, i) => <li key={i} className="flex items-center justify-between gap-3 py-4"><span className="min-w-0 break-words font-medium">{d.name}</span><span className="shrink-0 text-lg font-bold">{d.value ?? '–'} <span className="text-xs font-normal text-muted-foreground">{d.value !== null ? d.unit : ''}</span></span></li>)}</ul></section>
      </>}
    </main>
  </div>;
}