// Kondition / Laufspiele — einfache lokale Übungsbibliothek
// Erste modulare Version, später erweiterbar für weitere Hauptkategorien.

import { useEffect, useState } from "react";
import gedaechtnislaufVorschau from "@/assets/exercises/gedaechtnislauf-vorschau.jpg";
import gedaechtnislaufLeer from "@/assets/exercises/gedaechtnislauf-leer.jpg";

// Vorschaubilder für Demo-Übungen werden immer aus dem Build geladen
// (Vite-URLs enthalten einen Hash, der beim nächsten Build wechselt – daher
// niemals in localStorage speichern, sondern beim Lesen frisch überlagern).
const DEMO_IMAGES: Record<string, string[]> = {
  demo_gedaechtnislauf: [gedaechtnislaufVorschau, gedaechtnislaufLeer],
};


export const SUBCATEGORIES = [
  "Ausdauer",
  "Sprint",
  "Intervall",
  "Staffel",
  "Laufparcours",
  "Aufwärm-Laufspiele",
] as const;

export type Subcategory = (typeof SUBCATEGORIES)[number];

export const DIFFICULTIES = ["Leicht", "Mittel", "Schwer"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export type Exercise = {
  id: string;
  title: string;
  subcategory: Subcategory;
  shortDescription: string;
  goal: string;
  steps: string[];
  duration: string;
  durationMinutes: number;
  groupSize: string;
  material: string;
  ageGroup: string;
  ageMin: number;
  ageMax: number;
  difficulty: Difficulty;
  images: string[];
  videoUrl?: string;
  createdAt: number;
};

const STORE_KEY = "turni-kondition-exercises-v2";
const FAV_KEY = "turni-kondition-favs-v1";

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function withDemoImages(list: Exercise[]): Exercise[] {
  return list.map((e) =>
    DEMO_IMAGES[e.id] ? { ...e, images: DEMO_IMAGES[e.id] } : e,
  );
}

function stripDemoImages(list: Exercise[]): Exercise[] {
  return list.map((e) =>
    DEMO_IMAGES[e.id] ? { ...e, images: [] } : e,
  );
}

function readAll(): Exercise[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Migration: Text-Inhalte des Gedächtnislaufs auf aktuelle Version bringen
        let changed = false;
        const demo = DEMO_EXERCISES.find((d) => d.id === "demo_gedaechtnislauf");
        const migrated = parsed.map((e: Exercise) => {
          if (e.id === "demo_gedaechtnislauf" && demo) {
            const needsSteps = !e.steps?.[0]?.startsWith("Klasse in Gruppen einteilen");
            if (needsSteps) {
              changed = true;
              return {
                ...e,
                steps: demo.steps,
                shortDescription: demo.shortDescription,
                goal: demo.goal,
                material: demo.material,
              };
            }
          }
          return e;
        });
        if (changed) {
          try { localStorage.setItem(STORE_KEY, JSON.stringify(stripDemoImages(migrated))); } catch { /* ignore */ }
        }
        return withDemoImages(migrated);
      }
    }
  } catch { /* ignore */ }
  try { localStorage.setItem(STORE_KEY, JSON.stringify(stripDemoImages(DEMO_EXERCISES))); } catch { /* ignore */ }
  return withDemoImages(DEMO_EXERCISES);
}

function writeAll(list: Exercise[]) {
  // Demo-Bilder nicht persistieren (Build-Hash-URLs) – beim Lesen wieder überlagern.
  try { localStorage.setItem(STORE_KEY, JSON.stringify(stripDemoImages(list))); } catch { /* ignore */ }
  notify();
}

function readFavs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAV_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* ignore */ }
  return [];
}

function writeFavs(list: string[]) {
  try { localStorage.setItem(FAV_KEY, JSON.stringify(list)); } catch { /* ignore */ }
  notify();
}

export const konditionActions = {
  add(ex: Omit<Exercise, "id" | "createdAt">): Exercise {
    const created: Exercise = {
      ...ex,
      id: `ex_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
    };
    const list = readAll();
    writeAll([created, ...list]);
    return created;
  },
  update(id: string, patch: Partial<Exercise>) {
    const list = readAll().map((e) => (e.id === id ? { ...e, ...patch } : e));
    writeAll(list);
  },
  remove(id: string) {
    writeAll(readAll().filter((e) => e.id !== id));
    const favs = readFavs().filter((f) => f !== id);
    writeFavs(favs);
  },
  toggleFav(id: string) {
    const favs = readFavs();
    if (favs.includes(id)) writeFavs(favs.filter((f) => f !== id));
    else writeFavs([...favs, id]);
  },
};

export function useExercises(): Exercise[] {
  const [list, setList] = useState<Exercise[]>(() => (typeof window === "undefined" ? [] : readAll()));
  useEffect(() => {
    setList(readAll());
    const l = () => setList(readAll());
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return list;
}

export function useFavorites(): Set<string> {
  const [favs, setFavs] = useState<Set<string>>(() => (typeof window === "undefined" ? new Set() : new Set(readFavs())));
  useEffect(() => {
    setFavs(new Set(readFavs()));
    const l = () => setFavs(new Set(readFavs()));
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return favs;
}

// ---------------------- Demo-Daten ----------------------

export const DEMO_EXERCISES: Exercise[] = [
  {
    id: "demo_gedaechtnislauf",
    title: "Gedächtnislauf",
    subcategory: "Aufwärm-Laufspiele",
    shortDescription:
      "Vorne liegt ein Blatt mit allen Symbolen, hinten ein leeres Blatt. Die Kinder laufen los, merken sich pro Lauf ein Symbol und übertragen es am Startpunkt an die richtige Stelle.",
    goal:
      "Kondition, Konzentration und Zusammenarbeit verbinden – laufen, ein Symbol merken und korrekt übertragen.",
    steps: [
      "Klasse in Gruppen einteilen. Jede Gruppe erhält vorne (am Merkbereich) ein Blatt mit allen Symbolen und hinten (am Startpunkt) ein leeres Blatt mit denselben Feldern.",
      "Immer ein Kind pro Gruppe läuft nach vorne und merkt sich genau ein Symbol – nicht mehr.",
      "Zurück am Startpunkt trägt das Kind das gemerkte Symbol an der richtigen Stelle im leeren Blatt ein bzw. zeichnet es auf.",
      "Danach startet das nächste Kind – pro Lauf nur ein Symbol.",
      "Das Spiel läuft, bis alle Symbole korrekt vom vorderen auf das hintere Blatt übertragen sind.",
    ],
    duration: "15 Min",
    durationMinutes: 15,
    groupSize: "3er-/4er-Teams",
    material: "Pro Gruppe: 1 Blatt mit Symbolen (vorne) + 1 leeres Blatt mit denselben Feldern (hinten), Stift",
    ageGroup: "8–14 Jahre",
    ageMin: 8,
    ageMax: 14,
    difficulty: "Leicht",
    images: [gedaechtnislaufVorschau],
    createdAt: Date.now() - 2_000,
  },
  {
    id: "demo_wuerfelrallye",
    title: "Würfelrallye",
    subcategory: "Ausdauer",
    shortDescription:
      "Vier Gruppen sammeln gemeinsam Runden – jedes Kind würfelt und läuft die gewürfelte Anzahl. Ziel: 50 Runden pro Gruppe.",
    goal:
      "Ausdauer spielerisch trainieren und als Team gemeinsam ein Rundenziel erreichen.",
    steps: [
      "Klasse in 4 Gruppen einteilen. Jede Gruppe erhält 1 Würfel und einen festen Startpunkt.",
      "Ein Kind pro Gruppe würfelt und läuft genau die gewürfelte Anzahl an Runden.",
      "Danach ist das nächste Kind der Gruppe an der Reihe – würfeln, laufen, weitergeben.",
      "Alle gelaufenen Runden der Gruppe werden fortlaufend zusammengezählt.",
      "Ziel: Die Gruppe erreicht insgesamt 50 Runden.",
    ],
    duration: "20 Min",
    durationMinutes: 20,
    groupSize: "4 Gruppen",
    material: "4 Würfel, Rundenstrecke, Zettel/Tafel zum Mitzählen",
    ageGroup: "8–14 Jahre",
    ageMin: 8,
    ageMax: 14,
    difficulty: "Mittel",
    images: [],
    createdAt: Date.now() - 1_000,
  },
];
