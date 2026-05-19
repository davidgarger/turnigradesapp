// Vorlagen für Arbeitsaufträge bei Schülern, die nicht mitturnen.
// Einfache, schülergerechte Sprache. Pro Sportart und Auftragstyp mehrere
// Varianten, damit "Zufällig" abwechslungsreich bleibt. Komplett offline.

export type Sport =
  | "basketball"
  | "fussball"
  | "geraeteturnen"
  | "leichtathletik"
  | "allgemein";

export type TaskType =
  | "beobachtung"
  | "regeln"
  | "technik"
  | "reflexion"
  | "lueckentext"
  | "quiz"
  | "steckbrief"
  | "sportgeschichte"
  | "zufaellig";

export type Status = "entschuldigt" | "unentschuldigt" | "turnzeug_vergessen";

export const SPORT_LABEL: Record<Sport, string> = {
  basketball: "Basketball",
  fussball: "Fußball",
  geraeteturnen: "Geräteturnen",
  leichtathletik: "Leichtathletik",
  allgemein: "Allgemein",
};

export const TASK_LABEL: Record<TaskType, string> = {
  beobachtung: "Beobachtung",
  regeln: "Regeln",
  technik: "Technik",
  reflexion: "Reflexion",
  lueckentext: "Lückentext",
  quiz: "Quiz",
  steckbrief: "Steckbrief Persönlichkeit",
  sportgeschichte: "Sportgeschichte",
  zufaellig: "Zufällig",
};

export const STATUS_LABEL: Record<Status, string> = {
  entschuldigt: "entschuldigt",
  unentschuldigt: "nicht entschuldigt",
  turnzeug_vergessen: "Turnzeug vergessen",
};

type TaskSet = {
  tasks: string[]; // wir wählen 3 davon
  closing: string;
};

const POOL: Record<
  Sport,
  Record<"beobachtung" | "regeln" | "technik" | "reflexion", TaskSet[]>
> = {
  basketball: {
    beobachtung: [
      {
        tasks: [
          "Beobachte zwei Mitschüler genau. Wie oft passen sie den Ball richtig zu?",
          "Schreibe auf, welche Spielerin oder welcher Spieler heute besonders fair spielt.",
          "Zähle, wie viele Körbe in 10 Minuten geworfen werden.",
          "Notiere drei gute Aktionen, die du heute siehst.",
          "Achte auf das Dribbling: Wer hat den Ball gut unter Kontrolle?",
        ],
        closing: "Was hat dir beim Zuschauen am besten gefallen?",
      },
    ],
    regeln: [
      {
        tasks: [
          "Schreibe drei wichtige Regeln im Basketball auf.",
          "Erkläre kurz, was ein „Foul“ ist.",
          "Was bedeutet „Schrittfehler“? Schreibe es in eigenen Worten.",
          "Wie viele Spieler einer Mannschaft sind gleichzeitig auf dem Feld?",
          "Was zählt mehr: ein Korb von weit weg oder ein Korb von nah? Warum?",
        ],
        closing: "Welche Regel findest du am wichtigsten? Warum?",
      },
    ],
    technik: [
      {
        tasks: [
          "Beschreibe in drei Schritten, wie man richtig einen Korb wirft.",
          "Wie hält man die Hände beim Fangen eines Passes?",
          "Was muss man beim Dribbling beachten, damit der Ball nicht verloren geht?",
          "Erkläre den Unterschied zwischen Brustpass und Bodenpass.",
          "Warum ist es wichtig, beim Wurf die Knie zu beugen?",
        ],
        closing: "Welche Technik möchtest du selbst besser üben?",
      },
    ],
    reflexion: [
      {
        tasks: [
          "Was magst du an Basketball? Was magst du nicht?",
          "Wann hast du in einer Mannschaft schon einmal gut zusammengespielt?",
          "Was ist wichtiger: Tore werfen oder gut passen? Erkläre.",
          "Wie fühlt man sich, wenn man verliert? Was hilft dann?",
          "Wann ist man ein guter Teamspieler?",
        ],
        closing: "Was nimmst du heute aus der Stunde mit?",
      },
    ],
  },
  fussball: {
    beobachtung: [
      {
        tasks: [
          "Beobachte das Spiel. Welche Mannschaft passt sich öfter den Ball zu?",
          "Schreibe auf, wer heute besonders fair spielt.",
          "Zähle, wie viele Tore in 10 Minuten fallen.",
          "Notiere drei gute Spielzüge.",
          "Achte auf den Torwart: Wie steht er, wenn der Ball kommt?",
        ],
        closing: "Welche Mannschaft hat heute besser zusammengespielt? Warum?",
      },
    ],
    regeln: [
      {
        tasks: [
          "Schreibe drei wichtige Fußball-Regeln auf.",
          "Was bedeutet „Abseits“? Erkläre kurz.",
          "Wann gibt es einen Eckball?",
          "Wann gibt es einen Elfmeter?",
          "Welche Aufgabe hat der Schiedsrichter?",
        ],
        closing: "Welche Regel würdest du gerne ändern? Warum?",
      },
    ],
    technik: [
      {
        tasks: [
          "Beschreibe in drei Schritten, wie man einen Pass mit dem Innenrist spielt.",
          "Wie hält man den Körper, wenn man einen Ball annimmt?",
          "Was hilft, damit ein Schuss aufs Tor genau wird?",
          "Wie täuscht man einen Gegner aus?",
          "Warum sind kurze Pässe oft besser als weite?",
        ],
        closing: "Welche Technik möchtest du beim nächsten Mal üben?",
      },
    ],
    reflexion: [
      {
        tasks: [
          "Was magst du an Fußball? Was nicht?",
          "Wann hast du dich in einer Mannschaft besonders wohlgefühlt?",
          "Was ist wichtiger: gewinnen oder fair spielen? Warum?",
          "Wie fühlt es sich an, wenn man ein Tor schießt?",
          "Was tut man, wenn ein Mitspieler einen Fehler macht?",
        ],
        closing: "Was nimmst du heute aus der Stunde mit?",
      },
    ],
  },
  geraeteturnen: {
    beobachtung: [
      {
        tasks: [
          "Beobachte zwei Mitschüler an einem Gerät. Was machen sie gut?",
          "Notiere drei Dinge, auf die man beim Sichern achten muss.",
          "Welche Übung sieht heute am schwierigsten aus? Warum?",
          "Wer turnt heute besonders mutig?",
          "Welche Hilfestellungen werden gegeben?",
        ],
        closing: "Was war die schönste Übung, die du heute gesehen hast?",
      },
    ],
    regeln: [
      {
        tasks: [
          "Schreibe drei Sicherheitsregeln im Geräteturnen auf.",
          "Warum müssen Matten richtig liegen?",
          "Warum darf man Geräte nicht alleine aufbauen?",
          "Was bedeutet „Hilfestellung“?",
          "Welche Kleidung ist beim Turnen sinnvoll?",
        ],
        closing: "Welche Regel ist dir am wichtigsten? Warum?",
      },
    ],
    technik: [
      {
        tasks: [
          "Beschreibe in drei Schritten, wie man eine Rolle vorwärts macht.",
          "Was muss man beim Handstand mit den Armen tun?",
          "Wie landet man sicher nach einem Sprung?",
          "Worauf achtet man beim Schwingen an den Ringen?",
          "Warum spannt man beim Turnen den Körper an?",
        ],
        closing: "Welche Übung möchtest du selbst gerne können?",
      },
    ],
    reflexion: [
      {
        tasks: [
          "Wovor hast du beim Turnen manchmal Angst? Was hilft dir?",
          "Wann hast du dich nach einer Übung stolz gefühlt?",
          "Was ist schwerer: Kraft oder Mut? Warum?",
          "Wie hilft man jemandem, der sich nicht traut?",
          "Was hast du dich schon getraut, was du vorher nicht konntest?",
        ],
        closing: "Was nimmst du heute aus der Stunde mit?",
      },
    ],
  },
  leichtathletik: {
    beobachtung: [
      {
        tasks: [
          "Beobachte einen Lauf. Wer setzt die Arme gut ein?",
          "Schau dir einen Sprung an. Wie sieht die Landung aus?",
          "Beim Werfen: Welcher Schritt kommt vor dem Wurf?",
          "Wer atmet beim Laufen ruhig und gleichmäßig?",
          "Welcher Lauf wirkt heute am schnellsten? Warum?",
        ],
        closing: "Was hat dir beim Zuschauen am meisten gefallen?",
      },
    ],
    regeln: [
      {
        tasks: [
          "Wie ist der Start beim Sprint? Schreibe es auf.",
          "Was bedeutet „Fehlstart“?",
          "Wie wird die Weite beim Weitsprung gemessen?",
          "Welche Wurfgeräte kennst du? Nenne drei.",
          "Warum gibt es Bahnen beim Laufen?",
        ],
        closing: "Welche Disziplin ist deiner Meinung nach am schwersten? Warum?",
      },
    ],
    technik: [
      {
        tasks: [
          "Beschreibe in drei Schritten, wie man Anlauf, Absprung und Landung beim Weitsprung macht.",
          "Was hilft, schneller zu laufen?",
          "Warum schwingt man beim Laufen die Arme?",
          "Wie wirft man einen Ball weit?",
          "Wie atmet man beim Langstreckenlauf?",
        ],
        closing: "Welche Technik möchtest du selbst besser üben?",
      },
    ],
    reflexion: [
      {
        tasks: [
          "Was magst du lieber: laufen, springen oder werfen? Warum?",
          "Wann warst du außer Atem? Wie hast du dich danach gefühlt?",
          "Was ist wichtiger: Schnelligkeit oder Ausdauer?",
          "Wann hast du dich über deine eigene Leistung gefreut?",
          "Wie kann man besser werden, ohne den Spaß zu verlieren?",
        ],
        closing: "Was nimmst du heute aus der Stunde mit?",
      },
    ],
  },
  allgemein: {
    beobachtung: [
      {
        tasks: [
          "Beobachte die Stunde. Wer hilft heute besonders oft anderen?",
          "Welche Übung war heute am schwersten? Warum?",
          "Schreibe drei Dinge auf, die heute gut geklappt haben.",
          "Wer hat heute besonders viel Spaß? Woran erkennst du das?",
          "Notiere zwei faire Aktionen, die du gesehen hast.",
        ],
        closing: "Was hat dir beim Zuschauen am besten gefallen?",
      },
    ],
    regeln: [
      {
        tasks: [
          "Schreibe drei Regeln auf, die im Sportunterricht immer gelten.",
          "Warum gibt es Sicherheitsregeln im Sport?",
          "Was bedeutet „Fairplay“?",
          "Warum sollte man auf die Lehrperson hören?",
          "Welche Regel hilft, dass niemand verletzt wird?",
        ],
        closing: "Welche Regel ist dir am wichtigsten? Warum?",
      },
    ],
    technik: [
      {
        tasks: [
          "Was macht man vor dem Sport zum Aufwärmen? Nenne drei Übungen.",
          "Warum dehnt man sich nach dem Sport?",
          "Wie atmet man, wenn man sich anstrengt?",
          "Warum ist Wassertrinken im Sport wichtig?",
          "Was hilft, sich beim Sport zu konzentrieren?",
        ],
        closing: "Welche Übung tut dir selbst gut?",
      },
    ],
    reflexion: [
      {
        tasks: [
          "Wie fühlst du dich gerade? Schreibe es in einem Satz auf.",
          "Was magst du am Sportunterricht? Was nicht?",
          "Wann hast du dich im Sport schon einmal stark gefühlt?",
          "Was machst du, wenn etwas nicht gleich klappt?",
          "Wie kannst du andere im Sport unterstützen?",
        ],
        closing: "Wie kannst du andere im Sport unterstützen?",
      },
    ],
  },
};

// ────────────────────────────────────────────────────────────────────────────
// Lückentexte: Lösung in eckigen Klammern, beim Rendern als ______ ausgeblendet
// ────────────────────────────────────────────────────────────────────────────
type Cloze = { sentences: string[]; topic: string };

const CLOZE: Record<Sport, Cloze[]> = {
  basketball: [
    {
      topic: "Basketball – Grundlagen",
      sentences: [
        "Beim Basketball spielen [fünf] Spieler einer Mannschaft gleichzeitig auf dem Feld.",
        "Ein Korb aus dem Spiel zählt meistens [zwei] Punkte.",
        "Ein Wurf von hinter der Drei-Punkte-Linie zählt [drei] Punkte.",
        "Wenn man läuft, ohne zu dribbeln, ist das ein [Schrittfehler].",
        "Der Ball muss durch den [Korb] geworfen werden.",
      ],
    },
  ],
  fussball: [
    {
      topic: "Fußball – Grundlagen",
      sentences: [
        "Eine Fußballmannschaft besteht auf dem Feld aus [elf] Spielern.",
        "Ein Spiel dauert zweimal [45] Minuten.",
        "Den Ball ins gegnerische Tor schießen heißt ein [Tor] erzielen.",
        "Berührt der Ball den Boden hinter dem Tor, gibt es einen [Eckball] oder Abstoß.",
        "Bei einem groben Foul zeigt der Schiedsrichter die [rote] Karte.",
      ],
    },
  ],
  geraeteturnen: [
    {
      topic: "Geräteturnen – Grundlagen",
      sentences: [
        "Bevor man turnt, muss man sich gut [aufwärmen].",
        "Die weiche Unterlage auf dem Boden heißt [Matte].",
        "Beim Helfen einer anderen Person spricht man von einer [Hilfestellung].",
        "Bei einer Rolle vorwärts macht man sich klein wie ein [Ball].",
        "Beim Handstand zeigen die Beine nach [oben].",
      ],
    },
  ],
  leichtathletik: [
    {
      topic: "Leichtathletik – Grundlagen",
      sentences: [
        "Der schnellste Lauf über eine kurze Strecke heißt [Sprint].",
        "Beim Weitsprung gehören Anlauf, Absprung, Flug und [Landung] dazu.",
        "Der Speer, der Diskus und die Kugel sind [Wurfgeräte].",
        "Ein zu früher Start heißt [Fehlstart].",
        "Lange Strecken nennt man auch [Ausdauer]läufe.",
      ],
    },
  ],
  allgemein: [
    {
      topic: "Sport allgemein",
      sentences: [
        "Vor dem Sport machen wir uns warm. Das nennt man [Aufwärmen].",
        "Wer fair spielt, hält sich an die [Regeln].",
        "Im Sport ist es wichtig, genug zu [trinken].",
        "Eine Mannschaft besteht aus mehreren [Spielern].",
        "Wenn ich besser werden will, muss ich regelmäßig [üben].",
      ],
    },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// Quiz: 3 Fragen mit je 3 Optionen, richtige Antwort markiert
// ────────────────────────────────────────────────────────────────────────────
type QuizQuestion = { q: string; options: [string, string, string]; correctIndex: 0 | 1 | 2 };

const QUIZ: Record<Sport, QuizQuestion[]> = {
  basketball: [
    { q: "Wie viele Spieler einer Mannschaft sind beim Basketball gleichzeitig auf dem Feld?", options: ["4", "5", "6"], correctIndex: 1 },
    { q: "Wie viele Punkte zählt ein Wurf hinter der Drei-Punkte-Linie?", options: ["2", "3", "4"], correctIndex: 1 },
    { q: "Wie nennt man es, wenn man mit Ball läuft, ohne zu dribbeln?", options: ["Foul", "Schrittfehler", "Doppeldribbling"], correctIndex: 1 },
    { q: "Was ist ein Korbleger?", options: ["Ein Pass", "Ein Wurf nah am Korb", "Ein Schiedsrichterzeichen"], correctIndex: 1 },
    { q: "Wie lange dauert in der Schule meistens ein Viertel?", options: ["5 Min", "10 Min", "20 Min"], correctIndex: 1 },
  ],
  fussball: [
    { q: "Wie viele Feldspieler stehen pro Mannschaft auf dem Platz (inkl. Torwart)?", options: ["9", "10", "11"], correctIndex: 2 },
    { q: "Wie lange dauert ein normales Fußballspiel insgesamt?", options: ["60 Min", "80 Min", "90 Min"], correctIndex: 2 },
    { q: "Was bedeutet die gelbe Karte?", options: ["Lob", "Verwarnung", "Platzverweis"], correctIndex: 1 },
    { q: "Wann gibt es einen Eckball?", options: ["Wenn der Torwart den Ball hält", "Wenn der Ball über die Torauslinie geht und zuletzt der Verteidiger berührt hat", "Bei jedem Foul"], correctIndex: 1 },
    { q: "Wer leitet das Spiel?", options: ["Trainer", "Schiedsrichter", "Kapitän"], correctIndex: 1 },
  ],
  geraeteturnen: [
    { q: "Wozu dient eine Matte beim Turnen?", options: ["Zum Schmücken", "Zum Schutz beim Landen und Stürzen", "Zum Sitzen"], correctIndex: 1 },
    { q: "Was ist eine Hilfestellung?", options: ["Eine Übung", "Helfen, damit jemand sicher turnen kann", "Eine Strafe"], correctIndex: 1 },
    { q: "Was tut man bei einer Rolle vorwärts?", options: ["Hoch springen", "Sich klein machen und über den Rücken abrollen", "Auf dem Bauch rutschen"], correctIndex: 1 },
    { q: "Was darf man im Geräteturnen NICHT?", options: ["Aufwärmen", "Geräte alleine ohne Erlaubnis aufbauen", "Helfen"], correctIndex: 1 },
    { q: "Worauf zeigen die Beine im Handstand?", options: ["Nach vorn", "Nach oben", "Nach hinten"], correctIndex: 1 },
  ],
  leichtathletik: [
    { q: "Welche dieser Disziplinen ist eine Wurfdisziplin?", options: ["Weitsprung", "Speerwurf", "Sprint"], correctIndex: 1 },
    { q: "Was ist ein Fehlstart?", options: ["Ein zu langsamer Start", "Ein Start vor dem Startsignal", "Ein Start nach Sturz"], correctIndex: 1 },
    { q: "Welche Phasen hat der Weitsprung?", options: ["Anlauf – Absprung – Flug – Landung", "Start – Lauf – Stopp", "Wurf – Rollen – Stand"], correctIndex: 0 },
    { q: "Welche Strecke ist ein klassischer Sprint?", options: ["100 m", "1000 m", "5000 m"], correctIndex: 0 },
    { q: "Warum schwingt man beim Laufen die Arme?", options: ["Damit es schöner aussieht", "Für mehr Schwung und Gleichgewicht", "Damit es lauter ist"], correctIndex: 1 },
  ],
  allgemein: [
    { q: "Warum wärmt man sich vor dem Sport auf?", options: ["Damit der Lehrer es sieht", "Um Verletzungen zu vermeiden und besser leistungsfähig zu sein", "Damit es länger dauert"], correctIndex: 1 },
    { q: "Was bedeutet Fairplay?", options: ["Möglichst hart spielen", "Sich an Regeln halten und andere respektieren", "Immer gewinnen"], correctIndex: 1 },
    { q: "Warum ist Trinken im Sport wichtig?", options: ["Für besseren Geschmack", "Damit der Körper Flüssigkeit zurückbekommt", "Damit man kürzer spielt"], correctIndex: 1 },
    { q: "Was macht ein guter Teamspieler?", options: ["Spielt nur für sich", "Hilft den anderen und passt den Ball", "Schreit oft"], correctIndex: 1 },
    { q: "Was tut man, wenn jemand verletzt ist?", options: ["Weiterspielen", "Lehrperson holen und helfen", "Lachen"], correctIndex: 1 },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// Steckbriefe Sport-Persönlichkeiten
// ────────────────────────────────────────────────────────────────────────────
type Person = {
  name: string;
  sport: string;
  nation: string;
  geboren: string;
  bekanntFuer: string;
  funFact: string;
};

const PEOPLE: Record<Sport, Person[]> = {
  basketball: [
    { name: "Michael Jordan", sport: "Basketball", nation: "USA", geboren: "1963", bekanntFuer: "6× NBA-Champion mit den Chicago Bulls", funFact: "Wurde in der Schule zuerst nicht in die erste Mannschaft aufgenommen." },
    { name: "LeBron James", sport: "Basketball", nation: "USA", geboren: "1984", bekanntFuer: "Einer der erfolgreichsten NBA-Spieler aller Zeiten", funFact: "Er kam direkt von der High School in die NBA." },
    { name: "Dirk Nowitzki", sport: "Basketball", nation: "Deutschland", geboren: "1978", bekanntFuer: "NBA-Champion 2011 mit den Dallas Mavericks", funFact: "Er ist berühmt für seinen Fadeaway-Wurf auf einem Bein." },
  ],
  fussball: [
    { name: "Lionel Messi", sport: "Fußball", nation: "Argentinien", geboren: "1987", bekanntFuer: "Weltmeister 2022, mehrfacher Weltfußballer", funFact: "Als Kind brauchte er eine Wachstumsbehandlung." },
    { name: "Cristiano Ronaldo", sport: "Fußball", nation: "Portugal", geboren: "1985", bekanntFuer: "Europameister 2016, einer der besten Torjäger der Welt", funFact: "Er trainiert auch in seiner Freizeit fast täglich." },
    { name: "Pelé", sport: "Fußball", nation: "Brasilien", geboren: "1940", bekanntFuer: "3× Weltmeister, gilt als Fußballlegende", funFact: "Er erzielte über 1000 Tore in seiner Karriere." },
    { name: "Alexia Putellas", sport: "Fußball", nation: "Spanien", geboren: "1994", bekanntFuer: "Mehrfache Weltfußballerin", funFact: "Sie ist Kapitänin des FC Barcelona." },
  ],
  geraeteturnen: [
    { name: "Simone Biles", sport: "Kunstturnen", nation: "USA", geboren: "1997", bekanntFuer: "Mehrfache Olympiasiegerin im Turnen", funFact: "Mehrere Turnübungen sind nach ihr benannt." },
    { name: "Nadia Comăneci", sport: "Kunstturnen", nation: "Rumänien", geboren: "1961", bekanntFuer: "Erste perfekte 10,0 bei Olympia 1976", funFact: "Sie war damals erst 14 Jahre alt." },
    { name: "Fabian Hambüchen", sport: "Kunstturnen", nation: "Deutschland", geboren: "1987", bekanntFuer: "Olympiasieger 2016 am Reck", funFact: "Sein ganzes Familienumfeld turnt." },
  ],
  leichtathletik: [
    { name: "Usain Bolt", sport: "Leichtathletik (Sprint)", nation: "Jamaika", geboren: "1986", bekanntFuer: "Weltrekord über 100 m (9,58 s)", funFact: "Er aß vor seinen Olympia-Rennen oft Chicken Nuggets." },
    { name: "Carl Lewis", sport: "Leichtathletik (Sprint/Weitsprung)", nation: "USA", geboren: "1961", bekanntFuer: "9× Olympiasieger", funFact: "Er war auch ein hervorragender Weitspringer." },
    { name: "Allyson Felix", sport: "Leichtathletik", nation: "USA", geboren: "1985", bekanntFuer: "Erfolgreichste Leichtathletin bei Olympia", funFact: "Sie startete früh als Teenagerin bei großen Wettkämpfen." },
  ],
  allgemein: [
    { name: "Roger Federer", sport: "Tennis", nation: "Schweiz", geboren: "1981", bekanntFuer: "20 Grand-Slam-Titel im Tennis", funFact: "Er begann als Kind auch mit Fußball." },
    { name: "Serena Williams", sport: "Tennis", nation: "USA", geboren: "1981", bekanntFuer: "23 Grand-Slam-Titel im Einzel", funFact: "Sie trainierte zusammen mit ihrer Schwester Venus." },
    { name: "Michael Phelps", sport: "Schwimmen", nation: "USA", geboren: "1985", bekanntFuer: "23 Olympiagoldmedaillen – Rekord", funFact: "Er begann mit dem Schwimmen, weil er als Kind sehr energiegeladen war." },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// Sportgeschichte – kurzer Text + Verständnisfragen
// ────────────────────────────────────────────────────────────────────────────
type HistoryText = { title: string; text: string; questions: string[] };

const HISTORY: Record<Sport, HistoryText[]> = {
  basketball: [
    {
      title: "Wie Basketball erfunden wurde",
      text: "Basketball wurde 1891 in den USA vom Sportlehrer James Naismith erfunden. Er suchte eine Sportart, die seine Schüler im Winter in der Halle spielen konnten. Als Tore hängte er zwei Pfirsichkörbe an die Wand. Daraus entstand das heutige Basketballspiel mit zwei Mannschaften und einem Korb in 3,05 m Höhe.",
      questions: [
        "In welchem Jahr und in welchem Land wurde Basketball erfunden?",
        "Wer hat Basketball erfunden und warum?",
        "Was wurde am Anfang als Tor verwendet?",
      ],
    },
  ],
  fussball: [
    {
      title: "Die Geschichte des Fußballs",
      text: "Der moderne Fußball entstand 1863 in England. Damals einigten sich verschiedene Vereine in London auf gemeinsame Regeln und gründeten den ersten Fußballverband (die FA). Vorher gab es viele unterschiedliche Spiele mit dem Ball. Heute ist Fußball die beliebteste Sportart der Welt, und alle vier Jahre findet eine Weltmeisterschaft statt.",
      questions: [
        "Wann und wo entstand der moderne Fußball?",
        "Warum war die Gründung des ersten Fußballverbands wichtig?",
        "Wie oft findet die Fußball-Weltmeisterschaft statt?",
      ],
    },
  ],
  geraeteturnen: [
    {
      title: "Friedrich Ludwig Jahn – der „Turnvater“",
      text: "Friedrich Ludwig Jahn lebte von 1778 bis 1852 in Deutschland. Er gilt als „Turnvater“, weil er das Turnen als Sport für viele Menschen bekannt machte. 1811 eröffnete er den ersten Turnplatz in Berlin auf der Hasenheide. Geräte wie Reck, Barren und Pferd gehen auf ihn zurück.",
      questions: [
        "Warum nennt man Friedrich Ludwig Jahn „Turnvater“?",
        "Wo wurde der erste Turnplatz eröffnet?",
        "Welche Turngeräte gehen auf Jahn zurück?",
      ],
    },
  ],
  leichtathletik: [
    {
      title: "Olympische Spiele – früher und heute",
      text: "Die Olympischen Spiele gibt es schon seit der Antike. Sie wurden in Griechenland in der Stadt Olympia ausgetragen, das erste Mal etwa 776 v. Chr. Vor allem Lauf-, Wurf- und Sprungwettkämpfe gehörten dazu. 1896 wurden die modernen Olympischen Spiele in Athen wieder ins Leben gerufen. Heute finden sie alle vier Jahre statt.",
      questions: [
        "Wo und wann fanden die ersten Olympischen Spiele statt?",
        "Welche Wettkämpfe gehörten in der Antike dazu?",
        "Wann begannen die modernen Olympischen Spiele?",
      ],
    },
  ],
  allgemein: [
    {
      title: "Warum Sport wichtig ist",
      text: "Sport gibt es seit vielen tausend Jahren. Schon in der Antike war Sport wichtig: Menschen wollten gesund und stark sein. Heute weiß man: Sport hilft, fit zu bleiben, macht gute Laune und stärkt das Miteinander. Deshalb gibt es Sportunterricht in der Schule und viele Vereine, in denen Menschen gemeinsam trainieren.",
      questions: [
        "Seit wann gibt es Sport ungefähr?",
        "Welche guten Wirkungen hat Sport?",
        "Warum gibt es Sportunterricht in der Schule?",
      ],
    },
  ],
};

// ────────────────────────────────────────────────────────────────────────────

export type GeneratedAssignment = {
  tasks: string[];
  closing: string;
  resolvedTaskType: Exclude<TaskType, "zufaellig">;
  answerKey?: string; // optionale Lösung, z. B. für Lückentext / Quiz
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ALL_RESOLVED: Exclude<TaskType, "zufaellig">[] = [
  "beobachtung",
  "regeln",
  "technik",
  "reflexion",
  "lueckentext",
  "quiz",
  "steckbrief",
  "sportgeschichte",
];

export function generateAssignment(sport: Sport, taskType: TaskType): GeneratedAssignment {
  const resolved: Exclude<TaskType, "zufaellig"> =
    taskType === "zufaellig" ? pickRandom(ALL_RESOLVED) : taskType;

  if (resolved === "lueckentext") {
    const cloze = pickRandom(CLOZE[sport]);
    const picked = shuffle(cloze.sentences).slice(0, 5);
    const solutions: string[] = [];
    const tasks = picked.map((sentence, i) => {
      let n = 0;
      const blanked = sentence.replace(/\[([^\]]+)\]/g, (_m, sol: string) => {
        n++;
        solutions.push(`${i + 1}.${n}: ${sol}`);
        return "_________";
      });
      return `${i + 1}) ${blanked}`;
    });
    return {
      tasks: [`Thema: ${cloze.topic}`, "Setze die fehlenden Wörter in die Lücken ein:", ...tasks],
      closing: "Lies deinen ganzen Text am Ende noch einmal laut für dich durch.",
      resolvedTaskType: resolved,
      answerKey: solutions.join("   ·   "),
    };
  }

  if (resolved === "quiz") {
    const picked = shuffle(QUIZ[sport]).slice(0, 3);
    const tasks: string[] = ["Kreuze bei jeder Frage die richtige Antwort an:"];
    const letters = ["A", "B", "C"] as const;
    const solutions: string[] = [];
    picked.forEach((q, i) => {
      tasks.push(`${i + 1}) ${q.q}`);
      q.options.forEach((opt, j) => tasks.push(`   ${letters[j]}) ${opt}`));
      solutions.push(`${i + 1}: ${letters[q.correctIndex]}`);
    });
    return {
      tasks,
      closing: "Welche Frage fandest du am schwierigsten? Warum?",
      resolvedTaskType: resolved,
      answerKey: solutions.join("   ·   "),
    };
  }

  if (resolved === "steckbrief") {
    const p = pickRandom(PEOPLE[sport]);
    return {
      tasks: [
        `Persönlichkeit: ${p.name}`,
        `Sportart: ${p.sport}`,
        `Land: ${p.nation}`,
        `Geboren: ${p.geboren}`,
        `Bekannt für: ${p.bekanntFuer}`,
        `Wusstest du schon? ${p.funFact}`,
        "",
        "Aufgaben:",
        `1) Schreibe drei Sätze über ${p.name} mit eigenen Worten.`,
        `2) Welche Eigenschaften braucht jemand, um in „${p.sport}“ so erfolgreich zu werden?`,
        `3) Würdest du diese Sportart auch gerne ausprobieren? Begründe.`,
      ],
      closing: `Was bewundert man deiner Meinung nach an ${p.name} am meisten?`,
      resolvedTaskType: resolved,
    };
  }

  if (resolved === "sportgeschichte") {
    const h = pickRandom(HISTORY[sport]);
    return {
      tasks: [
        `Text: ${h.title}`,
        h.text,
        "",
        "Beantworte die folgenden Fragen in ganzen Sätzen:",
        ...h.questions.map((q, i) => `${i + 1}) ${q}`),
      ],
      closing: "Was ist das Interessanteste, das du in diesem Text neu erfahren hast?",
      resolvedTaskType: resolved,
    };
  }

  // Standard-Pools (Beobachtung / Regeln / Technik / Reflexion)
  const set = pickRandom(POOL[sport][resolved]);
  const tasks = shuffle(set.tasks).slice(0, 3);
  return { tasks, closing: set.closing, resolvedTaskType: resolved };
}

export function formatAssignmentText(opts: {
  name: string;
  klasse: string;
  datum: string;
  sport: Sport;
  status: Status;
  assignment: GeneratedAssignment;
}): string {
  const lines: string[] = [];
  lines.push("Arbeitsauftrag Sportunterricht");
  lines.push("");
  lines.push(`Name: ${opts.name}`);
  lines.push(`Klasse: ${opts.klasse}`);
  lines.push(`Datum: ${opts.datum}`);
  lines.push(`Status: ${STATUS_LABEL[opts.status]}`);
  lines.push(`Sportart: ${SPORT_LABEL[opts.sport]}`);
  lines.push(`Auftragstyp: ${TASK_LABEL[opts.assignment.resolvedTaskType]}`);
  lines.push("");
  lines.push("Aufgaben:");
  opts.assignment.tasks.forEach((t) => lines.push(t));
  lines.push("");
  lines.push(`Abschlussfrage: ${opts.assignment.closing}`);
  if (opts.assignment.answerKey) {
    lines.push("");
    lines.push(`Lösung (für die Lehrperson): ${opts.assignment.answerKey}`);
  }
  lines.push("");
  lines.push("Antwort:");
  lines.push("____________________________________________");
  lines.push("____________________________________________");
  lines.push("____________________________________________");
  return lines.join("\n");
}
