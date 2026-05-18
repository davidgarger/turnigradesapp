import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogIn, UserPlus, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TurniLogo } from "@/components/TurniLogo";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [{ title: "Anmelden — Turni" }],
  }),
});

// Aus dem Benutzernamen wird eine synthetische E-Mail gemacht, damit der
// Cloud-Login ohne echte Mail-Adresse funktioniert. Du und deine Kollegin
// teilt euch denselben Benutzernamen + dasselbe Passwort.
function toEmail(username: string) {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  return `${clean}@turnnoten.app`;
}

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <TurniLogo className="h-14 w-14 rounded-2xl shadow-lg shadow-violet-500/30" />
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">Turni</h1>
          <p className="text-sm text-muted-foreground">Deine App für den Turnunterricht</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
          <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1 text-sm font-medium">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`rounded-md px-3 py-1.5 transition ${mode === "login" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Anmelden
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-md px-3 py-1.5 transition ${mode === "signup" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Konto erstellen
            </button>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Benutzername
              </label>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="z. B. turnverein-mueller"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Passwort / PIN
              </label>
              <input
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="mind. 6 Zeichen"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/30 transition hover:opacity-95 disabled:opacity-60"
            >
              {mode === "signup" ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              {busy ? "Bitte warten…" : mode === "signup" ? "Konto erstellen" : "Anmelden"}
            </button>
          </form>

          <div className="mt-5 flex items-start gap-2 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
            <Users className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>
              Gebt euch denselben Benutzernamen + Passwort, dann arbeitet ihr im selben Konto.
              Änderungen werden automatisch zwischen euren Geräten synchronisiert.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
