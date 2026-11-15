import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  UserPlus,
  Users,
  Eye,
  EyeOff,
  Megaphone,
  Footprints,
  User,
  Lock,
  ArrowRight,
  Cone,
  Timer,
  CircleDot,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TurniLogo } from "@/components/TurniLogo";
import { toast } from "sonner";
import turnhalleBg from "@/assets/turnhalle-bg.webp";

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

const ROLE_BLUE = "var(--role-teacher)";
const ROLE_BLUE_STRONG = "var(--role-teacher-strong)";
const MINT = "#99FBB7";

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
    const t = window.setTimeout(() => setEntered(true), 60);
    return () => window.clearTimeout(t);
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
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Hintergrund: Turnhalle + dunkelgrün-blauer Verlauf */}
      <div className="absolute inset-0 -z-10">
        <img
          src={turnhalleBg}
          alt=""
          className="h-full w-full object-cover object-[center_65%]"
          width={1920}
          height={1280}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(4,60,48,0.62) 0%, rgba(6,42,66,0.55) 55%, rgba(4,50,40,0.6) 100%)",
          }}
        />
      </div>

      {/* Schwebende Sport-Dekoration (nur Desktop) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 hidden lg:block">
        <Cone
          className="login-float absolute left-[6%] top-[18%] h-14 w-14 text-white/25"
          style={{ animationDelay: "0s" }}
        />
        <Timer
          className="login-float absolute right-[7%] top-[24%] h-16 w-16 text-white/20"
          style={{ animationDelay: "1.2s" }}
        />
        <CircleDot
          className="login-float absolute bottom-[14%] left-[10%] h-12 w-12 text-white/20"
          style={{ animationDelay: "2.1s" }}
        />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-8 px-5 py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
        {/* Linke Spalte: Kopfbereich + Rollenauswahl */}
        <div
          className={`flex w-full max-w-md flex-col items-center transition-all duration-300 ease-out motion-reduce:transition-none lg:max-w-lg ${
            entered ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
          }`}
        >
          {/* Logo */}
          <div
            className={`flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-2xl ring-1 ring-white/40 ${
              entered ? "login-bounce" : ""
            }`}
          >
            <TurniLogo className="h-16 w-16" />
          </div>
          <h1
            className="mt-4 text-center text-5xl tracking-tight text-white drop-shadow-lg sm:text-6xl"
            style={{ fontFamily: '"Archivo Black", system-ui, sans-serif', letterSpacing: "-0.02em" }}
          >
            turni.live
          </h1>
          <p
            className="mt-2 text-center text-sm font-semibold uppercase"
            style={{ color: MINT, letterSpacing: "0.28em" }}
          >
            Für den Sportunterricht
          </p>

          {/* Rollenauswahl */}
          <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Lehrer — aktiv, zeigt das Formular */}
            <button
              type="button"
              onClick={() =>
                document.getElementById("login-form")?.scrollIntoView({ behavior: "smooth", block: "center" })
              }
              className="login-role-active group flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-3xl p-5 text-white shadow-xl ring-4 ring-white/90 transition-transform duration-200 ease-out motion-reduce:transition-none active:scale-95"
              style={{ background: `linear-gradient(140deg, ${ROLE_BLUE}, ${ROLE_BLUE_STRONG})` }}
            >
              <Megaphone className="h-10 w-10" strokeWidth={2.2} />
              <span className="text-xl font-bold">Lehrer</span>
              <span className="text-xs font-medium text-white/85">Klassen, Noten, Stunden</span>
            </button>

            {/* Schüler — führt zur Schülerseite */}
            <Link
              to="/schueler"
              className="group flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-3xl p-5 text-white shadow-xl brightness-[0.97] transition-all duration-200 ease-out motion-reduce:transition-none hover:brightness-105 active:scale-95"
              style={{
                background:
                  "linear-gradient(140deg, var(--role-student), var(--role-student-strong))",
              }}
            >
              <Footprints className="h-10 w-10" strokeWidth={2.2} />
              <span className="text-xl font-bold">Schüler</span>
              <span className="text-xs font-medium text-white/85">Mit Vorname und Code</span>
            </Link>
          </div>
        </div>

        {/* Rechte Spalte: Anmeldekarte (Glas-Effekt) */}
        <section
          id="login-form"
          className={`w-full max-w-md scroll-mt-6 transition-all delay-100 duration-300 ease-out motion-reduce:transition-none ${
            entered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div
            className="rounded-[28px] border border-white/50 bg-white/85 p-6 text-slate-900 shadow-2xl backdrop-blur-xl sm:p-8"
            style={{ boxShadow: "0 32px 64px -24px rgba(3,40,32,0.55)" }}
          >
            {/* Umschalter in Rollenfarbe */}
            <div
              className="mb-6 grid grid-cols-2 gap-1 rounded-2xl p-1.5 text-sm font-semibold"
              style={{ background: "color-mix(in oklab, var(--role-teacher) 10%, white)" }}
            >
              <button
                type="button"
                onClick={() => setMode("login")}
                className="min-h-[44px] rounded-xl px-3 py-2 transition-all duration-200 motion-reduce:transition-none"
                style={
                  mode === "login"
                    ? { background: ROLE_BLUE, color: "white", boxShadow: "0 4px 12px -4px rgba(0,0,0,0.35)" }
                    : { color: ROLE_BLUE_STRONG }
                }
              >
                Anmelden
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="min-h-[44px] rounded-xl px-3 py-2 transition-all duration-200 motion-reduce:transition-none"
                style={
                  mode === "signup"
                    ? { background: ROLE_BLUE, color: "white", boxShadow: "0 4px 12px -4px rgba(0,0,0,0.35)" }
                    : { color: ROLE_BLUE_STRONG }
                }
              >
                Neues Konto
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: ROLE_BLUE_STRONG }}
                >
                  Benutzername
                </label>
                <div className="relative">
                  <User
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
                    style={{ color: ROLE_BLUE }}
                  />
                  <input
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="z. B. sportlehrer-mueller"
                    className="min-h-[56px] w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm placeholder:text-slate-400 focus:outline-none"
                    style={{ transition: "box-shadow 200ms" }}
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow = "0 0 0 4px color-mix(in oklab, var(--role-teacher) 30%, transparent)")
                    }
                    onBlur={(e) => (e.currentTarget.style.boxShadow = "")}
                  />
                </div>
              </div>
              <div>
                <label
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: ROLE_BLUE_STRONG }}
                >
                  Passwort
                </label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
                    style={{ color: ROLE_BLUE }}
                  />
                  <input
                    type={showPw ? "text" : "password"}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="mind. 6 Zeichen"
                    className="min-h-[56px] w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-12 text-sm placeholder:text-slate-400 focus:outline-none"
                    style={{ transition: "box-shadow 200ms" }}
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow = "0 0 0 4px color-mix(in oklab, var(--role-teacher) 30%, transparent)")
                    }
                    onBlur={(e) => (e.currentTarget.style.boxShadow = "")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-2 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-xl transition hover:bg-slate-100"
                    style={{ color: ROLE_BLUE_STRONG }}
                    aria-label={showPw ? "Passwort verbergen" : "Passwort anzeigen"}
                  >
                    {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="group inline-flex min-h-[60px] w-full items-center justify-center gap-2 rounded-2xl px-4 text-base font-bold text-white transition-all duration-200 motion-reduce:transition-none disabled:opacity-60"
                style={{
                  background: `linear-gradient(135deg, ${ROLE_BLUE}, ${ROLE_BLUE_STRONG})`,
                  boxShadow: "0 16px 32px -14px rgba(20,60,140,0.6)",
                }}
              >
                {mode === "signup" ? <UserPlus className="h-5 w-5" /> : null}
                {busy ? "Bitte warten…" : mode === "signup" ? "Konto erstellen" : "Anmelden"}
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
              </button>
            </form>

            <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
              <Users className="mt-0.5 h-4 w-4 flex-shrink-0" />
              Teilt euch Benutzername + Passwort, um im selben Konto zu arbeiten.
              Änderungen synchronisieren sich automatisch zwischen euren Geräten.
            </p>
          </div>

          {/* Fußzeile */}
          <div className="mt-5 flex flex-col items-center gap-1 text-center text-xs text-white/80">
            <span>Gemacht für Sportlehrkräfte · DSGVO-konform · Cloud-Sync</span>
            <div className="flex items-center gap-2">
              <Link to="/impressum" className="underline transition hover:opacity-70">
                Impressum
              </Link>
              <span aria-hidden>·</span>
              <Link to="/datenschutz" className="underline transition hover:opacity-70">
                Datenschutz
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Animationen — abgeschaltet bei „Bewegung reduzieren" */}
      <style>{`
        @keyframes login-float {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50% { transform: translateY(-14px) rotate(4deg); }
        }
        @keyframes login-bounce {
          0% { transform: translateY(-18px); }
          45% { transform: translateY(6px); }
          70% { transform: translateY(-4px); }
          100% { transform: translateY(0); }
        }
        .login-float { animation: login-float 6s ease-in-out infinite; }
        .login-bounce { animation: login-bounce 400ms ease-out 250ms 1 both; }
        @media (prefers-reduced-motion: reduce) {
          .login-float, .login-bounce { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
