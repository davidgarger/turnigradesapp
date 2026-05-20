import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LogIn,
  UserPlus,
  Users,
  Eye,
  EyeOff,
  ClipboardCheck,
  Trophy,
  Shuffle,
  FileText,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TurniLogo } from "@/components/TurniLogo";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Turni — Sportunterricht organisieren mit Klarheit" },
      {
        name: "description",
        content:
          "turni.live hilft Sportlehrkräften, Anwesenheit, Leistungen, faire Teams und Arbeitsaufträge an einem Ort zu verwalten.",
      },
    ],
  }),
});

function toEmail(username: string) {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  return `${clean}@turnnoten.app`;
}

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: "Anwesenheit in Sekunden",
    desc: "Schnell erfassen, wer da ist — ohne Papier, ohne Umwege.",
  },
  {
    icon: Trophy,
    title: "Disziplinen & Leistungen",
    desc: "Ergebnisse direkt im Hosentaschen-Format dokumentieren.",
  },
  {
    icon: Shuffle,
    title: "Faire Teams automatisch",
    desc: "Ausgewogene Mannschaften mit einem Klick generieren.",
  },
  {
    icon: FileText,
    title: "Arbeitsaufträge erstellen",
    desc: "Alternative Aufgaben für nicht teilnehmende Schüler:innen.",
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (clean.length < 3) {
      toast.error("Benutzername mindestens 3 Zeichen (nur Buchstaben/Zahlen).");
      return;
    }
    if (password.length < 6) {
      toast.error("Passwort mindestens 6 Zeichen.");
      return;
    }
    setBusy(true);
    const email = toEmail(clean);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Konto erstellt — du bist eingeloggt.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Willkommen zurück!");
      }
      navigate({ to: "/" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unbekannter Fehler";
      toast.error(
        msg.includes("Invalid login")
          ? "Benutzername oder Passwort falsch."
          : msg.includes("already registered")
            ? "Dieser Benutzername ist bereits vergeben."
            : msg,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f8fb] text-slate-900">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-indigo-300/40 to-fuchsia-300/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-sky-300/40 to-emerald-200/30 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      {/* Top nav */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md shadow-indigo-500/10 ring-1 ring-slate-200">
            <TurniLogo className="h-7 w-7" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold tracking-tight">turni<span className="text-indigo-600">.live</span></div>
            <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
              für den Sportunterricht
            </div>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-600 backdrop-blur md:flex">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          Sichere Cloud-Synchronisierung
        </div>
      </header>

      {/* Main grid */}
      <main className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:py-16">
        {/* Left: brand + hero */}
        <section className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-indigo-200/70 bg-white/80 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Die App für moderne PE-Lehrkräfte
          </div>

          {/* Big logo lockup */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/20 blur-xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl shadow-indigo-500/15 ring-1 ring-slate-200">
                <TurniLogo className="h-14 w-14" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black tracking-tight text-slate-900">
                turni<span className="text-indigo-600">.live</span>
              </div>
              <div className="text-sm text-slate-500">Sportunterricht. Strukturiert.</div>
            </div>
          </div>

          <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-5xl">
            Sportunterricht{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                klar organisiert.
              </span>
              <span className="absolute bottom-1 left-0 -z-0 h-3 w-full rounded-md bg-indigo-200/60" />
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
            turni.live bündelt Anwesenheit, Leistungen, faire Teams und Arbeitsaufträge —
            an einem Ort, in einer App, gemacht für den Schulalltag.
          </p>

          {/* Feature grid */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{f.title}</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-slate-600">{f.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
              <Users className="h-3.5 w-3.5" />
              Bis zu 10 Klassen verwalten
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
              <Sparkles className="h-3.5 w-3.5" />
              Stationenkarten — coming soon
            </span>
          </div>
        </section>

        {/* Right: login card */}
        <section className="flex items-center lg:sticky lg:top-10 lg:self-start">
          <div className="relative w-full">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-fuchsia-500/20 blur-xl" />
            <div className="relative rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur sm:p-8">
              <div className="mb-5 flex items-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow ring-1 ring-slate-200">
                  <TurniLogo className="h-7 w-7" />
                </div>
                <div className="font-bold tracking-tight">
                  turni<span className="text-indigo-600">.live</span>
                </div>
              </div>

              <div className="mb-5">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {mode === "signup" ? "Konto erstellen" : "Anmelden"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Mit Benutzername und Passwort einloggen.
                </p>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 text-sm font-medium">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`rounded-lg px-3 py-2 transition ${mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Anmelden
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`rounded-lg px-3 py-2 transition ${mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Neues Konto
                </button>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Benutzername
                  </label>
                  <input
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="z. B. sportlehrer-mueller"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Passwort
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="mind. 6 Zeichen"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-11 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label={showPw ? "Passwort verbergen" : "Passwort anzeigen"}
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-60"
                >
                  {mode === "signup" ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                  {busy ? "Bitte warten…" : mode === "signup" ? "Konto erstellen" : "Anmelden"}
                </button>
              </form>

              <div className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                <Users className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" />
                <p>
                  Teilt euch Benutzername + Passwort, um im selben Konto zu arbeiten.
                  Änderungen synchronisieren sich automatisch zwischen euren Geräten.
                </p>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-slate-500">
              Gemacht für Sportlehrkräfte · DSGVO-konform · Cloud-Sync
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
