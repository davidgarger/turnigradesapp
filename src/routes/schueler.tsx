import { createFileRoute, Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useEffect, useRef, useState } from 'react';
import { queryOptions, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, LogOut, RefreshCw, Trophy, ClipboardCheck, Activity, Footprints, User, CircleAlert, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TurniPassSheet } from '@/components/TurniPassSheet';
import { readStudentView, studentLogin, studentLogout } from '@/lib/student-access.functions';
import { toast } from 'sonner';
import turnhalleBg from '@/assets/turnhalle-bg.webp';

const CODE_LENGTH = 20;

const studentQuery = queryOptions({ queryKey: ['student-view'], queryFn: () => readStudentView(), staleTime: 0, refetchInterval: 30000, retry: false });
export const Route = createFileRoute('/schueler')({
  loader: ({ context }) => context.queryClient.ensureQueryData(studentQuery),
  component: StudentPage,
  head: () => ({ meta: [
    { title: 'Mein Turni · Schülerzugang' }, { name: 'description', content: 'Dein persönlicher Turni-Pass, deine Leistungen und Anwesenheit.' },
    { property: 'og:title', content: 'Mein Turni · Schülerzugang' }, { property: 'og:description', content: 'Deine persönliche Übersicht im Sportunterricht.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex, nofollow' },
  ], links: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap' },
  ] }),
});

function StudentLogin() {
  const queryClient = useQueryClient();
  const login = useServerFn(studentLogin);
  const [firstName, setFirstName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [entered, setEntered] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setEntered(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  const codeReady = code.length === CODE_LENGTH;
  const canSubmit = firstName.trim().length > 0 && codeReady && !busy;

  function onCodeChange(raw: string) {
    const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, CODE_LENGTH);
    setCode(clean);
    if (error) setError('');
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true); setError('');
    try {
      const result = await login({ data: { firstName, code } });
      if (!result.ok) {
        setError('Das hat nicht geklappt. Schau noch einmal auf dein Kärtchen.');
        setShake(true);
        window.setTimeout(() => setShake(false), 450);
        return;
      }
      setSuccess(true);
      window.setTimeout(() => {
        void queryClient.invalidateQueries({ queryKey: studentQuery.queryKey });
      }, 700);
    } catch {
      setError('Anmeldung ist gerade nicht möglich. Bitte erneut versuchen.');
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* Hintergrund: Turnhalle + warmer Orange-Dunkelblau-Verlauf */}
      <div className="absolute inset-0 -z-10">
        <img src={turnhalleBg} alt="" className="h-full w-full object-cover object-[center_65%]" width={1920} height={1280} />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(165deg, color-mix(in oklab, var(--role-student) 55%, transparent) 0%, rgba(30,45,80,0.55) 60%, rgba(10,30,55,0.6) 100%)',
          }}
        />
      </div>

      {/* Zurück */}
      <div className="absolute left-4 top-4 z-10">
        <Link
          to="/login"
          aria-label="Zurück zur Anmeldung"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white text-slate-800 shadow-lg transition hover:scale-105 active:scale-95 motion-reduce:transition-none"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col items-center justify-center px-5 py-10">
        {/* Kopfbereich */}
        <div
          className={`flex flex-col items-center text-center transition-all duration-300 ease-out motion-reduce:transition-none ${
            entered ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'
          }`}
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/80">turni.live</p>
          <div
            className={`flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-2xl ring-1 ring-white/40 ${
              entered ? 'login-bounce' : ''
            }`}
            style={{ color: 'var(--role-student-strong)' }}
          >
            <Footprints className="h-14 w-14" strokeWidth={2} />
          </div>
          <h1
            className="mt-4 text-5xl tracking-tight text-white drop-shadow-lg sm:text-6xl"
            style={{ fontFamily: '"Archivo Black", system-ui, sans-serif', letterSpacing: '-0.02em' }}
          >
            Mein Turni
          </h1>
          <p className="mt-2 max-w-xs text-sm font-medium text-white/90">
            Melde dich mit deinem Vornamen und deinem Code an
          </p>
        </div>

        {/* Anmeldekarte */}
        <form
          onSubmit={submit}
          className={`mt-7 w-full rounded-[28px] border border-white/50 bg-white/90 p-6 text-slate-900 shadow-2xl backdrop-blur-xl transition-all delay-100 duration-300 ease-out motion-reduce:transition-none sm:p-7 ${
            entered ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          } ${shake ? 'login-shake' : ''}`}
          style={{ boxShadow: '0 32px 64px -24px rgba(60,30,5,0.5)' }}
        >
          {/* Vorname */}
          <div>
            <label
              htmlFor="student-first"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--role-student-strong)' }}
            >
              Vorname
            </label>
            <div className="relative">
              <User
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
                style={{ color: 'var(--role-student)' }}
              />
              <input
                id="student-first"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                maxLength={100}
                placeholder="Dein Vorname"
                className="min-h-[60px] w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-xl placeholder:text-base placeholder:text-slate-400 focus:outline-none"
                style={{ transition: 'box-shadow 200ms' }}
                onFocus={(e) =>
                  (e.currentTarget.style.boxShadow = '0 0 0 4px color-mix(in oklab, var(--role-student) 30%, transparent)')
                }
                onBlur={(e) => (e.currentTarget.style.boxShadow = '')}
              />
            </div>
          </div>

          {/* Zugangscode als Kästchen */}
          <div className="mt-5">
            <label
              htmlFor="student-code"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--role-student-strong)' }}
            >
              Zugangscode
            </label>
            <div className="relative" onClick={() => codeRef.current?.focus()}>
              {/* Ein einziges beschriftetes Feld für Tastatur & Screenreader */}
              <input
                ref={codeRef}
                id="student-code"
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                value={code}
                onChange={(e) => onCodeChange(e.target.value)}
                maxLength={CODE_LENGTH}
                aria-describedby={error ? 'student-code-error' : undefined}
                className="absolute inset-0 h-full w-full cursor-text opacity-0"
              />
              <div aria-hidden className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {Array.from({ length: CODE_LENGTH }, (_, i) => {
                  const ch = code[i] ?? '';
                  const isNext = i === code.length;
                  return (
                    <div
                      key={i}
                      className={`flex aspect-square items-center justify-center rounded-lg border-2 text-lg font-bold transition-colors duration-150 motion-reduce:transition-none sm:text-xl ${
                        ch ? 'border-transparent text-white' : isNext ? 'bg-white' : 'bg-white/70'
                      }`}
                      style={
                        ch
                          ? { background: 'var(--role-student)' }
                          : isNext
                            ? { borderColor: 'var(--role-student)' }
                            : { borderColor: '#e2e8f0' }
                      }
                    >
                      {ch}
                    </div>
                  );
                })}
              </div>
            </div>
            {error && (
              <p id="student-code-error" role="alert" className="mt-3 flex items-center gap-1.5 text-sm font-medium text-red-600">
                <CircleAlert className="h-4 w-4 flex-shrink-0" />
                {error}
              </p>
            )}
          </div>

          {/* Anmelden */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="group mt-6 inline-flex min-h-[64px] w-full items-center justify-center gap-2 rounded-2xl px-4 text-lg font-bold text-white transition-all duration-200 motion-reduce:transition-none disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, var(--role-student), var(--role-student-strong))',
              boxShadow: '0 16px 32px -14px rgba(180,90,10,0.6)',
            }}
          >
            {busy ? 'Anmelden…' : 'Anmelden'}
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
          </button>
        </form>

        {/* Hilfe */}
        <p className="mt-4 flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-medium text-slate-700 shadow backdrop-blur">
          <Info className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--role-student-strong)' }} />
          Deinen Code findest du auf dem Kärtchen von deiner Lehrperson.
        </p>
      </div>

      {/* Erfolgs-Haken */}
      {success && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="login-pop flex h-24 w-24 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl">
            <Check className="h-12 w-12" strokeWidth={3} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes login-bounce {
          0% { transform: translateY(-18px); }
          45% { transform: translateY(6px); }
          70% { transform: translateY(-4px); }
          100% { transform: translateY(0); }
        }
        @keyframes login-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        @keyframes login-pop {
          0% { transform: scale(0.4); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .login-bounce { animation: login-bounce 400ms ease-out 250ms 1 both; }
        .login-shake { animation: login-shake 400ms ease-in-out 1; }
        .login-pop { animation: login-pop 300ms ease-out 1 both; }
        @media (prefers-reduced-motion: reduce) {
          .login-bounce, .login-shake, .login-pop { animation: none !important; }
        }
      `}</style>
    </main>
  );
}

function StudentPage() {
  const { data } = useSuspenseQuery(studentQuery);
  const queryClient = useQueryClient();
  const logout = useServerFn(studentLogout);
  const [tab, setTab] = useState<'overview' | 'pass'>('overview');
  if (!data) return <StudentLogin />;
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
