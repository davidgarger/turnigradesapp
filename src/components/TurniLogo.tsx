type Props = { className?: string };

/**
 * Turni-Logo: stilisierte laufende Figur mit Schwung,
 * Verlauf indigo → fuchsia, passt zur App-Brand.
 */
export function TurniLogo({ className }: Props) {
  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="turni-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#turni-grad)" />
      {/* Kopf */}
      <circle cx="30" cy="13" r="3.2" fill="white" />
      {/* Körper / Arme / Beine als dynamische Linien */}
      <path
        d="M14 33 L21 27 L26 30 L23 36 L29 41"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M21 27 L25 22 L31 24 L35 20"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Speed-Lines */}
      <path d="M8 20 L13 20" stroke="white" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6 25 L12 25" stroke="white" strokeOpacity="0.4" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
