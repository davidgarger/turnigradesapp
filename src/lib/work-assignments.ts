// Vorlagen für Arbeitsaufträge bei Schülern, die nicht mitturnen.
// Einfache, schülergerechte Sprache. Pro Sportart und Auftragstyp 3+ Varianten,
// damit "Zufällig" abwechslungsreich bleibt.

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

// jeweils mind. 5 Aufgaben pro Block, damit Zufall Variation bringt
const POOL: Record<Sport, Record<Exclude<TaskType, "zufaellig">, TaskSet[]>> = {
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
        closing: "Was nimmst du heute aus der Stunde mit?",
      },
    ],
  },
};

export type GeneratedAssignment = {
  tasks: string[];
  closing: string;
  resolvedTaskType: Exclude<TaskType, "zufaellig">;
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

export function generateAssignment(sport: Sport, taskType: TaskType): GeneratedAssignment {
  const resolved: Exclude<TaskType, "zufaellig"> =
    taskType === "zufaellig"
      ? pickRandom(["beobachtung", "regeln", "technik", "reflexion"] as const)
      : taskType;

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
  opts.assignment.tasks.forEach((t, i) => lines.push(`${i + 1}. ${t}`));
  lines.push("");
  lines.push(`Abschlussfrage: ${opts.assignment.closing}`);
  lines.push("");
  lines.push("Antwort:");
  lines.push("____________________________________________");
  lines.push("____________________________________________");
  lines.push("____________________________________________");
  return lines.join("\n");
}
