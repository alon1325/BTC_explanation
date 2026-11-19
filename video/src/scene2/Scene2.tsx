import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AUDIO_START, COLORS, T } from "./timing";

// ---- Layout: drawn in a 1280x720 viewBox, scaled to the composition size ----
const W = 1280;
const H = 720;
const S = 150; // block size
const CY = 410; // chain centre line
const XS = [340, 640, 940]; // block centres
const CENTER_X = W / 2;
const HASHES = ["a3f9…", "7c1e…"];

const SANS = "Segoe UI, Helvetica, Arial, sans-serif";
const MONO = "Consolas, 'Courier New', monospace";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ip = (
  value: number,
  input: number[],
  output: number[],
  easing?: (t: number) => number,
) => interpolate(value, input, output, { ...clamp, easing });

// ---- Shared timeline values ----
const useTimeline = () => {
  const frame = useCurrentFrame();
  const collapse = ip(
    frame,
    [T.collapse, T.collapse + T.collapseDuration],
    [0, 1],
    Easing.inOut(Easing.cubic),
  );
  const extras = 1 - ip(frame, [T.collapse, T.collapse + 15], [0, 1]);
  const waveX = ip(
    frame,
    [T.tamper, T.tamper + T.waveDuration],
    [XS[0], XS[2] + S / 2 + 20],
    Easing.inOut(Easing.quad),
  );
  const tampered = frame >= T.tamper;
  // How red a point at x is, given the wave has passed it.
  const redAt = (x: number) =>
    tampered ? ip(waveX, [x - 30, x + 10], [0, 1]) * (1 - collapse) : 0;
  return { frame, collapse, extras, waveX, redAt };
};

// ---- Blocks ----
const Block: React.FC<{ index: number }> = ({ index }) => {
  const { fps } = useVideoConfig();
  const { frame, collapse, extras, redAt } = useTimeline();

  const enter = spring({
    frame: frame - (T.blocksIn + index * T.blockStagger),
    fps,
    config: { damping: 15 },
  });
  const baseX = XS[index] - (1 - enter) * 220;
  const x = interpolate(collapse, [0, 1], [baseX, CENTER_X]);

  // Block 3 is a ghost (being mined) until the mining ring completes.
  const isNewest = index === 2;
  const solid = isNewest ? ip(frame, [T.miningEnd, T.miningEnd + 8], [0, 1]) : 1;
  const minedPulse = isNewest
    ? ip(frame, [T.miningEnd, T.miningEnd + 6, T.miningEnd + 20], [0, 1, 0])
    : 0;

  const red = index === 0 ? (frame >= T.tamper ? 1 - collapse : 0) : redAt(XS[index] - S / 2);
  const flash =
    index === 0
      ? ip(frame, [T.tamper, T.tamper + 4, T.tamper + 10, T.tamper + 14, T.tamper + 24], [0, 1, 0.3, 1, 0])
      : 0;

  const border = interpolateColors(red, [0, 1], [COLORS.block, COLORS.red]);
  const scale = 1 + 0.08 * minedPulse;

  return (
    <g
      opacity={enter}
      transform={`translate(${x} ${CY}) scale(${scale})`}
    >
      {/* ghost outline while mining */}
      <rect
        x={-S / 2}
        y={-S / 2}
        width={S}
        height={S}
        rx={20}
        fill="none"
        stroke={COLORS.block}
        strokeOpacity={0.6 * (1 - solid)}
        strokeWidth={3}
        strokeDasharray="12 9"
      />
      {/* solid page */}
      <g opacity={solid}>
        <rect
          x={-S / 2}
          y={-S / 2}
          width={S}
          height={S}
          rx={20}
          fill={COLORS.block}
          stroke={border}
          strokeWidth={6}
        />
        {[-32, 0, 32].map((dy, i) => (
          <rect
            key={dy}
            x={-48}
            y={dy - 5}
            width={[96, 72, 84][i]}
            height={10}
            rx={5}
            fill={interpolateColors(red, [0, 1], [COLORS.blockLine, "#E8A2A4"])}
          />
        ))}
        <rect
          x={-S / 2}
          y={-S / 2}
          width={S}
          height={S}
          rx={20}
          fill={COLORS.red}
          opacity={0.18 * red + 0.5 * flash}
        />
      </g>
      <text
        y={S / 2 + 34}
        textAnchor="middle"
        fill={COLORS.dim}
        fontFamily={SANS}
        fontSize={18}
        fontWeight={600}
        letterSpacing={3}
        opacity={extras}
      >
        BLOCK {index + 1}
      </text>
    </g>
  );
};

// ---- Cyan arrows pointing back to the predecessor ----
const Arrow: React.FC<{ index: number }> = ({ index }) => {
  const { frame, extras, redAt } = useTimeline();
  const start = T.arrowsIn + (index - 1) * T.arrowStagger;
  const draw = ip(frame, [start, start + 18], [0, 1], Easing.out(Easing.cubic));

  const x1 = XS[index] - S / 2 - 14; // tail at this block
  const x2 = XS[index - 1] + S / 2 + 14; // head at previous block
  const xEnd = x1 + (x2 - x1) * draw;
  const mid = (x1 + x2) / 2;

  const red = redAt(mid);
  const color = interpolateColors(red, [0, 1], [COLORS.cyan, COLORS.red]);
  const pulse = ip(frame, [T.chainPulse, T.chainPulse + 8, T.chainPulse + 26], [0, 1, 0]);
  const labelIn = ip(frame, [start + 10, start + 24], [0, 1]);

  return (
    <g opacity={extras}>
      <line
        x1={x1}
        y1={CY}
        x2={xEnd + 10}
        y2={CY}
        stroke={color}
        strokeWidth={5 + 3 * pulse}
        strokeLinecap="round"
        strokeDasharray={red > 0.5 ? "10 10" : undefined}
        style={{ filter: `drop-shadow(0 0 ${4 + 10 * pulse}px ${color})` }}
      />
      <polygon
        points={`${xEnd},${CY} ${xEnd + 18},${CY - 12} ${xEnd + 18},${CY + 12}`}
        fill={color}
        opacity={draw > 0.95 ? 1 : 0}
      />
      <text
        x={mid}
        y={CY - 26}
        textAnchor="middle"
        fill={color}
        fontFamily={MONO}
        fontSize={22}
        opacity={labelIn}
      >
        {HASHES[index - 1]}
      </text>
    </g>
  );
};

// ---- Gold mining ring with tumbling dice ----
const Die: React.FC<{ x: number; y: number; seed: number }> = ({ x, y, seed }) => {
  const frame = useCurrentFrame();
  const face = (Math.floor(frame / 4) * 5 + seed * 3) % 6;
  const pips: [number, number][][] = [
    [[0, 0]],
    [[-1, -1], [1, 1]],
    [[-1, -1], [0, 0], [1, 1]],
    [[-1, -1], [1, -1], [-1, 1], [1, 1]],
    [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
    [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
  ];
  const bob = Math.sin((frame + seed * 13) / 5) * 6;
  const rot = (frame * (7 + seed * 3)) % 360;
  return (
    <g transform={`translate(${x} ${y + bob}) rotate(${rot})`}>
      <rect x={-15} y={-15} width={30} height={30} rx={6} fill="none" stroke={COLORS.gold} strokeWidth={3} />
      {pips[face].map(([px, py], i) => (
        <circle key={i} cx={px * 7.5} cy={py * 7.5} r={2.6} fill={COLORS.gold} />
      ))}
    </g>
  );
};

const MiningRing: React.FC = () => {
  const { frame } = useTimeline();
  const R = 112;
  const circ = 2 * Math.PI * R;
  const visible = ip(
    frame,
    [T.miningStart, T.miningStart + 10, T.miningEnd + 12, T.miningEnd + 30],
    [0, 1, 1, 0],
  );
  const progress = ip(frame, [T.miningStart + 6, T.miningEnd], [0, 1], Easing.in(Easing.quad));
  const done = ip(frame, [T.miningEnd, T.miningEnd + 25], [0, 1], Easing.out(Easing.cubic));
  const spin = frame < T.miningEnd ? frame * 6 : T.miningEnd * 6;
  const diceOpacity = 1 - ip(frame, [T.miningEnd - 4, T.miningEnd + 4], [0, 1]);

  if (visible <= 0) return null;
  return (
    <g opacity={visible} transform={`translate(${XS[2]} ${CY})`}>
      <circle r={R} fill="none" stroke={COLORS.gold} strokeOpacity={0.18} strokeWidth={8} />
      <circle
        r={R}
        fill="none"
        stroke={COLORS.gold}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - progress)}
        transform={`rotate(${spin - 90})`}
        style={{ filter: `drop-shadow(0 0 8px ${COLORS.gold})` }}
      />
      {/* soft completion pulse */}
      <circle
        r={R + 30 * done}
        fill="none"
        stroke={COLORS.gold}
        strokeWidth={4}
        opacity={done > 0 ? 1 - done : 0}
      />
      <g opacity={diceOpacity}>
        <Die x={-32} y={-26} seed={0} />
        <Die x={30} y={-6} seed={1} />
        <Die x={-8} y={34} seed={2} />
      </g>
    </g>
  );
};

// ---- Red tamper wave ----
const TamperWave: React.FC = () => {
  const { frame, waveX } = useTimeline();
  const o = ip(
    frame,
    [T.tamper, T.tamper + 5, T.tamper + T.waveDuration - 6, T.tamper + T.waveDuration],
    [0, 1, 1, 0],
  );
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      <ellipse
        cx={waveX}
        cy={CY}
        rx={34}
        ry={95}
        fill={COLORS.red}
        opacity={0.25}
        style={{ filter: "blur(14px)" }}
      />
      <line x1={waveX} y1={CY - 90} x2={waveX} y2={CY + 90} stroke={COLORS.red} strokeWidth={3} opacity={0.8} />
    </g>
  );
};

// ---- Gold stopwatch + "redo all work" bar ----
const Stopwatch: React.FC = () => {
  const { fps } = useVideoConfig();
  const { frame, extras } = useTimeline();
  const enter = spring({ frame: frame - T.stopwatchIn, fps, config: { damping: 14 } });
  const barW = 640;
  const fill = ip(frame, [T.stopwatchIn + 8, T.stopwatchIn + 60], [0, barW], Easing.inOut(Easing.quad));
  const hand = (frame - T.stopwatchIn) * 14;
  const cx = 300;
  const cy = 190;
  const barX = 360;

  if (frame < T.stopwatchIn) return null;
  return (
    <g opacity={enter * extras} transform={`translate(0 ${(1 - enter) * -30})`}>
      <g transform={`translate(${cx} ${cy})`}>
        <rect x={-7} y={-48} width={14} height={10} rx={3} fill={COLORS.gold} />
        <circle r={32} fill="none" stroke={COLORS.gold} strokeWidth={5} />
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={-22}
          stroke={COLORS.gold}
          strokeWidth={4}
          strokeLinecap="round"
          transform={`rotate(${hand})`}
        />
        <circle r={4} fill={COLORS.gold} />
      </g>
      <text
        x={barX}
        y={cy - 22}
        fill={COLORS.gold}
        fontFamily={SANS}
        fontSize={24}
        fontWeight={700}
        letterSpacing={2}
      >
        REDO ALL WORK
      </text>
      <rect x={barX} y={cy - 6} width={barW} height={20} rx={10} fill={COLORS.gold} opacity={0.18} />
      <rect x={barX} y={cy - 6} width={fill} height={20} rx={10} fill={COLORS.gold} />
    </g>
  );
};

// ---- Opening label ----
const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const o = ip(frame, [T.titleIn, T.titleIn + 12, T.titleOut, T.titleOut + 12], [0, 1, 1, 0]);
  const y = ip(frame, [T.titleIn, T.titleIn + 12], [20, 0], Easing.out(Easing.cubic));
  return (
    <text
      x={CENTER_X}
      y={200 + y}
      textAnchor="middle"
      fill={COLORS.block}
      fontFamily={SANS}
      fontSize={40}
      fontWeight={600}
      letterSpacing={6}
      opacity={o}
    >
      THE WHOLE IDEA
    </text>
  );
};

export const Scene2: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Sequence from={AUDIO_START} layout="none">
        <Audio name="Narration" src={staticFile("scene2/narration.wav")} />
      </Sequence>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        <Title />
        <Arrow index={1} />
        <Arrow index={2} />
        <TamperWave />
        <MiningRing />
        {/* draw the outer blocks first so the middle one sits on top when they collapse */}
        <Block index={0} />
        <Block index={2} />
        <Block index={1} />
        <Stopwatch />
      </svg>
    </AbsoluteFill>
  );
};
