// Kondition / Laufspiele — einfache lokale Übungsbibliothek
// Erste modulare Version, später erweiterbar für weitere Hauptkategorien.

import { useEffect, useState } from "react";

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
  duration: string;         // z.B. "10–15 Min"
  durationMinutes: number;  // grobe Minutenzahl für Filter
  groupSize: string;        // z.B. "ganze Klasse", "4er-Teams"
  material: string;         // z.B. "Hütchen, Stoppuhr"
  ageGroup: string;         // z.B. "10–14 Jahre"
  ageMin: number;
  ageMax: number;
  difficulty: Difficulty;
  images: string[];         // data URLs oder https
  videoUrl?: string;        // externer Link ODER data URL
  createdAt: number;
};

const STORE_KEY = "turni-kondition-exercises-v1";
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
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* ignore */ }
  // Erstlauf: Demo-Daten schreiben
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
    id: "demo_dauerlauf",
    title: "Ruhiger Dauerlauf",
    subcategory: "Ausdauer",
    shortDescription: "Gleichmäßiger Lauf im Wohlfühltempo zur Grundlagenausdauer.",
    goal: "Grundlagenausdauer verbessern und Sprechtempo halten können.",
    steps: [
      "Kurzes Warm-up: 2 Minuten lockeres Einlaufen.",
      "12 Minuten gleichmäßig in Zweiergruppen laufen (Sprechtempo).",
      "Nach 6 Minuten Richtung wechseln.",
      "Ausklang: 2 Minuten gehen und leichtes Dehnen.",
    ],
    duration: "15 Min",
    durationMinutes: 15,
    groupSize: "ganze Klasse",
    material: "Stoppuhr, evtl. Hütchen als Wendepunkte",
    ageGroup: "10–15 Jahre",
    ageMin: 10, ageMax: 15,
    difficulty: "Leicht",
    images: [],
    createdAt: Date.now() - 6_000,
  },
  {
    id: "demo_sprint30",
    title: "30-Meter-Sprints",
    subcategory: "Sprint",
    shortDescription: "Kurze Antritte aus dem Hochstart für Schnelligkeit.",
    goal: "Antrittsschnelligkeit und Reaktionsvermögen schulen.",
    steps: [
      "Zwei Linien im Abstand von 30 m markieren.",
      "In Dreier-Gruppen aus Hochstart starten.",
      "5 Sprints mit je 60 Sekunden Pause dazwischen.",
      "Kurz auslaufen und locker ausschütteln.",
    ],
    duration: "15 Min",
    durationMinutes: 15,
    groupSize: "3er-Gruppen",
    material: "2 Hütchen pro Bahn, Stoppuhr",
    ageGroup: "10–16 Jahre",
    ageMin: 10, ageMax: 16,
    difficulty: "Mittel",
    images: [],
    createdAt: Date.now() - 5_000,
  },
  {
    id: "demo_intervall",
    title: "Tabata-Laufintervalle",
    subcategory: "Intervall",
    shortDescription: "Acht Runden 20 s Sprint, 10 s Pause – kurz und intensiv.",
    goal: "Anaerobe Kapazität und Willenskraft trainieren.",
    steps: [
      "Warm-up: 3 Minuten lockeres Laufen und Skippings.",
      "8 × 20 Sekunden Sprint mit 10 Sekunden Gehpause.",
      "Zwischen den Runden Puls kurz überprüfen.",
      "Cool-down: 3 Minuten ausgehen.",
    ],
    duration: "10 Min",
    durationMinutes: 10,
    groupSize: "ganze Klasse",
    material: "Stoppuhr, Bodenmarkierungen",
    ageGroup: "12–16 Jahre",
    ageMin: 12, ageMax: 16,
    difficulty: "Schwer",
    images: [],
    createdAt: Date.now() - 4_000,
  },
  {
    id: "demo_pendelstaffel",
    title: "Pendelstaffel",
    subcategory: "Staffel",
    shortDescription: "Klassiker: Teams laufen abwechselnd zum Wendepunkt und zurück.",
    goal: "Teamgeist, Wechseltechnik und Sprintausdauer.",
    steps: [
      "Klasse in gleich große Teams (4–6 Kinder) teilen.",
      "Startlinie und Wendehütchen 15 m entfernt aufstellen.",
      "Erste:r läuft zum Hütchen, umrundet es und übergibt per Handklatsch.",
      "Sieger-Team ist zuerst zurück und sitzt auf der Bank.",
    ],
    duration: "10 Min",
    durationMinutes: 10,
    groupSize: "4er-/6er-Teams",
    material: "Hütchen als Wendepunkte",
    ageGroup: "8–14 Jahre",
    ageMin: 8, ageMax: 14,
    difficulty: "Leicht",
    images: [],
    createdAt: Date.now() - 3_000,
  },
  {
    id: "demo_parcours",
    title: "Hindernis-Laufparcours",
    subcategory: "Laufparcours",
    shortDescription: "Slalom, Sprung und Krabbeltunnel als Rundkurs.",
    goal: "Koordination, Wendigkeit und Ausdauer kombinieren.",
    steps: [
      "Parcours aufbauen: Hütchen-Slalom, Reifen zum Springen, Bank zum Balancieren, Matte zum Rollen.",
      "Kinder starten im 15-Sekunden-Abstand.",
      "3 Runden im eigenen Tempo laufen.",
      "Gemeinsam abbauen und kurze Feedbackrunde.",
    ],
    duration: "20 Min",
    durationMinutes: 20,
    groupSize: "ganze Klasse",
    material: "Hütchen, Reifen, Bank, Matte",
    ageGroup: "8–13 Jahre",
    ageMin: 8, ageMax: 13,
    difficulty: "Mittel",
    images: [],
    createdAt: Date.now() - 2_000,
  },
  {
    id: "demo_fangspiel",
    title: "Kettenfangen",
    subcategory: "Aufwärm-Laufspiele",
    shortDescription: "Spielerisches Aufwärmen – wer gefangen wird, hängt sich an.",
    goal: "Puls hochbringen, Übersicht und Zusammenspiel fördern.",
    steps: [
      "Spielfeld auf halber Hallengröße abgrenzen.",
      "Eine Person startet als Fänger.",
      "Wer gefangen wird, reicht die Hand – die Kette wächst.",
      "Ab 4 Personen darf die Kette sich teilen.",
    ],
    duration: "8 Min",
    durationMinutes: 8,
    groupSize: "ganze Klasse",
    material: "Feldmarkierungen (Hütchen)",
    ageGroup: "8–14 Jahre",
    ageMin: 8, ageMax: 14,
    difficulty: "Leicht",
    images: [],
    createdAt: Date.now() - 1_000,
  },
];
