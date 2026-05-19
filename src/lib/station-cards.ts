// Postenkarten-Generator für Leichtathletik & Geräteturnen.
// Inhalte sind didaktische Standard-Vorübungen aus dem Allgemeinwissen
// (z. B. methodische Reihen aus mobilesport.ch, Lehrmittel Sporterziehung).
// Lehrpersonen sollten Inhalte vor dem Einsatz fachlich prüfen.

export type StationDiscipline =
  | "sprint"
  | "weitsprung"
  | "hochsprung"
  | "kugelstossen"
  | "ausdauer"
  | "huerden"
  | "boden"
  | "reck"
  | "barren"
  | "sprung"
  | "schwebebalken"
  | "ringe"
  | "minitramp";

export type StationLevel = "unterstufe" | "mittelstufe" | "oberstufe";

export type StationCard = {
  title: string;
  ziel: string;
  material: string[];
  ablauf: string[];
  variationLeichter: string;
  variationSchwerer: string;
  sicherheit: string;
  videoSearch: string; // Vorschlag für YouTube-Suche / QR-Code
};

export const DISCIPLINE_LABEL: Record<StationDiscipline, string> = {
  sprint: "Sprint",
  weitsprung: "Weitsprung",
  hochsprung: "Hochsprung",
  kugelstossen: "Kugelstoßen",
  ausdauer: "Ausdauer",
  huerden: "Hürdenlauf",
  boden: "Bodenturnen",
  reck: "Reck",
  barren: "Barren",
  sprung: "Sprung (Kasten / Bock)",
  schwebebalken: "Schwebebalken",
  ringe: "Ringe",
  minitramp: "Minitrampolin",
};

export const LEVEL_LABEL: Record<StationLevel, string> = {
  unterstufe: "Unterstufe (1.–4. Kl.)",
  mittelstufe: "Mittelstufe (5.–6. Kl.)",
  oberstufe: "Oberstufe (7.–9./10. Kl.)",
};

export const SPORT_TO_DISCIPLINES: Record<"leichtathletik" | "geraeteturnen", StationDiscipline[]> = {
  leichtathletik: ["sprint", "weitsprung", "hochsprung", "kugelstossen", "ausdauer", "huerden"],
  geraeteturnen: ["boden", "reck", "barren", "sprung", "schwebebalken", "ringe", "minitramp"],
};

// Pool: pro Disziplin & Niveau eine Liste von Posten.
type Pool = Record<StationDiscipline, Record<StationLevel, StationCard[]>>;

const POOL: Pool = {
  sprint: {
    unterstufe: [
      {
        title: "Reaktionsstart aus dem Sitz",
        ziel: "Reaktionsschnelligkeit und schneller Startimpuls",
        material: ["Pfeife oder Klatscher", "Markierungshütchen (Start- und Ziellinie 10 m)"],
        ablauf: [
          "Die Schüler sitzen mit dem Rücken zur Laufrichtung auf dem Boden.",
          "Auf das Pfiff-Signal aufstehen und 10 m sprinten.",
          "Pro Durchgang 3 Sprints mit Pause.",
        ],
        variationLeichter: "Aus dem Stand statt aus dem Sitz starten.",
        variationSchwerer: "Aus der Bauchlage starten, Signal akustisch und optisch wechseln.",
        sicherheit: "Auslaufzone von mind. 5 m frei halten, keine Wand am Ziel.",
        videoSearch: "Reaktionsspiele Sprint Schule Grundschule",
      },
      {
        title: "Tier-Sprints",
        ziel: "Beschleunigung und Bewegungsfreude",
        material: ["6–8 Hütchen", "Kärtchen mit Tieren (Gepard, Frosch, Hase)"],
        ablauf: [
          "Strecke von 15 m abstecken.",
          "Pro Durchgang wird ein Tier gezogen.",
          "Die Schüler sprinten in der Bewegungsart des Tiers.",
        ],
        variationLeichter: "Strecke auf 10 m kürzen.",
        variationSchwerer: "Staffelform mit Übergabe einer Karte.",
        sicherheit: "Auf rutschfeste Schuhe und genügend Abstand achten.",
        videoSearch: "Sprint Spiele Grundschule Tieresprint",
      },
    ],
    mittelstufe: [
      {
        title: "Skippings am Ort und in Bewegung",
        ziel: "Saubere Sprinttechnik mit hoher Kniehebung",
        material: ["Koordinationsleiter oder 8 Markierungen", "Stoppuhr"],
        ablauf: [
          "20 s Skippings am Ort, Knie auf Hüfthöhe.",
          "20 s Skippings über die Leiter, Fußspitzen nach vorn.",
          "Dann 15 m im Sprint auslaufen.",
          "3 Serien, dazwischen 60 s Pause.",
        ],
        variationLeichter: "Tempo reduzieren, nur Skippings ohne Sprint.",
        variationSchwerer: "Skippings mit Armschwung bewusst betonen, Strecke auf 25 m.",
        sicherheit: "Auf gerade Hüfte und entspannte Schultern achten.",
        videoSearch: "Sprint ABC Skippings Schule",
      },
      {
        title: "Hochstart vs. Tiefstart",
        ziel: "Startvarianten kennen und vergleichen",
        material: ["Startlinie", "Ziellinie bei 20 m", "Stoppuhr"],
        ablauf: [
          "Je 2 Sprints aus dem Hochstart (Schrittstellung).",
          "Je 2 Sprints aus dem Tiefstart (Hände am Boden).",
          "Zeiten notieren und vergleichen.",
        ],
        variationLeichter: "Nur Hochstart, kürzere Strecke (15 m).",
        variationSchwerer: "Mit Startblöcken bzw. Markierungen Tiefstart sauber üben.",
        sicherheit: "Vorher Knie- und Sprunggelenke mobilisieren.",
        videoSearch: "Tiefstart Hochstart Schule Leichtathletik",
      },
    ],
    oberstufe: [
      {
        title: "Sprint-ABC-Parcours",
        ziel: "Sprinttechnik vertiefen (Kniehub, Anfersen, Sprunglauf)",
        material: ["Koordinationsleiter", "6 Markierungshütchen", "Stoppuhr"],
        ablauf: [
          "Station A: 15 m Anfersen.",
          "Station B: 15 m Kniehub.",
          "Station C: 15 m Sprunglauf.",
          "Station D: 30 m fliegender Sprint mit Zeitnahme.",
          "2 Durchgänge.",
        ],
        variationLeichter: "Jede Übung mit halber Strecke und gehender Pause.",
        variationSchwerer: "Sprunglauf mit Armschwung-Fokus; 40 m Sprintstrecke.",
        sicherheit: "Gründliches Aufwärmen vor explosiven Übungen.",
        videoSearch: "Lauf ABC Sprint Schule Oberstufe",
      },
    ],
  },
  weitsprung: {
    unterstufe: [
      {
        title: "Zonenweitsprung aus dem Stand",
        ziel: "Beidbeiniger Absprung und kontrollierte Landung",
        material: ["Mattenbahn oder Sandgrube", "Bodenmarkierungen (Zonen 1–4)"],
        ablauf: [
          "Aus dem Stand beidbeinig in die Zonen springen.",
          "Jede Zone gibt Punkte.",
          "5 Versuche, beste Weite zählt.",
        ],
        variationLeichter: "Sprung von einer leichten Erhöhung (kleiner Kasten).",
        variationSchwerer: "Standweitsprung mit Drehung um 90° in der Luft.",
        sicherheit: "Landung immer auf Matte/Sand, Hände vorne.",
        videoSearch: "Standweitsprung Grundschule Übung",
      },
    ],
    mittelstufe: [
      {
        title: "Absprung mit Anlauf, Reifen-Rhythmus",
        ziel: "Anlauf-Rhythmus und sauberer einbeiniger Absprung",
        material: ["4–6 Gymnastikreifen", "Weitsprunggrube oder Mattenbahn"],
        ablauf: [
          "Reifen im individuellen Schrittabstand legen (letzter Reifen =