import type { GraphicKey } from "@/lib/station-cards";

// Einfache Strichmännchen-SVGs für ausgewählte Bewegungsschritte.
// ViewBox 100×100, schwarzer Stroke, kein Fill (außer Kopf).
// Wenn kein Mapping vorhanden, wird null zurückgegeben.

function Figure({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      role="img"
      aria-hidden
    >
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {children}
      </g>
    </svg>
  );
}

const Head = ({ cx, cy, r = 5 }: { cx: number; cy: number; r?: number }) => (
  <circle cx={cx} cy={cy} r={r} fill="currentColor" />
);

const Bar = ({ y = 30 }: { y?: number }) => (
  <line x1="5" y1={y} x2="95" y2={y} strokeWidth="3" />
);

const Ground = () => <line x1="0" y1="98" x2="100" y2="98" strokeDasharray="2 3" />;

// 1. Hang am Reck — gerade hängend
function ReckHang() {
  return (
    <Figure>
      <Bar />
      <Ground />
      <Head cx={50} cy={42} />
      {/* Arme nach oben zum Reck */}
      <line x1="46" y1="38" x2="42" y2="30" />
      <line x1="54" y1="38" x2="58" y2="30" />
      {/* Rumpf */}
      <line x1="50" y1="47" x2="50" y2="72" />
      {/* Beine gestreckt */}
      <line x1="50" y1="72" x2="44" y2="92" />
      <line x1="50" y1="72" x2="56" y2="92" />
    </Figure>
  );
}

// 2. Knie zur Stange
function ReckKneeTuck() {
  return (
    <Figure>
      <Bar />
      <Ground />
      <Head cx={50} cy={42} />
      <line x1="46" y1="38" x2="42" y2="30" />
      <line x1="54" y1="38" x2="58" y2="30" />
      <line x1="50" y1="47" x2="50" y2="60" />
      {/* Knie hochgezogen */}
      <line x1="50" y1="60" x2="40" y2="48" />
      <line x1="40" y1="48" x2="46" y2="38" />
      <line x1="50" y1="60" x2="60" y2="48" />
      <line x1="60" y1="48" x2="54" y2="38" />
    </Figure>
  );
}

// 3. Hüfte ans Reck — Aufschwung in Drehung, Körper L-förmig um Stange
function ReckHipBar() {
  return (
    <Figure>
      <Bar />
      <Ground />
      {/* Kopf unter Stange, Körper klappt um Bar */}
      <Head cx={36} cy={36} />
      {/* Arme greifen Reck */}
      <line x1="40" y1="36" x2="48" y2="30" />
      <line x1="38" y1="40" x2="45" y2="32" />
      {/* Rumpf zum Reck hin */}
      <line x1="40" y1="38" x2="55" y2="28" />
      {/* Beine schwingen über Reck */}
      <line x1="55" y1="28" x2="75" y2="22" />
      <line x1="55" y1="28" x2="78" y2="30" />
    </Figure>
  );
}

// 4. Stütz am Reck — Zielübung
function ReckSupport() {
  return (
    <Figure>
      <Bar />
      <Ground />
      {/* Kopf oberhalb Reck */}
      <Head cx={50} cy={18} />
      {/* Arme gestreckt nach unten zum Reck */}
      <line x1="46" y1="22" x2="46" y2="30" />
      <line x1="54" y1="22" x2="54" y2="30" />
      {/* Rumpf aufrecht über Reck */}
      <line x1="50" y1="23" x2="50" y2="30" />
      {/* Beine hängen unterhalb Reck */}
      <line x1="50" y1="30" x2="44" y2="55" />
      <line x1="50" y1="30" x2="56" y2="55" />
    </Figure>
  );
}

// Hüftumschwung 1: Stütz
function ReckUmStuetz() {
  return ReckSupport();
}
// Hüftumschwung 2: Knie heran, Hüfte abklappen
function ReckUmKnie() {
  return (
    <Figure>
      <Bar />
      <Ground />
      <Head cx={50} cy={20} />
      <line x1="46" y1="24" x2="46" y2="30" />
      <line x1="54" y1="24" x2="54" y2="30" />
      {/* Hüfte zum Reck, Knie angezogen */}
      <line x1="50" y1="25" x2="50" y2="32" />
      <line x1="50" y1="32" x2="40" y2="42" />
      <line x1="50" y1="32" x2="60" y2="42" />
    </Figure>
  );
}
// Hüftumschwung 3: Rückwärts unter Reck
function ReckUmZug() {
  return (
    <Figure>
      <Bar />
      <Ground />
      {/* Körper umgekehrt, Kopf unten */}
      <Head cx={50} cy={52} />
      <line x1="46" y1="48" x2="46" y2="32" />
      <line x1="54" y1="48" x2="54" y2="32" />
      <line x1="50" y1="48" x2="50" y2="62" />
      <line x1="50" y1="62" x2="42" y2="80" />
      <line x1="50" y1="62" x2="58" y2="80" />
    </Figure>
  );
}
// Hüftumschwung 4: Wieder im Stütz
function ReckUmEnd() {
  return ReckSupport();
}

// Boden – Hocke
function BodenHocke() {
  return (
    <Figure>
      <Ground />
      <Head cx={50} cy={50} />
      {/* Arme um Knie */}
      <line x1="46" y1="55" x2="40" y2="70" />
      <line x1="54" y1="55" x2="60" y2="70" />
      {/* Rumpf */}
      <line x1="50" y1="55" x2="50" y2="75" />
      {/* Beine angezogen */}
      <line x1="50" y1="75" x2="38" y2="80" />
      <line x1="38" y1="80" x2="42" y2="92" />
      <line x1="50" y1="75" x2="62" y2="80" />
      <line x1="62" y1="80" x2="58" y2="92" />
    </Figure>
  );
}
// Boden – Rolle Ansatz (Schräglage)
function BodenRolleAnsatz() {
  return (
    <Figure>
      <Ground />
      {/* Schräge Linie als Mattenbahn */}
      <line x1="10" y1="92" x2="80" y2="60" strokeDasharray="3 2" />
      <Head cx={70} cy={56} />
      <line x1="68" y1="60" x2="60" y2="72" />
      <line x1="60" y1="72" x2="50" y2="78" />
      <line x1="50" y1="78" x2="44" y2="88" />
    </Figure>
  );
}
// Boden – Rolle Mitte (auf Rücken kullernd)
function BodenRolleMitte() {
  return (
    <Figure>
      <Ground />
      <Head cx={40} cy={70} />
      <line x1="44" y1="68" x2="60" y2="74" />
      <line x1="60" y1="74" x2="58" y2="60" />
      <line x1="60" y1="74" x2="68" y2="62" />
      {/* Bogen-Rücken */}
      <path d="M 40 75 Q 55 88 70 78" />
    </Figure>
  );
}
// Boden – Stand nach Rolle
function BodenRolleStand() {
  return (
    <Figure>
      <Ground />
      <Head cx={50} cy={22} />
      <line x1="50" y1="27" x2="50" y2="60" />
      <line x1="50" y1="35" x2="38" y2="48" />
      <line x1="50" y1="35" x2="62" y2="48" />
      <line x1="50" y1="60" x2="44" y2="92" />
      <line x1="50" y1="60" x2="56" y2="92" />
    </Figure>
  );
}

// Sprung – Anlauf
function SprungAnlauf() {
  return (
    <Figure>
      <Ground />
      <Head cx={30} cy={30} />
      <line x1="30" y1="35" x2="30" y2="60" />
      <line x1="30" y1="42" x2="20" y2="52" />
      <line x1="30" y1="42" x2="40" y2="36" />
      <line x1="30" y1="60" x2="22" y2="86" />
      <line x1="30" y1="60" x2="42" y2="84" />
      {/* Bewegungspfeil */}
      <line x1="55" y1="50" x2="80" y2="50" strokeWidth="1.5" />
      <line x1="76" y1="46" x2="80" y2="50" strokeWidth="1.5" />
      <line x1="76" y1="54" x2="80" y2="50" strokeWidth="1.5" />
    </Figure>
  );
}
// Sprung – Absprung vom Brett
function SprungAbsprung() {
  return (
    <Figure>
      <Ground />
      {/* Brett */}
      <line x1="55" y1="90" x2="85" y2="82" strokeWidth="3" />
      <Head cx={50} cy={30} />
      <line x1="50" y1="35" x2="50" y2="58" />
      <line x1="50" y1="40" x2="38" y2="28" />
      <line x1="50" y1="40" x2="62" y2="28" />
      <line x1="50" y1="58" x2="58" y2="80" />
      <line x1="50" y1="58" x2="64" y2="76" />
    </Figure>
  );
}
// Sprung – Stütz auf Kasten
function SprungStuetz() {
  return (
    <Figure>
      <Ground />
      {/* Kasten */}
      <rect x="50" y="60" width="40" height="28" fill="none" />
      <Head cx={45} cy={32} />
      <line x1="45" y1="37" x2="45" y2="55" />
      <line x1="45" y1="42" x2="55" y2="55" />
      <line x1="45" y1="42" x2="35" y2="58" />
      <line x1="45" y1="55" x2="55" y2="68" />
      <line x1="45" y1="55" x2="60" y2="62" />
    </Figure>
  );
}
// Sprung – Landung
function SprungLandung() {
  return (
    <Figure>
      <Ground />
      <Head cx={50} cy={36} />
      <line x1="50" y1="41" x2="50" y2="62" />
      <line x1="50" y1="46" x2="38" y2="40" />
      <line x1="50" y1="46" x2="62" y2="40" />
      {/* Beine gebeugt */}
      <line x1="50" y1="62" x2="40" y2="78" />
      <line x1="40" y1="78" x2="38" y2="92" />
      <line x1="50" y1="62" x2="60" y2="78" />
      <line x1="60" y1="78" x2="62" y2="92" />
    </Figure>
  );
}

const MAP: Record<GraphicKey, () => JSX.Element> = {
  "reck-hang": ReckHang,
  "reck-knee-tuck": ReckKneeTuck,
  "reck-hip-bar": ReckHipBar,
  "reck-support": ReckSupport,
  "reck-umschwung-stuetz": ReckUmStuetz,
  "reck-umschwung-knie": ReckUmKnie,
  "reck-umschwung-zug": ReckUmZug,
  "reck-umschwung-end": ReckUmEnd,
  "boden-hocke": BodenHocke,
  "boden-rolle-ansatz": BodenRolleAnsatz,
  "boden-rolle-mitte": BodenRolleMitte,
  "boden-rolle-stand": BodenRolleStand,
  "sprung-anlauf": SprungAnlauf,
  "sprung-absprung": SprungAbsprung,
  "sprung-stuetz": SprungStuetz,
  "sprung-landung": SprungLandung,
};

export function StationGraphic({ kind }: { kind?: GraphicKey }) {
  if (!kind) return null;
  const Comp = MAP[kind];
  if (!Comp) return null;
  return (
    <div className="aspect-square w-full max-w-[160px] text-foreground/80">
      <Comp />
    </div>
  );
}
