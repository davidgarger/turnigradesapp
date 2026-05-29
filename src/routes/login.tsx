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

      {/* Top nav */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 pt-6">
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

          <h1
            className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl"
            style={{ color: BRAND_DARK }}
          >
            Sportunterricht{" "}
            <span className="relative inline-block">
              <span className="relative z-10">klar organisiert.</span>
              <span
                className="absolute bottom-1 left-0 -z-0 h-3 w-full rounded-md"
                style={{ background: BRAND_MINT, opacity: 0.7 }}
              />
            </span>
          </h1>

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
                <h2 className="text-2xl font-bold tracking-tight" style={{ color: BRAND_DARK }}>
                  {mode === "signup" ? "Konto erstellen" : "Anmelden"}
                </h2>
                <p className="mt-1 text-sm" style={{ color: `${BRAND_DARK}99` }}>
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
