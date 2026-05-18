import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings, Users, ClipboardList, ImagePlus, Trash2, Palette, Check } from "lucide-react";
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

type ThemeKey =
  | "violet"
  | "pink"
  | "teal"
  | "orange"
  | "blue"
  | "lime"
  | "slate"
  | "rose"
  | "sky"
  | "amber";

type Theme = {
  label: string;
  gradient: string;
  ring: string;
  glow: string;
  swatch: string;
};

const THEMES: Record<ThemeKey, Theme> = {
  violet: {
    label: "Violett",
    gradient: "from-indigo-500 via-violet-500 to-fuchsia-500",
    ring: "ring-violet-300",
    glow: "shadow-violet-500/30",
    swatch: "bg-gradient-to-br from-indigo-500 to-fuchsia-500",
  },
  pink: {
    label: "Pink",
    gradient: "from-orange-400 via-pink-500 to-rose-500",
    ring: "ring-pink-300",
    glow: "shadow-pink-500/30",
    swatch: "bg-gradient-to-br from-orange-400 to-rose-500",
  },
  teal: {
    label: "Türkis",
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    ring: "ring-teal-300",
    glow: "shadow-teal-500/30",
    swatch: "bg-gradient-to-br from-emerald-400 to-cyan-500",
  },
  orange: {
    label: "Orange",
    gradient: "from-amber-400 via-orange-500 to-red-500",
    ring: "ring-orange-300",
    glow: "shadow-orange-500/30",
    swatch: "bg-gradient-to-br from-amber-400 to-red-500",
  },
  blue: {
    label: "Blau",
    gradient: "from-sky-500 via-blue-600 to-indigo-700",
    ring: "ring-blue-300",
    glow: "shadow-blue-500/30",
    swatch: "bg-gradient-to-br from-sky-500 to-indigo-700",
  },
  lime: {
    label: "Lime",
    gradient: "from-lime-400 via-green-500 to-emerald-600",
    ring: "ring-lime-300",
    glow: "shadow-lime-500/30",
    swatch: "bg-gradient-to-br from-lime-400 to-emerald-600",
  },
  slate: {
    label: "Schiefer",
    gradient: "from-slate-600 via-slate-700 to-slate-900",
    ring: "ring-slate-400",
    glow: "shadow-slate-700/40",
    swatch: "bg-gradient-to-br from-slate-600 to-slate-900",
  },
  rose: {
    label: "Rose",
    gradient: "from-rose-400 via-rose-500 to-red-600",
    ring: "ring-rose-300",
    glow: "shadow-rose-500/30",
    swatch: "bg-gradient-to-br from-rose-400 to-red-600",
  },
  sky: {
    label: "Himmel",
    gradient: "from-cyan-400 via-sky-500 to-blue-600",
    ring: "ring-sky-300",
    glow: "shadow-sky-500/30",
    swatch: "bg-gradient-to-br from-cyan-400 to-blue-600",
  },
  amber: {
    label: "Sonne",
    gradient: "from-yellow-400 via-amber-500 to-orange-600",
    ring: "ring-amber-300",
    glow: "shadow-amber-500/30",
    swatch: "bg-gradient-to-br from-yellow-400 to-orange-600",
  },
};

const DEFAULT_THEME: Record<(typeof CLASSES)[number], ThemeKey> = {
  "1": "violet",
  "2": "pink",
  "3": "teal",
  "4": "orange",
};

const LOGO_KEY = "turn-app-school-logo";
const THEME_KEY = "turn-app-class-themes";

function loadThemes(): Record<string, ThemeKey> {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v) return JSON.parse(v);
  } catch {
    /* ignore */
  }
  return {};
}

function Index() {
  const state = useTurnState();
  const [themes, setThemes] = useState<Record<string, ThemeKey>>({});
  const [openPicker, setOpenPicker] = useState<string | null>(null);

  useEffect(() => {
    setThemes(loadThemes());
  }, []);

  const setClassTheme = (classId: string, key: ThemeKey) => {
    const next = { ...themes, [classId]: key };
    setThemes(next);
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setOpenPicker(null);
  };

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
            const themeKey = themes[id] ?? DEFAULT_THEME[id];
            const theme = THEMES[themeKey];
            const isOpen = openPicker === id;
            return (
              <div key={id} className="relative">
                <Link
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
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-semibold uppercase tracking-wider">
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-white">
                        {cls.students.length} Schüler
                      </span>
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-white">
                        {cls.disciplines.length} Disz.
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Farb-Picker Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenPicker(isOpen ? null : id);
                  }}
                  aria-label="Farbe ändern"
                  className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-sm transition hover:bg-white/40"
                >
                  <Palette className="h-4 w-4" />
                </button>

                {isOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setOpenPicker(null)}
                    />
                    <div className="absolute right-2 top-12 z-30 w-56 rounded-xl border border-border bg-popover p-3 shadow-2xl">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Farbe wählen
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {(Object.keys(THEMES) as ThemeKey[]).map((k) => {
                          const active = themeKey === k;
                          return (
                            <button
                              key={k}
                              type="button"
                              onClick={() => setClassTheme(id, k)}
                              title={THEMES[k].label}
                              aria-label={THEMES[k].label}
                              className={`relative h-8 w-8 rounded-full ${THEMES[k].swatch} ring-2 transition ${
                                active ? "ring-foreground" : "ring-white/60 hover:ring-foreground/50"
                              }`}
                            >
                              {active && (
                                <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
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
