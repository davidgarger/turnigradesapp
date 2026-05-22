import {
  Backpack,
  Dumbbell,
  Lightbulb,
  ShieldAlert,
  Target,
  Users,
  Zap,
} from "lucide-react";
import {
  type StationCard as StationCardType,
  type CardSport,
  type CardFokus,
  type DisciplineCardSet,
  SOZIALFORM_LABEL,
  FOKUS_LABEL,
  SPORT_COLORS,
  SPORT_LABEL,
  LEVEL_TINT,
} from "@/lib/station-cards-v2";

const FOKUS_TIPP: Record<CardFokus, string> = {
  kraft: "Spann den Bauch fest an – Kraft kommt aus der Mitte, nicht aus den Armen allein.",
  technik: "Lieber langsam und sauber als schnell und schlampig. Technik schlägt Tempo.",
  koordination: "Schau dorthin, wo du hin willst. Dein Blick führt deinen Körper.",
  ausdauer: "Atme ruhig durch die Nase ein und durch den Mund aus – nicht hetzen.",
  mut: "Erst probieren, dann bewerten. Eine kleine Hilfestellung reicht oft schon.",
};

const LEVEL_TIPP: Record<number, string> = {
  1: "Starte ohne Druck – erst das Gefühl, dann die Leistung.",
  2: "Wiederhole die Bewegung mindestens 5× bewusst, bevor du steigerst.",
  3: "Achte auf den Übergang: weicher Übergang = bessere Bewegung.",
  4: "Hier zählt's: einmal mit voller Konzentration ist mehr wert als zehnmal nebenbei.",
};

const MERKE: Record<CardFokus, string> = {
  kraft: "Stark werden heißt: viele saubere Wiederholungen, kein Show-Off.",
  technik: "Profis üben das Einfache so lange, bis es perfekt aussieht.",
  koordination: "Erst der Kopf, dann der Körper – Bewegung vorstellen, dann ausführen.",
  ausdauer: "Gleichmäßig ist schneller als ungleichmäßig schnell.",
  mut: "Mut ist nicht keine Angst – Mut ist trotzdem starten.",
};
import { TurniLogo } from "./TurniLogo";

type Props = {
  card: StationCardType;
  set: DisciplineCardSet;
  index: number; // 1..4
};

export function StationCard({ card, set, index }: Props) {
  const sportColor = SPORT_COLORS[set.sport];
  const tint = LEVEL_TINT[card.level];

  return (
    <article
      className="station-card relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm print:break-inside-avoid print:shadow-none"
      style={{ borderColor: sportColor.soft }}
    >
      {/* Farbbalken oben */}
      <div
        className="flex items-center justify-between px-4 py-2 text-white"
        style={{
          background: sportColor.base,
          opacity: Number(tint),
        }}
      >
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
          <DisciplineIcon sport={set.sport} className="h-3.5 w-3.5" />
          <span>{SPORT_LABEL[set.sport]}</span>
          <span className="opacity-70">·</span>
          <span>{set.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((l) => (
            <span
              key={l}
              className="h-1.5 w-4 rounded-full"
              style={{
                background: "white",
                opacity: l <= card.level ? 1 : 0.35,
              }}
            />
          ))}
          <span className="ml-1 text-[10px] font-bold tracking-wider">
            LEVEL {card.level}
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-slate-100 px-5 pt-4 pb-3">
        <div
          className="text-[10px] font-bold uppercase tracking-[0.18em]"
          style={{ color: sportColor.base }}
        >
          {card.levelLabel}
        </div>
        <h2 className="mt-1 text-xl font-bold leading-tight text-slate-900">
          {card.title}
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">{set.subtitle}</p>
      </header>

      {/* Einfacher Tipp-Streifen */}
      <div
        className="relative flex items-center gap-3 border-b border-slate-100 px-5 py-3"
        style={{ background: sportColor.soft + "55" }}
      >
        <Lightbulb
          className="h-4 w-4 shrink-0"
          style={{ color: sportColor.base }}
        />
        <p className="text-[13px] font-medium leading-snug text-slate-800">
          {FOKUS_TIPP[card.fokus]}
        </p>
        <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-600 shadow-sm">
          {index}/4
        </span>
      </div>

      {/* Inhalt: nur So geht's + Sicherheit, je max. 3 Punkte */}
      <div className="grid flex-1 gap-4 px-5 py-4 sm:grid-cols-2">
        <Section
          title="So geht’s"
          color={sportColor.base}
          icon={<Target className="h-3.5 w-3.5" />}
          items={card.soGehts.slice(0, 3)}
        />
        <Section
          title="Sicherheit"
          color="#b91c1c"
          icon={<ShieldAlert className="h-3.5 w-3.5" />}
          items={card.sicherheit.slice(0, 2)}
        />
      </div>
    </article>
  );
}

function Section({
  title,
  color,
  icon,
  items,
}: {
  title: string;
  color: string;
  icon: React.ReactNode;
  items: string[];
}) {
  return (
    <div>
      <div
        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
        style={{ color }}
      >
        {icon}
        <span>{title}</span>
      </div>
      <ul className="mt-1 space-y-1 text-[12px] leading-snug text-slate-700">
        {items.map((t, i) => (
          <li key={i} className="flex gap-1.5">
            <span style={{ color }} className="select-none">
              ›
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-slate-500">{icon}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}:
      </span>
      <span className="font-medium text-slate-700">{children}</span>
    </div>
  );
}

function DisciplineIcon({
  sport,
  className,
}: {
  sport: CardSport;
  className?: string;
}) {
  // einfaches generisches Icon je Bereich
  if (sport === "leichtathletik") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="17" cy="5" r="2" fill="currentColor" stroke="none" />
        <path d="M14 9l-3 3 2 3-4 5" />
        <path d="M13 12l4 2 3-3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <rect x="5" y="9" width="3" height="6" rx="0.5" fill="currentColor" stroke="none" />
      <rect x="16" y="9" width="3" height="6" rx="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
