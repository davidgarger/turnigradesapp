// Kondition / Laufspiele — einfache lokale Übungsbibliothek
// Erste modulare Version, später erweiterbar für weitere Hauptkategorien.

import { useEffect, useState } from "react";
import gedaechtnislaufVorschau from "@/assets/exercises/gedaechtnislauf-vorschau.jpg";

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

function readAll(): Exercise[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Migration: Vorschaubild für Gedächtnislauf ergänzen, falls noch leer
        let changed = false;
        const migrated = parsed.map((e: Exercise) => {
          if (e.id === "demo_gedaechtnislauf" && (!e.images || e.images.length === 0)) {
            changed = true;
            return { ...e, images: [gedaechtnislaufVorschau] };
          }
          return e;
        });
        if (changed) {
          try { localStorage.setItem(STORE_KEY, JSON.stringify(migrated)); } catch { /* ignore */ }
        }
        return migrated;
      }
    }
  } catch { /* ignore */ }
  try { localStorage.setItem(STORE_KEY, JSON.stringify(DEMO_EXERCISES)); } catch { /* ignore */ }
  return DEMO_EXERCISES;
}

function writeAll(list: Exercise[]) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch { /* ignore */ }
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
      "Kinder laufen zu einem Merkbereich, prägen sich Symbole oder Karten ein und ordnen sie im Team richtig zu.",
    goal:
      "Kondition, Konzentration und Zusammenarbeit verbinden – laufen, merken, richtig zuordnen.",
    steps: [
      "Merkbereich auf der einen Hallenseite aufbauen: dort liegen frei wählbare Symbole, Bilder oder Karten (Platzhalter – später beliebig austauschbar).",
      "Auf der anderen Seite arbeiten die Gruppen an einer Ablagefläche, wo die Informationen richtig zugeordnet werden.",
      "Immer ein Kind pro Gruppe läuft los, merkt sich ein Element und läuft zurück.",
      "In der Gruppe wird das Element benannt, zugeordnet oder passend abgelegt.",
      "Danach startet das nächste Kind – bis alle Elemente korrekt zugeordnet sind.",
    ],
    duration: "15 Min",
    durationMinutes: 15,
    groupSize: "3er-/4er-Teams",
    material: "Merkkarten oder Symbole (frei wählbar), Ablagefläche pro Gruppe",
    ageGroup: "8–14 Jahre",
    ageMin: 8,
    ageMax: 14,
    difficulty: "Leicht",
    images: [],
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
