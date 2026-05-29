import { useState } from "react";
import { useRouterState, Link } from "@tanstack/react-router";
import { Heart, MessageSquarePlus, X, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useScrollLock } from "@/hooks/use-scroll-lock";

type FeedbackKind = "verbesserung" | "fehler" | "sonstiges";

const KIND_LABEL: Record<FeedbackKind, string> = {
  verbesserung: "Verbesserungsvorschlag",
  fehler: "Fehlermeldung",
  sonstiges: "Sonstiges",
};

export function SiteFooter() {
  const [open, setOpen] = useState(false);
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="no-print mt-16 border-t border-border/60 bg-background/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
            <span>© {year} Turni</span>
            <span aria-hidden>·</span>
            <span>
              Erstellt von <strong className="text-foreground">David Garger</strong>
            </span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              mit Unterstützung von
              <a
                href="https://lovable.dev"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-foreground hover:underline"
              >
                Lovable
              </a>
              <Heart className="h-3 w-3 fill-rose-500 text-rose-500" aria-hidden />
            </span>
            <span aria-hidden>·</span>
            <Link to="/impressum" className="hover:text-foreground hover:underline">
              Impressum
            </Link>
            <span aria-hidden>·</span>
            <Link to="/datenschutz" className="hover:text-foreground hover:underline">
              Datenschutz
            </Link>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-accent"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
            Feedback senden
          </button>
        </div>
      </footer>
      {open ? <FeedbackDialog onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function FeedbackDialog({ onClose }: { onClose: () => void }) {
  useScrollLock(true);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [kind, setKind] = useState<FeedbackKind>("verbesserung");
  const [message, setMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed.length < 3) {
      toast.error("Bitte eine kurze Nachricht eingeben.");
      return;
    }
    if (trimmed.length > 4000) {
      toast.error("Nachricht ist zu lang (max. 4000 Zeichen).");
      return;
    }
    const emailTrim = contactEmail.trim();
    if (emailTrim && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      toast.error("Bitte gültige E-Mail-Adresse eingeben oder Feld leer lassen.");
      return;
    }
    setSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id ?? null;
      const ua = typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null;
      const { error } = await supabase.from("feedback").insert({
        user_id: userId,
        kind,
        message: trimmed,
        contact_email: emailTrim || null,
        page: pathname,
        user_agent: ua,
      });
      if (error) throw error;
      toast.success("Danke für dein Feedback!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Konnte Feedback nicht senden. Bitte später erneut versuchen.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center"
      onClick={onClose}
    >
      <form
        onSubmit={onSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-xl border border-border bg-background p-5 shadow-2xl"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2 id="feedback-title" className="text-lg font-semibold">
              Feedback an David
            </h2>
            <p className="text-xs text-muted-foreground">
              Verbesserungsvorschläge oder Fehlermeldungen — geht direkt an den Entwickler.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Schließen"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Art</span>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as FeedbackKind)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {(Object.keys(KIND_LABEL) as FeedbackKind[]).map((k) => (
                <option key={k} value={k}>
                  {KIND_LABEL[k]}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">
              Nachricht <span className="text-rose-500">*</span>
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              maxLength={4000}
              required
              placeholder="Was hat dir gefehlt, was hat nicht funktioniert?"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <span className="mt-1 block text-right text-[10px] text-muted-foreground">
              {message.length}/4000
            </span>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">
              Deine E-Mail (optional, für Rückfragen)
            </span>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="dein.name@beispiel.com"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Senden
          </button>
        </div>
      </form>
    </div>
  );
}
