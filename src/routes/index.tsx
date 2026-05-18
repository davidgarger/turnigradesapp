import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings, Users, ClipboardList, ImagePlus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTurnState } from "@/lib/turn-store";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Turnnoten — Startseite" },
      { name: "description", content: "Wähle eine Klasse zur Verwaltung von Schülern und Noten." },
    ],
  }),
});

const CLASSES = ["1", "2", "3", "4"] as const;

// Vier kräftige, deutlich unterscheidbare Farb-Themes pro Klasse
const CLASS_THEMES: Record<
  (typeof CLASSES)[number],
  { gradient: string; ring: string; chip: string; glow: string; accent: string }
> = {
  "1": {
    gradient: "from-indigo-500 via-violet-500 to-fuchsia-500",
    ring: "ring-violet-300",
    chip: "bg-white/20 text-white",
    glow: "shadow-violet-500/30",
    accent: "text-violet-100",
  },
  "2": {
    gradient: "from-orange-400 via-pink-500 to-rose-500",
    ring: "ring-pink-300",
    chip: "bg-white/20 text-white",
    glow: "shadow-pink-500/30",
    accent: "text-pink-100",
  },
  "3": {
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    ring: "ring-teal-300",
    chip: "bg-white/20 text-white",
    glow: "shadow-teal-500/30",
    accent: "text-teal-100",
  },
  "4": {
    gradient: "from-amber-400 via-orange-500 to-red-500",
    ring: "ring-orange-300",
    chip: "bg-white/20 text-white",
    glow: "shadow-orange-500/30",
    accent: "text-orange-100",
  },
};

const LOGO_KEY = "turn-app-school-logo";

function Index() {
  const state = useTurnState();
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-md shadow-violet-500/20">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">Turnnoten</h1>
              <p className="text-xs text-muted-foreground">Bewertung im Turnunterricht</p>
            </div>
          </div>
          <Link
            to="/einstellungen"
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Bewertungseinstellungen</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <SchoolLogo />

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Klasse auswählen
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Wähle eine Klasse, um Schüler, Disziplinen und Noten zu verwalten.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CLASSES.map((id) => {
            const cls = state.classes[id];
            const theme = CLASS_THEMES[id];
            return (
              <Link
                key={id}
                to="/klasse/$classId"
                params={{ classId: id }}
                className={`group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${theme.gradient} p-6 text-white shadow-xl ${theme.glow} ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 ${theme.ring}`}
              >
                {/* dekorative Blobs */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-black/10 blur-2xl" />

                <div className="relative flex items-center justify-between">
                  <span className="text-6xl font-black leading-none tracking-tight drop-shadow-sm">
                    {id}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div className="relative mt-6">
                  <div className="text-lg font-bold">{cls.name}</div>
                  <div className={`mt-2 flex flex-wrap gap-1.5 text-[11px] font-semibold uppercase tracking-wider`}>
                    <span className={`rounded-full px-2 py-0.5 ${theme.chip}`}>
                      {cls.students.length} Schüler
                    </span>
                    <span className={`rounded-full px-2 py-0.5 ${theme.chip}`}>
                      {cls.disciplines.length} Disz.
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function SchoolLogo() {
  const [logo, setLogo] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const v = localStorage.getItem(LOGO_KEY);
      if (v) setLogo(v);
    } catch {
      /* ignore */
    }
  }, []);

  const onPick = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result || "");
      setLogo(url);
      try {
        localStorage.setItem(LOGO_KEY, url);
      } catch {
        /* quota */
      }
    };
    reader.readAsDataURL(file);
  };

  const onRemove = () => {
    setLogo(null);
    try {
      localStorage.removeItem(LOGO_KEY);
    } catch {
      /* ignore */
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="mb-10 flex flex-col items-center">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
        }}
      />

      {logo ? (
        <div className="group relative">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg ring-4 ring-white sm:h-32 sm:w-32">
            <img src={logo} alt="Schullogo" className="h-full w-full object-contain p-2" />
          </div>
          <div className="absolute -bottom-1 left-1/2 hidden -translate-x-1/2 gap-1 group-hover:flex">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-full bg-foreground/90 px-2.5 py-1 text-[10px] font-semibold text-background shadow"
            >
              Ändern
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1 rounded-full bg-destructive px-2.5 py-1 text-[10px] font-semibold text-destructive-foreground shadow"
              aria-label="Logo entfernen"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-full border-2 border-dashed border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary sm:h-32 sm:w-32"
        >
          <ImagePlus className="h-6 w-6" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Schullogo</span>
        </button>
      )}
    </div>
  );
}
