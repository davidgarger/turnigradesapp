// Flache Vektor-Illustrationen für alle Stationenkarten.
// Stil: runde Formen, gefüllte Körper, kräftige Disziplin-Farben.
// `currentColor` steuert die Disziplin-Farbe (Blau LA / Orange GT)
// und färbt Trikot + Sportgerät passend ein.

import React from "react";

const SKIN = "#F2C9A6";
const HAIR = "#3D2A20";
const SHOE = "#1F2937";
const GROUND = "#E5E7EB";
const GEAR = "#374151";
const WHITE = "#FFFFFF";
const SAND = "#EBD7AC";
const MAT = "#C9E4D1";

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

const Floor = ({ y = 92, fill = GROUND }: { y?: number; fill?: string }) => (
  <rect x="0" y={y} width="100" height={100 - y} fill={fill} />
);

function Head({ cx, cy, r = 6 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={SKIN} />
      <path
        d={`M ${cx - r} ${cy - 1} Q ${cx - r} ${cy - r - 2} ${cx} ${cy - r - 1} Q ${cx + r} ${cy - r - 2} ${cx + r} ${cy - 1} L ${cx + r - 1} ${cy - r + 1} Q ${cx} ${cy - r - 0.5} ${cx - r + 1} ${cy - r + 1} Z`}
        fill={HAIR}
      />
    </g>
  );
}

function Limb({
  x1, y1, x2, y2, w = 4.5, color = SKIN,
}: { x1: number; y1: number; x2: number; y2: number; w?: number; color?: string }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeLinecap="round" />
  );
}

function Sleeve({ x1, y1, x2, y2, w = 6 }: { x1: number; y1: number; x2: number; y2: number; w?: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={w} strokeLinecap="round" />;
}

function Short({ x1, y1, x2, y2, w = 7 }: { x1: number; y1: number; x2: number; y2: number; w?: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={w} strokeLinecap="round" opacity="0.85" />;
}

function Torso({ cx, cy, w = 14, h = 18, rot = 0 }: { cx: number; cy: number; w?: number; h?: number; rot?: number }) {
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={w / 2} fill="currentColor" />
    </g>
  );
}

function Shoe({ x, y, r = 3 }: { x: number; y: number; r?: number }) {
  return <ellipse cx={x} cy={y} rx={r + 1} ry={r - 0.8} fill={SHOE} />;
}

// ============== SPRINT ==============
const SprintStand = () => (
  <Frame>
    <Floor />
    <rect x="18" y="89" width="26" height="3" fill={WHITE} stroke={GEAR} strokeWidth="0.6" />
    <Head cx={50} cy={20} />
    <Torso cx={50} cy={38} h={20} />
    <Sleeve x1={50} y1={32} x2={40} y2={42} />
    <Sleeve x1={50} y1={32} x2={60} y2={42} />
    <Limb x1={40} y1={42} x2={36} y2={52} />
    <Limb x1={60} y1={42} x2={64} y2={52} />
    <Short x1={50} y1={48} x2={45} y2={62} />
    <Short x1={50} y1={48} x2={55} y2={62} />
    <Limb x1={45} y1={62} x2={44} y2={85} />
    <Limb x1={55} y1={62} x2={56} y2={85} />
    <Shoe x={44} y={87} />
    <Shoe x={56} y={87} />
  </Frame>
);

const SprintSkipping = () => (
  <Frame>
    <Floor />
    <Head cx={50} cy={16} />
    <Torso cx={50} cy={34} h={18} />
    <Sleeve x1={50} y1={28} x2={64} y2={24} />
    <Limb x1={64} y1={24} x2={70} y2={36} />
    <Sleeve x1={50} y1={28} x2={36} y2={36} />
    <Limb x1={36} y1={36} x2={32} y2={24} />
    <Short x1={50} y1={42} x2={62} y2={48} />
    <Limb x1={62} y1={48} x2={58} y2={68} />
    <Short x1={50} y1={42} x2={48} y2={58} />
    <Limb x1={48} y1={58} x2={52} y2={84} />
    <Shoe x={58} y={68} r={2.5} />
    <Shoe x={52} y={86} />
  </Frame>
);

const SprintTiefstart = () => (
  <Frame>
    <Floor />
    <rect x="60" y="82" width="22" height="8" rx="2" fill={GEAR} />
    <rect x="60" y="76" width="7" height="8" rx="1.5" fill={GEAR} />
    <Head cx={28} cy={48} />
    <Torso cx={46} cy={58} w={14} h={20} rot={70} />
    <Sleeve x1={32} y1={52} x2={30} y2={70} />
    <Limb x1={30} y1={70} x2={28} y2={84} />
    <Sleeve x1={36} y1={56} x2={36} y2={72} />
    <Limb x1={36} y1={72} x2={36} y2={86} />
    <Short x1={56} y1={66} x2={70} y2={78} />
    <Limb x1={70} y1={78} x2={72} y2={86} />
    <Short x1={54} y1={68} x2={52} y2={82} />
    <Limb x1={52} y1={82} x2={50} y2={88} />
    <Shoe x={28} y={86} r={2.2} />
    <Shoe x={36} y={88} r={2.2} />
  </Frame>
);

const SprintZiel = () => (
  <Frame>
    <Floor />
    <g>
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x="80" y={12 + i * 10} width="6" height="5" fill={i % 2 === 0 ? GEAR : WHITE} />
      ))}
      <rect x="80" y="12" width="6" height="80" fill="none" stroke={GEAR} strokeWidth="0.6" />
    </g>
    <Head cx={42} cy={18} />
    <Torso cx={44} cy={38} h={20} rot={-12} />
    <Sleeve x1={44} y1={32} x2={28} y2={22} />
    <Sleeve x1={46} y1={34} x2={62} y2={30} />
    <Short x1={46} y1={48} x2={36} y2={62} />
    <Limb x1={36} y1={62} x2={38} y2={86} />
    <Short x1={48} y1={48} x2={60} y2={60} />
    <Limb x1={60} y1={60} x2={64} y2={84} />
    <Shoe x={38} y={88} />
    <Shoe x={64} y={86} />
  </Frame>
);

// ============== WEITSPRUNG ==============
const WeitStand = () => (
  <Frame>
    <Floor />
    <rect x="20" y="88" width="22" height="5" fill="currentColor" opacity="0.85" />
    <Head cx={48} cy={22} />
    <Torso cx={48} cy={40} h={20} />
    <Sleeve x1={48} y1={34} x2={36} y2={46} />
    <Sleeve x1={48} y1={34} x2={60} y2={46} />
    <Short x1={48} y1={50} x2={42} y2={64} />
    <Limb x1={42} y1={64} x2={44} y2={86} />
    <Short x1={48} y1={50} x2={54} y2={64} />
    <Limb x1={54} y1={64} x2={54} y2={86} />
    <Shoe x={44} y={87} />
    <Shoe x={54} y={87} />
  </Frame>
);

const WeitAbsprung = () => (
  <Frame>
    <Floor />
    <rect x="18" y="88" width="22" height="5" fill="currentColor" opacity="0.85" />
    <Head cx={36} cy={22} />
    <Torso cx={40} cy={40} h={20} rot={-18} />
    <Sleeve x1={38} y1={32} x2={52} y2={22} />
    <Sleeve x1={38} y1={32} x2={24} y2={42} />
    <Short x1={42} y1={50} x2={38} y2={70} />
    <Limb x1={38} y1={70} x2={36} y2={86} />
    <Short x1={42} y1={50} x2={60} y2={44} />
    <Limb x1={60} y1={44} x2={72} y2={52} />
    <Shoe x={36} y={88} />
    <Shoe x={74} y={54} r={2.5} />
  </Frame>
);

const WeitFlug = () => (
  <Frame>
    <Floor />
    <rect x="40" y="89" width="55" height="4" fill={SAND} />
    <path d="M 14 78 Q 30 28 60 50" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.5" />
    <Head cx={50} cy={34} />
    <Torso cx={52} cy={52} h={20} rot={18} />
    <Sleeve x1={50} y1={44} x2={36} y2={38} />
    <Sleeve x1={52} y1={44} x2={66} y2={34} />
    <Short x1={56} y1={60} x2={46} y2={70} />
    <Limb x1={46} y1={70} x2={42} y2={76} />
    <Short x1={58} y1={60} x2={70} y2={62} />
    <Limb x1={70} y1={62} x2={76} y2={64} />
    <Shoe x={42} y={76} r={2.5} />
    <Shoe x={78} y={64} r={2.5} />
  </Frame>
);

const WeitLandung = () => (
  <Frame>
    <Floor />
    <rect x="20" y="86" width="76" height="7" fill={SAND} />
    <Head cx={48} cy={38} />
    <Torso cx={52} cy={56} h={20} rot={-12} />
    <Sleeve x1={50} y1={48} x2={36} y2={46} />
    <Sleeve x1={54} y1={48} x2={68} y2={40} />
    <Short x1={56} y1={64} x2={68} y2={76} />
    <Limb x1={68} y1={76} x2={72} y2={86} />
    <Short x1={56} y1={64} x2={66} y2={80} />
    <Limb x1={66} y1={80} x2={78} y2={86} />
    <Shoe x={72} y={86} />
    <Shoe x={78} y={86} />
  </Frame>
);

// ============== KUGELSTOSSEN ==============
const KugelGriff = () => (
  <Frame>
    <circle cx={50} cy={52} r={38} fill={GROUND} opacity="0.5" />
    <ellipse cx={44} cy={64} rx={16} ry={11} fill={SKIN} />
    <rect x={32} y={48} width={5} height={16} rx={2.5} fill={SKIN} />
    <rect x={39} y={42} width={5} height={22} rx={2.5} fill={SKIN} />
    <rect x={46} y={40} width={5} height={24} rx={2.5} fill={SKIN} />
    <rect x={53} y={44} width={5} height={20} rx={2.5} fill={SKIN} />
    <circle cx={56} cy={42} r={18} fill={GEAR} />
    <circle cx={50} cy={36} r={5} fill={WHITE} opacity="0.4" />
  </Frame>
);

const KugelStand = () => (
  <Frame>
    <Floor />
    <Head cx={44} cy={22} />
    <Torso cx={46} cy={42} h={22} />
    <circle cx={54} cy={30} r={5} fill={GEAR} />
    <Sleeve x1={46} y1={34} x2={54} y2={30} />
    <Sleeve x1={46} y1={36} x2={32} y2={44} />
    <Short x1={46} y1={52} x2={36} y2={68} />
    <Limb x1={36} y1={68} x2={32} y2={86} />
    <Short x1={46} y1={52} x2={58} y2={68} />
    <Limb x1={58} y1={68} x2={62} y2={86} />
    <Shoe x={32} y={88} />
    <Shoe x={62} y={88} />
  </Frame>
);

const KugelDrehung = () => (
  <Frame>
    <Floor />
    <circle cx={50} cy={82} r={24} fill="none" stroke={GEAR} strokeWidth="1" strokeDasharray="2 2" />
    <Head cx={50} cy={24} />
    <Torso cx={50} cy={42} h={20} />
    <circle cx={58} cy={32} r={4.5} fill={GEAR} />
    <Sleeve x1={50} y1={36} x2={58} y2={32} />
    <Sleeve x1={50} y1={36} x2={38} y2={44} />
    <Short x1={50} y1={50} x2={38} y2={68} />
    <Limb x1={38} y1={68} x2={36} y2={82} />
    <Short x1={50} y1={50} x2={62} y2={68} />
    <Limb x1={62} y1={68} x2={64} y2={82} />
    <path d="M 28 50 A 22 22 0 0 1 72 50" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.6" />
    <Shoe x={36} y={84} />
    <Shoe x={64} y={84} />
  </Frame>
);

const KugelStoss = () => (
  <Frame>
    <Floor />
    <Head cx={38} cy={24} />
    <Torso cx={42} cy={42} h={22} rot={-8} />
    <Sleeve x1={42} y1={32} x2={68} y2={20} />
    <circle cx={74} cy={16} r={6} fill={GEAR} />
    <Sleeve x1={40} y1={36} x2={28} y2={42} />
    <Short x1={42} y1={52} x2={32} y2={68} />
    <Limb x1={32} y1={68} x2={28} y2={86} />
    <Short x1={44} y1={52} x2={56} y2={68} />
    <Limb x1={56} y1={68} x2={60} y2={86} />
    <path d="M 78 14 Q 92 4 96 22" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.6" />
    <Shoe x={28} y={88} />
    <Shoe x={60} y={88} />
  </Frame>
);

// ============== STAFFEL ==============
const StaffelHalten = () => (
  <Frame>
    <Floor />
    <Head cx={50} cy={20} />
    <Torso cx={50} cy={40} h={22} />
    <Sleeve x1={50} y1={34} x2={62} y2={44} />
    <Limb x1={62} y1={44} x2={72} y2={50} />
    <rect x={70} y={47} width={20} height={5} rx={2.5} fill={GEAR} transform="rotate(10 80 50)" />
    <Sleeve x1={50} y1={34} x2={38} y2={44} />
    <Short x1={50} y1={52} x2={44} y2={66} />
    <Limb x1={44} y1={66} x2={44} y2={86} />
    <Short x1={50} y1={52} x2={56} y2={66} />
    <Limb x1={56} y1={66} x2={56} y2={86} />
    <Shoe x={44} y={88} />
    <Shoe x={56} y={88} />
  </Frame>
);

const StaffelStand = () => (
  <Frame>
    <Floor />
    <Head cx={26} cy={22} r={5} />
    <Torso cx={26} cy={40} w={11} h={18} />
    <Sleeve x1={26} y1={34} x2={42} y2={44} />
    <Limb x1={42} y1={44} x2={54} y2={48} />
    <rect x={50} y={45} width={16} height={4} rx={2} fill={GEAR} transform="rotate(8 58 47)" />
    <Sleeve x1={26} y1={34} x2={18} y2={44} />
    <Short x1={26} y1={50} x2={22} y2={66} />
    <Limb x1={22} y1={66} x2={22} y2={86} />
    <Short x1={26} y1={50} x2={30} y2={66} />
    <Limb x1={30} y1={66} x2={30} y2={86} />
    <Shoe x={22} y={88} r={2.2} />
    <Shoe x={30} y={88} r={2.2} />
    <Head cx={76} cy={22} r={5} />
    <Torso cx={76} cy={40} w={11} h={18} />
    <Sleeve x1={76} y1={34} x2={66} y2={46} />
    <Sleeve x1={76} y1={34} x2={84} y2={42} />
    <Short x1={76} y1={50} x2={72} y2={66} />
    <Limb x1={72} y1={66} x2={72} y2={86} />
    <Short x1={76} y1={50} x2={80} y2={66} />
    <Limb x1={80} y1={66} x2={80} y2={86} />
    <Shoe x={72} y={88} r={2.2} />
    <Shoe x={80} y={88} r={2.2} />
  </Frame>
);

const StaffelUebergabe = () => (
  <Frame>
    <Floor />
    <Head cx={22} cy={24} r={5} />
    <Torso cx={24} cy={42} w={11} h={18} />
    <Sleeve x1={24} y1={36} x2={42} y2={46} />
    <Limb x1={42} y1={46} x2={52} y2={48} />
    <rect x={48} y={45} width={16} height={4} rx={2} fill={GEAR} transform="rotate(5 56 47)" />
    <Sleeve x1={24} y1={36} x2={14} y2={46} />
    <Short x1={24} y1={52} x2={16} y2={68} />
    <Limb x1={16} y1={68} x2={16} y2={84} />
    <Short x1={24} y1={52} x2={32} y2={68} />
    <Limb x1={32} y1={68} x2={36} y2={84} />
    <Shoe x={16} y={86} r={2.2} />
    <Shoe x={36} y={86} r={2.2} />
    <Head cx={76} cy={24} r={5} />
    <Torso cx={74} cy={42} w={11} h={18} />
    <Sleeve x1={74} y1={36} x2={60} y2={48} />
    <Sleeve x1={74} y1={36} x2={86} y2={44} />
    <Short x1={74} y1={52} x2={66} y2={68} />
    <Limb x1={66} y1={68} x2={64} y2={84} />
    <Short x1={74} y1={52} x2={82} y2={68} />
    <Limb x1={82} y1={68} x2={84} y2={84} />
    <Shoe x={64} y={86} r={2.2} />
    <Shoe x={84} y={86} r={2.2} />
  </Frame>
);

const StaffelZiel = () => (
  <Frame>
    <Floor />
    {[18, 38, 58, 78].map((x, i) => (
      <g key={i}>
        <Head cx={x} cy={32} r={4} />
        <Torso cx={x} cy={46} w={9} h={14} />
        <Sleeve x1={x} y1={42} x2={x - 6} y2={50} w={4} />
        <Sleeve x1={x} y1={42} x2={x + 6} y2={50} w={4} />
        <Short x1={x} y1={54} x2={x - 4} y2={66} w={5} />
        <Limb x1={x - 4} y1={66} x2={x - 4} y2={82} w={3.5} />
        <Short x1={x} y1={54} x2={x + 4} y2={66} w={5} />
        <Limb x1={x + 4} y1={66} x2={x + 4} y2={82} w={3.5} />
        <Shoe x={x - 4} y={84} r={2} />
        <Shoe x={x + 4} y={84} r={2} />
      </g>
    ))}
    <rect x={32} y={12} width={36} height={4} rx={2} fill={GEAR} />
    <text x={50} y={22} textAnchor="middle" fontSize="6" fill={GEAR} fontWeight="700">4 × 1</text>
  </Frame>
);

// ============== RECK ==============
const Bar = ({ y = 28 }: { y?: number }) => (
  <g>
    <rect x="6" y="14" width="4" height={y + 60} fill={GEAR} />
    <rect x="90" y="14" width="4" height={y + 60} fill={GEAR} />
    <rect x="6" y={y - 2} width="88" height="5" rx="2.5" fill={GEAR} />
  </g>
);

const ReckHang = () => (
  <Frame>
    <Floor />
    <Bar y={26} />
    <Head cx={50} cy={42} />
    <Torso cx={50} cy={60} h={20} />
    <Sleeve x1={50} y1={54} x2={46} y2={32} />
    <Sleeve x1={50} y1={54} x2={54} y2={32} />
    <Short x1={50} y1={70} x2={45} y2={80} />
    <Limb x1={45} y1={80} x2={45} y2={90} />
    <Short x1={50} y1={70} x2={55} y2={80} />
    <Limb x1={55} y1={80} x2={55} y2={90} />
    <Shoe x={45} y={92} />
    <Shoe x={55} y={92} />
  </Frame>
);

const ReckKnee = () => (
  <Frame>
    <Floor />
    <Bar y={28} />
    <Head cx={50} cy={44} />
    <Torso cx={50} cy={60} h={18} />
    <Sleeve x1={50} y1={54} x2={46} y2={34} />
    <Sleeve x1={50} y1={54} x2={54} y2={34} />
    <Short x1={50} y1={68} x2={38} y2={56} />
    <Limb x1={38} y1={56} x2={42} y2={36} />
    <Short x1={50} y1={68} x2={62} y2={56} />
    <Limb x1={62} y1={56} x2={58} y2={36} />
    <Shoe x={42} y={34} r={2.5} />
    <Shoe x={58} y={34} r={2.5} />
  </Frame>
);

const ReckHilfe = () => (
  <Frame>
    <Floor />
    <Bar y={32} />
    <Head cx={42} cy={38} />
    <Torso cx={44} cy={54} h={18} rot={-20} />
    <Sleeve x1={44} y1={48} x2={50} y2={34} />
    <Sleeve x1={44} y1={48} x2={48} y2={34} />
    <Short x1={48} y1={62} x2={62} y2={56} />
    <Limb x1={62} y1={56} x2={76} y2={46} />
    <Short x1={48} y1={62} x2={64} y2={62} />
    <Limb x1={64} y1={62} x2={78} y2={56} />
    <ellipse cx={72} cy={70} rx={8} ry={5} fill={SKIN} opacity="0.7" />
    <Limb x1={72} y1={70} x2={88} y2={86} color={SKIN} />
  </Frame>
);

const ReckStuetz = () => (
  <Frame>
    <Floor />
    <Bar y={32} />
    <Head cx={50} cy={20} />
    <Torso cx={50} cy={38} h={16} />
    <Limb x1={46} y1={32} x2={46} y2={32} />
    <Limb x1={54} y1={32} x2={54} y2={32} />
    <Short x1={50} y1={46} x2={44} y2={60} />
    <Limb x1={44} y1={60} x2={42} y2={78} />
    <Short x1={50} y1={46} x2={56} y2={60} />
    <Limb x1={56} y1={60} x2={58} y2={78} />
    <Shoe x={42} y={80} />
    <Shoe x={58} y={80} />
  </Frame>
);

// ============== BARREN ==============
const Holme = () => (
  <g>
    <rect x="5" y="48" width="38" height="4" rx="2" fill={GEAR} />
    <rect x="57" y="48" width="38" height="4" rx="2" fill={GEAR} />
    <rect x="10" y="52" width="3" height="40" fill={GEAR} />
    <rect x="35" y="52" width="3" height="40" fill={GEAR} />
    <rect x="62" y="52" width="3" height="40" fill={GEAR} />
    <rect x="87" y="52" width="3" height="40" fill={GEAR} />
  </g>
);

const BarrenStuetz = () => (
  <Frame>
    <Floor />
    <Holme />
    <Head cx={50} cy={28} />
    <Torso cx={50} cy={44} h={16} />
    <Sleeve x1={48} y1={38} x2={42} y2={48} />
    <Sleeve x1={52} y1={38} x2={58} y2={48} />
    <Short x1={50} y1={52} x2={46} y2={68} />
    <Limb x1={46} y1={68} x2={46} y2={82} />
    <Short x1={50} y1={52} x2={54} y2={68} />
    <Limb x1={54} y1={68} x2={54} y2={82} />
    <Shoe x={46} y={84} />
    <Shoe x={54} y={84} />
  </Frame>
);

const BarrenSchwungKlein = () => (
  <Frame>
    <Floor />
    <Holme />
    <Head cx={50} cy={28} />
    <Torso cx={50} cy={44} h={16} />
    <Sleeve x1={48} y1={38} x2={42} y2={48} />
    <Sleeve x1={52} y1={38} x2={58} y2={48} />
    <Short x1={50} y1={52} x2={62} y2={66} />
    <Limb x1={62} y1={66} x2={68} y2={76} />
    <Short x1={50} y1={52} x2={66} y2={72} />
    <Limb x1={66} y1={72} x2={72} y2={82} />
    <path d="M 36 84 Q 50 92 64 84" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.6" />
    <Shoe x={68} y={78} r={2.5} />
    <Shoe x={72} y={84} r={2.5} />
  </Frame>
);

const BarrenSchwungGross = () => (
  <Frame>
    <Floor />
    <Holme />
    <Head cx={50} cy={28} />
    <Torso cx={50} cy={44} h={16} />
    <Sleeve x1={48} y1={38} x2={42} y2={48} />
    <Sleeve x1={52} y1={38} x2={58} y2={48} />
    <Short x1={50} y1={52} x2={72} y2={42} />
    <Limb x1={72} y1={42} x2={88} y2={32} />
    <Short x1={50} y1={52} x2={74} y2={50} />
    <Limb x1={74} y1={50} x2={92} y2={40} />
    <Shoe x={88} y={32} r={2.5} />
    <Shoe x={92} y={40} r={2.5} />
  </Frame>
);

const BarrenZiel = () => (
  <Frame>
    <Floor />
    <Holme />
    <Head cx={50} cy={28} />
    <Torso cx={50} cy={44} h={16} />
    <Sleeve x1={48} y1={38} x2={42} y2={48} />
    <Sleeve x1={52} y1={38} x2={58} y2={48} />
    <Short x1={50} y1={52} x2={28} y2={36} />
    <Limb x1={28} y1={36} x2={12} y2={24} />
    <Short x1={50} y1={52} x2={26} y2={42} />
    <Limb x1={26} y1={42} x2={10} y2={32} />
    <path d="M 14 78 Q 50 96 86 78" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.5" />
    <Shoe x={12} y={24} r={2.5} />
    <Shoe x={10} y={32} r={2.5} />
  </Frame>
);

// ============== BALKEN ==============
const Beam = () => (
  <g>
    <rect x="0" y="74" width="100" height="6" rx="1" fill="#B89968" />
    <rect x="0" y="74" width="100" height="1" fill="#8C7344" />
    <rect x="6" y="80" width="3" height="12" fill={GEAR} />
    <rect x="91" y="80" width="3" height="12" fill={GEAR} />
  </g>
);

const BalkenGehen = () => (
  <Frame>
    <Floor />
    <Beam />
    <Head cx={50} cy={20} />
    <Torso cx={50} cy={38} h={18} />
    <Sleeve x1={50} y1={32} x2={30} y2={36} />
    <Sleeve x1={50} y1={32} x2={70} y2={36} />
    <Short x1={50} y1={46} x2={44} y2={60} />
    <Limb x1={44} y1={60} x2={44} y2={74} />
    <Short x1={50} y1={46} x2={56} y2={60} />
    <Limb x1={56} y1={60} x2={56} y2={74} />
  </Frame>
);

const BalkenWaage = () => (
  <Frame>
    <Floor />
    <Beam />
    <Head cx={26} cy={50} />
    <Torso cx={42} cy={52} w={14} h={20} rot={90} />
    <Sleeve x1={30} y1={50} x2={20} y2={40} />
    <Sleeve x1={30} y1={52} x2={20} y2={56} />
    <Short x1={56} y1={52} x2={56} y2={74} />
    <Short x1={56} y1={52} x2={84} y2={42} />
    <Limb x1={84} y1={42} x2={92} y2={36} />
    <Shoe x={56} y={76} />
    <Shoe x={92} y={36} r={2.5} />
  </Frame>
);

const BalkenStrecksprung = () => (
  <Frame>
    <Floor />
    <Beam />
    <Head cx={50} cy={18} />
    <Torso cx={50} cy={36} h={18} />
    <Sleeve x1={50} y1={30} x2={34} y2={22} />
    <Sleeve x1={50} y1={30} x2={66} y2={22} />
    <Short x1={50} y1={44} x2={46} y2={60} />
    <Limb x1={46} y1={60} x2={46} y2={72} />
    <Short x1={50} y1={44} x2={54} y2={60} />
    <Limb x1={54} y1={60} x2={54} y2={72} />
    <path d="M 30 68 A 20 8 0 0 1 70 68" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.6" />
  </Frame>
);

const BalkenZiel = () => (
  <Frame>
    <Floor />
    <Beam />
    <Head cx={50} cy={18} />
    <Torso cx={50} cy={36} h={18} />
    <Sleeve x1={50} y1={30} x2={34} y2={24} />
    <Sleeve x1={50} y1={30} x2={66} y2={24} />
    <Short x1={50} y1={44} x2={46} y2={60} />
    <Limb x1={46} y1={60} x2={46} y2={72} />
    <Short x1={50} y1={44} x2={54} y2={60} />
    <Limb x1={54} y1={60} x2={54} y2={72} />
    <path d="M 28 12 A 22 10 0 0 1 72 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.7" />
    <polygon points="72,8 76,12 72,16" fill="currentColor" opacity="0.7" />
  </Frame>
);

// ============== BODEN ==============
const Mat = () => <rect x="0" y="84" width="100" height="10" fill={MAT} />;

const BodenWiege = () => (
  <Frame>
    <Floor />
    <Mat />
    <circle cx={50} cy={70} r={20} fill="currentColor" />
    <Head cx={34} cy={70} r={5} />
    <ellipse cx={58} cy={56} rx={10} ry={6} fill={SKIN} />
    <path d="M 26 88 Q 50 96 74 88" fill="none" stroke={GEAR} strokeWidth="1.2" strokeDasharray="3 2" opacity="0.6" />
  </Frame>
);

const BodenRolleAnsatz = () => (
  <Frame>
    <Floor />
    <Mat />
    <path d="M 10 84 L 80 56 L 80 84 Z" fill={MAT} />
    <Head cx={68} cy={50} />
    <Torso cx={62} cy={62} w={14} h={16} rot={-35} />
    <Sleeve x1={56} y1={70} x2={50} y2={80} />
    <Sleeve x1={62} y1={66} x2={56} y2={78} />
    <Short x1={68} y1={56} x2={76} y2={64} />
    <Limb x1={76} y1={64} x2={78} y2={78} />
    <Shoe x={78} y={80} r={2.5} />
  </Frame>
);

const BodenRolleMitte = () => (
  <Frame>
    <Floor />
    <Mat />
    <circle cx={50} cy={70} r={18} fill="currentColor" />
    <Head cx={38} cy={72} r={5} />
    <ellipse cx={62} cy={60} rx={9} ry={6} fill={SKIN} />
    <path d="M 32 76 Q 50 92 70 80" fill="none" stroke={GEAR} strokeWidth="1.4" strokeDasharray="3 2" opacity="0.7" />
    <polygon points="70,80 74,82 70,86" fill={GEAR} opacity="0.7" />
  </Frame>
);

const BodenRolleStand = () => (
  <Frame>
    <Floor />
    <Mat />
    <Head cx={50} cy={20} />
    <Torso cx={50} cy={40} h={22} />
    <Sleeve x1={50} y1={34} x2={36} y2={28} />
    <Sleeve x1={50} y1={34} x2={64} y2={28} />
    <Short x1={50} y1={50} x2={44} y2={66} />
    <Limb x1={44} y1={66} x2={44} y2={82} />
    <Short x1={50} y1={50} x2={56} y2={66} />
    <Limb x1={56} y1={66} x2={56} y2={82} />
    <Shoe x={44} y={83} />
    <Shoe x={56} y={83} />
  </Frame>
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
