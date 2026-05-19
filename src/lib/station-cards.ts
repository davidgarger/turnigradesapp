// Postenkarten-Generator für Leichtathletik & Geräteturnen.
// Inhalte = didaktische Standard-Vorübungen aus Allgemeinwissen
// (Lehrmittel Sporterziehung CH, mobilesport.ch-Logik).
// Lehrperson sollte Inhalte vor Einsatz fachlich prüfen.

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

export type StationCard = {
  title: string;
  ziel: string;
  material: string[];
  ablauf: string[];
  variationLeichter: string;
  variationSchwerer: string;
  sicherheit: string;
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

const mk = (
  title: string,
  ziel: string,
  material: string[],
  ablauf: string[],
  leichter: string,
  schwerer: string,
  sicherheit: string,
  videoSearch: string,
): StationCard => ({
  title,
  ziel,
  material,
  ablauf,
  variationLeichter: leichter,
  variationSchwerer: schwerer,
  sicherheit,
  videoSearch,
});

const POOL: Record<StationDiscipline, Record<StationLevel, StationCard[]>> = {
  // ============ LEICHTATHLETIK ============
  sprint: {
    unterstufe: [
      mk("Reaktionsstart aus dem Sitz", "Reaktionsschnelligkeit und schneller Startimpuls",
        ["Pfeife/Klatscher", "Hütchen (Start- und Ziellinie 10 m)"],
        ["Schüler sitzen mit Rücken zur Laufrichtung.", "Auf Pfiff aufstehen und 10 m sprinten.", "3 Sprints mit Pause."],
        "Aus dem Stand statt aus dem Sitz starten.",
        "Aus Bauchlage starten, Signal akustisch und optisch wechseln.",
        "Auslaufzone von 5 m frei halten, keine Wand am Ziel.",
        "Reaktionsspiele Sprint Grundschule"),
      mk("Tier-Sprints", "Beschleunigung und Bewegungsfreude",
        ["6 Hütchen", "Karten mit Tieren (Gepard, Frosch, Hase)"],
        ["Strecke 15 m abstecken.", "Pro Durchgang Tier ziehen.", "In Bewegungsart des Tiers sprinten."],
        "Strecke auf 10 m kürzen.",
        "Staffelform mit Übergabe einer Karte.",
        "Rutschfeste Schuhe, genügend Abstand.",
        "Sprintspiele Grundschule Tiere"),
    ],
    mittelstufe: [
      mk("Skippings am Ort und in Bewegung", "Saubere Sprinttechnik mit hoher Kniehebung",
        ["Koordinationsleiter oder 8 Markierungen", "Stoppuhr"],
        ["20 s Skippings am Ort, Knie auf Hüfthöhe.", "20 s Skippings über Leiter.", "15 m im Sprint auslaufen.", "3 Serien, 60 s Pause."],
        "Nur Skippings ohne Sprint.",
        "Skippings mit Armschwung betont, Strecke 25 m.",
        "Auf gerade Hüfte und entspannte Schultern achten.",
        "Sprint ABC Skippings Schule"),
      mk("Hochstart vs. Tiefstart", "Startvarianten kennen und vergleichen",
        ["Startlinie", "Ziellinie 20 m", "Stoppuhr"],
        ["2 Sprints aus Hochstart.", "2 Sprints aus Tiefstart.", "Zeiten notieren und vergleichen."],
        "Nur Hochstart, 15 m.",
        "Mit Startblöcken Tiefstart sauber üben.",
        "Knie und Sprunggelenke vorher mobilisieren.",
        "Tiefstart Hochstart Schule Leichtathletik"),
    ],
    oberstufe: [
      mk("Sprint-ABC-Parcours", "Sprinttechnik vertiefen (Kniehub, Anfersen, Sprunglauf)",
        ["Koordinationsleiter", "6 Hütchen", "Stoppuhr"],
        ["A: 15 m Anfersen.", "B: 15 m Kniehub.", "C: 15 m Sprunglauf.", "D: 30 m fliegender Sprint mit Zeit.", "2 Durchgänge."],
        "Jede Übung mit halber Strecke und gehender Pause.",
        "Sprunglauf mit Armschwung-Fokus, 40 m Sprintstrecke.",
        "Gründliches Aufwärmen vor explosiven Übungen.",
        "Lauf ABC Sprint Oberstufe"),
    ],
  },
  weitsprung: {
    unterstufe: [
      mk("Zonenweitsprung aus dem Stand", "Beidbeiniger Absprung und kontrollierte Landung",
        ["Mattenbahn oder Sandgrube", "Bodenmarkierungen Zonen 1–4"],
        ["Beidbeinig aus Stand in Zonen springen.", "Jede Zone gibt Punkte.", "5 Versuche, beste Weite zählt."],
        "Sprung von leichter Erhöhung (kleiner Kasten).",
        "Standweitsprung mit 90°-Drehung in der Luft.",
        "Landung immer auf Matte/Sand, Hände vorne.",
        "Standweitsprung Grundschule"),
    ],
    mittelstufe: [
      mk("Reifen-Rhythmus mit Absprung", "Anlauf-Rhythmus und sauberer einbeiniger Absprung",
        ["4–6 Gymnastikreifen", "Weitsprunggrube oder Mattenbahn"],
        ["Reifen im Schrittabstand legen, letzter Reifen = Absprungbein.", "Anlauf rhythmisch durch die Reifen.", "Einbeiniger Absprung, beidbeinige Landung.", "5 Versuche."],
        "Nur 3 Reifen, kürzerer Anlauf.",
        "Anlauf 6–8 Schritte, Sprung in Schrittstellung in der Luft.",
        "Absprungzone trocken, Landung weich.",
        "Weitsprung Anlauf Schule"),
    ],
    oberstufe: [
      mk("Schrittweitsprung mit Anlaufmarkierung", "Optimale Anlauflänge finden, Sprungweite steigern",
        ["Sandgrube", "Maßband", "Markierungen für Anlauf"],
        ["Anlauflänge mit 12–16 Schritten testen und markieren.", "3 Probeanläufe ohne Sprung.", "5 Sprünge mit Messung.", "Beste Weite notieren."],
        "Anlauf auf 8 Schritte verkürzen.",
        "Hang- oder Lauftechnik in der Luft probieren.",
        "Absprungbalken nicht überschreiten, Landung beidbeinig.",
        "Weitsprung Technik Oberstufe"),
    ],
  },
  hochsprung: {
    unterstufe: [
      mk("Springen über Gummiband", "Mut zum Sprung, beidbeinige Landung",
        ["Gummiband zwischen 2 Stangen", "Weichbodenmatte"],
        ["Band auf Kniehöhe spannen.", "Aus 3 Schritten Anlauf darüberspringen.", "Höhe schrittweise erhöhen.", "5 Versuche pro Höhe."],
        "Band tiefer, aus Stand springen.",
        "Höhe anpassen, einbeiniger Absprung.",
        "Immer Weichbodenmatte als Landung.",
        "Hochsprung Gummiband Schule"),
    ],
    mittelstufe: [
      mk("Scherensprung über Band", "Scherensprung-Technik einführen",
        ["Gummiband oder weiche Latte", "Weichbodenmatte"],
        ["Anlauf seitlich-schräg (5 Schritte).", "Innenbein schwingt zuerst über die Latte, Außenbein folgt.", "Landung auf Sprungbein, ablaufen.", "5 Versuche pro Höhe."],
        "Niedrige Höhe, nur Schwungbein-Übung am Boden.",
        "Höher legen, sauberere Scherenbewegung.",
        "Anlauf seitlich, nicht frontal.",
        "Scherensprung Hochsprung Schule"),
    ],
    oberstufe: [
      mk("Flop-Vorübung am Kasten", "Bogen-Anlauf und Rückenlage-Position",
        ["Hochsprunganlage mit Latte", "Weichbodenmatte", "Großer Kasten als Absprunghilfe"],
        ["Auf Kasten stehen, Rücken zur Matte, beidbeinig auf den Rücken in Flop-Position fallen.", "Dann mit 3-Schritt-Bogenanlauf einbeinig in Flop-Position springen.", "5 Versuche."],
        "Nur Fall vom Kasten in Rückenlage.",
        "Vollständiger 5-Schritt-Bogenanlauf über Latte.",
        "Nur auf Weichbodenmatte, nie auf normale Matte.",
        "Fosbury Flop Vorübungen Schule"),
    ],
  },
  kugelstossen: {
    unterstufe: [
      mk("Stoßen mit Medizinball", "Stoßbewegung lernen, Kraftübertragung",
        ["1–2 kg Medizinball pro Paar", "Markierungen für Zonen"],
        ["Paarweise gegenüber.", "Ball mit einer Hand vom Hals weg stoßen (nicht werfen).", "Partner fängt, stößt zurück.", "10 Stöße pro Seite."],
        "Leichteren Ball, kürzere Distanz.",
        "Schwererer Ball, Stoß aus seitlicher Stellung.",
        "Ellbogen hinter Ball, niemals Schwungwurf.",
        "Kugelstoßen Vorübung Medizinball"),
    ],
    mittelstufe: [
      mk("Standstoß mit Kugel", "Korrekte Stoßauslage und Streckung",
        ["Kugel 3 kg", "Stoßkreis oder Markierung", "Maßband"],
        ["Stoßauslage: Seitlich zur Stoßrichtung.", "Kugel am Hals, Ellbogen hoch.", "Aus Knie- und Hüftstreckung stoßen.", "5 Versuche, beste Weite zählt."],
        "Aus frontalem Stand stoßen.",
        "Mit Angleitschritt stoßen.",
        "Vor jedem Stoß Bereich vor sich kontrollieren.",
        "Kugelstoßen Technik Schule"),
    ],
    oberstufe: [
      mk("Angleittechnik nach O'Brien", "Vorbeschleunigung und Endstoß koppeln",
        ["Kugel 4–5 kg", "Stoßkreis", "Maßband"],
        ["Auslage: Rücken zur Stoßrichtung.", "Tiefe Hocke, Angleitschritt nach hinten.", "Aus Drehung und Streckung stoßen.", "5 Stöße, Weiten vergleichen."],
        "Nur Standstoß ohne Angleiten üben.",
        "Drehstoß-Technik probieren.",
        "Stoßbereich immer frei, Reihenfolge einhalten.",
        "Kugelstoßen Angleittechnik"),
    ],
  },
  ausdauer: {
    unterstufe: [
      mk("Linienlauf mit Aufgaben", "Spielerische Grundausdauer",
        ["Hallenlinien", "Kärtchen mit Aufgaben"],
        ["Auf Hallenlinien locker laufen.", "Bei Kreuzungen Karte ziehen (Hampelmann, 5 Hocksprünge).", "10 Minuten."],
        "Gehen statt laufen erlaubt.",
        "Tempo erhöhen, Aufgaben anspruchsvoller.",
        "Genügend Abstand, auf Mitschüler achten.",
        "Ausdauerspiele Grundschule"),
    ],
    mittelstufe: [
      mk("Tempogefühl-Lauf", "Konstantes Lauftempo entwickeln",
        ["Markierte Runde (200–400 m)", "Stoppuhr"],
        ["1. Runde: lockeres Tempo, Zeit messen.", "2. Runde: gleiche Zeit erreichen ohne Uhr.", "3. Runde: 10 % schneller.", "Reflexion in Paaren."],
        "Strecke halbieren.",
        "5 Runden mit Tempowechsel je Runde.",
        "Trinkpause nach Bedarf.",
        "Tempolauf Schule Ausdauer"),
    ],
    oberstufe: [
      mk("Intervalltraining 4×400 m", "Aerobe Ausdauer und Tempohärte",
        ["400-m-Runde oder markierte Strecke", "Stoppuhr"],
        ["4×400 m mit 90 s Trabpause.", "Ziel: konstante Zeit ±3 s.", "Zeiten notieren.", "Auslaufen 5 Minuten."],
        "3×300 m statt 4×400 m.",
        "6×400 m oder Pause verkürzen.",
        "Vorher 10 Minuten Einlaufen, gut hydriert.",
        "Intervalltraining 400m Schule"),
    ],
  },
  huerden: {
    unterstufe: [
      mk("Springen über Schaumstoffhindernisse", "Mut und Schrittrhythmus",
        ["4 weiche Hindernisse (Schaumblöcke)", "20 m Bahn"],
        ["Hindernisse im gleichen Abstand legen.", "Im Lauf darüberspringen.", "5 Durchgänge."],
        "Niedrigere Hindernisse, langsamer.",
        "Höhere Hindernisse, Tempo erhöhen.",
        "Nur weiche Hindernisse, keine Bananenkartons.",
        "Hürden Vorübung Grundschule"),
    ],
    mittelstufe: [
      mk("3-Schritt-Rhythmus über Mini-Hürden", "Konstanten Schrittrhythmus zwischen Hürden",
        ["5 Mini-Hürden (40 cm)", "Abstand 6 m"],
        ["3 Schritte zwischen jeder Hürde.", "Führbein und Nachziehbein bewusst.", "4 Durchgänge."],
        "Nur 3 Hürden, größerer Abstand.",
        "5-Schritt-Rhythmus, höhere Hürden.",
        "Hürden in Laufrichtung kippen.",
        "Hürdentechnik Schule Mittelstufe"),
    ],
    oberstufe: [
      mk("Hürdenlauf mit Zeitnahme", "Technik unter Tempo halten",
        ["6 Hürden (76 cm)", "Stoppuhr"],
        ["Anlauf 13 m, dann 6 Hürden im 3-Schritt-Rhythmus.", "3 Durchgänge mit Zeitnahme.", "Bestzeit notieren."],
        "Niedrigere Hürden, weniger Anzahl.",
        "Volle Wettkampfhöhe, längere Strecke.",
        "Erst mit guter Technik unter Tempo.",
        "Hürdenlauf Technik Oberstufe"),
    ],
  },

  // ============ GERÄTETURNEN ============
  boden: {
    unterstufe: [
      mk("Rolle vorwärts auf der schiefen Bahn", "Sichere Rollbewegung mit rundem Rücken",
        ["2 Turnmatten", "1 kleiner Kasten als schiefe Bahn"],
        ["Matten an Kasten anlehnen (schiefe Ebene).", "Aus Hocke abrollen, runder Rücken, Kinn auf Brust.", "5 Rollen, dann auf gerader Matte."],
        "Helfer stützt Nacken leicht.",
        "Rolle auf gerader Bahn ohne Hilfe.",
        "Kein Aufstützen mit Kopf, immer runder Rücken.",
        "Rolle vorwärts Grundschule Turnen"),
    ],
    mittelstufe: [
      mk("Handstand an Wand", "Handstand-Position mit Sicherheit erleben",
        ["2 Turnmatten", "Wand"],
        ["Aus Standwaage Hände setzen.", "Beine an Wand hochlaufen.", "10 s halten, kontrolliert abrollen.", "3 Versuche."],
        "Nur Standwaage und Beine an Wand stützen.",
        "Handstand frei mit Helfersicherung.",
        "Wand frei von Bildern, Helfer seitlich.",
        "Handstand lernen Schule"),
    ],
    oberstufe: [
      mk("Rad mit Aufschwung-Sequenz", "Rad rechts und links, anschließend Aufschwung",
        ["3 Turnmatten in Reihe"],
        ["Rad rechts.", "Rad links.", "Aufschwung aus Stand.", "Sequenz 3-mal turnen."],
        "Nur Rad rechts ohne Sequenz.",
        "Rad-Rad-Radwende kombinieren.",
        "Genug Platz seitlich, kein Material in Reichweite.",
        "Rad Aufschwung Bodenturnen"),
    ],
  },
  reck: {
    unterstufe: [
      mk("Hängen und Schaukeln", "Griffkraft und Körperspannung",
        ["Reck auf Brusthöhe", "Matte"],
        ["Im Ristgriff hängen.", "Vor- und zurückschaukeln.", "10 s halten, 3 Wiederholungen."],
        "Reck tiefer, Füße kurz am Boden.",
        "Im Hang Knie zum Bauch ziehen.",
        "Matte unter dem Reck, Helfer seitlich.",
        "Reck Hängen Grundschule"),
    ],
    mittelstufe: [
      mk("Hüftaufschwung mit Hilfe", "Hüftaufschwung in den Stütz",
        ["Reck schulterhoch", "2 Matten"],
        ["Anhocken, Bauch ans Reck.", "Helfer unterstützt Oberschenkel.", "In Stütz drehen, 3 s halten.", "5 Versuche."],
        "Helfer hebt Beine mehr, niedrigeres Reck.",
        "Hüftaufschwung ohne Hilfe.",
        "Immer 2 Helfer in Anfangsphase.",
        "Hüftaufschwung Reck Schule"),
    ],
    oberstufe: [
      mk("Hüftumschwung", "Schwungvolle Drehung um Reck im Stütz",
        ["Reck schulterhoch", "2 Matten"],
        ["Aus Stütz schwingen.", "Beine schließen, Rumpf um Stange ziehen.", "Wieder in Stütz enden.", "3 saubere Umschwünge."],
        "Mit Helferunterstützung am Rücken.",
        "Umschwung mit Beinschwung verbinden.",
        "Festen Griff prüfen, evtl. Magnesia.",
        "Hüftumschwung Reck Oberstufe"),
    ],
  },
  barren: {
    unterstufe: [
      mk("Stütz und Schwung", "Stützkraft und Körperhaltung",
        ["Niederbarren", "2 Matten"],
        ["In Stütz, Arme gestreckt.", "10 s halten.", "Aus Stütz vor- und zurückschwingen.", "3 Serien."],
        "Stütz nur 5 s, ohne Schwung.",
        "Stütz mit gestreckten Beinen, höherer Schwung.",
        "Matten beidseitig, Helfer am Hüftbereich.",
        "Barren Stütz Schule"),
    ],
    mittelstufe: [
      mk("Oberarmstand mit Hilfe", "Stützgleichgewicht im Oberarmstütz",
        ["Niederbarren", "Matten beidseitig"],
        ["In Oberarmstütz gehen.", "Beine senkrecht hochheben.", "5 s halten.", "Mit 2 Helfern an Beinen."],
        "Nur Oberarmstütz ohne Beine senkrecht.",
        "Oberarmstand 10 s, dann Rolle vorwärts.",
        "Immer 2 Helfer in der Lernphase.",
        "Oberarmstand Barren Schule"),
    ],
    oberstufe: [
      mk("Kippe in den Stütz", "Schwungvolles Aufrichten aus dem Hang",
        ["Niederbarren", "Matten"],
        ["Aus Hang im Stütz schwingen.", "Beine hoch, Hüfte heran.", "Kraftvoll in Stütz drücken.", "3 saubere Kippen."],
        "Helfer schiebt Hüfte.",
        "Kippe mit anschließendem Vorschwung.",
        "Helfer auch nach Stütz stehen lassen.",
        "Kippe Barren Oberstufe"),
    ],
  },
  sprung: {
    unterstufe: [
      mk("Aufknien und Aufhocken auf Kasten", "Sprung über Hindernis mit Aufstütz",
        ["Kasten 3 Teile", "Sprungbrett", "Matte"],
        ["Anlauf 5 Schritte.", "Mit Sprungbrett auf Kasten knien.", "Aufrichten, in den Stand springen, Landung mit Kn