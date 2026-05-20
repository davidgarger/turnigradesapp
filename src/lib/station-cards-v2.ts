// Einheitliches Stationenkarten-System für turni.live
// Pro Disziplin immer 4 Karten: Basis, Technik, Übergang, Zielübung.

export type CardSport = "leichtathletik" | "geraeteturnen";

export type CardDiscipline =
  | "sprint"
  | "weitsprung"
  | "kugelstossen"
  | "staffel"
  | "reck"
  | "barren"
  | "balken"
  | "boden";

export type CardLevel = 1 | 2 | 3 | 4;

export type CardSozialform = "einzel" | "paar" | "gruppe";
export type CardFokus = "kraft" | "technik" | "koordination" | "ausdauer" | "mut";

export type StationCard = {
  level: CardLevel; // 1 Basis · 2 Technik · 3 Übergang · 4 Zielübung
  levelLabel: string;
  title: string;
  graphicKey: string; // siehe StationCardGraphic.tsx
  soGehts: string[]; // 3–5 kurze Schritte
  daraufAchten: string[]; // 2–4 Coaching-Punkte
  sicherheit: string[]; // 1–3 Sicherheitshinweise
  material: string[];
  sozialform: CardSozialform;
  fokus: CardFokus;
};

export type DisciplineCardSet = {
  sport: CardSport;
  discipline: CardDiscipline;
  title: string;
  subtitle: string;
  cards: [StationCard, StationCard, StationCard, StationCard];
};

export const SPORT_LABEL: Record<CardSport, string> = {
  leichtathletik: "Leichtathletik",
  geraeteturnen: "Geräteturnen",
};

export const DISCIPLINE_LABEL: Record<CardDiscipline, string> = {
  sprint: "Sprint",
  weitsprung: "Weitsprung",
  kugelstossen: "Kugelstoßen",
  staffel: "Staffel",
  reck: "Reck",
  barren: "Barren",
  balken: "Schwebebalken",
  boden: "Bodenturnen",
};

export const SOZIALFORM_LABEL: Record<CardSozialform, string> = {
  einzel: "Einzeln",
  paar: "Paar",
  gruppe: "Gruppe",
};

export const FOKUS_LABEL: Record<CardFokus, string> = {
  kraft: "Kraft",
  technik: "Technik",
  koordination: "Koordination",
  ausdauer: "Ausdauer",
  mut: "Mut",
};

export const SPORT_TO_DISCIPLINES: Record<CardSport, CardDiscipline[]> = {
  leichtathletik: ["sprint", "weitsprung", "kugelstossen", "staffel"],
  geraeteturnen: ["reck", "barren", "balken", "boden"],
};

// Farbsystem: Blau = LA, Orange = GT
export const SPORT_COLORS: Record<CardSport, { base: string; soft: string; ink: string }> = {
  leichtathletik: { base: "#1d4ed8", soft: "#dbeafe", ink: "#0b2a6b" },
  geraeteturnen: { base: "#ea580c", soft: "#ffedd5", ink: "#7c2d12" },
};

// Level-Akzent (zusätzliche visuelle Stufung innerhalb einer Disziplin)
export const LEVEL_TINT: Record<CardLevel, string> = {
  1: "0.55",
  2: "0.7",
  3: "0.85",
  4: "1",
};

export const LEVEL_LABEL: Record<CardLevel, string> = {
  1: "Vorübung · Basis",
  2: "Vorübung · Technik",
  3: "Vorübung · Übergang",
  4: "Zielübung",
};

// Hilfsfunktion
const c = (card: StationCard): StationCard => card;

export const CARD_SETS: DisciplineCardSet[] = [
  // ====================== LEICHTATHLETIK ======================
  {
    sport: "leichtathletik",
    discipline: "sprint",
    title: "Sprint",
    subtitle: "Vom Tiefstart zum schnellen Lauf",
    cards: [
      c({
        level: 1,
        levelLabel: LEVEL_LABEL[1],
        title: "Reaktionsstart aus dem Stand",
        graphicKey: "sprint-stand",
        soGehts: [
          "Aufrechter Stand hinter der Linie",
          "Auf Signal kraftvoll antreten",
          "10 m sprinten, locker auslaufen",
        ],
        daraufAchten: ["Blick nach vorne", "Arme aktiv mitschwingen", "Ferse-Knie-Knie"],
        sicherheit: ["Genug Auslaufweg einplanen"],
        material: ["Startlinie", "10 m Bahn"],
        sozialform: "einzel",
        fokus: "koordination",
      }),
      c({
        level: 2,
        levelLabel: LEVEL_LABEL[2],
        title: "Skippings & Anfersen",
        graphicKey: "sprint-skipping",
        soGehts: [
          "Skipping: Knie hoch, kurzer Bodenkontakt",
          "Anfersen: Fersen ans Gesäß",
          "Je 2 × 15 m",
        ],
        daraufAchten: ["Rumpf stabil", "Vorfußlauf", "Arme 90°"],
        sicherheit: ["Locker beginnen, Tempo steigern"],
        material: ["15 m Bahn", "Markierung"],
        sozialform: "gruppe",
        fokus: "technik",
      }),
      c({
        level: 3,
        levelLabel: LEVEL_LABEL[3],
        title: "Tiefstart mit Startblock",
        graphicKey: "sprint-tiefstart",
        soGehts: [
          "Hände schulterbreit vor der Linie",
          "Knie auf hinterem Block",
          "Hüfte heben, auf Signal abdrücken",
        ],
        daraufAchten: ["Erste Schritte flach", "Kopf zunächst unten", "Kraftvolle Streckung"],
        sicherheit: ["Block fest fixieren"],
        material: ["Startblock", "30 m Bahn"],
        sozialform: "paar",
        fokus: "technik",
      }),
      c({
        level: 4,
        levelLabel: LEVEL_LABEL[4],
        title: "50 m Sprint auf Zeit",
        graphicKey: "sprint-ziel",
        soGehts: [
          "Tiefstart hinter der Linie",
          "Maximaltempo bis zur Ziellinie",
          "Locker auslaufen",
        ],
        daraufAchten: ["Aufrechter Sprint", "Blick zur Ziellinie", "Erst hinter Ziel abbremsen"],
        sicherheit: ["Bahn frei halten", "Auslaufzone min. 15 m"],
        material: ["50 m Bahn", "Stoppuhr"],
        sozialform: "paar",
        fokus: "ausdauer",
      }),
    ],
  },

  {
    sport: "leichtathletik",
    discipline: "weitsprung",
    title: "Weitsprung",
    subtitle: "Vom Anlauf zur sicheren Landung",
    cards: [
      c({
        level: 1,
        levelLabel: LEVEL_LABEL[1],
        title: "Standweitsprung",
        graphicKey: "weit-stand",
        soGehts: [
          "Füße hüftbreit hinter der Linie",
          "Arme schwingen, Knie beugen",
          "Mit beiden Beinen weit nach vorne",
        ],
        daraufAchten: ["Armschwung mitnehmen", "Beidbeinig landen", "Vorwärts in den Stand"],
        sicherheit: ["Weiche Landefläche"],
        material: ["Markierung", "Matte oder Sandgrube"],
        sozialform: "einzel",
        fokus: "kraft",
      }),
      c({
        level: 2,
        levelLabel: LEVEL_LABEL[2],
        title: "Absprung vom Markierungspunkt",
        graphicKey: "weit-absprung",
        soGehts: [
          "5 Schritte Anlauf zur Markierung",
          "Einbeiniger Absprung",
          "Knie hoch, dann landen",
        ],
        daraufAchten: ["Letzter Schritt schnell", "Absprung über Vorfuß", "Schwungbein aktiv"],
        sicherheit: ["Sandgrube/Matte geharkt"],
        material: ["Markierungsband", "Sandgrube oder Matte"],
        sozialform: "paar",
        fokus: "technik",
      }),
      c({
        level: 3,
        levelLabel: LEVEL_LABEL[3],
        title: "Anlauf + Hangsprung andeuten",
        graphicKey: "weit-flug",
        soGehts: [
          "7–9 Schritte Anlauf",
          "Absprung, kurz in der Luft strecken",
          "Beine vor der Landung anziehen",
        ],
        daraufAchten: ["Konstanter Anlauf", "Aufrechter Oberkörper", "Beine parallel zur Landung"],
        sicherheit: ["Helfer markiert Absprung", "Landefläche kontrollieren"],
        material: ["Anlaufbahn", "Sandgrube", "Markierung"],
        sozialform: "gruppe",
        fokus: "koordination",
      }),
      c({
        level: 4,
        levelLabel: LEVEL_LABEL[4],
        title: "Weitsprung mit voller Anlauflänge",
        graphicKey: "weit-landung",
        soGehts: [
          "Voller individueller Anlauf",
          "Kraftvoller Absprung am Balken",
          "Beidbeinige Landung in der Grube",
        ],
        daraufAchten: ["Absprung vor dem Balken", "Arme nach vorne reißen", "Nach vorn aus der Grube"],
        sicherheit: ["Grube vor jedem Sprung harken"],
        material: ["Anlaufbahn", "Absprungbalken", "Sandgrube"],
        sozialform: "gruppe",
        fokus: "technik",
      }),
    ],
  },

  {
    sport: "leichtathletik",
    discipline: "kugelstossen",
    title: "Kugelstoßen",
    subtitle: "Vom Halten zum Standstoß",
    cards: [
      c({
        level: 1,
        levelLabel: LEVEL_LABEL[1],
        title: "Kugel richtig halten",
        graphicKey: "kugel-griff",
        soGehts: [
          "Kugel auf Fingerwurzeln legen",
          "Daumen seitlich stützt",
          "Kugel am Hals unterhalb Kinn",
        ],
        daraufAchten: ["Handgelenk gerade", "Ellbogen hoch", "Schulter entspannt"],
        sicherheit: ["Niemals werfen — nur stoßen", "Wurfsektor frei"],
        material: ["Leichte Kugel (2–3 kg)"],
        sozialform: "paar",
        fokus: "technik",
      }),
      c({
        level: 2,
        levelLabel: LEVEL_LABEL[2],
        title: "Stoß aus dem Stand",
        graphicKey: "kugel-stand",
        soGehts: [
          "Stand seitlich, Gewicht auf hinterem Bein",
          "Hüfte nach vorne drehen",
          "Arm streckt explosiv",
        ],
        daraufAchten: ["Kugel bleibt am Hals", "Erst Beine, dann Arm", "Blick folgt der Kugel"],
        sicherheit: ["Mind. 10 m Sektor frei", "Erst auf Signal stoßen"],
        material: ["Kugel", "Markierte Stoßlinie"],
        sozialform: "gruppe",
        fokus: "technik",
      }),
      c({
        level: 3,
        levelLabel: LEVEL_LABEL[3],
        title: "Angehen mit Nachstellschritt",
        graphicKey: "kugel-drehung",
        soGehts: [
          "Rücken zur Stoßrichtung",
          "Nachstellschritt nach hinten",
          "Aus tiefer Position stoßen",
        ],
        daraufAchten: ["Tiefer Schwerpunkt", "Hüfte vor Schulter", "Druckbein erst spät strecken"],
        sicherheit: ["Sektor sichern", "Nur ein:e Stoßende:r zur Zeit"],
        material: ["Kugel", "Stoßkreis oder Markierung"],
        sozialform: "paar",
        fokus: "koordination",
      }),
      c({
        level: 4,
        levelLabel: LEVEL_LABEL[4],
        title: "Standstoß auf Weite",
        graphicKey: "kugel-stoss",
        soGehts: [
          "Stoßkreis betreten",
          "Stoß aus Standposition",
          "Stoßfeld nach Pfiff betreten",
        ],
        daraufAchten: ["Kugel vom Hals abdrücken", "Nach Stoß im Kreis bleiben", "Fuß nicht über Balken"],
        sicherheit: ["Sektor 100% frei", "Kugel nicht rollen"],
        material: ["Wettkampfkugel", "Stoßkreis", "Maßband"],
        sozialform: "gruppe",
        fokus: "kraft",
      }),
    ],
  },

  {
    sport: "leichtathletik",
    discipline: "staffel",
    title: "Staffel",
    subtitle: "Stab sicher übergeben",
    cards: [
      c({
        level: 1,
        levelLabel: LEVEL_LABEL[1],
        title: "Stabhalten & Mitlaufen",
        graphicKey: "staffel-halten",
        soGehts: [
          "Stab am Ende fest greifen",
          "Lockeres Traben über 30 m",
          "Stab am Körper halten",
        ],
        daraufAchten: ["Locker laufen", "Stab nicht schlenkern", "Blick nach vorne"],
        sicherheit: ["Genug Abstand zwischen Läufer:innen"],
        material: ["Staffelstab"],
        sozialform: "einzel",
        fokus: "koordination",
      }),
      c({
        level: 2,
        levelLabel: LEVEL_LABEL[2],
        title: "Übergabe im Stand",
        graphicKey: "staffel-stand",
        soGehts: [
          "Empfänger:in hält Hand nach hinten",
          "Stab von unten in die Hand legen",
          "Übergabe 10× üben",
        ],
        daraufAchten: ["Handfläche stabil", "Daumen unten", "Saubere Übergabe"],
        sicherheit: ["Festen Stand halten"],
        material: ["Staffelstab"],
        sozialform: "paar",
        fokus: "technik",
      }),
      c({
        level: 3,
        levelLabel: LEVEL_LABEL[3],
        title: "Übergabe im Lauf",
        graphicKey: "staffel-uebergabe",
        soGehts: [
          "Empfänger:in startet auf Marke",
          "Übergabe in Wechselzone",
          "Beide laufen am Ende durch",
        ],
        daraufAchten: ["Nicht abbremsen", "Hand stabil hinten", "Akustisches Signal: ‚Hep!‘"],
        sicherheit: ["Wechselzone klar markieren"],
        material: ["Staffelstab", "Markierungen für Wechselzone"],
        sozialform: "paar",
        fokus: "koordination",
      }),
      c({
        level: 4,
        levelLabel: LEVEL_LABEL[4],
        title: "4×50 m Staffellauf",
        graphicKey: "staffel-ziel",
        soGehts: [
          "4er Team mit Stab",
          "Übergabe in der Wechselzone",
          "Volle Geschwindigkeit bis ins Ziel",
        ],
        daraufAchten: ["Sauberer Wechsel", "Im richtigen Korridor", "Stab niemals werfen"],
        sicherheit: ["Bahnen einhalten", "Auslaufzone frei"],
        material: ["Staffelstab", "4 × 50 m Bahn", "Stoppuhr"],
        sozialform: "gruppe",
        fokus: "ausdauer",
      }),
    ],
  },

  // ====================== GERÄTETURNEN ======================
  {
    sport: "geraeteturnen",
    discipline: "reck",
    title: "Reck",
    subtitle: "Vom Hang zum Aufschwung",
    cards: [
      c({
        level: 1,
        levelLabel: LEVEL_LABEL[1],
        title: "Aktiver Hang",
        graphicKey: "reck-hang",
        soGehts: [
          "Ristgriff am schulterhohen Reck",
          "Schultern aktiv nach unten ziehen",
          "Körper gestreckt halten — 3×10 s",
        ],
        daraufAchten: ["Bauchspannung", "Schultern nicht hochziehen", "Beine geschlossen"],
        sicherheit: ["Matte unter Reck", "Kontrolliert absteigen"],
        material: ["Reck schulterhoch", "Turnmatte"],
        sozialform: "paar",
        fokus: "kraft",
      }),
      c({
        level: 2,
        levelLabel: LEVEL_LABEL[2],
        title: "Knie zur Stange",
        graphicKey: "reck-knee",
        soGehts: [
          "Aus dem Hang",
          "Knie zur Stange ziehen",
          "Stirn nähert sich dem Reck — 3×5 Wdh.",
        ],
        daraufAchten: ["Aktive Bauchspannung", "Bewusst absenken", "Atmung"],
        sicherheit: ["Nicht rückwärts fallen"],
        material: ["Reck schulterhoch", "Matte"],
        sozialform: "paar",
        fokus: "kraft",
      }),
      c({
        level: 3,
        levelLabel: LEVEL_LABEL[3],
        title: "Aufschwung mit Hilfe",
        graphicKey: "reck-hilfe",
        soGehts: [
          "Anhocken, Bauch ans Reck",
          "Helfer:in stützt Oberschenkel",
          "Drehung in den Stütz führen",
        ],
        daraufAchten: ["Kopf in Verlängerung", "Hüfte nah am Reck", "Endposition halten"],
        sicherheit: ["2 Helfer:innen seitlich", "Griff erst im Endstütz lösen"],
        material: ["Reck schulterhoch", "2 Matten", "Helfer:innen"],
        sozialform: "gruppe",
        fokus: "mut",
      }),
      c({
        level: 4,
        levelLabel: LEVEL_LABEL[4],
        title: "Hüftaufschwung frei",
        graphicKey: "reck-stuetz",
        soGehts: [
          "Kleiner Sprung, Bauch ans Reck",
          "Beine schwingen vor",
          "Hüfte zieht in den Stütz, 2 s halten",
        ],
        daraufAchten: ["Fester Griff", "Schultern über Reck", "Saubere Endposition"],
        sicherheit: ["Helfer:in in Reichweite", "Ggf. Magnesia"],
        material: ["Reck schulterhoch", "Matte"],
        sozialform: "paar",
        fokus: "technik",
      }),
    ],
  },

  {
    sport: "geraeteturnen",
    discipline: "barren",
    title: "Barren",
    subtitle: "Vom Stütz zum Stützschwingen",
    cards: [
      c({
        level: 1,
        levelLabel: LEVEL_LABEL[1],
        title: "Stütz halten",
        graphicKey: "barren-stuetz",
        soGehts: [
          "Auf Niederbarren in den Stütz",
          "Arme gestreckt, Schultern tief",
          "3 × 8 s halten",
        ],
        daraufAchten: ["Schultern weg von Ohren", "Bauch fest", "Beine geschlossen"],
        sicherheit: ["Matten unter Barren"],
        material: ["Niederbarren", "2 Matten"],
        sozialform: "paar",
        fokus: "kraft",
      }),
      c({
        level: 2,
        levelLabel: LEVEL_LABEL[2],
        title: "Kleiner Schwung",
        graphicKey: "barren-schwung-klein",
        soGehts: [
          "Aus dem Stütz",
          "Beine leicht vor- und zurückschwingen",
          "5 ruhige Wdh.",
        ],
        daraufAchten: ["Schultern über Holm", "Schwung aus Hüfte", "Arme gestreckt"],
        sicherheit: ["Helfer:in an der Hüfte"],
        material: ["Niederbarren", "Matten"],
        sozialform: "paar",
        fokus: "technik",
      }),
      c({
        level: 3,
        levelLabel: LEVEL_LABEL[3],
        title: "Großer Schwung mit Hilfe",
        graphicKey: "barren-schwung-gross",
        soGehts: [
          "Vor- und Rückschwung steigern",
          "Helfer:in unterstützt an Hüfte",
          "Bis Schulterhöhe schwingen",
        ],
        daraufAchten: ["Schultern stabil", "Saubere Endlage im Stütz", "Atmung"],
        sicherheit: ["Helfer:in bleibt während Schwung"],
        material: ["Niederbarren", "Matten", "Helfer:in"],
        sozialform: "gruppe",
        fokus: "koordination",
      }),
      c({
        level: 4,
        levelLabel: LEVEL_LABEL[4],
        title: "Stützschwingen frei",
        graphicKey: "barren-ziel",
        soGehts: [
          "Voller Schwung vor und zurück",
          "Mind. Schulterhöhe erreichen",
          "Sauber im Stütz enden",
        ],
        daraufAchten: ["Schultern aktiv", "Beine geschlossen", "Kontrolliertes Ausschwingen"],
        sicherheit: ["Matten beidseitig", "Helfer:in in Reichweite"],
        material: ["Barren", "Matten"],
        sozialform: "paar",
        fokus: "kraft",
      }),
    ],
  },

  {
    sport: "geraeteturnen",
    discipline: "balken",
    title: "Schwebebalken",
    subtitle: "Vom Gehen zum Sprung",
    cards: [
      c({
        level: 1,
        levelLabel: LEVEL_LABEL[1],
        title: "Balancegehen",
        graphicKey: "balken-gehen",
        soGehts: [
          "Auf Niederbalken vorwärts gehen",
          "Arme seitlich ausgestreckt",
          "Rückwärts zurück",
        ],
        daraufAchten: ["Blick auf Balkenende", "Fuß genau auf Balken", "Ruhige Atmung"],
        sicherheit: ["Matten neben Balken"],
        material: ["Niederbalken", "Matten"],
        sozialform: "einzel",
        fokus: "koordination",
      }),
      c({
        level: 2,
        levelLabel: LEVEL_LABEL[2],
        title: "Standwaage",
        graphicKey: "balken-waage",
        soGehts: [
          "Auf Balken stehen",
          "Ein Bein nach hinten strecken",
          "Oberkörper neigen, 5 s halten",
        ],
        daraufAchten: ["Bein und Rumpf bilden Linie", "Arme seitlich", "Blick nach vorn"],
        sicherheit: ["Niederbalken zuerst"],
        material: ["Niederbalken", "Matten"],
        sozialform: "paar",
        fokus: "koordination",
      }),
      c({
        level: 3,
        levelLabel: LEVEL_LABEL[3],
        title: "Strecksprung am Boden",
        graphicKey: "balken-strecksprung",
        soGehts: [
          "Am Boden Strecksprung üben",
          "Mit halber Drehung",
          "Auf Markierung landen",
        ],
        daraufAchten: ["Beidbeiniger Absprung", "Körper gestreckt", "Beidbeinige Landung"],
        sicherheit: ["Genug Platz"],
        material: ["Markierung am Boden"],
        sozialform: "gruppe",
        fokus: "technik",
      }),
      c({
        level: 4,
        levelLabel: LEVEL_LABEL[4],
        title: "Strecksprung mit Drehung",
        graphicKey: "balken-ziel",
        soGehts: [
          "Auf Balken Strecksprung",
          "180°-Drehung in der Luft",
          "Sauber auf Balken landen",
        ],
        daraufAchten: ["Aufrechter Körper", "Arme seitlich", "Blickfixpunkt"],
        sicherheit: ["Weichbodenmatte Pflicht", "Helfer:in seitlich"],
        material: ["Schwebebalken", "Weichbodenmatte"],
        sozialform: "paar",
        fokus: "mut",
      }),
    ],
  },

  {
    sport: "geraeteturnen",
    discipline: "boden",
    title: "Bodenturnen",
    subtitle: "Von der Wiege zur Rolle",
    cards: [
      c({
        level: 1,
        levelLabel: LEVEL_LABEL[1],
        title: "Wiege in Rückenlage",
        graphicKey: "boden-wiege",
        soGehts: [
          "In Rückenlage, Knie an Brust",
          "Vor- und zurückwiegen",
          "10 Wdh.",
        ],
        daraufAchten: ["Runder Rücken", "Kinn auf Brust", "Beine eng"],
        sicherheit: ["Weiche Matte"],
        material: ["Turnmatte"],
        sozialform: "einzel",
        fokus: "koordination",
      }),
      c({
        level: 2,
        levelLabel: LEVEL_LABEL[2],
        title: "Rolle auf schiefer Ebene",
        graphicKey: "boden-rolle-ansatz",
        soGehts: [
          "Matten an kleinen Kasten lehnen",
          "Aus Hocke abrollen",
          "5 Rollen abwärts",
        ],
        daraufAchten: ["Kinn auf Brust", "Hände schulterbreit", "Über Nacken abrollen"],
        sicherheit: ["Nie