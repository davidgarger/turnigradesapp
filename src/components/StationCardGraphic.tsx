// Flache Vektor-Illustrationen für alle Stationenkarten.
// Stil: runde Formen, gefüllte Körper, kräftige Disziplin-Farben.
// currentColor steuert die Disziplin-Farbe (Blau LA / Orange GT).
// ViewBox 100x100.

const SKIN = "#F2C9A6";
const SKIN_DARK = "#D8A584";
const HAIR = "#3D2A20";
const SHOE = "#1F2937";
const GROUND = "#E5E7EB";
const GEAR = "#374151";
const WHITE = "#FFFFFF";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      role="img"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const Floor = ({ y = 92 }: { y?: number }) => (
  <rect x="0" y={y} width="100" height={100 - y} fill={GROUND} rx="0" />
);

// ---- Wiederverwendbare Körperteile ----
// "Figur" zeichnet einen flachen, abgerundeten Körper.
// Parameter steuern Pose grob; Details kommen pro Karte dazu.

type BodyProps = {
  cx: number; // Brustmitte X
  cy: number; // Brustmitte Y
  headR?: number;
  jersey?: string; // override
};

function Head({ cx, cy, r = 7 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy - r - 0.5} r={r + 2} fill={HAIR} />
      <circle cx={cx} cy={cy} r={r} fill={SKIN} />
      <circle cx={cx} cy={cy - r - 1} r={r + 1.5} fill={HAIR} />
      <rect x={cx - r - 0.5} y={cy - 1.5} width={r * 2 + 1} height="3" fill={SKIN} />
    </g>
  );
}

function Torso({
  cx,
  cy,
  w = 14,
  h = 18,
  rot = 0,
  jersey,
}: BodyProps & { w?: number; h?: number; rot?: number }) {
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      <rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={w / 2}
        fill={jersey ?? "currentColor"}
      />
    </g>
  );
}

function Limb({
  x1,
  y1,
  x2,
  y2,
  width = 5,
  color = SKIN,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width?: number;
  color?: string;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
}

function Shoe({ x, y, r = 3 }: { x: number; y: number; r?: number }) {
  return <ellipse cx={x} cy={y} rx={r + 1} ry={r - 0.5} fill={SHOE} />;
}

// ============== SPRINT (Leichtathletik) ==============
const SprintStand = () => (
  <Frame>
    <Floor />
    {/* Startlinie */}
    <rect x="18" y="90" width="24" height="3" fill={WHITE} stroke={GEAR} strokeWidth="0.5" />
    <Head cx={50} cy={22} />
    <Torso cx={50} cy={42} h={22} />
    <Limb x1={50} y1={36} x2={40} y2={50} />
    <Limb x1={50} y1={36} x2={60} y2={50} />
    <Limb x1={50} y1={52} x2={45} y2={80} />
    <Limb x1={50} y1={52} x2={55} y2={80} />
    <Shoe x={45} y={88} />
    <Shoe x={55} y={88} />
  </Frame>
);

const SprintSkipping = () => (
  <Frame>
    <Floor />
    <Head cx={50} cy={18} />
    <Torso cx={50} cy={38} h={20} />
    {/* Arme 90° */}
    <Limb x1={50} y1={32} x2={64} y2={28} />
    <Limb x1={64} y1={28} x2={70} y2={40} />
    <Limb x1={50} y1={32} x2={36} y2={38} />
    <Limb x1={36} y1={38} x2={32} y2={26} />
    {/* Knie hoch */}
    <Limb x1={50} y1={48} x2={62} y2={50} />
    <Limb x1={62} y1={50} x2={58} y2={70} />
    <Limb x1={50} y1={48} x2={48} y2={72} />
    <Limb x1={48} y1={72} x2={52} y2={88} />
    <Shoe x={58} y={70} r={2.5} />
    <Shoe x={52} y={88} />
  </Frame>
);

const SprintTiefstart = () => (
  <Frame>
    <Floor />
    {/* Startblock */}
    <rect x="62" y="82" width="20" height="8" rx="2" fill={GEAR} />
    <rect x="62" y="78" width="6" height="6" rx="1" fill={GEAR} />
    <Head cx={30} cy={50} />
    <Torso cx={45} cy={60} w={16} h={20} rot={70} />
    {/* Stützarme */}
    <Limb x1={30} y1={56} x2={28} y2={84} />
    <Limb x1={36} y1={58} x2={36} y2={86} />
    {/* Beine */}
    <Limb x1={55} y1={66} x2={70} y2={80} width={6} />
    <Limb x1={52} y1={70} x2={50} y2={88} width={6} />
    <Shoe x={28} y={86} r={2} />
    <Shoe x={36} y={88} r={2} />
  </Frame>
);

const SprintZiel = () => (
  <Frame>
    <Floor />
    {/* Ziellinie kariert */}
    <g>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect
          key={i}
          x="78"
          y={12 + i * 10}
          width="6"
          height="5"
          fill={i % 2 === 0 ? GEAR : WHITE}
        />
      ))}
      <rect x="78" y="12" width="6" height="80" fill="none" stroke={GEAR} strokeWidth="0.5" />
    </g>
    <Head cx={42} cy={18} />
    <Torso cx={44} cy={40} h={22} rot={-10} />
    <Limb x1={44} y1={32} x2={28} y2={22} />
    <Limb x1={46} y1={36} x2={62} y2={30} />
    <Limb x1={46} y1={52} x2={34} y2={72} />
    <Limb x1={34} y1={72} x2={38} y2={88} />
    <Limb x1={48} y1={50} x2={62} y2={62} />
    <Limb x1={62} y1={62} x2={66} y2={84} />
    <Shoe x={38} y={88} />
    <Shoe x={66} y={86} />
  </Frame>
);

// ============== WEITSPRUNG ==============
const WeitStand = () => (
  <Frame>
    <Floor />
    <rect x="20" y="89" width="22" height="4" fill="currentColor" opacity="0.8" />
    <Head cx={48} cy={22} />
    <Torso cx={48} cy={42} h={22} />
    <Limb x1={48} y1={36} x2={34} y2={48} />
    <Limb x1={48} y1={36} x2={62} y2={48} />
    {/* Hocke */}
    <Limb x1={48} y1={52} x2={40} y2={68} />
    <Limb x1={40} y1={68} x2={44} y2={86} />
    <Limb x1={48} y1={52} x2={56} y2={68} />
    <Limb x1={56} y1={68} x2={54} y2={86} />
    <Shoe x={44} y={88} />
    <Shoe x={54} y={88} />
  </Frame>
);

const WeitAbsprung = () => (
  <Frame>
    <Floor />
    <rect x="20" y="89" width="22" height="4" fill="currentColor" opacity="0.8" />
    <Head cx={36} cy={24} />
    <Torso cx={40} cy={42} h={20} rot={-15} />
    <Limb x1={38} y1={34} x2={52} y2={24} />
    <Limb x1={38} y1={34} x2={24} y2={42} />
    {/* Absprungbein gestreckt */}
    <Limb x1={42} y1={52} x2={36} y2={86} width={6} />
    {/* Schwungbein hoch */}
    <Limb x1={42} y1={52} x2={62} y2={46} width={6} />
    <Limb x1={62} y1={46} x2={74} y2={56} width={6} />
    <Shoe x={36} y={88} />
    <Shoe x={74} y={58} />
  </Frame>
);

const WeitFlug = () => (
  <Frame>
    <Floor />
    {/* Sandgrube */}
    <rect x="40" y="90" width="55" height="3" fill="#E8D4A8" />
    <Head cx={50} cy={36} />
    <Torso cx={52} cy={54} h={20} rot={20} />
    <Limb x1={50} y1={46} x2={36} y2={40} />
    <Limb x1={52} y1={46} x2={66} y2={36} />
    <Limb x1={56} y1={62} x2={44} y2={70} />
    <Limb x1={58} y1={62} x2={72} y2={66} />
    <Shoe x={42} y={70} />
    <Shoe x={74} y={66} />
    {/* Flugkurve */}
    <path
      d="M 14 80 Q 30 30 60 50"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="3 2"
      opacity="0.5"
    />
  </Frame>
);

const WeitLandung = () => (
  <Frame>
    <Floor />
    <rect x="20" y="88" width="75" height="5" fill="#E8D4A8" />
    <Head cx={50} cy={40} />
    <Torso cx={52} cy={58} h={20} rot={-10} />
    <Limb x1={50} y1={50} x2={36} y2={48} />
    <Limb x1={54} y1={50} x2={68} y2={42} />
    <Limb x1={56} y1={66} x2={68} y2={78} width={6} />
    <Limb x1={68} y1={78} x2={72} y2={88} width={6} />
    <Limb x1={56} y1={66} x2={66} y2={82} width={6} />
    <Limb x1={66} y1={82} x2={78} y2={88} width={6} />
    <Shoe x={72} y={88} />
    <Shoe x={78} y={88} />
  </Frame>
);

// ============== KUGELSTOSSEN ==============
const KugelGriff = () => (
  <Frame>
    {/* Detail: Hand mit Kugel */}
    <circle cx={50} cy={50} r={36} fill={GROUND} opacity="0.4" />
    {/* Hand */}
    <ellipse cx={42} cy={62} rx={14} ry={10} fill={SKIN} />
    <ellipse cx={42} cy={62} rx={14} ry={10} fill="none" stroke={SKIN_DARK} strokeWidth="0.8" />
    {/* Finger */}
    <rect x={30} y={48} width={4} height={14} rx={2} fill={SKIN} />
    <rect x={36} y={44} width={4} height={18} rx={2} fill={SKIN} />
    <rect x={42} y={42} width={4} height={20} rx={2} fill={SKIN} />
    <rect x={48} y={46} width={4} height={18} rx={2} fill={SKIN} />
    {/* Kugel */}
    <circle cx={56} cy={42} r={18} fill={GEAR} />
    <circle cx={50} cy={36} r={5