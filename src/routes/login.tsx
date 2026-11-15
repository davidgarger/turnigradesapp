import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LogIn,
  UserPlus,
  Users,
  Eye,
  EyeOff,
  GraduationCap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TurniLogo } from "@/components/TurniLogo";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { property: "og:title", content: "Turni — Sportunterricht organisieren mit Klarheit" },
      { property: "og:description", content: "turni.live hilft Sportlehrkräften, Anwesenheit, Leistungen, faire Teams und Arbeitsaufträge an einem Ort zu verwalten." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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
        href: "https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap",
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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f6faf7] text-slate-900">
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
      </div>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-10">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-emerald-100">
            <TurniLogo className="h-10 w-10" />
          </div>
          <div className="leading-tight">
            <div
              className="text-2xl tracking-tight"
              style={{ fontFamily: '"Archivo Black", system-ui, sans-serif', color: BRAND_DARK, letterSpacing: "-0.02em" }}
            >
              turni.live
            </div>
            <div className="text-xs font-medium uppercase tracking-[0.14em]" style={{ color: BRAND_DARK, opacity: 0.6 }}>
              für den Sportunterricht
            </div>
          </div>
        </div>

        {/* Zwei große Zugangs-Buttons */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <Button
            className="h-20 flex-col gap-1.5 text-base font-semibold shadow-md"
            onClick={() => document.getElementById('login-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          >
            <GraduationCap className="h-6 w-6" />
            Lehrer
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col gap-1.5 bg-white text-base font-semibold shadow-md">
            <Link to="/schueler">
              <Users className="h-6 w-6" />
              Schüler
            </Link>
          </Button>
        </div>

        {/* Login card */}
        <section id="login-form" className="scroll-mt-6">
          <div
            className="rounded-3xl border bg-white/95 p-6 backdrop-blur sm:p-8"
            style={{ borderColor: `${BRAND_DARK}22`, boxShadow: `0 30px 60px -30px ${BRAND_DARK}55` }}
          >
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
        </section>
      </main>
    </div>
  );
}
