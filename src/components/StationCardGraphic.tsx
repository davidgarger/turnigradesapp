// Einheitliche SVG-Strichmännchen für alle Stationenkarten.
// ViewBox 100x100, Stroke 2px, runde Enden, monochrom currentColor.

type FigureProps = { children: React.ReactNode };
function Figure({ children }: FigureProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      role="img"
      aria-hidden
    >
      <g
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {children}
      </g>
    </svg>
  );
}

const Head = ({ cx, cy, r = 5 }: { cx: number; cy: number; r?: number }) => (
  <circle cx={cx} cy={cy} r={r} fill="currentColor" />
);

const Ground = () => (
  <line x1="0" y1="96" x2="100" y2="96" strokeDasharray="2 3" opacity="0.5" />
);

const Bar = ({ y = 30 }: { y?: number }) => (
  <line x1="5" y1={y} x2="95" y2={y} strokeWidth="3" />
);

// ============== SPRINT ==============
const SprintStand = () => (
  <Figure>
    <Ground />
    <Head cx={50} cy={20} />
    <line x1="50" y1="25" x2="50" y2="60" />
    <line x1="50" y1="35" x2="38" y2="48" />
    <line x1="50" y1="35" x2="62" y2="48" />
    <line x1="50" y1="60" x2="44" y2="92" />
    <line x1="50" y1="60" x2="58" y2="92" />
    {/* Startlinie */}
    <line x1="20" y1="94" x2="40" y2="94" strokeWidth="3" />
  </Figure>
);

const SprintSkipping = () => (
  <Figure>
    <Ground />
    <Head cx={50} cy={20} />
    <line x1="50" y1="25" x2="50" y2="55" />
    {/* Arme 90° */}
    <line x1="50" y1="34" x2="62" y2="28" />
    <line x1="62" y1="28" x2="68" y2="40" />
    <line x1="50" y1="34" x2="38" y2="42" />
    <line x1="38" y1="42" x2="32" y2="32" />
    {/* Knie hoch */}
    <line x1="50" y1="55" x2="60" y2="50" />
    <line x1="60" y1="50" x2="56" y2="70" />
    <line x1="50" y1="55" x2="48" y2="78" />
    <line x1="48" y1="78" x2="52" y2="92" />
  </Figure>
);

const SprintTiefstart = () => (
  <Figure>
    <Ground />
    {/* Block */}
    <line x1="65" y1="92" x2="80" y2="80" strokeWidth="3" />
    <Head cx={32} cy={56} />
    {/* Rumpf nach vorne */}
    <line x1="36" y1="58" x2="60" y2="70" />
    {/* Arme stützen */}
    <line x1="36" y1="58" x2="28" y2="90" />
    <line x1="40" y1="60" x2="34" y2="92" />
    {/* Beine */}
    <line x1="60" y1="70" x2="72" y2="82" />
    <line x1="60" y1="70" x2="50" y2="92" />
  </Figure>
);

const SprintZiel = () => (
  <Figure>
    <Ground />
    <Head cx={45} cy={20} />
    <line x1="45" y1="25" x2="48" y2="58" />
    {/* Arme dynamisch */}
    <line x1="46" y1="32" x2="32" y2="22" />
    <line x1="46" y1="34" x2="62" y2="28" />
    {/* Beine im Sprint */}
    <line x1="48" y1="58" x2="36" y2="78" />
    <line x1="36" y1="78" x2="40" y2="92" />
    <line x1="48" y1="58" x2="64" y2="68" />
    <line x1="64" y1="68" x2="68" y2="86" />
    {/* Ziellinie */}
    <line x1="82" y1="20" x2="82" y2="92" strokeWidth="3" strokeDasharray="3 3" />
  </Figure>
);

// ============== WEITSPRUNG ==============
const WeitStand = () => (
  <Figure>
    <Ground />
    {/* Linie */}
    <line x1="25" y1="92" x2="40" y2="92" strokeWidth="3" />
    <Head cx={48} cy={24} />
    <line x1="48" y1="29" x2="48" y2="58" />
    {/* Arme zurück (vor Sprung) */}
    <line x1="48" y1="36" x2="36" y2="44" />
    <line x1="48" y1="36" x2="60" y2="44" />
    {/* Beine gebeugt */}
    <line x1="48" y1="58" x2="40" y2="76" />
    <line x1="40" y1="76" x2="42" y2="90" />
    <line x1="48" y1="58" x2="56" y2="76" />
    <line x1="56" y1="76" x2="54" y2="90" />
  </Figure>
);

const WeitAbsprung = () => (
  <Figure>
    <Ground />
    <Head cx={35} cy={26} />
    <line x1="35" y1="31" x2="38" y2="58" />
    <line x1="36" y1="38" x2="48" y2="28" />
    <line x1="36" y1="38" x2="24" y2="46" />
    {/* Absprungbein */}
    <line x1="38" y1="58" x2="32" y2="86" />
    {/* Schwungbein hoch */}
    <line x1="38" y1="58" x2="56" y2="50" />
    <line x1="56" y1="50" x2="68" y2="60" />
    {/* Absprungbalken */}
    <line x1="22" y1="92" x2="38" y2="92" strokeWidth="3" />
  </Figure>
);

const WeitFlug = () => (
  <Figure>
    <Ground />
    {/* Schwebephase */}
    <Head cx={50} cy={34} />
    <line x1="50" y1="39" x2="55" y2="60" />
    <line x1="50" y1="44" x2="36" y2="38" />
    <line x1="50" y1="44" x2="64" y2="38" />
    {/* Beine geöffnet */}
    <line x1="55" y1="60" x2="42" y2="68" />
    <line x1="55" y1="60" x2="70" y2="64" />
    {/* Flug-Pfeil */}
    <line x1="15" y1="86" x2="85" y2="86" opacity="0.5" />
    <line x1="80" y1="82" x2="85" y2="86" opacity="0.5" />
    <line x1="80" y1="90" x2="85" y2="86" opacity="0.5" />
  </Figure>
);

const WeitLandung = () => (
  <Figure>
    <Ground />
    {/* Sandgrube andeuten */}
    <line x1="35" y1="92" x2="90" y2="92" strokeWidth="3" opacity="0.4" />
    <Head cx={55} cy={42} />
    <line x1="55" y1="47" x2="55" y2="68" />
    <line x1="55" y1="52" x2="40" y2="48" />
    <line x1="55" y1="52" x2="70" y2="46" />
    {/* Beine vorne, landend */}
    <line x1="55" y1="68" x2="68" y2="78" />
    <line x1="68" y1="78" x2="70" y2="90" />
    <line x1="55" y1="68" x2="68" y2="82" />
    <line x1="68" y1="82" x2="76" y2="90" />
  </Figure>
);

// ============== KUGELSTOSSEN ==============
const KugelGriff = () => (
  <Figure>
    {/* Hand mit Kugel — Detailansicht */}
    <circle cx="55" cy="55" r="18" fill="currentColor" opacity="0.15" />
    <circle cx="55" cy="55" r="18" />
    {/* Hand-Andeutung */}
    <line x1="38" y1="60" x2="30" y2="78" />
    <line x1="42" y1="68" x2="34" y2="84" />
    <line x1="48" y1="72" x2="44" y2="88" />
    {/* Kugel-Label */}
    <circle cx="55" cy="55" r="3" fill="currentColor" />
  </Figure>
);

const KugelStand = () => (
  <Figure>
    <Ground />
    <Head cx={45} cy={26} />
    {/* Kugel am Hals */}
    <circle cx="52" cy="30" r="4" fill="currentColor" opacity="0.6" />
    <line x1="45" y1="31" x2="48" y2="58" />
    {/* Stoßarm gewinkelt */}
    <line x1="46" y1="34" x2="56" y2="32" />
    <line x1="56" y1="32" x2="52" y2="30" />
    {/* Freier Arm */}
    <line x1="44" y1="38" x2="32" y2="46" />
    {/* Beine seitlich */}
    <line x1="48" y1="58" x2="36" y2="88" />
    <line x1="48" y1="58" x2="62" y2="86" />
  </Figure>
);

const KugelDrehung = () => (
  <Figure>
    <Ground />
    <circle cx="50" cy="80" r="22" opacity="0.4" />
    <Head cx={50} cy={28} />
    <circle cx="58" cy="32" r="3.5" fill="currentColor" opacity="0.6" />
    <line x1="50" y1="33" x2="50" y2="60" />
    <line x1="50" y1="38" x2="60" y2="34" />
    <line x1="50" y1="38" x2="38" y2="46" />
    {/* Tiefe Hocke */}
    <line x1="50" y1="60" x2="38" y2="78" />
    <line x1="50" y1="60" x2="62" y2="78" />
    {/* Drehpfeil */}
    <path d="M 28 50 A 22 22 0 0 1 72 50" opacity="0.5" />
  </Figure>
);

const KugelStoss = () => (
  <Figure>
    <Ground />
    <Head cx={42} cy={26} />
    {/* Arm explodiert nach vorne-oben */}
    <line x1="44" y1="30" x2="72" y2="20" />
    <circle cx="76" cy="18" r="4" fill="currentColor" />
    <line x1="42" y1="31" x2="44" y2="58" />
    <line x1="42" y1="38" x2="30" y2="42" />
    <line x1="44" y1="58" x2="34" y2="88" />
    <line x1="44" y1="58" x2="56" y2="88" />
    {/* Flugkurve */}
    <path d="M 80 18 Q 92 6 96 22" opacity="0.4" strokeDasharray="2 3" />
  </Figure>
);

// ============== STAFFEL ==============
const StaffelHalten = () => (
  <Figure>
    <Ground />
    <Head cx={50} cy={22} />
    <line x1="50" y1="27" x2="50" y2="58" />
    <line x1="50" y1="34" x2="60" y2="44" />
    {/* Stab */}
    <line x1="60" y1="44" x2="74" y2="50" strokeWidth="3" />
    <line x1="50" y1="34" x2="40" y2="44" />
    <line x1="50" y1="58" x2="44" y2="90" />
    <line x1="50" y1="58" x2="56" y2="90" />
  </Figure>
);

const StaffelStand = () => (
  <Figure>
    <Ground />
    {/* Übergeber:in */}
    <Head cx={30} cy={26} />
    <line x1="30" y1="31" x2="30" y2="58" />
    <line x1="30" y1="38" x2="48" y2="42" />
    <line x1="48" y1="42" x2="58" y2="46" strokeWidth="3" />
    <line x1="30" y1="58" x2="26" y2="90" />
    <line x1="30" y1="58" x2="34" y2="90" />
    {/* Empfänger:in mit Hand nach hinten */}
    <Head cx={75} cy={26} />
    <line x1="75" y1="31" x2="75" y2="58" />
    <line x1="75" y1="38" x2="60" y2="46" />
    <line x1="75" y1="58" x2="70" y2="90" />
    <line x1="75" y1="58" x2="80" y2="90" />
  </Figure>
);

const StaffelUebergabe = () => (
  <Figure>
    <Ground />
    {/* Beide in Bewegung */}
    <Head cx={25} cy={28} />
    <line x1="25" y1="33" x2="28" y2="58" />
    <line x1="26" y1="40" x2="42" y2="46" />
    <line x1="42" y1="46" x2="54" y2="48" strokeWidth="3" />
    <line x1="28" y1="58" x2="18" y2="86" />
    <line x1="28" y1="58" x2="38" y2="86" />
    <Head cx={72} cy={28} />
    <line x1="72" y1="33" x2="70" y2="58" />
    <line x1="72" y1="40" x2="56" y2="48" />
    <line x1="70" y1="58" x2="64" y2="86" />
    <line x1="70" y1="58" x2="80" y2="86" />
    {/* Pfeil */}
    <line x1="42" y1="20" x2="58" y2="20" opacity="0.5" />
    <line x1="54" y1="16" x2="58" y2="20" opacity="0.5" />
    <line x1="54" y1="24" x2="58" y2="20" opacity="0.5" />
  </Figure>
);

const StaffelZiel = () => (
  <Figure>
    <Ground />
    {/* 4 kleine Läufer:innen */}
    {[15, 35, 55, 75].map((x, i) => (
      <g key={i}>
        <Head cx={x} cy={32} r={4} />
        <line x1={x} y1={36} x2={x + 2} y2={58} />
        <line x1={x} y1={42} x2={x - 6} y2={50} />
        <line x1={x} y1={42} x2={x + 8} y2={50} />
        <line x1={x + 2} y1={58} x2={x - 4} y2={82} />
        <line x1={x + 2} y1={58} x2={x + 8} y2={82} />
      </g>
    ))}
    {/* Stab oben */}
    <line x1="35" y1="14" x2="55" y2="14" strokeWidth="3" />
    <line x1="85" y1="20" x2="85" y2="92" strokeWidth="3" strokeDasharray="3 3" />
  </Figure>
);

// ============== RECK ==============
const ReckHang = () => (
  <Figure>
    <Bar y={26} />
    <Ground />
    <Head cx={50} cy={42} />
    <line x1="46" y1="38" x2="42" y2="28" />
    <line x1="54" y1="38" x2="58" y2="28" />
    <line x1="50" y1="47" x2="50" y2="72" />
    <line x1="50" y1="72" x2="44" y2="92" />
    <line x1="50" y1="72" x2="56" y2="92" />
  </Figure>
);

const ReckKnee = () => (
  <Figure>
    <Bar y={26} />
    <Ground />
    <Head cx={50} cy={42} />
    <line x1="46" y1="38" x2="42" y2="28" />
    <line x1="54" y1="38" x2="58" y2="28" />
    <line x1="50" y1="47" x2="50" y2="58" />
    <line x1="50" y1="58" x2="40" y2="48" />
    <line x1="40" y1="48" x2="46" y2="38" />
    <line x1="50" y1="58" x2="60" y2="48" />
    <line x1="60" y1="48" x2="54" y2="38" />
  </Figure>
);

const ReckHilfe = () => (
  <Figure>
    <Bar y={30} />
    <Ground />
    <Head cx={40} cy={36} />
    <line x1="44" y1="36" x2="50" y2="30" />
    <line x1="42" y1="40" x2="48" y2="32" />
    <line x1="44" y1="38" x2="58" y2="30" />
    <line x1="58" y1="30" x2="74" y2="22" />
    <line x1="58" y1="30" x2="78" y2="32" />
    {/* Helferhand */}
    <line x1="70" y1="50" x2="62" y2="42" opacity="0.6" />
    <circle cx="72" cy="52" r="3" fill="currentColor" opacity="0.4" />
  </Figure>
);

const ReckStuetz = () => (
  <Figure>
    <Bar y={30} />
    <Ground />
    <Head cx={50} cy={18} />
    <line x1="46" y1="22" x2="46" y2="30" />
    <line x1="54" y1="22" x2="54" y2="30" />
    <line x1="50" y1="23" x2="50" y2="30" />
    <line x1="50" y1="30" x2="44" y2="58" />
    <line x1="50" y1="30" x2="56" y2="58" />
  </Figure>
);

// ============== BARREN ==============
const BarrenStuetz = () => (
  <Figure>
    <Ground />
    {/* Holme */}
    <line x1="10" y1="50" x2="42" y2="50" strokeWidth="3" />
    <line x1="58" y1="50" x2="90" y2="50" strokeWidth="3" />
    <Head cx={50} cy={32} />
    <line x1="46" y1="36" x2="42" y2="50" />
    <line x1="54" y1="36" x2="58" y2="50" />
    <line x1="50" y1="37" x2="50" y2="50" />
    <line x1="50" y1="50" x2="44" y2="80" />
    <line x1="50" y1="50" x2="56" y2="80" />
  </Figure>
);

const BarrenSchwungKlein = () => (
  <Figure>
    <Ground />
    <line x1="10" y1="50" x2="42" y2="50" strokeWidth="3" />
    <line x1="58" y1="50" x2="90" y2="50" strokeWidth="3" />
    <Head cx={50} cy={32} />
    <line x1="46" y1="36" x2="42" y2="50" />
    <line x1="54" y1="36" x2="58" y2="50" />
    <line x1="50" y1="37" x2="50" y2="50" />
    {/* Beine leicht vor */}
    <line x1="50" y1="50" x2="62" y2="68" />
    <line x1="50" y1="50" x2="68" y2="74" />
    {/* Schwung-Pfeil */}
    <path d="M 36 80 Q 50 90 64 80" opacity="0.5" strokeDasharray="2 3" />
  </Figure>
);

const BarrenSchwungGross = () => (
  <Figure>
    <Ground />
    <line x1="10" y1="50" x2="42" y2="50" strokeWidth="3" />
    <line x1="58" y1="50" x2="90" y2="50" strokeWidth="3" />
    <Head cx={50} cy={32} />
    <line x1="46" y1="36" x2="42" y2="50" />
    <line x1="54" y1="36" x2="58" y2="50" />
    <line x1="50" y1="37" x2="50" y2="50" />
    {/* Beine hoch nach vorne */}
    <line x1="50" y1="50" x2="74" y2="42" />
    <line x1="74" y1="42" x2="88" y2="32" />
    <line x1="50" y1="50" x2="78" y2="48" />
    <line x1="78" y1="48" x2="92" y2="40" />
  </Figure>
);

const BarrenZiel = () => (
  <Figure>
    <Ground />
    <line x1="10" y1="50" x2="42" y2="50" strokeWidth="3" />
    <line x1="58" y1="50" x2="90" y2="50" strokeWidth="3" />
    <Head cx={50} cy={32} />
    <line x1="46" y1="36" x2="42" y2="50" />
    <line x1="54" y1="36" x2="58" y2="50" />
    <line x1="50" y1="37" x2="50" y2="50" />
    {/* Beine schwingen nach hinten hoch */}
    <line x1="50" y1="50" x2="28" y2="34" />
    <line x1="28" y1="34" x2="12" y2="24" />
    <line x1="50" y1="50" x2="24" y2="40" />
    <line x1="24" y1="40" x2="10" y2="32" />
    {/* Schwungbogen */}
    <path d="M 14 78 Q 50 96 86 78" opacity="0.4" strokeDasharray="2 3" />
  </Figure>
);

// ============== BALKEN ==============
const BalkenGehen = () => (
  <Figure>
    <Ground />
    {/* Balken */}
    <line x1="5" y1="78" x2="95" y2="78" strokeWidth="4" />
    <Head cx={50} cy={18} />
    <line x1="50" y1="23" x2="50" y2="52" />
    {/* Arme seitlich */}
    <line x1="50" y1="30" x2="28" y2="34" />
    <line x1="50" y1="30" x2="72" y2="34" />
    {/* Beine: ein Schritt */}
    <line x1="50" y1="52" x2="42" y2="78" />
    <line x1="50" y1="52" x2="58" y2="78" />
  </Figure>
);

const BalkenWaage = () => (
  <Figure>
    <Ground />
    <line x1="5" y1="78" x2="95" y2="78" strokeWidth="4" />
    {/* Rumpf horizontal */}
    <Head cx={28} cy={48} />
    <line x1="32" y1="50" x2="62" y2="50" />
    <line x1="34" y1="48" x2="22" y2="40" />
    <line x1="34" y1="50" x2="22" y2="56" />
    {/* Standbein */}
    <line x1="55" y1="50" x2="55" y2="78" />
    {/* Bein hinten hoch */}
    <line x1="60" y1="50" x2="85" y2="42" />
  </Figure>
);

const BalkenStrecksprung = () => (
  <Figure>
    <Ground />
    {/* Bodenmarkierung */}
    <line x1="30" y1="92" x2="70" y2="92" strokeWidth="3" />
    <Head cx={50} cy={22} />
    <line x1="50" y1="27" x2="50" y2="55" />
    <line x1="50" y1="32" x2="34" y2="22" />
    <line x1="50" y1="32" x2="66" y2="22" />
    {/* Gestreckte Beine in Luft */}
    <line x1="50" y1="55" x2="46" y2="80" />
    <line x1="50" y1="55" x2="54" y2="80" />
    {/* Drehpfeil */}
    <path d="M 30 70 A 20 8 0 0 1 70 70" opacity="0.5" strokeDasharray="2 3" />
  </Figure>
);

const BalkenZiel = () => (
  <Figure>
    <Ground />
    <line x1="5" y1="78" x2="95" y2="78" strokeWidth="4" />
    <Head cx={50} cy={18} />
    <line x1="50" y1="23" x2="50" y2="50" />
    <line x1="50" y1="28" x2="32" y2="24" />
    <line x1="50" y1="28" x2="68" y2="24" />
    <line x1="50" y1="50" x2="46" y2="72" />
    <line x1="50" y1="50" x2="54" y2="72" />
    {/* Drehpfeil oberhalb */}
    <path d="M 30 12 A 22 10 0 0 1 70 12" opacity="0.5" strokeDasharray="2 3" />
    <line x1="68" y1="8" x2="70" y2="12" opacity="0.5" />
    <line x1="68" y1="16" x2="70" y2="12" opacity="0.5" />
  </Figure>
);

// ============== BODEN ==============
const BodenWiege = () => (
  <Figure>
    <Ground />
    {/* In Rückenlage zusammengerollt */}
    <circle cx="50" cy="68" r="18" />
    <Head cx={32} cy={68} r={4} />
    {/* Knie zur Brust */}
    <line x1="50" y1="50" x2="40" y2="58" />
    <line x1="40" y1="58" x2="46" y2="68" />
    {/* Schwingpfeil */}
    <path d="M 24 88 Q 50 96 76 88" opacity="0.5" strokeDasharray="2 3" />
  </Figure>
);

const BodenRolleAnsatz = () => (
  <Figure>
    <Ground />
    {/* schiefe Ebene */}
    <line x1="10" y1="92" x2="80" y2="60" strokeWidth="2.5" />
    <Head cx={70} cy={56} />
    <line x1="68" y1="60" x2="60" y2="72" />
    <line x1="60" y1="72" x2="50" y2="78" />
    <line x1="50" y1="78" x2="44" y2="88" />
  </Figure>
);

const BodenRolleMitte = () => (
  <Figure>
    <Ground />
    <Head cx={40} cy={70} />
    <line x1="44" y1="68" x2="60" y2="74" />
    <line x1="60" y1="74" x2="58" y2="60" />
    <line x1="60" y1="74" x2="68" y2="62" />
    <path d="M 40 75 Q 55 88 70 78" />
  </Figure>
);

const BodenRolleStand = () => (
  <Figure>
    <Ground />
    <Head cx={50} cy={20} />
    <line x1="50" y1="25" x2="50" y2="58" />
    <line x1="50" y1="32" x2="38" y2="46" />
    <line x1="50" y1="32" x2="62" y2="46" />
    <line x1="50" y1="58" x2="44" y2="90" />
    <line x1="50" y1="58" x2="56" y2="90" />
  </Figure>
);

const MAP: Record<string, () => React.ReactElement> = {
  "sprint-stand": SprintStand,
  "sprint-skipping": SprintSkipping,
  "sprint-tiefstart": SprintTiefstart,
  "sprint-ziel": SprintZiel,
  "weit-stand": WeitStand,
  "weit-absprung": WeitAbsprung,
  "weit-flug": WeitFlug,
  "weit-landung": WeitLandung,
  "kugel-griff": KugelGriff,
  "kugel-stand": KugelStand,
  "kugel-drehung": KugelDrehung,
  "kugel-stoss": KugelStoss,
  "staffel-halten": StaffelHalten,
  "staffel-stand": StaffelStand,
  "staffel-uebergabe": StaffelUebergabe,
  "staffel-ziel": StaffelZiel,
  "reck-hang": ReckHang,
  "reck-knee": ReckKnee,
  "reck-hilfe": ReckHilfe,
  "reck-stuetz": ReckStuetz,
  "barren-stuetz": BarrenStuetz,
  "barren-schwung-klein": BarrenSchwungKlein,
  "barren-schwung-gross": BarrenSchwungGross,
  "barren-ziel": BarrenZiel,
  "balken-gehen": BalkenGehen,
  "balken-waage": BalkenWaage,
  "balken-strecksprung": BalkenStrecksprung,
  "balken-ziel": BalkenZiel,
  "boden-wiege": BodenWiege,
  "boden-rolle-ansatz": BodenRolleAnsatz,
  "boden-rolle-mitte": BodenRolleMitte,
  "boden-rolle-stand": BodenRolleStand,
};

export function StationCardGraphic({ kind }: { kind: string }) {
  const Comp = MAP[kind];
  if (!Comp) {
    return (
      <div className="flex h-full w-full items-center justify-center text-xs opacity-40">
        kein Bild
      </div>
    );
  }
  return <Comp />;
}
