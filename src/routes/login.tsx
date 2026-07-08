import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
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
  LayoutGrid,
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
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Archivo+Black&display=swap",
      },
    ],
  }),
});

function toEmail(username: string) {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  return `${clean}@turnnoten.app`;
}

// Brand greens taken from the Turni logo
const BRAND_DARK = "#044C3A";
const BRAND_MINT = "#99FBB7";

const FEATURES: Array<{
  icon: typeof ClipboardCheck;
  title: string;
  desc: string;
  badge?: string;
}> = [
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
    title: "Faire Teams erstellen",
    desc: "Ausgewogene Mannschaften mit einem Klick generieren.",
  },
  {
    icon: FileText,
    title: "Arbeitsaufträge erstellen",
    desc: "Alternative Aufgaben für nicht teilnehmende Schüler:innen.",
  },
  {
    icon: Users,
    title: "Bis zu 10 Klassen",
    desc: "Alle deine Lerngruppen sauber getrennt an einem Ort.",
  },
  {
    icon: LayoutGrid,
    title: "Stationenkarten",
    desc: "Druckfertige Karten für Zirkeltraining & Co.",
    badge: "Coming soon",
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
    <div className="relative min-h-screen overflow-hidden bg-[#f6faf7] text-slate-900">
      {/* Background decoration — brand greens */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${BRAND_MINT}66, transparent)` }}
        />
        <div
          className="absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${BRAND_DARK}33, transparent)` }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #044C3A 1px, transparent 1px), linear-gradient(to bottom, #044C3A 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      {/* Hero "Wir sind online" — Storytelling Intro */}
      <section className="relative mx-auto flex min-h-[100svh] max-w-3xl flex-col items-center justify-center px-6 pt-10 pb-16 text-center">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #04231b22 1px, transparent 0)",
            backgroundSize: "6px 6px",
          }}
        />

        <div className="mb-6 flex items-center gap-2.5">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-md ring-1"
            style={{ borderColor: `${BRAND_DARK}22`, boxShadow: `0 8px 24px -12px ${BRAND_DARK}55` }}
          >
            <TurniLogo className="h-7 w-7" />
          </div>
          <div className="text-left leading-tight">
            <div className="text-base font-bold tracking-tight" style={{ color: BRAND_DARK }}>
              turni.live
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: BRAND_DARK, opacity: 0.6 }}>
              Sportunterricht
            </div>
          </div>
        </div>

        <h1 className="leading-[0.95]" style={{ color: BRAND_DARK }}>
          <span
            className="block text-4xl sm:text-5xl md:text-6xl"
            style={{ fontFamily: '"Dancing Script", cursive', fontWeight: 700 }}
          >
            Moderner
          </span>
          <span
            className="mt-1 block text-5xl tracking-tight sm:text-6xl md:text-7xl"
            style={{ fontFamily: '"Archivo Black", system-ui, sans-serif', letterSpacing: "-0.02em" }}
          >
            TURNUNTERRICHT
          </span>
          <span
            className="mt-3 block text-2xl sm:text-3xl md:text-4xl"
            style={{ fontFamily: '"Dancing Script", cursive', fontWeight: 600, opacity: 0.9 }}
          >
            auf einen Blick
          </span>
        </h1>

        {/* Domain pill */}
        <a
          href="https://turni.live"
          className="mt-6 inline-flex items-center gap-2 rounded-full border bg-white/80 px-5 py-2.5 text-sm font-medium shadow-sm backdrop-blur transition hover:bg-white sm:text-base"
          style={{ borderColor: `${BRAND_DARK}55`, color: BRAND_DARK }}
        >
          <span className="opacity-60">www.</span>
          <span className="font-semibold">turni.live</span>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </a>

        {/* Laptop + Phone mockup */}
        <div className="relative mt-10 w-full max-w-lg">
          {/* Laptop */}
          <div className="relative mx-auto w-[88%]">
            <div
              className="rounded-[14px] border-[6px] border-slate-900 bg-slate-900 shadow-2xl"
              style={{ boxShadow: `0 30px 60px -20px ${BRAND_DARK}66` }}
            >
              <div className="overflow-hidden rounded-[6px]">
                <MiniTurniDashboard />
              </div>
            </div>
            {/* Laptop base */}
            <div className="relative mx-auto h-[10px] w-[112%] -translate-x-[5%] rounded-b-2xl bg-slate-800" />
            <div className="mx-auto h-[3px] w-[40%] rounded-b-md bg-slate-700/80" />
          </div>

          {/* Phone overlay */}
          <div className="absolute -bottom-6 right-2 w-[34%] sm:right-6">
            <div
              className="rounded-[26px] border-[5px] border-slate-900 bg-slate-900 shadow-2xl"
              style={{ boxShadow: `0 24px 40px -16px ${BRAND_DARK}88` }}
            >
              <div className="relative overflow-hidden rounded-[18px]">
                <div className="absolute left-1/2 top-1 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-slate-700" />
                <MiniTurniPhone />
              </div>
            </div>
          </div>
        </div>

        <p
          className="mt-14 max-w-md text-sm leading-snug"
          style={{ color: BRAND_DARK, opacity: 0.75 }}
        >
          Anwesenheit, Noten, Teams &amp; Arbeitsaufträge — alles an einem Ort.
        </p>


        {/* Hand-drawn arrow */}
        <svg
          viewBox="0 0 80 90"
          className="mt-8 h-16 w-14"
          fill="none"
          stroke={BRAND_DARK}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M40 5 C 18 25, 18 55, 38 78" />
          <path d="M28 66 L 38 80 L 50 70" />
        </svg>

        {/* CTA */}
        <a
          href="#login-form"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("login-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          className="mt-6 inline-flex items-center justify-center rounded-full px-12 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-xl transition hover:scale-[1.02] active:scale-[0.99]"
          style={{
            background: "#0a0a0a",
            boxShadow: `0 20px 40px -16px ${BRAND_DARK}aa`,
          }}
        >
          Jetzt anmelden
        </a>
      </section>

      {/* Top nav */}
      <header id="anmelden" className="mx-auto flex max-w-7xl scroll-mt-6 items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md ring-1 ring-emerald-100" style={{ boxShadow: `0 8px 24px -12px ${BRAND_DARK}33` }}>
            <TurniLogo className="h-7 w-7" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold tracking-tight" style={{ color: BRAND_DARK }}>
              turni<span style={{ color: BRAND_DARK }}>.live</span>
            </div>
            <div className="text-[10px] font-medium uppercase tracking-[0.14em]" style={{ color: BRAND_DARK, opacity: 0.6 }}>
              für den Sportunterricht
            </div>
          </div>
        </div>
        <div
          className="hidden items-center gap-2 rounded-full border bg-white/70 px-3 py-1.5 text-xs font-medium backdrop-blur md:flex"
          style={{ borderColor: `${BRAND_DARK}22`, color: BRAND_DARK }}
        >
          <ShieldCheck className="h-3.5 w-3.5" style={{ color: BRAND_DARK }} />
          Sichere Cloud-Synchronisierung
        </div>
      </header>

      {/* Main grid */}
      <main className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:py-16">
        {/* Left: brand + hero */}
        <section className="flex flex-col justify-center">
          <div
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border bg-white/80 px-3 py-1 text-xs font-semibold shadow-sm"
            style={{ borderColor: `${BRAND_DARK}33`, color: BRAND_DARK }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Die App für moderne PE-Lehrkräfte
          </div>

          {/* Big logo lockup */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative">
              <div
                className="absolute -inset-2 rounded-3xl blur-xl"
                style={{ background: `linear-gradient(135deg, ${BRAND_MINT}66, ${BRAND_DARK}22)` }}
              />
              <div
                className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white ring-1"
                style={{ boxShadow: `0 20px 40px -20px ${BRAND_DARK}55`, borderColor: `${BRAND_DARK}22` }}
              >
                <TurniLogo className="h-14 w-14" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black tracking-tight" style={{ color: BRAND_DARK }}>
                turni<span>.live</span>
              </div>
              <div className="text-sm" style={{ color: BRAND_DARK, opacity: 0.7 }}>
                Sportunterricht. Strukturiert.
              </div>
            </div>
          </div>

          <h1 className="leading-[0.95]" style={{ color: BRAND_DARK }}>
            <span className="block text-3xl font-bold sm:text-4xl">
              Sportunterricht
            </span>
            <span
              className="mt-1 block text-4xl tracking-tight sm:text-5xl"
              style={{ fontFamily: '"Archivo Black", system-ui, sans-serif', letterSpacing: "-0.02em" }}
            >
              KLAR ORGANISIERT
            </span>
          </h1>
          <div
            className="mt-4 h-1 w-24 rounded-full"
            style={{ background: `linear-gradient(90deg, ${BRAND_DARK}, ${BRAND_MINT})` }}
          />

          {/* Feature grid — 6 cards including "Bis zu 10 Klassen" + "Stationenkarten coming soon" */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border bg-white p-4 transition hover:-translate-y-0.5"
                style={{
                  borderColor: `${BRAND_DARK}1f`,
                  boxShadow: `0 1px 0 ${BRAND_DARK}0a, 0 12px 24px -18px ${BRAND_DARK}33`,
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{ background: `linear-gradient(90deg, ${BRAND_DARK}, ${BRAND_MINT})` }}
                />
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND_MINT}, #d6fde3)`,
                      boxShadow: `inset 0 0 0 1px ${BRAND_DARK}22`,
                    }}
                  >
                    <f.icon className="h-5 w-5" strokeWidth={2.2} style={{ color: BRAND_DARK }} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <div className="text-sm font-semibold" style={{ color: BRAND_DARK }}>
                        {f.title}
                      </div>
                      {f.badge && (
                        <span
                          className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                          style={{
                            background: BRAND_DARK,
                            color: BRAND_MINT,
                          }}
                        >
                          {f.badge}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs leading-relaxed" style={{ color: `${BRAND_DARK}cc` }}>
                      {f.desc}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right: login card */}
        <section id="login-form" className="flex items-center lg:sticky lg:top-10 lg:self-start">
          <div className="relative w-full">
            <div
              className="absolute -inset-1 rounded-3xl blur-xl"
              style={{ background: `linear-gradient(135deg, ${BRAND_MINT}55, ${BRAND_DARK}22)` }}
            />
            <div
              className="relative rounded-3xl border bg-white/95 p-6 backdrop-blur sm:p-8"
              style={{ borderColor: `${BRAND_DARK}22`, boxShadow: `0 30px 60px -30px ${BRAND_DARK}55` }}
            >
              <div className="mb-5 flex items-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow ring-1" style={{ borderColor: `${BRAND_DARK}22` }}>
                  <TurniLogo className="h-7 w-7" />
                </div>
                <div className="font-bold tracking-tight" style={{ color: BRAND_DARK }}>
                  turni<span>.live</span>
                </div>
              </div>

              <div className="mb-5">
                <div
                  className="text-lg font-semibold leading-none"
                  style={{ color: BRAND_DARK, opacity: 0.85 }}
                >
                  {mode === "signup" ? "Schön, dass du da bist —" : "Willkommen zurück —"}
                </div>
                <h2
                  className="mt-1 text-3xl tracking-tight"
                  style={{ fontFamily: '"Archivo Black", system-ui, sans-serif', color: BRAND_DARK, letterSpacing: "-0.02em" }}
                >
                  {mode === "signup" ? "KONTO ERSTELLEN" : "ANMELDEN"}
                </h2>
                <p className="mt-2 text-sm" style={{ color: `${BRAND_DARK}99` }}>
                  Mit Benutzername und Passwort einloggen.
                </p>
              </div>

              <div
                className="mb-5 grid grid-cols-2 gap-1 rounded-xl p-1 text-sm font-medium"
                style={{ background: `${BRAND_DARK}0d` }}
              >
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="rounded-lg px-3 py-2 transition"
                  style={
                    mode === "login"
                      ? { background: "white", color: BRAND_DARK, boxShadow: `0 1px 2px ${BRAND_DARK}22` }
                      : { color: `${BRAND_DARK}99` }
                  }
                >
                  Anmelden
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="rounded-lg px-3 py-2 transition"
                  style={
                    mode === "signup"
                      ? { background: "white", color: BRAND_DARK, boxShadow: `0 1px 2px ${BRAND_DARK}22` }
                      : { color: `${BRAND_DARK}99` }
                  }
                >
                  Neues Konto
                </button>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: BRAND_DARK }}>
                    Benutzername
                  </label>
                  <input
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="z. B. sportlehrer-mueller"
                    className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm placeholder:text-slate-400 transition focus:outline-none"
                    style={{ borderColor: `${BRAND_DARK}33`, color: BRAND_DARK }}
                    onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 4px ${BRAND_MINT}55`)}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = "")}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: BRAND_DARK }}>
                    Passwort
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="mind. 6 Zeichen"
                      className="w-full rounded-xl border bg-white px-4 py-2.5 pr-11 text-sm placeholder:text-slate-400 transition focus:outline-none"
                      style={{ borderColor: `${BRAND_DARK}33`, color: BRAND_DARK }}
                      onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 4px ${BRAND_MINT}55`)}
                      onBlur={(e) => (e.currentTarget.style.boxShadow = "")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 transition hover:bg-emerald-50"
                      style={{ color: BRAND_DARK }}
                      aria-label={showPw ? "Passwort verbergen" : "Passwort anzeigen"}
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold transition disabled:opacity-60"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND_DARK}, #0a6e52)`,
                    color: BRAND_MINT,
                    boxShadow: `0 14px 30px -12px ${BRAND_DARK}99`,
                  }}
                >
                  {mode === "signup" ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                  {busy ? "Bitte warten…" : mode === "signup" ? "Konto erstellen" : "Anmelden"}
                </button>
              </form>

              <div
                className="mt-5 flex items-start gap-2 rounded-xl p-3 text-xs"
                style={{ background: `${BRAND_MINT}33`, color: BRAND_DARK }}
              >
                <Users className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: BRAND_DARK }} />
                <p>
                  Teilt euch Benutzername + Passwort, um im selben Konto zu arbeiten.
                  Änderungen synchronisieren sich automatisch zwischen euren Geräten.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col items-center gap-1 text-center text-xs" style={{ color: `${BRAND_DARK}99` }}>
              <span>Gemacht für Sportlehrkräfte · DSGVO-konform · Cloud-Sync</span>
              <div className="flex items-center gap-2">
                <Link to="/impressum" className="underline transition hover:opacity-70" style={{ color: BRAND_DARK }}>
                  Impressum
                </Link>
                <span aria-hidden>·</span>
                <Link to="/datenschutz" className="underline transition hover:opacity-70" style={{ color: BRAND_DARK }}>
                  Datenschutz
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---------- Mini Turni Mockups for the hero ---------- */
/* Diese Mockups spiegeln die echte App-Oberfläche wider —
   gleiche Farbthemen, gleiche Kartenstruktur wie unter „/". */

const CLASS_TILES: Array<{ id: string; name: string; sus: number; disc: number; grad: string }> = [
  { id: "1", name: "1a", sus: 22, disc: 4, grad: "from-indigo-500 via-violet-500 to-fuchsia-500" },
  { id: "2", name: "2b", sus: 24, disc: 5, grad: "from-orange-400 via-pink-500 to-rose-500" },
  { id: "3", name: "3a", sus: 21, disc: 4, grad: "from-emerald-400 via-teal-500 to-cyan-500" },
  { id: "4", name: "4c", sus: 26, disc: 6, grad: "from-amber-400 via-orange-500 to-red-500" },
  { id: "5", name: "5a", sus: 23, disc: 5, grad: "from-sky-500 via-blue-600 to-indigo-700" },
  { id: "6", name: "6b", sus: 25, disc: 4, grad: "from-lime-400 via-green-500 to-emerald-600" },
  { id: "7", name: "7c", sus: 20, disc: 5, grad: "from-rose-400 via-rose-500 to-red-600" },
  { id: "8", name: "8a", sus: 22, disc: 6, grad: "from-cyan-400 via-sky-500 to-blue-600" },
];

function MiniTurniDashboard() {
  return (
    <div className="aspect-[16/10] w-full bg-gradient-to-b from-slate-50 via-white to-slate-50 text-[8px] leading-tight">
      {/* Header — genau wie in der echten App */}
      <div className="flex items-center justify-between border-b border-slate-200/70 bg-white/80 px-2.5 py-2 backdrop-blur">
        <div className="flex items-center gap-1.5">
          <TurniLogo className="h-4 w-4 rounded-[3px] shadow-sm" />
          <div className="leading-none">
            <div className="text-[8px] font-semibold tracking-tight text-slate-900">Turni</div>
            <div className="text-[6px] text-slate-500">Sportunterricht</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="rounded-[3px] bg-gradient-to-r from-amber-500 to-rose-500 px-1 py-[2px] text-[6px] font-semibold text-white shadow-sm">Noten</span>
          <span className="rounded-[3px] bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-1 py-[2px] text-[6px] font-semibold text-white shadow-sm">Aufträge</span>
          <span className="rounded-[3px] bg-gradient-to-r from-emerald-500 to-teal-500 px-1 py-[2px] text-[6px] font-semibold text-white shadow-sm">Übungen</span>
          <span className="rounded-[3px] border border-slate-200 bg-white px-1 py-[2px] text-[6px] font-medium text-slate-600">Archiv</span>
          <span className="grid h-3 w-3 place-items-center rounded-[3px] border border-slate-200 bg-white text-slate-500" style={{ fontSize: 5 }}>⚙</span>
        </div>
      </div>

      {/* Titel */}
      <div className="px-3 pt-2 text-center">
        <div className="text-[10px] font-bold tracking-tight text-slate-900">Klasse auswählen</div>
        <div className="text-[6px] text-slate-500">Wähle eine Klasse zur Verwaltung.</div>
      </div>

      {/* Klassen-Kacheln — echte Gradient-Optik */}
      <div className="mt-1.5 grid grid-cols-4 gap-1.5 px-2.5 pb-2.5">
        {CLASS_TILES.map((c) => (
          <div
            key={c.id}
            className={`relative overflow-hidden rounded-md bg-gradient-to-br ${c.grad} p-1.5 text-white shadow-md ring-1 ring-white/20`}
          >
            <div className="pointer-events-none absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/25 blur-md" />
            <div className="pointer-events-none absolute -bottom-2 -left-2 h-5 w-5 rounded-full bg-black/10 blur-md" />
            <div className="relative flex items-start justify-between">
              <span className="text-[14px] font-black leading-none tracking-tight drop-shadow-sm">{c.id}</span>
              <span className="grid h-3 w-3 place-items-center rounded-[3px] bg-white/25 text-[6px] backdrop-blur-sm">◧</span>
            </div>
            <div className="relative mt-1">
              <div className="text-[7px] font-bold leading-none">{c.name}</div>
              <div className="mt-0.5 flex gap-0.5">
                <span className="rounded-full bg-white/25 px-1 py-[1px] text-[5px] font-semibold">
                  {c.sus} SuS
                </span>
                <span className="rounded-full bg-white/25 px-1 py-[1px] text-[5px] font-semibold">
                  {c.disc} Disz.
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniTurniPhone() {
  const mobileTiles = CLASS_TILES.slice(0, 4);
  return (
    <div className="aspect-[9/19] w-full bg-gradient-to-b from-slate-50 via-white to-slate-50 p-1.5 text-[6px] leading-tight">
      {/* Header */}
      <div className="mt-2 flex items-center justify-between rounded-md border border-slate-200 bg-white/80 px-1.5 py-1 backdrop-blur">
        <TurniLogo className="h-3 w-3" />
        <div className="flex gap-0.5">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-gradient-to-br from-amber-500 to-rose-500" />
          <span className="h-2.5 w-2.5 rounded-[2px] bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
          <span className="h-2.5 w-2.5 rounded-[2px] bg-gradient-to-br from-emerald-500 to-teal-500" />
        </div>
      </div>

      {/* Titel */}
      <div className="mt-2 px-1 text-center">
        <div className="text-[8px] font-bold tracking-tight text-slate-900">Klasse auswählen</div>
      </div>

      {/* Klassenkacheln — 2 Spalten wie am Handy */}
      <div className="mt-1.5 grid grid-cols-2 gap-1.5 px-1">
        {mobileTiles.map((c) => (
          <div
            key={c.id}
            className={`relative overflow-hidden rounded-md bg-gradient-to-br ${c.grad} p-1.5 text-white shadow-md ring-1 ring-white/20`}
          >
            <div className="pointer-events-none absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/25 blur-md" />
            <div className="relative flex items-start justify-between">
              <span className="text-[16px] font-black leading-none tracking-tight drop-shadow-sm">{c.id}</span>
              <span className="grid h-3 w-3 place-items-center rounded-[3px] bg-white/25 text-[6px] backdrop-blur-sm">◧</span>
            </div>
            <div className="relative mt-1.5">
              <div className="text-[7px] font-bold leading-none">{c.name}</div>
              <div className="mt-0.5 flex flex-wrap gap-0.5">
                <span className="rounded-full bg-white/25 px-1 py-[1px] text-[5px] font-semibold">
                  {c.sus} SuS
                </span>
                <span className="rounded-full bg-white/25 px-1 py-[1px] text-[5px] font-semibold">
                  {c.disc} Disz.
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Kleiner Hinweis unten */}
      <div className="mt-2 rounded-md border border-slate-200 bg-white/80 px-1.5 py-1 text-center text-[6px] font-medium text-slate-500">
        Notenübersicht · Aufträge · Übungen
      </div>
    </div>
  );
}


