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
  Check,
  Backpack,
  Slash,
  FileCheck,
  FileX,
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
        <section className="flex items-center lg:sticky lg:top-10 lg:self-start">
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

function MiniTurniDashboard() {
  return (
    <div className="aspect-[16/10] w-full bg-[#f6faf7] p-3 text-[8px] leading-tight">
      {/* topbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div
            className="flex h-4 w-4 items-center justify-center rounded-md"
            style={{ background: BRAND_DARK, color: BRAND_MINT, fontWeight: 800, fontSize: 6 }}
          >
            T
          </div>
          <span style={{ color: BRAND_DARK, fontWeight: 700 }}>turni.live</span>
        </div>
        <div className="flex gap-1">
          <span className="rounded-sm px-1 py-[1px] text-white" style={{ background: BRAND_DARK, fontSize: 6 }}>
            Klassen
          </span>
          <span className="rounded-sm bg-white px-1 py-[1px]" style={{ color: BRAND_DARK, fontSize: 6, border: `1px solid ${BRAND_DARK}33` }}>
            Notenübersicht
          </span>
        </div>
      </div>

      {/* class cards grid */}
      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {[
          { c: "5a", k: 24 },
          { c: "6b", k: 22 },
          { c: "7c", k: 26 },
          { c: "8a", k: 19 },
          { c: "9b", k: 23 },
          { c: "10", k: 21 },
          { c: "5c", k: 25 },
          { c: "6a", k: 20 },
        ].map((it, i) => (
          <div
            key={i}
            className="rounded-md p-1.5 text-white shadow-sm"
            style={{
              background: i % 2 === 0
                ? `linear-gradient(135deg, ${BRAND_DARK}, #0a6e52)`
                : `linear-gradient(135deg, #0a6e52, ${BRAND_DARK})`,
            }}
          >
            <div className="font-black" style={{ fontSize: 10 }}>
              {it.c}
            </div>
            <div className="opacity-80" style={{ fontSize: 6 }}>
              {it.k} SuS
            </div>
          </div>
        ))}
      </div>

      {/* table preview */}
      <div className="mt-2 rounded-md border bg-white p-1.5" style={{ borderColor: `${BRAND_DARK}22` }}>
        <div className="flex items-center justify-between" style={{ color: BRAND_DARK }}>
          <span style={{ fontWeight: 700, fontSize: 7 }}>Klasse 8a</span>
          <span style={{ fontSize: 6, opacity: 0.6 }}>Anwesenheit · Noten</span>
        </div>
        <div className="mt-1 space-y-[3px]">
          {["Anna M.", "Ben K.", "Clara R.", "David S."].map((n, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: BRAND_MINT, border: `1px solid ${BRAND_DARK}55` }}
              />
              <span style={{ color: BRAND_DARK, fontSize: 7 }}>{n}</span>
              <div className="ml-auto flex gap-[2px]">
                {[1, 2, 3, 4, 5].map((x) => (
                  <div
                    key={x}
                    className="h-1.5 w-3 rounded-sm"
                    style={{
                      background: x <= 3 + (i % 2) ? BRAND_DARK : `${BRAND_DARK}22`,
                    }}
                  />
                ))}
                <span
                  className="ml-1 rounded px-1 text-white"
                  style={{ background: BRAND_DARK, fontSize: 6 }}
                >
                  {[1.7, 2.3, 1.3, 2.0][i]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniTurniPhone() {
  return (
    <div className="aspect-[9/19] w-full bg-[#f6faf7] p-2 text-[7px] leading-tight">
      <div className="mt-3 flex items-center gap-1">
        <div
          className="flex h-3.5 w-3.5 items-center justify-center rounded-md"
          style={{ background: BRAND_DARK, color: BRAND_MINT, fontWeight: 800, fontSize: 5 }}
        >
          T
        </div>
        <span style={{ color: BRAND_DARK, fontWeight: 700, fontSize: 7 }}>Klasse 8a</span>
      </div>

      <div
        className="mt-2 rounded-md p-1.5 text-white"
        style={{ background: `linear-gradient(135deg, ${BRAND_DARK}, #0a6e52)` }}
      >
        <div style={{ fontSize: 6, opacity: 0.8 }}>Heute</div>
        <div style={{ fontSize: 9, fontWeight: 800 }}>Anwesenheit</div>
        <div className="mt-1 flex gap-[2px]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-2 flex-1 rounded-sm"
              style={{ background: i < 10 ? BRAND_MINT : "#ffffff33" }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between" style={{ fontSize: 6 }}>
          <span>10 / 12 da</span>
          <span>schnelle Stunde</span>
        </div>
      </div>

      <div className="mt-2 space-y-1">
        {([
          { n: "Anna", s: "present" },
          { n: "Ben", s: "forgotten" },
          { n: "Clara", s: "present" },
          { n: "David", s: "excused" },
          { n: "Eva", s: "present" },
          { n: "Felix", s: "unexcused" },
        ] as const).map(({ n, s }) => {
          const cfg = {
            present: { bg: "#16a34a", icon: <Check className="h-2.5 w-2.5" strokeWidth={3.5} /> },
            forgotten: {
              bg: "#ea580c",
              icon: (
                <span className="relative inline-flex h-2.5 w-2.5 items-center justify-center">
                  <Backpack className="h-2.5 w-2.5" strokeWidth={2.75} />
                  <Slash className="absolute inset-0 h-2.5 w-2.5" strokeWidth={3} />
                </span>
              ),
            },
            excused: { bg: "#d97706", icon: <FileCheck className="h-2.5 w-2.5" strokeWidth={2.75} /> },
            unexcused: { bg: "#dc2626", icon: <FileX className="h-2.5 w-2.5" strokeWidth={2.75} /> },
          }[s];
          return (
            <div
              key={n}
              className="flex items-center justify-between rounded-md border bg-white px-1.5 py-1"
              style={{ borderColor: `${BRAND_DARK}22` }}
            >
              <div className="flex items-center gap-1">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ background: BRAND_MINT, border: `1px solid ${BRAND_DARK}55` }}
                />
                <span style={{ color: BRAND_DARK, fontWeight: 600 }}>{n}</span>
              </div>
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full text-white shadow-sm"
                style={{ background: cfg.bg }}
              >
                {cfg.icon}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

