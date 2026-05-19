// Stationenkarten-Generator: Übungsreihen, die schrittweise zur Zielübung führen.
// Quelle: didaktische Standard-Vorübungen (Lehrmittel Sporterziehung CH,
// mobilesport.ch-Logik). Bitte vor Einsatz fachlich prüfen.

export type StationSport = "leichtathletik" | "geraeteturnen";

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

// Schlüssel für vorhandene SVG-Strichmännchen-Grafiken.
// Wenn kein Key gesetzt ist, wird die Karte nur mit Text gezeigt.
export type GraphicKey =
  | "reck-hang"
  | "reck-knee-tuck"
  | "reck-hip-bar"
  | "reck-support"
  | "reck-umschwung-stuetz"
  | "reck-umschwung-knie"
  | "reck-umschwung-zug"
  | "reck-umschwung-end"
  | "boden-hocke"
  | "boden-rolle-ansatz"
  | "boden-rolle-mitte"
  | "boden-rolle-stand"
  | "sprung-anlauf"
  | "sprung-absprung"
  | "sprung-stuetz"
  | "sprung-landung";

export type ProgressionStep = {
  title: string;
  ziel: string;
  beschreibung: string; // kurze Bewegungsbeschreibung (1–2 Sätze)
  material?: string[];
  sicherheit?: string;
  graphicKey?: GraphicKey;
};

export type Progression = {
  id: string;
  sport: StationSport;
  discipline: StationDiscipline;
  levels: StationLevel[];
  target: string; // Name der Zielübung
  steps: ProgressionStep[]; // letzter Step = Zielübung
  videoSearch: string;
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
  sprung: "Sprung (Kasten/Bock)",
  schwebebalken: "Schwebebalken",
  ringe: "Ringe",
  minitramp: "Minitrampolin",
};

export const LEVEL_LABEL: Record<StationLevel, string> = {
  unterstufe: "Unterstufe (1.–4. Kl.)",
  mittelstufe: "Mittelstufe (5.–6. Kl.)",
  oberstufe: "Oberstufe (7.–9./10. Kl.)",
};

export const SPORT_LABEL: Record<StationSport, string> = {
  leichtathletik: "Leichtathletik",
  geraeteturnen: "Geräteturnen",
};

export const SPORT_TO_DISCIPLINES: Record<StationSport, StationDiscipline[]> = {
  leichtathletik: ["sprint", "weitsprung", "hochsprung", "kugelstossen", "ausdauer", "huerden"],
  geraeteturnen: ["boden", "reck", "barren", "sprung", "schwebebalken", "ringe", "minitramp"],
};

// Hilfsfunktion zur kompakten Definition.
const step = (
  title: string,
  ziel: string,
  beschreibung: string,
  extra?: { material?: string[]; sicherheit?: string; graphicKey?: GraphicKey },
): ProgressionStep => ({ title, ziel, beschreibung, ...extra });

// ============================================================
//  Übungsreihen – jede endet mit der Zielübung
// ============================================================

const PROGRESSIONS: Progression[] = [
  // ============ RECK ============
  {
    id: "reck-aufschwung",
    sport: "geraeteturnen",
    discipline: "reck",
    levels: ["mittelstufe", "oberstufe"],
    target: "Hüftaufschwung am Reck",
    videoSearch: "Hüftaufschwung Reck Vorübungen Schule",
    steps: [
      step(
        "Aktiver Hang",
        "Griffkraft und Körperspannung aufbauen",
        "Im Ristgriff am schulterhohen Reck hängen, Schultern aktiv nach unten ziehen, Körper gestreckt halten. 3×10 s.",
        {
          material: ["Reck schulterhoch", "Matte"],
          sicherheit: "Matte unter dem Reck, kontrolliert absteigen.",
          graphicKey: "reck-hang",
        },
      ),
      step(
        "Knie zur Stange ziehen",
        "Hüfte schließen, Bauchspannung",
        "Aus dem Hang die Knie hoch zur Stange ziehen, Stirn nähert sich der Stange. 3×5 Wdh.",
        {
          material: ["Reck schulterhoch", "Matte"],
          sicherheit: "Bewusst absenken, nicht rückwärts fallen lassen.",
          graphicKey: "reck-knee-tuck",
        },
      ),
      step(
        "Hüftaufschwung mit Hilfe",
        "Drehung um die Stange spüren",
        "Anhocken, Bauch ans Reck. Helfer:in stützt Oberschenkel und führt die Drehung in den Stütz. 5 Versuche.",
        {
          material: ["Reck schulterhoch", "2 Matten", "1–2 Helfer:innen"],
          sicherheit: "Zwei Helfer:innen seitlich; Griff erst nach Endstütz lösen.",
          graphicKey: "reck-hip-bar",
        },
      ),
      step(
        "Hüftaufschwung frei – Zielübung",
        "Selbständig aus dem Sprung in den Stütz",
        "Aus kleinem Sprung Bauch ans Reck, Beine schwingen vor, Hüfte zieht über die Stange in den Stütz. 3 saubere Versuche, je 2 s im Stütz halten.",
        {
          material: ["Reck schulterhoch", "Matte"],
          sicherheit: "Helfer:in in Reichweite, fester Griff, ggf. Magnesia.",
          graphicKey: "reck-support",
        },
      ),
    ],
  },
  {
    id: "reck-umschwung",
    sport: "geraeteturnen",
    discipline: "reck",
    levels: ["oberstufe"],
    target: "Hüftumschwung am Reck",
    videoSearch: "Hüftumschwung Reck Vorübungen Schule",
    steps: [
      step(
        "Sicherer Stütz",
        "Stützkraft und Körperhaltung",
        "Aus Aufschwung in Stütz halten, Schultern über Reck, Blick geradeaus. 3×8 s.",
        { material: ["Reck schulterhoch", "Matte"], graphicKey: "reck-umschwung-stuetz" },
      ),
      step(
        "Knie heran, Hüfte abklappen",
        "Hüfte ans Reck führen",
        "Aus Stütz Knie eng an Stange ziehen, Hüfte zur Stange abklappen, Kopf in Verlängerung. 5 Wdh.",
        { material: ["Reck schulterhoch", "Matte"], graphicKey: "reck-umschwung-knie" },
      ),
      step(
        "Umschwung mit Hilfe",
        "Drehung kontrollieren",
        "Helfer:in steht seitlich, schiebt Rücken/Hüfte um die Stange in den Stütz. 5 Versuche.",
        {
          material: ["Reck schulterhoch", "2 Matten", "Helfer:in"],
          sicherheit: "Hand am unteren Rücken, beim Endstütz halten.",
          graphicKey: "reck-umschwung-zug",
        },
      ),
      step(
        "Hüftumschwung frei – Zielübung",
        "Schwungvolle Drehung in den Stütz",
        "Aus Stütz Beine vorschwingen, Hüfte aktiv an Stange ziehen, Rumpf um die Stange in den Stütz. 3 saubere Umschwünge.",
        {
          material: ["Reck schulterhoch", "Matte"],
          sicherheit: "Fester Griff prüfen, Helfer:in in Reichweite.",
          graphicKey: "reck-umschwung-end",
        },
      ),
    ],
  },

  // ============ BODEN ============
  {
    id: "boden-rolle-vw",
    sport: "geraeteturnen",
    discipline: "boden",
    levels: ["unterstufe", "mittelstufe"],
    target: "Rolle vorwärts in den Stand",
    videoSearch: "Rolle vorwärts Schule Vorübungen",
    steps: [
      step(
        "Wiege in Rückenlage",
        "Runder Rücken spüren",
        "Auf Matte in Rückenlage, Knie an Brust, vor- und zurückwiegen. 10 Wdh.",
        { material: ["Turnmatte"], graphicKey: "boden-hocke" },
      ),
      step(
        "Rolle auf schiefer Ebene",
        "Drehimpuls erleichtern",
        "Matten an kleinen Kasten lehnen. Aus Hocke abrollen, Kinn auf Brust. 5 Rollen.",
        {
          material: ["2 Matten", "Kleiner Kasten"],
          sicherheit: "Helfer:in stützt Nacken leicht, nie auf Kopf abstützen.",
          graphicKey: "boden-rolle-ansatz",
        },
      ),
      step(
        "Rolle auf gerader Bahn",
        "Bewegung ohne Hilfsmittel",
        "Aus Hocke abrollen über Nacken/Rücken, weich landen. 5 Versuche.",
        { material: ["2 Turnmatten"], graphicKey: "boden-rolle-mitte" },
      ),
      step(
        "Rolle in den Stand – Zielübung",
        "Schwungvoll in den Stand aufstehen",
        "Aus Hocke abrollen, Beine eng anziehen, mit Armen Schwung holen und ohne Aufstützen in den Stand. 3 saubere Versuche.",
        {
          material: ["2 Turnmatten"],
          sicherheit: "Runder Rücken, Kinn auf Brust.",
          graphicKey: "boden-rolle-stand",
        },
      ),
    ],
  },
  {
    id: "boden-handstand",
    sport: "geraeteturnen",
    discipline: "boden",
    levels: ["mittelstufe", "oberstufe"],
    target: "Handstand mit Abrollen",
    videoSearch: "Handstand lernen Schule Abrollen",
    steps: [
      step(
        "Bankposition",
        "Schultern aktivieren, Körperspannung",
        "Im Vierfüßlerstand Schultern über Händen, Bauch fest. 30 s halten.",
        { material: ["Turnmatte"] },
      ),
      step(
        "Beine an Wand hochlaufen",
        "Handstand-Position kennenlernen",
        "Aus Stütz Hände nahe Wand, Füße an Wand hochlaufen bis Körper gestreckt. 3×10 s.",
        {
          material: ["2 Matten", "Wand"],
          sicherheit: "Hände schulterbreit, Blick zwischen Hände.",
        },
      ),
      step(
        "Handstand mit Helfer:in",
        "Frei stehen lernen",
        "Aus Standwaage in Handstand schwingen, Helfer:in fängt Beine. 5 Versuche.",
        {
          material: ["2 Matten", "Helfer:in"],
          sicherheit: "Helfer:in seitlich, beide Beine sichern.",
        },
      ),
      step(
        "Handstand + Abrollen – Zielübung",
        "Sicher beenden",
        "Handstand erreichen, kontrolliert über runden Rücken in Rolle vorwärts abrollen, in Stand aufstehen. 3 Versuche.",
        {
          material: ["2 Matten", "Helfer:in"],
          sicherheit: "Kinn auf Brust beim Abrollen, nie über Wirbelsäule kippen.",
        },
      ),
    ],
  },

  // ============ BARREN ============
  {
    id: "barren-kippe",
    sport: "geraeteturnen",
    discipline: "barren",
    levels: ["oberstufe"],
    target: "Kippe in den Stütz",
    videoSearch: "Kippe Barren Schule Vorübungen",
    steps: [
      step("Stütz halten", "Stützkraft", "Im Stütz auf Niederbarren 10 s halten, Schultern tief. 3 Serien.", {
        material: ["Niederbarren", "2 Matten"],
      }),
      step(
        "Vor- und Rückschwung",
        "Schwung im Stütz kontrollieren",
        "Aus Stütz locker vor- und zurückschwingen, Beine geschlossen. 5×.",
        { material: ["Niederbarren", "2 Matten"] },
      ),
      step(
        "Kippe mit Hilfe",
        "Aufrichten aus dem Hang",
        "Aus Hang Beine hoch zur Stange, Helfer:in schiebt Hüfte, Druck auf Stange in Stütz. 5 Versuche.",
        {
          material: ["Niederbarren", "Matten", "Helfer:in"],
          sicherheit: "Helfer:in bleibt auch im Stütz stehen.",
        },
      ),
      step(
        "Kippe frei – Zielübung",
        "Schwungvolles Aufrichten",
        "Aus Hang Beine zur Stange führen, kraftvoll in Stütz drücken, Endstütz halten. 3 saubere Kippen.",
        { material: ["Niederbarren", "Matten"] },
      ),
    ],
  },
  {
    id: "barren-stuetz",
    sport: "geraeteturnen",
    discipline: "barren",
    levels: ["unterstufe", "mittelstufe"],
    target: "Stützschwingen auf Barren",
    videoSearch: "Barren Stütz Schwingen Schule",
    steps: [
      step("Sitz im Barren", "Erstes Vertrautwerden", "Auf Holmen sitzen, Hände rechts/links abstützen. 30 s.", {
        material: ["Niederbarren", "Matten"],
      }),
      step("Stütz statisch", "Stützkraft", "Im Stütz Arme gestreckt, Schultern tief, 8 s halten. 3 Serien.", {
        material: ["Niederbarren", "Matten"],
      }),
      step(
        "Kleiner Schwung",
        "Schwung initiieren",
        "Aus Stütz Beine leicht vor/zurück schwingen, Schultern bleiben über Holm. 5×.",
        { material: ["Niederbarren", "Matten"], sicherheit: "Helfer:in an Hüfte." },
      ),
      step(
        "Stützschwingen – Zielübung",
        "Voller kontrollierter Schwung",
        "Aus Stütz Beine kraftvoll vor- und zurückschwingen, mind. Schulterhöhe, sauber im Stütz enden. 3×.",
        { material: ["Niederbarren", "Matten"] },
      ),
    ],
  },

  // ============ SPRUNG (Kasten/Bock) ============
  {
    id: "sprung-hocke",
    sport: "geraeteturnen",
    discipline: "sprung",
    levels: ["mittelstufe", "oberstufe"],
    target: "Sprunghocke über Kasten quer",
    videoSearch: "Sprunghocke Kasten Schule Vorübungen",
    steps: [
      step(
        "Anlauf rhythmisieren",
        "Konstanter Anlauf",
        "7 Schritte Anlauf, beidbeinig auf Brett, hoch springen, weich landen. 5 Versuche.",
        { material: ["Sprungbrett", "Matte"], graphicKey: "sprung-anlauf" },
      ),
      step(
        "Absprung vom Brett",
        "Explosiver Absprung",
        "Aus 5 Schritten Anlauf vom Brett strecksprung, Arme reißen hoch. 5×.",
        { material: ["Sprungbrett", "Weichbodenmatte"], graphicKey: "sprung-absprung" },
      ),
      step(
        "Aufhocken auf Kasten",
        "Stütz und Hocke koppeln",
        "Anlauf 5 Schritte, vom Brett auf Kasten hocken, Hände stützen. Aufrichten, abspringen. 5×.",
        { material: ["Kasten 3 Teile", "Sprungbrett", "Matte"], graphicKey: "sprung-stuetz" },
      ),
      step(
        "Sprunghocke – Zielübung",
        "Vollständige Hocke über Kasten",
        "Anlauf, Brettabsprung, Hände stützen auf Kasten, Beine zwischen Hände hocken, sauber landen. 5 saubere Sprünge.",
        {
          material: ["Kasten 4 Teile quer", "Sprungbrett", "2 Matten"],
          sicherheit: "Helfer:in am Oberarm, nie am Hals greifen.",
          graphicKey: "sprung-landung",
        },
      ),
    ],
  },

  // ============ SCHWEBEBALKEN ============
  {
    id: "balken-strecksprung",
    sport: "geraeteturnen",
    discipline: "schwebebalken",
    levels: ["mittelstufe", "oberstufe"],
    target: "Strecksprung mit halber Drehung auf Balken",
    videoSearch: "Strecksprung Drehung Schwebebalken Schule",
    steps: [
      step("Balancegehen", "Gleichgewicht", "Auf Balken vor und zurück gehen, Arme seitlich. 3 Durchgänge.", {
        material: ["Niederbalken", "Matten"],
      }),
      step("Standwaage", "Statisches Gleichgewicht", "Standwaage je Bein 5 s halten. 3 Versuche pro Seite.", {
        material: ["Niederbalken", "Matten"],
      }),
      step("Strecksprung am Boden", "Sprung mit Drehung üben", "Am Boden Strecksprung mit 180°-Drehung, sauber landen. 5×.", {
        material: ["Bodenmarkierung"],
      }),
      step(
        "Strecksprung mit Drehung – Zielübung",
        "Sprung auf Balken kontrolliert",
        "Auf Balken Strecksprung mit 180°-Drehung, sauber auf Balken landen, Arme seitlich. 5 Versuche.",
        {
          material: ["Schwebebalken", "Weichbodenmatte"],
          sicherheit: "Weichbodenmatte unter Balken Pflicht.",
        },
      ),
    ],
  },

  // ============ RINGE ============
  {
    id: "ringe-sturzhang",
    sport: "geraeteturnen",
    discipline: "ringe",
    levels: ["mittelstufe", "oberstufe"],
    target: "Sturzhang in den Ringen",
    videoSearch: "Sturzhang Ringe Schule",
    steps: [
      step("Aktiver Hang", "Schultern aktivieren", "In Ringen hängen, Schultern nach unten ziehen. 3×10 s.", {
        material: ["Ringe", "Matte"],
      }),
      step("Knie hochziehen", "Bauchspannung", "Im Hang Knie zur Brust ziehen, kontrolliert absenken. 3×8 Wdh.", {
        material: ["Ringe", "Matte"],
      }),
      step("Beine durch Ringe", "Inversion vorbereiten", "Beine zwischen den Ringen nach hinten oben strecken (kurz), wieder absenken. 5×.", {
        material: ["Ringe", "Matte"],
        sicherheit: "Helfer:in führt Beine.",
      }),
      step(
        "Sturzhang – Zielübung",
        "Inversion halten",
        "Beine durch Ringe nach oben strecken, Sturzhang 5 s halten, kontrolliert in Streckhang ablassen. 3 Versuche.",
        {
          material: ["Ringe", "Matte"],
          sicherheit: "Helfer:in steht hinter Schüler:in, Matten unter Ringen.",
        },
      ),
    ],
  },

  // ============ MINITRAMP ============
  {
    id: "minitramp-strecksprung",
    sport: "geraeteturnen",
    discipline: "minitramp",
    levels: ["unterstufe", "mittelstufe"],
    target: "Strecksprung vom Minitramp",
    videoSearch: "Minitramp Strecksprung Schule",
    steps: [
      step("Auf Tramp federn", "Tramp-Gefühl", "Aus Stand auf Tramp beidbeinig federn. 10×.", {
        material: ["Minitrampolin", "Weichbodenmatte"],
      }),
      step("Anlauf 3 Schritte", "Sicherer Aufsprung", "3 Schritte Anlauf, beidbeinig auf Tramp, federn, kontrolliert absteigen. 5×.", {
        material: ["Minitrampolin", "Weichbodenmatte"],
      }),
      step("Niedersprung in Matte", "Landung üben", "Vom Tramp in Weichbodenmatte springen, in Knie federn. 5×.", {
        material: ["Minitrampolin", "Weichbodenmatte"],
      }),
      step(
        "Strecksprung – Zielübung",
        "Voller Strecksprung mit sicherer Landung",
        "Anlauf 5 Schritte, vom Tramp Strecksprung mit Armzug, Landung beidbeinig in Weichbodenmatte. 5 Sprünge.",
        {
          material: ["Minitrampolin", "Weichbodenmatte"],
          sicherheit: "Helfer:in am Mattenrand, nie auf harten Boden landen.",
        },
      ),
    ],
  },
  {
    id: "minitramp-salto",
    sport: "geraeteturnen",
    discipline: "minitramp",
    levels: ["oberstufe"],
    target: "Salto vorwärts in Weichbodenmatte",
    videoSearch: "Salto vorwärts Minitramp Schule",
    steps: [
      step("Strecksprung sicher", "Basis sichern", "Vom Tramp Strecksprung in Matte, beidbeinig landen. 5×.", {
        material: ["Minitrampolin", "Weichbodenmatte"],
      }),
      step("Hocksprung in Matte", "Knie zur Brust ziehen", "Vom Tramp Hocksprung, Knie zur Brust, Landung auf Füße. 5×.", {
        material: ["Minitrampolin", "Weichbodenmatte"],
      }),
      step("Rolle vw. von erhöhter Position", "Drehimpuls erleben", "Von kleinem Kasten Rolle vorwärts in Weichbodenmatte. 5×.", {
        material: ["Kleiner Kasten", "Weichbodenmatte"],
      }),
      step(
        "Salto vorwärts – Zielübung",
        "Volle Drehung in Weichbodenmatte",
        "Anlauf 9 Schritte, vom Tramp abdrücken, Knie zur Brust, Rolle/Salto in Weichbodenmatte. 3 saubere Versuche.",
        {
          material: ["Minitrampolin", "Große Weichbodenmatte", "2 Helfer:innen"],
          sicherheit: "Pflicht: 2 Helfer:innen seitlich, Lehrperson sichert mit.",
        },
      ),
    ],
  },

  // ============ LEICHTATHLETIK ============
  // SPRINT
  {
    id: "sprint-tiefstart",
    sport: "leichtathletik",
    discipline: "sprint",
    levels: ["mittelstufe", "oberstufe"],
    target: "Tiefstart über 30 m",
    videoSearch: "Tiefstart Sprint Schule Vorübungen",
    steps: [
      step("Reaktion aus dem Sitz", "Reaktionsschnelligkeit", "Auf Pfiff aus dem Sitz aufstehen und 10 m sprinten. 3×.", {
        material: ["Pfeife", "Hütchen"],
      }),
      step("Hochstart 20 m", "Startimpuls aufrecht", "Aus Hochstart 20 m sprinten, 4 Versuche, Zeit notieren.", {
        material: ["Stoppuhr", "Hütchen"],
      }),
      step("Tiefstart ohne Blöcke", "Position lernen", "Aus Tiefstart (Hände hinter Linie, Knie auf Boden) 15 m sprinten. 4×.", {
        material: ["Startlinie"],
      }),
      step(
        "Tiefstart 30 m – Zielübung",
        "Vollständiger Tiefstart mit Zeit",
        "Aus Tiefstart auf Kommando 'Auf die Plätze – Fertig – Los' 30 m sprinten. 3 Versuche, Bestzeit notieren.",
        { material: ["Startblöcke o. Markierung", "Stoppuhr", "Ziellinie"] },
      ),
    ],
  },

  // WEITSPRUNG
  {
    id: "weitsprung-schritt",
    sport: "leichtathletik",
    discipline: "weitsprung",
    levels: ["mittelstufe", "oberstufe"],
    target: "Schrittweitsprung mit Anlauf",
    videoSearch: "Schrittweitsprung Anlauf Schule",
    steps: [
      step("Standweitsprung", "Beidbeiniger Absprung", "Aus Stand mit Armschwung beidbeinig weit springen. 5 Versuche.", {
        material: ["Sandgrube o. Mattenbahn"],
      }),
      step("Reifen-Rhythmus", "Anlaufrhythmus", "Durch 4 Reifen rhythmisch laufen, letzter = Absprungbein. 5×.", {
        material: ["4 Reifen", "Mattenbahn"],
      }),
      step("Einbeiniger Absprung", "Absprungbein finden", "Mit 6 Schritten Anlauf einbeinig abspringen, beidbeinig landen. 5×.", {
        material: ["Sandgrube", "Markierung"],
      }),
      step(
        "Schrittweitsprung – Zielübung",
        "Volle Weite mit Schrittstellung",
        "Anlauf 12 Schritte, einbeinig abspringen, in der Luft Schrittstellung, beidbeinig in Sand landen. 5 Versuche.",
        { material: ["Sandgrube", "Maßband", "Anlaufmarkierung"] },
      ),
    ],
  },

  // HOCHSPRUNG
  {
    id: "hochsprung-flop",
    sport: "leichtathletik",
    discipline: "hochsprung",
    levels: ["oberstufe"],
    target: "Fosbury Flop über Latte",
    videoSearch: "Fosbury Flop Schule Vorübungen",
    steps: [
      step("Sprung über Gummiband", "Mut", "Aus 3 Schritten Anlauf über Gummiband, beidbeinige Landung auf Weichbodenmatte. 5×.", {
        material: ["Gummiband", "Weichbodenmatte"],
      }),
      step("Scherensprung", "Schwungbein einsetzen", "Seitlich-schräger Anlauf, Innenbein schwingt zuerst über Band. 5×.", {
        material: ["Gummiband", "Weichbodenmatte"],
      }),
      step("Flop-Fall vom Kasten", "Rückenlage spüren", "Auf Kasten stehend rückwärts in Flop-Position auf Weichbodenmatte fallen. 5×.", {
        material: ["Großer Kasten", "Weichbodenmatte"],
        sicherheit: "Nur auf Weichbodenmatte, nie auf normale Matte.",
      }),
      step(
        "Fosbury Flop – Zielübung",
        "Vollständiger Flop über Latte",
        "Bogenanlauf 5 Schritte, einbeinig abspringen, Rücken über Latte, Beine nachziehen, Landung auf Weichbodenmatte. 5 Versuche.",
        { material: ["Hochsprunganlage mit Latte", "Weichbodenmatte"] },
      ),
    ],
  },

  // KUGELSTOSSEN
  {
    id: "kugel-standstoss",
    sport: "leichtathletik",
    discipline: "kugelstossen",
    levels: ["mittelstufe", "oberstufe"],
    target: "Standstoß mit Kugel aus Auslage",
    videoSearch: "Kugelstoßen Standstoß Schule",
    steps: [
      step("Medizinball-Stoß", "Stoßbewegung", "Paarweise Medizinball mit einer Hand vom Hals weg stoßen. 10×.", {
        material: ["1–2 kg Medizinball"],
        sicherheit: "Nie werfen, immer stoßen.",
      }),
      step("Stoß aus Frontstand", "Bein- und Hüftstreckung", "Mit Kugel frontal zur Stoßrichtung aus Knie- und Hüftstreckung stoßen. 5×.", {
        material: ["Kugel 3 kg", "Markierung"],
      }),
      step("Stoßauslage seitlich", "Auslage einnehmen", "Seitlich zur Stoßrichtung, Kugel am Hals, Ellbogen hoch — Position 5× einnehmen und korrigieren.", {
        material: ["Kugel 3 kg"],
      }),
      step(
        "Standstoß – Zielübung",
        "Korrekter Stoß mit Weitenmessung",
        "Aus Stoßauslage seitlich, Knie- und Hüftstreckung, Ellbogen hinter Kugel, kraftvoll stoßen. 5 Versuche, beste Weite notieren.",
        {
          material: ["Kugel 3 kg", "Stoßkreis", "Maßband"],
          sicherheit: "Bereich vor sich kontrollieren, Reihenfolge einhalten.",
        },
      ),
    ],
  },

  // AUSDAUER
  {
    id: "ausdauer-tempo",
    sport: "leichtathletik",
    discipline: "ausdauer",
    levels: ["mittelstufe", "oberstufe"],
    target: "Konstanter 12-Minuten-Lauf",
    videoSearch: "Cooper Test Schule Tempogefühl",
    steps: [
      step("Linienlauf", "Lockeres Einlaufen", "5 Minuten auf Hallenlinien locker laufen.", {
        material: ["Hallenlinien"],
      }),
      step("Tempolauf 1 Runde", "Tempogefühl", "1 Runde (200–400 m) locker, Zeit messen.", {
        material: ["Markierte Runde", "Stoppuhr"],
      }),
      step("3-Runden-Test", "Tempo halten", "3 Runden gleiches Tempo, Zeiten vergleichen.", {
        material: ["Markierte Runde", "Stoppuhr"],
      }),
      step(
        "12-Minuten-Lauf – Zielübung",
        "Maximale Strecke in konstantem Tempo",
        "12 Minuten ohne Gehpause möglichst weit laufen, Runden zählen. Strecke = Runden × Länge.",
        {
          material: ["Markierte Runde", "Stoppuhr"],
          sicherheit: "Trinkpause danach, bei Schwindel sofort abbrechen.",
        },
      ),
    ],
  },

  // HÜRDEN
  {
    id: "huerden-rhythmus",
    sport: "leichtathletik",
    discipline: "huerden",
    levels: ["mittelstufe", "oberstufe"],
    target: "Hürdenlauf über 6 Hürden im 3-Schritt-Rhythmus",
    videoSearch: "Hürdenlauf Schule 3 Schritt Rhythmus",
    steps: [
      step("Sprung über Schaumstoff", "Mut", "Über 4 weiche Hindernisse springen. 5×.", {
        material: ["4 Schaumblöcke"],
      }),
      step("Führbein-Übung", "Technik einüben", "Seitlich an niedriger Hürde Führbein über die Hürde ziehen. 5× pro Seite.", {
        material: ["Mini-Hürden"],
      }),
      step("3 Mini-Hürden 3-Schritt", "Rhythmus finden", "Über 3 Hürden im 3-Schritt-Rhythmus laufen. 4×.", {
        material: ["3 Mini-Hürden (40 cm)"],
      }),
      step(
        "6 Hürden – Zielübung",
        "Voller Hürdenlauf mit Zeitnahme",
        "Anlauf 13 m, 6 Hürden im 3-Schritt-Rhythmus, Ziel sprinten. 3 Versuche, Bestzeit notieren.",
        {
          material: ["6 Hürden (60–76 cm)", "Stoppuhr"],
          sicherheit: "Hürden in Laufrichtung kippen können.",
        },
      ),
    ],
  },
];

// =========================================================
//  Public API
// =========================================================

export function listProgressions(
  sport: StationSport,
  discipline: StationDiscipline,
  level: StationLevel,
): Progression[] {
  return PROGRESSIONS.filter(
    (p) => p.sport === sport && p.discipline === discipline && p.levels.includes(level),
  );
}

export function getProgression(id: string): Progression | undefined {
  return PROGRESSIONS.find((p) => p.id === id);
}

export function listDisciplinesForSport(sport: StationSport): StationDiscipline[] {
  return SPORT_TO_DISCIPLINES[sport];
}

// QR-Code-URL (kein extra NPM-Package).
export function buildVideoQrUrl(videoSearch: string, override?: string): string {
  const target =
    override && override.trim().length > 0
      ? override.trim()
      : `https://www.youtube.com/results?search_query=${encodeURIComponent(videoSearch)}`;
  const encoded = encodeURIComponent(target);
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&data=${encoded}`;
}
