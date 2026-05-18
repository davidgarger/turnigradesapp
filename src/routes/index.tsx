import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Settings, Users, ClipboardList, ImagePlus, Trash2, Palette, Check, LogOut, MoreVertical, Pencil, ArrowLeftRight, RotateCcw, Plus, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { turnActions, useTurnState } from "@/lib/turn-store";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Turnnoten — Startseite" },
      { name: "description", content: "Wähle eine Klasse zur Verwaltung von Schülern und Noten." },
    ],
  }),
});

const CLASSES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] as const;

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
  "5": "blue",
  "6": "lime",
  "7": "rose",
  "8": "sky",
  "9": "amber",
  "10": "slate",
};

const LOGO_KEY = "turn-app-school-logo";
const THEME_KEY = "turn-app-class-themes";
const VISIBLE_KEY = "turn-app-visible-classes";

type UserPrefs = {
  logo: string | null;
  themes: Record<string, ThemeKey>;
  visible_classes: string[];
};

async function fetchUserPrefs(userId: string): Promise<UserPrefs | null> {
  const { data, error } = await supabase
    .from("user_prefs")
    .select("logo, themes, visible_classes")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return {
    logo: (data.logo as string | null) ?? null,
    themes: (data.themes as Record<string, ThemeKey>) ?? {},
    visible_classes: Array.isArray(data.visible_classes)
      ? (data.visible_classes as string[]).filter((x) => CLASSES.includes(x as (typeof CLASSES)[number]))
      : ["1", "2", "3", "4"],
  };
}

async function saveUserPrefs(userId: string, patch: Partial<UserPrefs>) {
  const payload: { user_id: string; logo?: string | null; themes?: Record<string, ThemeKey>; visible_classes?: string[] } = { user_id: userId };
  if ("logo" in patch) payload.logo = patch.logo ?? null;
  if ("themes" in patch) payload.themes = patch.themes;
  if ("visible_classes" in patch) payload.visible_classes = patch.visible_classes;
  await supabase.from("user_prefs").upsert(payload, { onConflict: "user_id" });
}

function loadThemes(): Record<string, ThemeKey> {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v) return JSON.parse(v);
  } catch {
    /* ignore */
  }
  return {};
}

function loadVisibleClasses(): string[] {
  try {
    const v = localStorage.getItem(VISIBLE_KEY);
    if (v) {
      const arr = JSON.parse(v);
      if (Array.isArray(arr) && arr.length > 0) return arr.filter((x) => CLASSES.includes(x));
    }
  } catch {
    /* ignore */
  }
  return ["1", "2", "3", "4"];
}

function Index() {
  const state = useTurnState();
  const [themes, setThemes] = useState<Record<string, ThemeKey>>({});
  const [openPicker, setOpenPicker] = useState<string | null>(null);
  const [visible, setVisible] = useState<string[]>(["1", "2", "3", "4"]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Sofort lokalen Cache anzeigen, dann Cloud-Werte nachladen
    setThemes(loadThemes());
    setVisible(loadVisibleClasses());

    let active = true;
    const apply = async (uid: string | null) => {
      setUserId(uid);
      if (!uid) return;
      const remote = await fetchUserPrefs(uid);
      if (!active) return;
      if (remote) {
        setThemes(remote.themes);
        setVisible(remote.visible_classes);
        try {
          localStorage.setItem(THEME_KEY, JSON.stringify(remote.themes));
          localStorage.setItem(VISIBLE_KEY, JSON.stringify(remote.visible_classes));
        } catch { /* ignore */ }
      } else {
        // Erstmalige Migration: lokale Werte in die Cloud schreiben
        const localThemes = loadThemes();
        const localVisible = loadVisibleClasses();
        const localLogo = (() => {
          try {
            return (
              localStorage.getItem(`${LOGO_KEY}:${uid}`) ||
              localStorage.getItem(LOGO_KEY)
            );
          } catch { return null; }
        })();
        await saveUserPrefs(uid, {
          themes: localThemes,
          visible_classes: localVisible,
          logo: localLogo,
        });
      }
    };

    supabase.auth.getUser().then(({ data }) => apply(data.user?.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      apply(session?.user?.id ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const persistVisible = (next: string[]) => {
    setVisible(next);
    try {
      localStorage.setItem(VISIBLE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    if (userId) void saveUserPrefs(userId, { visible_classes: next });
  };

  const addNextClass = () => {
    const next = CLASSES.find((c) => !visible.includes(c));
    if (!next) return;
    persistVisible([...visible, next]);
    toast.success(`Klasse ${next} hinzugefügt`);
  };

  const hideClass = (id: string) => {
    if (visible.length <= 1) {
      toast.error("Mindestens eine Klasse muss sichtbar bleiben.");
      return;
    }
    persistVisible(visible.filter((c) => c !== id));
    setOpenPicker(null);
    toast.success(`Klasse ${id} ausgeblendet`);
  };

  const setClassTheme = (classId: string, key: ThemeKey) => {
    const next = { ...themes, [classId]: key };
    setThemes(next);
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    if (userId) void saveUserPrefs(userId, { themes: next });
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
              <h1 className="text-xl font-semibold tracking-tight text-foreground">Turni</h1>
              <p className="text-xs text-muted-foreground">Deine App für den Sportunterricht</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/einstellungen"
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Einstellungen</span>
            </Link>
            <LogoutButton />
          </div>
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
          {CLASSES.filter((id) => visible.includes(id)).map((id) => {
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

                {/* Menü-Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenPicker(isOpen ? null : id);
                  }}
                  aria-label="Klassen-Menü"
                  className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-sm transition hover:bg-white/40"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {isOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setOpenPicker(null)}
                    />
                    <div className="absolute right-2 top-12 z-30 w-64 rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-2xl">
                      <button
                        type="button"
                        onClick={() => {
                          const next = window.prompt("Klassenname / Schulstufe", cls.name);
                          if (next && next.trim()) {
                            turnActions.renameClass(id, next.trim());
                            toast.success("Klassenname geändert");
                          }
                          setOpenPicker(null);
                        }}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                      >
                        <Pencil className="h-4 w-4" />
                        Schulstufe / Name ändern
                      </button>

                      <div className="my-1 border-t border-border" />

                      <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5"><ArrowLeftRight className="h-3 w-3" /> Klasse verschieben (tauschen)</span>
                      </div>
                      <div className="flex gap-1.5 px-2 pb-2">
                        {(visible as typeof CLASSES[number][]).filter((c) => c !== id).map((target) => (
                          <button
                            key={target}
                            type="button"
                            onClick={() => {
                              turnActions.swapClasses(id, target);
                              toast.success(`Mit Klasse ${target} getauscht`);
                              setOpenPicker(null);
                            }}
                            className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-xs font-semibold hover:bg-accent"
                          >
                            ↔ {target}
                          </button>
                        ))}
                      </div>

                      <div className="my-1 border-t border-border" />

                      <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5"><Palette className="h-3 w-3" /> Farbe</span>
                      </div>
                      <div className="grid grid-cols-5 gap-2 px-2 pb-2">
                        {(Object.keys(THEMES) as ThemeKey[]).map((k) => {
                          const active = themeKey === k;
                          return (
                            <button
                              key={k}
                              type="button"
                              onClick={() => setClassTheme(id, k)}
                              title={THEMES[k].label}
                              aria-label={THEMES[k].label}
                              className={`relative h-7 w-7 rounded-full ${THEMES[k].swatch} ring-2 transition ${
                                active ? "ring-foreground" : "ring-border hover:ring-foreground/50"
                              }`}
                            >
                              {active && (
                                <Check className="absolute inset-0 m-auto h-3.5 w-3.5 text-white drop-shadow" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="my-1 border-t border-border" />

                      <button
                        type="button"
                        onClick={() => hideClass(id)}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                      >
                        <EyeOff className="h-4 w-4" />
                        Klasse ausblenden
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              `„${cls.name}" zurücksetzen?\n\nAlle Mitgeturnt/TV/E/NE-Zähler, Disziplin-Punkte, roten/grünen Punkte und die Stunden-Historie werden auf 0 gesetzt. Schüler und Disziplinen bleiben erhalten.`,
                            )
                          ) {
                            turnActions.resetClass(id);
                            toast.success("Klasse zurückgesetzt");
                          }
                          setOpenPicker(null);
                        }}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Klasse zurücksetzen (neues Schuljahr)
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
          {visible.length < CLASSES.length && (
            <button
              type="button"
              onClick={addNextClass}
              className="group flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-background/50 p-6 text-muted-foreground transition hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-600"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted group-hover:bg-indigo-100">
                <Plus className="h-6 w-6" />
              </div>
              <span className="text-sm font-semibold">Klasse hinzufügen</span>
              <span className="text-xs">Nächste freie Schulstufe</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function SchoolLogo() {
  const [logo, setLogo] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const storageKey = userId ? `${LOGO_KEY}:${userId}` : null;

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      const uid = data.user?.id ?? null;
      setUserId(uid);
      try {
        const key = uid ? `${LOGO_KEY}:${uid}` : LOGO_KEY;
        const v = localStorage.getItem(key);
        // Migration: legacy global key → user-scoped
        if (!v && uid) {
          const legacy = localStorage.getItem(LOGO_KEY);
          if (legacy) {
            localStorage.setItem(key, legacy);
            localStorage.removeItem(LOGO_KEY);
            setLogo(legacy);
            return;
          }
        }
        if (v) setLogo(v);
        else setLogo(null);
      } catch {
        /* ignore */
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      try {
        const key = uid ? `${LOGO_KEY}:${uid}` : LOGO_KEY;
        const v = localStorage.getItem(key);
        setLogo(v || null);
      } catch {
        setLogo(null);
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const onPick = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result || "");
      setLogo(url);
      try {
        if (storageKey) localStorage.setItem(storageKey, url);
      } catch {
        /* quota */
      }
    };
    reader.readAsDataURL(file);
  };

  const onRemove = () => {
    setLogo(null);
    try {
      if (storageKey) localStorage.removeItem(storageKey);
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

function LogoutButton() {
  const navigate = useNavigate();
  const onLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };
  return (
    <button
      type="button"
      onClick={onLogout}
      className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      aria-label="Abmelden"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">Abmelden</span>
    </button>
  );
}
