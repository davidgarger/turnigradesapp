// Vorlagen für Arbeitsaufträge bei Schülern, die nicht mitturnen.
// Einfache, schülergerechte Sprache. Pro Sportart und Auftragstyp mehrere
// Varianten, damit "Zufällig" abwechslungsreich bleibt. Komplett offline.

export type Sport =
  | "basketball"
  | "fussball"
  | "volleyball"
  | "handball"
  | "unihockey"
  | "badminton"
  | "schwimmen"
  | "geraeteturnen"
  | "leichtathletik"
  | "olympia"
  | "fairplay"
  | "anatomie"
  | "aufwaermen"
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

export type Difficulty = "leicht" | "mittel" | "schwer";

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  leicht: "Leicht (Unter-/Mittelstufe, 1.–4. Kl.)",
  mittel: "Mittel (5.–7. Kl.)",
  schwer: "Schwer (Oberstufe, 8.–10. Kl.)",
};

// Automatische Schwierigkeit anhand der Klassenstufe (1–10).
export function difficultyForClassId(classId: string | undefined): Difficulty {
  const n = Number(classId);
  if (!Number.isFinite(n)) return "mittel";
  if (n <= 4) return "leicht";
  if (n <= 7) return "mittel";
  return "schwer";
}

export const SPORT_LABEL: Record<Sport, string> = {
  basketball: "Basketball",
  fussball: "Fußball",
  volleyball: "Volleyball",
  handball: "Handball",
  unihockey: "Unihockey / Floorball",
  badminton: "Badminton",
  schwimmen: "Schwimmen",
  geraeteturnen: "Geräteturnen",
  leichtathletik: "Leichtathletik",
  olympia: "Olympische Spiele",
  fairplay: "Fairplay & Sportethik",
  anatomie: "Anatomie & Muskulatur",
  aufwaermen: "Aufwärmen & Cool-down",
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
  volleyball: {
    beobachtung: [{ tasks: ["Beobachte: Wer ruft den Ball am häufigsten richtig an?", "Zähle die gelungenen Pritsch-Annahmen einer Mannschaft.", "Notiere drei gute Annahmen mit Bagger.", "Wer bewegt sich besonders schnell ans Netz?", "Achte auf die Aufstellung beim Aufschlag."], closing: "Welches Team spielt heute besser zusammen? Warum?" }],
    regeln: [{ tasks: ["Wie viele Spieler stehen pro Mannschaft auf dem Feld?", "Wie viele Ballberührungen darf eine Mannschaft maximal machen?", "Wann gibt es einen Punkt?", "Was passiert, wenn der Ball ins Netz fällt?", "Wie wird der Aufschlag ausgeführt?"], closing: "Welche Regel ist im Volleyball am wichtigsten? Warum?" }],
    technik: [{ tasks: ["Beschreibe in drei Schritten den oberen Zuspiel (Pritschen).", "Wie hält man die Arme beim Baggern?", "Warum geht man beim Annehmen in die Knie?", "Wie steht man beim Aufschlag?", "Was muss beim Block über dem Netz beachtet werden?"], closing: "Welche Technik möchtest du selber besser können?" }],
    reflexion: [{ tasks: ["Was magst du an Volleyball, was nicht?", "Wie hilft man jemandem, der den Ball oft verfehlt?", "Was tut weh nach einer Volleyballstunde? Warum?", "Wie wichtig ist Kommunikation auf dem Feld?", "Wann hast du dich beim Volleyball stark gefühlt?"], closing: "Was nimmst du heute aus der Stunde mit?" }],
  },
  handball: {
    beobachtung: [{ tasks: ["Zähle, wie viele Tore in 10 Minuten fallen.", "Beobachte den Torwart: Wie steht er bei einem Wurf?", "Wer wirft heute besonders genau?", "Notiere drei gute Pässe.", "Wer verteidigt besonders fair?"], closing: "Welche Aktion hat dir am besten gefallen?" }],
    regeln: [{ tasks: ["Wie viele Spieler einer Mannschaft sind gleichzeitig auf dem Feld?", "Wie viele Schritte darf man ohne Dribbling machen?", "Wann gibt es einen Siebenmeter?", "Was bedeutet die rote Karte?", "Wer darf in den Torraum?"], closing: "Welche Regel findest du am schwierigsten?" }],
    technik: [{ tasks: ["Beschreibe den Sprungwurf in drei Schritten.", "Wie hält man den Ball beim Pass?", "Worauf achtet man beim Fangen?", "Wie täuscht man einen Gegner aus?", "Warum ist das Dribbling im Handball weniger wichtig als im Basketball?"], closing: "Welche Technik möchtest du üben?" }],
    reflexion: [{ tasks: ["Was magst du an Handball?", "Wie fühlt es sich an, ein Tor zu werfen?", "Wann hast du gut mit anderen zusammengespielt?", "Wie geht man mit einem groben Foul um?", "Was ist wichtiger: schnell oder genau werfen?"], closing: "Was nimmst du heute aus der Stunde mit?" }],
  },
  unihockey: {
    beobachtung: [{ tasks: ["Achte auf die Stockhaltung. Wer hält ihn korrekt mit beiden Händen?", "Zähle die Torabschlüsse in 10 Minuten.", "Wer läuft besonders aufmerksam mit?", "Notiere drei gute Pässe entlang der Bande.", "Wer verteidigt besonders ruhig?"], closing: "Was hat dir beim Zuschauen am meisten gefallen?" }],
    regeln: [{ tasks: ["Wie hoch darf der Stock geschwungen werden?", "Was ist ein „Hoher Stock“?", "Wann gibt es einen Bully?", "Wer darf in den Torraum?", "Was passiert bei einer Strafzeit?"], closing: "Welche Regel schützt die Spielenden am meisten?" }],
    technik: [{ tasks: ["Beschreibe den Handgelenkschuss in drei Schritten.", "Wie führt man den Ball ruhig am Stock?", "Wie passt man genau in den Lauf?", "Wie steht man als Verteidiger?", "Warum ist die tiefe Knieposition wichtig?"], closing: "Welche Technik möchtest du verbessern?" }],
    reflexion: [{ tasks: ["Was magst du an Unihockey?", "Was ist anders als bei Fußball oder Handball?", "Wie hilft man jemandem, der noch unsicher mit dem Stock ist?", "Wann ist Unihockey gefährlich? Was kann man tun?", "Was macht ein gutes Team aus?"], closing: "Was nimmst du heute aus der Stunde mit?" }],
  },
  badminton: {
    beobachtung: [{ tasks: ["Beobachte das Spiel: Wer steht oft in der Mitte des Feldes?", "Wer schlägt den Federball besonders genau?", "Wer bewegt sich schnell zwischen vorne und hinten?", "Notiere drei gelungene Aufschläge.", "Achte auf die Schlägerhaltung."], closing: "Welche Spielerin / welcher Spieler hat dir am besten gefallen?" }],
    regeln: [{ tasks: ["Wie viele Punkte braucht man, um einen Satz zu gewinnen?", "Wie wird der Aufschlag ausgeführt?", "Wann ist der Federball „aus“?", "Wer hat im Einzel und im Doppel Aufschlag?", "Was passiert, wenn der Ball das Netz berührt und trotzdem ins Feld fällt?"], closing: "Welche Regel ist im Badminton besonders speziell?" }],
    technik: [{ tasks: ["Beschreibe den Überkopf-Clear in drei Schritten.", "Wie hält man den Schläger richtig (Universal-Griff)?", "Was ist ein Drop?", "Wie steht man in der Grundstellung?", "Warum ist Beinarbeit beim Badminton so wichtig?"], closing: "Welche Technik möchtest du selber besser können?" }],
    reflexion: [{ tasks: ["Was magst du an Badminton?", "Wann wird man im Badminton schnell müde? Warum?", "Wie fühlt es sich an, einen schwierigen Ball noch zu erreichen?", "Wie geht man mit einem Punktverlust um?", "Wann ist Doppel schwieriger als Einzel?"], closing: "Was nimmst du heute aus der Stunde mit?" }],
  },
  schwimmen: {
    beobachtung: [{ tasks: ["Beobachte die Beinbewegung beim Kraulen.", "Wer atmet ruhig zur Seite?", "Wer gleitet besonders lange nach dem Abstoß?", "Achte auf den Armzug beim Brustschwimmen.", "Wer hat eine ruhige Wasserlage?"], closing: "Welche Schwimmart sieht heute am elegantesten aus?" }],
    regeln: [{ tasks: ["Welche Sicherheitsregeln gelten im Schwimmbad?", "Warum darf man am Beckenrand nicht rennen?", "Warum nicht alleine ins tiefe Becken springen?", "Wann pfeift die Bademeisterin / der Bademeister?", "Welche Wendungen gibt es im Wettkampf?"], closing: "Welche Sicherheitsregel ist dir am wichtigsten?" }],
    technik: [{ tasks: ["Beschreibe den Beinschlag beim Kraulen.", "Wie atmet man beim Brustschwimmen?", "Wie macht man den Startsprung sicher?", "Was ist die Wasserlage und warum ist sie wichtig?", "Wie kann man Wasserwiderstand verringern?"], closing: "Welche Schwimmart möchtest du besser können?" }],
    reflexion: [{ tasks: ["Wie fühlst du dich im Wasser?", "Hattest du schon einmal Respekt vor tiefem Wasser? Was hat geholfen?", "Was ist anders an Sport im Wasser?", "Warum ist Schwimmen so gesund?", "Wann hast du dich im Wasser besonders sicher gefühlt?"], closing: "Was nimmst du heute aus der Stunde mit?" }],
  },
  olympia: {
    beobachtung: [{ tasks: ["Welche olympischen Sportarten kennst du? Notiere fünf.", "Welche olympischen Disziplinen siehst du im Sportunterricht wieder?", "Was fällt dir beim Olympia-Logo (5 Ringe) auf?", "Welche Sommer- und Welche Wintersportarten gibt es bei Olympia?", "Welche Disziplin würdest du gerne live sehen? Warum?"], closing: "Was macht Olympia so besonders?" }],
    regeln: [{ tasks: ["Wie oft finden die Sommerspiele statt?", "Wie oft finden die Winterspiele statt?", "Was bedeuten die fünf Ringe?", "Wer entzündet das Olympische Feuer?", "Was ist der olympische Eid?"], closing: "Welche dieser Regeln oder Symbole findest du am wichtigsten?" }],
    technik: [{ tasks: ["Wähle eine olympische Sportart. Beschreibe sie kurz.", "Welche Eigenschaften braucht eine Spitzensportlerin?", "Was bedeutet „Bronze, Silber, Gold“?", "Wie qualifiziert man sich für Olympia (grob beschrieben)?", "Was ist der Unterschied zwischen Olympia und Weltmeisterschaft?"], closing: "Welche Sportart würdest du gerne ausprobieren?" }],
    reflexion: [{ tasks: ["Was bedeutet „Dabei sein ist alles“?", "Warum verbinden viele Menschen Hoffnung mit Olympia?", "Was ist gut, was ist problematisch an Olympia?", "Welche Geschichte einer/eines Olympioniken kennst du?", "Wie würdest du dich fühlen, wenn du Olympiagold gewinnst?"], closing: "Was nimmst du heute aus der Stunde mit?" }],
  },
  fairplay: {
    beobachtung: [{ tasks: ["Beobachte: Wer hilft heute fair einem anderen auf?", "Wer akzeptiert Schiedsrichterentscheidungen ruhig?", "Wer gibt einen Fehler offen zu?", "Wer hilft schwächeren Mitspielenden?", "Wer feiert auch die Erfolge anderer?"], closing: "Welche faire Aktion hat dir besonders gefallen?" }],
    regeln: [{ tasks: ["Was bedeutet Fairplay in eigenen Worten?", "Welche drei Regeln machen Sport fair?", "Wie sollte man sich nach einer Niederlage verhalten?", "Wie geht man mit einer Siegerin oder einem Sieger um?", "Warum gibt es Schiedsrichter?"], closing: "Welche Regel sollte überall gelten?" }],
    technik: [{ tasks: ["Wie kann man verlieren lernen?", "Wie geht man mit einem unfairen Mitspieler um?", "Wie kann man andere ermutigen?", "Was bedeutet Respekt im Sport?", "Welche Worte helfen, ein Team zu stärken?"], closing: "Welcher Tipp ist für dich am wichtigsten?" }],
    reflexion: [{ tasks: ["Wann warst du selbst unfair? Was hättest du anders machen können?", "Wann hat dich jemand fair behandelt?", "Was tut weh: Niederlage oder Unfairness?", "Hat Fairplay auch ausserhalb des Sports Bedeutung?", "Was kannst du heute fairer machen?"], closing: "Was nimmst du heute aus der Stunde mit?" }],
  },
  anatomie: {
    beobachtung: [{ tasks: ["Welche Muskeln spürst du nach dem Aufwärmen am stärksten?", "Welche Körperteile arbeiten beim Laufen besonders?", "Welche beim Werfen?", "Welche beim Springen?", "Welche beim Schwimmen?"], closing: "Welcher Muskel überrascht dich heute?" }],
    regeln: [{ tasks: ["Nenne drei grosse Muskelgruppen.", "Wozu dienen Knochen?", "Was sind Gelenke?", "Warum braucht der Körper Pause?", "Was passiert mit dem Herzschlag bei Anstrengung?"], closing: "Welche Information war neu für dich?" }],
    technik: [{ tasks: ["Wo befindet sich der Bizeps? Was tut er?", "Wo der Trizeps? Was tut er?", "Welche Muskeln helfen bei einem Sprung?", "Warum atmet man bei Sport schneller?", "Wie wachsen Muskeln (kurz erklärt)?"], closing: "Welcher Muskel ist dir wichtig im Alltag?" }],
    reflexion: [{ tasks: ["Wann hast du nach dem Sport Muskelkater gespürt?", "Was hat dem Körper dann geholfen?", "Warum ist Bewegung gut für den Kopf?", "Was tut deinem Körper besonders gut?", "Wie kannst du gut auf deinen Körper hören?"], closing: "Was nimmst du heute aus der Stunde mit?" }],
  },
  aufwaermen: {
    beobachtung: [{ tasks: ["Beobachte: Wer wärmt sich heute konzentriert auf?", "Welche Übungen kommen besonders oft vor?", "Wer atmet ruhig durch?", "Wer bewegt alle Gelenke locker durch?", "Wie verändert sich die Stimmung in der Klasse während des Aufwärmens?"], closing: "Welche Aufwärmübung hat dir am besten gefallen?" }],
    regeln: [{ tasks: ["Warum wärmt man sich überhaupt auf?", "Wie lange sollte ein gutes Warm-up dauern?", "Welche Reihenfolge ist sinnvoll (allgemein → spezifisch)?", "Was gehört zum Cool-down?", "Warum nicht direkt mit Maximaltempo starten?"], closing: "Welche dieser Regeln ist dir am wichtigsten?" }],
    technik: [{ tasks: ["Nenne drei gute Aufwärmübungen.", "Beschreibe eine Mobilisationsübung für die Schultern.", "Welche Übung wärmt die Beine gut auf?", "Welche Atemübung hilft zur Konzentration?", "Welche Dehnübung passt nach dem Sport?"], closing: "Welche Übung baust du beim nächsten Mal selbst ein?" }],
    reflexion: [{ tasks: ["Wann hast du dich ohne Aufwärmen verletzt oder unwohl gefühlt?", "Wie verändert sich dein Körper nach dem Aufwärmen?", "Wie hilft Aufwärmen mental?", "Was macht ein gutes Cool-down aus?", "Wie kannst du dein eigenes Aufwärmprogramm gestalten?"], closing: "Was nimmst du heute aus der Stunde mit?" }],
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
  volleyball: [{ topic: "Volleyball – Grundlagen", sentences: ["Eine Volleyballmannschaft hat auf dem Feld [sechs] Spieler.", "Pro Ballwechsel sind maximal [drei] Ballberührungen erlaubt.", "Das obere Zuspiel heißt [Pritschen].", "Das untere Zuspiel heißt [Baggern].", "Das Spiel beginnt mit einem [Aufschlag]."] }],
  handball: [{ topic: "Handball – Grundlagen", sentences: ["Auf dem Feld stehen pro Mannschaft [sieben] Spieler.", "Ein Strafwurf wird vom [Siebenmeter]punkt ausgeführt.", "Ohne zu dribbeln darf man höchstens [drei] Schritte machen.", "In den Torraum darf nur der [Torwart].", "Ein Wurf in der Luft heißt [Sprungwurf]."] }],
  unihockey: [{ topic: "Unihockey – Grundlagen", sentences: ["Unihockey wird mit einem [Stock] und einem Lochball gespielt.", "Der Stock darf nicht über [Hüft]höhe geschwungen werden.", "Im Torraum darf nur der [Torwart] sein.", "Das Spiel beginnt mit einem [Bully].", "Unihockey heißt international auch [Floorball]."] }],
  badminton: [{ topic: "Badminton – Grundlagen", sentences: ["Im Badminton spielt man mit einem [Federball] (Shuttle).", "Ein Satz wird normalerweise bis [21] Punkte gespielt.", "Der hohe weite Schlag heißt [Clear].", "Ein kurzer, weicher Schlag über das Netz heißt [Drop].", "Der Schläger wird mit dem [Universal]griff gehalten."] }],
  schwimmen: [{ topic: "Schwimmen – Grundlagen", sentences: ["Die schnellste Schwimmart ist [Kraul].", "Beim [Brust]schwimmen atmet man nach vorne.", "Eine gute Wasserlage bedeutet, der Körper ist [waagrecht].", "Die Wende im Wettkampf heißt [Rollwende] oder Wende.", "Vor dem Schwimmen muss man unbedingt [duschen]."] }],
  olympia: [{ topic: "Olympische Spiele", sentences: ["Die ersten Olympischen Spiele fanden in [Griechenland] statt.", "Die modernen Olympischen Spiele wurden [1896] wiederbelebt.", "Die Olympischen Sommerspiele finden alle [vier] Jahre statt.", "Auf der Olympia-Flagge sind [fünf] Ringe.", "Die drei Medaillen heißen Gold, [Silber] und Bronze."] }],
  fairplay: [{ topic: "Fairplay im Sport", sentences: ["Fairplay heißt, sich an die [Regeln] zu halten.", "Eine wichtige Person, die das Spiel überwacht, ist die [Schiedsrichterin].", "Wer einen Fehler offen zugibt, zeigt [Ehrlichkeit].", "Nach dem Spiel reicht man dem Gegner die [Hand].", "Auch nach einer Niederlage bleibt man [fair]."] }],
  anatomie: [{ topic: "Anatomie & Muskulatur", sentences: ["Der Muskel an der Vorderseite des Oberarms heißt [Bizeps].", "Der Gegenspieler an der Rückseite heißt [Trizeps].", "Das größte Gelenk im Körper ist das [Knie].", "Das Herz ist ein [Muskel].", "Bei Anstrengung wird die [Atmung] schneller."] }],
  aufwaermen: [{ topic: "Aufwärmen & Cool-down", sentences: ["Aufwärmen schützt vor [Verletzungen].", "Ein gutes Warm-up dauert etwa [10] Minuten.", "Man beginnt mit allgemeinen Übungen und wird dann [spezifischer].", "Zum Aufwärmen gehört auch das Mobilisieren der [Gelenke].", "Nach dem Sport hilft ein ruhiges [Cool-down]."] }],
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
  volleyball: [
    { q: "Wie viele Spieler einer Mannschaft sind beim Volleyball gleichzeitig auf dem Feld?", options: ["5", "6", "7"], correctIndex: 1 },
    { q: "Wie viele Ballberührungen pro Mannschaft sind maximal erlaubt?", options: ["2", "3", "4"], correctIndex: 1 },
    { q: "Wie heißt das obere Zuspiel?", options: ["Baggern", "Pritschen", "Schmettern"], correctIndex: 1 },
    { q: "Wie startet jedes Spiel und jeder Punkt?", options: ["Mit einem Anstoß", "Mit einem Aufschlag", "Mit einem Bully"], correctIndex: 1 },
    { q: "Was ist ein Block?", options: ["Ein Sprung mit gestreckten Armen am Netz, um den Ball zu stoppen", "Ein Angriffsschlag", "Ein Aufschlag von unten"], correctIndex: 0 },
  ],
  handball: [
    { q: "Wie viele Spieler pro Mannschaft sind auf dem Feld (inkl. Torwart)?", options: ["6", "7", "8"], correctIndex: 1 },
    { q: "Wie viele Schritte darf man ohne Dribbling machen?", options: ["2", "3", "4"], correctIndex: 1 },
    { q: "Wer darf in den Torraum?", options: ["Alle Spieler", "Nur der Torwart", "Nur die Verteidiger"], correctIndex: 1 },
    { q: "Was ist ein Siebenmeter?", options: ["Ein Einwurf", "Ein Strafwurf aus 7 m", "Eine Zeitstrafe"], correctIndex: 1 },
    { q: "Was bedeutet die rote Karte?", options: ["Lob", "Verwarnung", "Hinausstellung"], correctIndex: 2 },
  ],
  unihockey: [
    { q: "Womit spielt man Unihockey?", options: ["Mit einem Stock und einem Lochball", "Mit Schlägern und einem Tennisball", "Mit einem Stock und einem Puck"], correctIndex: 0 },
    { q: "Wie hoch darf der Stock geschwungen werden?", options: ["Bis Kopfhöhe", "Bis Hüfthöhe", "Egal wie hoch"], correctIndex: 1 },
    { q: "Wer darf in den Torraum?", options: ["Alle", "Nur der Torwart", "Nur Verteidiger"], correctIndex: 1 },
    { q: "Wie beginnt das Spiel oder eine Unterbrechung?", options: ["Mit Anstoß", "Mit Bully", "Mit Einwurf"], correctIndex: 1 },
    { q: "Wie heißt Unihockey international auch?", options: ["Floorball", "Hallenhockey", "Streethockey"], correctIndex: 0 },
  ],
  badminton: [
    { q: "Womit spielt man Badminton?", options: ["Mit einem Tennisball", "Mit einem Federball / Shuttle", "Mit einem Softball"], correctIndex: 1 },
    { q: "Bis wie viele Punkte geht ein Satz normalerweise?", options: ["15", "21", "25"], correctIndex: 1 },
    { q: "Was ist ein Clear?", options: ["Ein hoher, weiter Schlag bis ans Ende des Feldes", "Ein flacher Schlag knapp übers Netz", "Ein Aufschlag von oben"], correctIndex: 0 },
    { q: "Wie wird der Aufschlag ausgeführt?", options: ["Von oben mit Schmetterschlag", "Von unten unterhalb der Hüfte", "Egal wie"], correctIndex: 1 },
    { q: "Was ist im Badminton besonders wichtig?", options: ["Krafttraining mit Hanteln", "Schnelle Beinarbeit", "Lange Pausen"], correctIndex: 1 },
  ],
  schwimmen: [
    { q: "Welche Schwimmart ist die schnellste?", options: ["Brust", "Kraul", "Rücken"], correctIndex: 1 },
    { q: "Was bedeutet eine gute Wasserlage?", options: ["Aufrecht im Wasser stehen", "Möglichst flach und waagrecht im Wasser liegen", "Auf dem Rücken sitzen"], correctIndex: 1 },
    { q: "Warum sollte man vor dem Schwimmen duschen?", options: ["Aus Höflichkeit", "Hygiene und Sauberkeit des Wassers", "Damit man wärmer ist"], correctIndex: 1 },
    { q: "Was ist im Schwimmbad NICHT erlaubt?", options: ["Schwimmen", "Am Beckenrand rennen", "Tauchen mit Erlaubnis"], correctIndex: 1 },
    { q: "Welche Wende gibt es im Wettkampf?", options: ["Rollwende", "Sprungwende", "Stehwende"], correctIndex: 0 },
  ],
  olympia: [
    { q: "Wo fanden die ersten Olympischen Spiele statt?", options: ["Italien", "Griechenland", "Ägypten"], correctIndex: 1 },
    { q: "Wann starteten die modernen Olympischen Spiele?", options: ["1776", "1896", "1936"], correctIndex: 1 },
    { q: "Wie oft finden die Olympischen Sommerspiele statt?", options: ["alle 2 Jahre", "alle 4 Jahre", "alle 5 Jahre"], correctIndex: 1 },
    { q: "Wie viele Ringe hat das Olympia-Logo?", options: ["4", "5", "6"], correctIndex: 1 },
    { q: "Welche Medaille ist die wertvollste?", options: ["Silber", "Gold", "Bronze"], correctIndex: 1 },
  ],
  fairplay: [
    { q: "Was bedeutet Fairplay?", options: ["Möglichst hart spielen", "Sich an die Regeln halten und andere respektieren", "Nur gewinnen wollen"], correctIndex: 1 },
    { q: "Wie verhält man sich nach einer Niederlage fair?", options: ["Schimpfen", "Dem Gegner gratulieren", "Den Sieger ignorieren"], correctIndex: 1 },
    { q: "Wer überwacht im Spiel die Einhaltung der Regeln?", options: ["Der Trainer", "Die Schiedsrichterin", "Der Kapitän"], correctIndex: 1 },
    { q: "Was tut ein fairer Spieler bei eigenem Foul?", options: ["Streitet es ab", "Gibt es offen zu", "Schiebt es einem anderen zu"], correctIndex: 1 },
    { q: "Was gehört NICHT zum Fairplay?", options: ["Respekt", "Ehrlichkeit", "Den Gegner verletzen"], correctIndex: 2 },
  ],
  anatomie: [
    { q: "Wie heißt der Muskel an der Vorderseite des Oberarms?", options: ["Trizeps", "Bizeps", "Deltoideus"], correctIndex: 1 },
    { q: "Welches ist das größte Gelenk des Körpers?", options: ["Schulter", "Knie", "Hüfte"], correctIndex: 1 },
    { q: "Was ist das Herz?", options: ["Ein Knochen", "Ein Muskel", "Ein Organ ohne Muskeln"], correctIndex: 1 },
    { q: "Was passiert mit der Atmung bei Anstrengung?", options: ["Sie wird langsamer", "Sie wird schneller", "Sie bleibt gleich"], correctIndex: 1 },
    { q: "Wann wachsen Muskeln vor allem?", options: ["Während der Belastung", "In der Erholungsphase nach dem Training", "Beim Essen"], correctIndex: 1 },
  ],
  aufwaermen: [
    { q: "Warum wärmt man sich vor dem Sport auf?", options: ["Damit es länger dauert", "Um Verletzungen zu vermeiden und leistungsfähiger zu sein", "Damit man später müder ist"], correctIndex: 1 },
    { q: "Wie lange sollte ein gutes Warm-up dauern?", options: ["1 Minute", "ca. 10 Minuten", "30 Minuten"], correctIndex: 1 },
    { q: "Welche Reihenfolge ist sinnvoll?", options: ["Maximalbelastung – allgemein – spezifisch", "allgemein – spezifisch – Hauptteil", "Dehnen – ohne Aufwärmen – Wettkampf"], correctIndex: 1 },
    { q: "Was gehört zum Cool-down?", options: ["Voller Sprint", "Ruhiges Auslaufen und lockeres Dehnen", "Sofort kalt duschen"], correctIndex: 1 },
    { q: "Welche Übung ist KEINE typische Aufwärmübung?", options: ["Hampelmann", "Lockeres Laufen", "Maximalkraft Bankdrücken"], correctIndex: 2 },
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
  volleyball: [
    { name: "Karch Kiraly", sport: "Volleyball / Beachvolleyball", nation: "USA", geboren: "1960", bekanntFuer: "Olympiagold in Halle und am Strand", funFact: "Er ist der bisher einzige Spieler mit Olympia-Gold in beiden Volleyball-Varianten." },
    { name: "Giba (Gilberto Godoy Filho)", sport: "Volleyball", nation: "Brasilien", geboren: "1976", bekanntFuer: "Weltmeister und Olympiasieger mit Brasilien", funFact: "Bekannt für seine Sprungkraft und lautstarke Motivation seines Teams." },
  ],
  handball: [
    { name: "Mikkel Hansen", sport: "Handball", nation: "Dänemark", geboren: "1987", bekanntFuer: "Mehrfacher Welthandballer, Olympiasieger", funFact: "Er ist Linkshänder und gefürchtet für seine Sprungwürfe." },
    { name: "Nikola Karabatić", sport: "Handball", nation: "Frankreich", geboren: "1984", bekanntFuer: "Mehrfacher Weltmeister und Olympiasieger", funFact: "Sein Bruder Luka spielt ebenfalls in der französischen Nationalmannschaft." },
  ],
  unihockey: [
    { name: "Kim Nilsson", sport: "Unihockey / Floorball", nation: "Schweden", geboren: "1988", bekanntFuer: "Mehrfacher Weltmeister mit Schweden", funFact: "Er gilt vielen Fans als bester Floorballer aller Zeiten." },
    { name: "Matthias Hofbauer", sport: "Unihockey", nation: "Schweiz", geboren: "1981", bekanntFuer: "Topskorer der Schweizer Nationalmannschaft", funFact: "Spielte über 200 Länderspiele für die Schweiz." },
  ],
  badminton: [
    { name: "Lin Dan", sport: "Badminton", nation: "China", geboren: "1983", bekanntFuer: "2× Olympiasieger im Einzel", funFact: "Bekannt als „Super Dan“ wegen seiner Dominanz." },
    { name: "Carolina Marín", sport: "Badminton", nation: "Spanien", geboren: "1993", bekanntFuer: "Olympiasiegerin 2016, mehrfache Weltmeisterin", funFact: "Sie ist berühmt für ihre lauten Anfeuerungsrufe nach jedem Punkt." },
  ],
  schwimmen: [
    { name: "Michael Phelps", sport: "Schwimmen", nation: "USA", geboren: "1985", bekanntFuer: "23 Olympiagoldmedaillen – Rekord aller Zeiten", funFact: "Er hat überdurchschnittlich lange Arme und große Füße." },
    { name: "Katie Ledecky", sport: "Schwimmen", nation: "USA", geboren: "1997", bekanntFuer: "Dominante Langstreckenschwimmerin, mehrfache Olympiasiegerin", funFact: "Sie hält mehrere Weltrekorde im Freistil." },
  ],
  olympia: [
    { name: "Pierre de Coubertin", sport: "Olympische Bewegung", nation: "Frankreich", geboren: "1863", bekanntFuer: "Gründer der modernen Olympischen Spiele (1896)", funFact: "Von ihm stammt der Spruch „Dabei sein ist alles“." },
    { name: "Jesse Owens", sport: "Leichtathletik / Olympia", nation: "USA", geboren: "1913", bekanntFuer: "4 Goldmedaillen bei Olympia 1936 in Berlin", funFact: "Er setzte ein wichtiges Zeichen gegen den damaligen Rassismus." },
  ],
  fairplay: [
    { name: "Andrés Iniesta", sport: "Fußball", nation: "Spanien", geboren: "1984", bekanntFuer: "Weltmeister 2010, gilt als Vorbild für Fairness", funFact: "Er wechselte nach einem Foul oft das Trikot mit dem Gegenspieler." },
    { name: "Roger Federer", sport: "Tennis", nation: "Schweiz", geboren: "1981", bekanntFuer: "20 Grand-Slam-Titel, Fairplay-Ikone des Tennis", funFact: "Er gewann mehrfach den ATP-Sportsmanship-Award." },
  ],
  anatomie: [
    { name: "Andreas Vesalius", sport: "Anatomie der Medizin", nation: "Flandern (heute Belgien)", geboren: "1514", bekanntFuer: "Begründer der modernen Anatomie", funFact: "Sein Buch „De humani corporis fabrica“ veränderte die Medizin." },
    { name: "Galen von Pergamon", sport: "Antike Anatomie", nation: "Griechenland/Römisches Reich", geboren: "ca. 129 n. Chr.", bekanntFuer: "Wichtigster antiker Arzt, untersuchte Muskeln und Knochen", funFact: "Er war auch Arzt der Gladiatoren in Pergamon." },
  ],
  aufwaermen: [
    { name: "Jürgen Weineck", sport: "Sportwissenschaft", nation: "Deutschland", geboren: "1942", bekanntFuer: "Wichtiger Autor zur Trainingslehre, u. a. zum Aufwärmen", funFact: "Sein Buch „Optimales Training“ ist Standardliteratur im Sportstudium." },
    { name: "Hans Selye", sport: "Stress- und Trainingsforschung", nation: "Österreich/Kanada", geboren: "1907", bekanntFuer: "Forschte zur Anpassung des Körpers an Belastung", funFact: "Er prägte den Begriff „Stress“ in der Medizin." },
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

export function generateAssignment(
  sport: Sport,
  taskType: TaskType,
  difficulty: Difficulty = "mittel",
): GeneratedAssignment {
  const resolved: Exclude<TaskType, "zufaellig"> =
    taskType === "zufaellig" ? pickRandom(ALL_RESOLVED) : taskType;

  // Anzahl je Auftragstyp nach Schwierigkeit
  const counts = {
    leicht: { pool: 2, quiz: 2, cloze: 3 },
    mittel: { pool: 3, quiz: 3, cloze: 5 },
    schwer: { pool: 4, quiz: 5, cloze: 5 },
  }[difficulty];

  if (resolved === "lueckentext") {
    const cloze = pickRandom(CLOZE[sport]);
    const picked = shuffle(cloze.sentences).slice(0, counts.cloze);
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
    const intro =
      difficulty === "leicht"
        ? "Setze die fehlenden Wörter in die Lücken ein:"
        : difficulty === "schwer"
          ? "Setze die fehlenden Wörter ein und schreibe danach zu zwei Sätzen eine kurze Erklärung in eigenen Worten:"
          : "Setze die fehlenden Wörter in die Lücken ein:";
    return {
      tasks: [`Thema: ${cloze.topic}`, intro, ...tasks],
      closing:
        difficulty === "schwer"
          ? "Erkläre eines der Fachwörter aus deinem Text in 2–3 Sätzen."
          : "Lies deinen ganzen Text am Ende noch einmal laut für dich durch.",
      resolvedTaskType: resolved,
      answerKey: solutions.join("   ·   "),
    };
  }

  if (resolved === "quiz") {
    const picked = shuffle(QUIZ[sport]).slice(0, counts.quiz);
    const tasks: string[] = ["Kreuze bei jeder Frage die richtige Antwort an:"];
    const letters = ["A", "B", "C"] as const;
    const solutions: string[] = [];
    picked.forEach((q, i) => {
      tasks.push(`${i + 1}) ${q.q}`);
      q.options.forEach((opt, j) => tasks.push(`   ${letters[j]}) ${opt}`));
      solutions.push(`${i + 1}: ${letters[q.correctIndex]}`);
    });
    if (difficulty === "schwer") {
      tasks.push("");
      tasks.push("Zusatzaufgabe: Begründe bei zwei Antworten kurz, warum sie richtig sind.");
    }
    return {
      tasks,
      closing: "Welche Frage fandest du am schwierigsten? Warum?",
      resolvedTaskType: resolved,
      answerKey: solutions.join("   ·   "),
    };
  }

  if (resolved === "steckbrief") {
    const p = pickRandom(PEOPLE[sport]);
    const baseTasks = [
      `Persönlichkeit: ${p.name}`,
      `Sportart: ${p.sport}`,
      `Land: ${p.nation}`,
      `Geboren: ${p.geboren}`,
      `Bekannt für: ${p.bekanntFuer}`,
      `Wusstest du schon? ${p.funFact}`,
      "",
      "Aufgaben:",
    ];
    const aufgaben =
      difficulty === "leicht"
        ? [
            `1) Schreibe zwei Sätze über ${p.name}.`,
            `2) Möchtest du diese Sportart auch ausprobieren? Warum?`,
          ]
        : difficulty === "schwer"
          ? [
              `1) Schreibe einen kurzen Text (mindestens 6 Sätze) über ${p.name}.`,
              `2) Welche Eigenschaften braucht jemand, um in „${p.sport}“ Spitzensportler/in zu werden?`,
              `3) Vergleiche „${p.sport}“ mit einer anderen Sportart deiner Wahl.`,
              `4) Was kann man von ${p.name} für die eigene Disziplin und Motivation lernen?`,
            ]
          : [
              `1) Schreibe drei Sätze über ${p.name} mit eigenen Worten.`,
              `2) Welche Eigenschaften braucht jemand, um in „${p.sport}“ so erfolgreich zu werden?`,
              `3) Würdest du diese Sportart auch gerne ausprobieren? Begründe.`,
            ];
    return {
      tasks: [...baseTasks, ...aufgaben],
      closing: `Was bewundert man deiner Meinung nach an ${p.name} am meisten?`,
      resolvedTaskType: resolved,
    };
  }

  if (resolved === "sportgeschichte") {
    const h = pickRandom(HISTORY[sport]);
    const fragen =
      difficulty === "leicht"
        ? h.questions.slice(0, 2)
        : difficulty === "schwer"
          ? [...h.questions, "Was hätte sich anders entwickelt, wenn es diesen Sport nicht gäbe? Begründe."]
          : h.questions;
    return {
      tasks: [
        `Text: ${h.title}`,
        h.text,
        "",
        difficulty === "leicht"
          ? "Beantworte die folgenden Fragen in kurzen Sätzen:"
          : "Beantworte die folgenden Fragen in ganzen Sätzen:",
        ...fragen.map((q, i) => `${i + 1}) ${q}`),
      ],
      closing:
        difficulty === "schwer"
          ? "Was bedeutet die Geschichte dieses Sports für die heutige Zeit?"
          : "Was ist das Interessanteste, das du in diesem Text neu erfahren hast?",
      resolvedTaskType: resolved,
    };
  }

  // Standard-Pools (Beobachtung / Regeln / Technik / Reflexion)
  const set = pickRandom(POOL[sport][resolved]);
  const tasks = shuffle(set.tasks).slice(0, counts.pool);
  if (difficulty === "schwer") {
    tasks.push("Zusatzaufgabe: Begründe deine wichtigste Beobachtung oder Antwort in 2–3 Sätzen.");
  }
  return { tasks, closing: set.closing, resolvedTaskType: resolved };
}

export function formatAssignmentText(opts: {
  name: string;
  klasse: string;
  datum: string;
  sport: Sport;
  status: Status;
  difficulty?: Difficulty;
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
  if (opts.difficulty) lines.push(`Schwierigkeit: ${DIFFICULTY_LABEL[opts.difficulty]}`);
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
