import React from "react";
import {
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CHAR_W,
  COLORS,
  FONT_MONO,
  FONT_SANS,
  FUNNEL_X,
  HASH_W,
  HEX_R,
  HEX_X,
  HEX_Y,
  MONO_SIZE,
  OUT_X,
} from "./theme";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const fade = (frame: number, inAt: number, outAt?: number, len = 12) =>
  Math.min(
    interpolate(frame, [inAt, inAt + len], [0, 1], clamp),
    outAt === undefined ? 1 : interpolate(frame, [outAt, outAt + len], [1, 0], clamp),
  );

/* ---------------- The SHA-256 machine ---------------- */

const hexPoints = (r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return `${r * Math.cos(a)},${r * Math.sin(a)}`;
  }).join(" ");

export const Hexagon: React.FC<{ appearAt: number; pulses: number[] }> = ({
  appearAt,
  pulses,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - appearAt, fps, config: { damping: 14 } });
  const pulse = pulses.reduce((acc, p) => {
    const d = frame - p;
    return d < 0 ? acc : acc + Math.exp(-d / 6) * (d < 3 ? d / 3 : 1);
  }, 0);
  const spin = pulses.reduce(
    (acc, p) => acc + interpolate(frame, [p, p + 14], [0, 60], clamp),
    0,
  );
  const scale = enter * (1 + 0.08 * Math.min(pulse, 1));

  return (
    <div
      style={{
        position: "absolute",
        left: HEX_X - HEX_R * 1.4,
        top: HEX_Y - HEX_R * 1.4,
        width: HEX_R * 2.8,
        height: HEX_R * 2.8,
        transform: `scale(${scale})`,
        filter: `drop-shadow(0 0 ${8 + 30 * Math.min(pulse, 1)}px ${COLORS.cyan}88)`,
      }}
    >
      <svg width="100%" height="100%" viewBox="-168 -168 336 336">
        <g transform={`rotate(${spin})`}>
          <polygon
            points={hexPoints(HEX_R)}
            fill={COLORS.panel}
            stroke={COLORS.cyan}
            strokeWidth={6}
            strokeLinejoin="round"
          />
          <polygon
            points={hexPoints(HEX_R - 22)}
            fill="none"
            stroke={COLORS.cyan}
            strokeOpacity={0.3}
            strokeWidth={2}
          />
        </g>
        <text
          x={0}
          y={12}
          textAnchor="middle"
          fill={COLORS.offWhite}
          fontFamily={FONT_SANS}
          fontWeight={700}
          fontSize={36}
          letterSpacing={1}
        >
          SHA-256
        </text>
      </svg>
    </div>
  );
};

/* ---------------- Input funnel ---------------- */

export const Funnel: React.FC<{ opacity: number }> = ({ opacity }) => (
  <svg
    width={260}
    height={200}
    viewBox="0 0 260 200"
    style={{
      position: "absolute",
      left: FUNNEL_X - 130,
      top: HEX_Y - 100,
      opacity,
    }}
  >
    <path
      d="M 20 30 L 240 30 L 150 120 L 150 170 L 110 170 L 110 120 Z"
      fill={COLORS.panel}
      stroke={COLORS.offWhite}
      strokeOpacity={0.7}
      strokeWidth={4}
      strokeLinejoin="round"
    />
    {/* pipe from funnel into the machine */}
    <path
      d="M 130 170 L 130 185 L 260 185"
      fill="none"
      stroke={COLORS.offWhite}
      strokeOpacity={0.35}
      strokeWidth={4}
    />
  </svg>
);

/* ---------------- Inputs ---------------- */

export const WordChip: React.FC<{
  text: string;
  redIndex?: number;
  flipProgress?: number;
  fromChar?: string;
}> = ({ text, redIndex = -1, flipProgress = 0, fromChar }) => (
  <div
    style={{
      padding: "14px 28px",
      borderRadius: 16,
      background: COLORS.offWhite,
      color: COLORS.navy,
      fontFamily: FONT_MONO,
      fontSize: 46,
      fontWeight: 700,
      display: "flex",
    }}
  >
    {text.split("").map((ch, i) => {
      if (i !== redIndex) return <span key={i}>{ch}</span>;
      // flip from the original letter to the new red letter
      const showNew = flipProgress >= 0.5;
      const sy = Math.abs(Math.cos(flipProgress * Math.PI));
      return (
        <span
          key={i}
          style={{
            display: "inline-block",
            transform: `scaleY(${sy})`,
            color: showNew ? COLORS.red : COLORS.navy,
          }}
        >
          {showNew ? ch : (fromChar ?? ch)}
        </span>
      );
    })}
  </div>
);

export const PageIcon: React.FC = () => (
  <div
    style={{
      width: 120,
      height: 150,
      borderRadius: 12,
      background: COLORS.offWhite,
      padding: "22px 16px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: 14,
    }}
  >
    {[1, 0.85, 0.95, 0.6, 0.8].map((w, i) => (
      <div
        key={i}
        style={{
          height: 8,
          width: `${w * 100}%`,
          borderRadius: 4,
          background: COLORS.gray,
        }}
      />
    ))}
  </div>
);

export const BookIcon: React.FC = () => (
  <svg width={170} height={170} viewBox="0 0 170 170">
    {/* page edges */}
    <rect x={30} y={22} width={118} height={130} rx={8} fill="#D9D4C5" />
    {[0, 1, 2, 3, 4].map((i) => (
      <line
        key={i}
        x1={140}
        x2={140}
        y1={30}
        y2={146}
        transform={`translate(${-i * 3} 0)`}
        stroke="#B9B3A3"
        strokeWidth={1.5}
      />
    ))}
    {/* cover */}
    <rect x={18} y={14} width={118} height={130} rx={8} fill={COLORS.offWhite} />
    <rect x={18} y={14} width={22} height={130} rx={6} fill={COLORS.gold} />
    <rect x={56} y={44} width={64} height={8} rx={4} fill={COLORS.gray} />
    <rect x={56} y={62} width={44} height={8} rx={4} fill={COLORS.gray} />
  </svg>
);

/** Drops an input from above the funnel down into it, then hides it. */
export const DroppingInput: React.FC<{
  dropAt: number;
  appearAt: number;
  children: React.ReactNode;
}> = ({ dropAt, appearAt, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - appearAt, fps, config: { damping: 15 } });
  const drop = interpolate(frame, [dropAt, dropAt + 14], [0, 1], {
    ...clamp,
    easing: (t) => t * t,
  });
  if (frame < appearAt || drop >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: FUNNEL_X,
        top: HEX_Y - 230 + drop * 190,
        transform: `translate(-50%, -50%) scale(${enter * (1 - 0.75 * drop)})`,
        opacity: 1 - drop * 0.6,
      }}
    >
      {children}
    </div>
  );
};

/* ---------------- Output hash rows ---------------- */

const HEX_CHARS = "0123456789abcdef";

export type HashRowProps = {
  y: number;
  hash: string;
  /** frame when typing starts */
  start: number;
  /** "type" types characters left-to-right; "scramble" spins slot-machine style */
  mode?: "type" | "scramble";
  color?: string;
  label?: string;
  opacity?: number;
  highlight?: number;
};

export const HashRow: React.FC<HashRowProps> = ({
  y,
  hash,
  start,
  mode = "type",
  color = COLORS.cyan,
  label,
  opacity = 1,
  highlight = 0,
}) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  const typed = Math.floor(interpolate(frame, [start, start + 20], [0, 64], clamp));
  const lineIn = interpolate(frame, [start - 6, start + 4], [0, 1], clamp);

  return (
    <div style={{ opacity }}>
      {/* connector from machine to row */}
      <svg
        width={OUT_X - HEX_X}
        height={1080}
        style={{ position: "absolute", left: HEX_X, top: 0 }}
      >
        <path
          d={`M ${HEX_R * 0.9} ${540} C ${HEX_R + 60} 540, ${HEX_R + 40} ${y}, ${OUT_X - HEX_X - 20} ${y}`}
          fill="none"
          stroke={color}
          strokeOpacity={0.45}
          strokeWidth={3}
          strokeDasharray={400}
          strokeDashoffset={400 * (1 - lineIn)}
        />
      </svg>
      {label && (
        <div
          style={{
            position: "absolute",
            left: OUT_X,
            top: y - 56,
            fontFamily: FONT_SANS,
            fontSize: 22,
            color: COLORS.gray,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: OUT_X - 16,
          top: y - 26,
          width: HASH_W + 32,
          height: 52,
          borderRadius: 10,
          background: `rgba(61,220,242,${0.05 + 0.12 * highlight})`,
          border: `2px solid rgba(61,220,242,${0.15 + 0.6 * highlight})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: OUT_X,
          top: y - MONO_SIZE * 0.65,
          fontFamily: FONT_MONO,
          fontSize: MONO_SIZE,
          whiteSpace: "pre",
          display: "flex",
        }}
      >
        {hash.split("").map((ch, i) => {
          if (mode === "type") {
            return (
              <span
                key={i}
                style={{ width: CHAR_W, color: i < typed ? color : "transparent" }}
              >
                {ch}
              </span>
            );
          }
          const settle = start + 8 + i * 0.9;
          const spinning = frame < settle;
          const shown = spinning
            ? HEX_CHARS[Math.floor(random(`${hash}-${i}-${Math.floor(frame / 2)}`) * 16)]
            : ch;
          const pop = interpolate(frame, [settle, settle + 6], [1.12, 1], clamp);
          return (
            <span
              key={i}
              style={{
                width: CHAR_W,
                display: "inline-block",
                color: spinning ? COLORS.red : color,
                opacity: spinning ? 0.75 : 1,
                transform: `scale(${spinning ? 1 : pop})`,
              }}
            >
              {shown}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------- 64-character bracket ---------------- */

export const LengthBracket: React.FC<{ y: number; at: number; opacity: number }> = ({
  y,
  at,
  opacity,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = spring({ frame: frame - at, fps, config: { damping: 18 } });
  const w = HASH_W * grow;
  return (
    <div style={{ opacity }}>
      <svg
        width={HASH_W + 20}
        height={40}
        style={{ position: "absolute", left: OUT_X - 10, top: y }}
      >
        <path
          d={`M 10 4 L 10 18 L ${10 + w} 18 L ${10 + w} 4`}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth={4}
          strokeLinejoin="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: OUT_X,
          width: HASH_W,
          top: y + 30,
          textAlign: "center",
          fontFamily: FONT_SANS,
          fontWeight: 700,
          fontSize: 40,
          color: COLORS.gold,
          opacity: interpolate(frame, [at + 8, at + 18], [0, 1], clamp),
        }}
      >
        always 64 characters
      </div>
    </div>
  );
};

/* ---------------- One-way pieces ---------------- */

export const Wall: React.FC<{ x: number; opacity: number; shake: number }> = ({
  x,
  opacity,
  shake,
}) => (
  <svg
    width={40}
    height={260}
    viewBox="0 0 40 260"
    style={{
      position: "absolute",
      left: x - 20 + shake,
      top: HEX_Y - 130,
      opacity,
    }}
  >
    {Array.from({ length: 10 }, (_, r) => (
      <g key={r}>
        <rect
          x={r % 2 ? 0 : -10}
          y={r * 26}
          width={30}
          height={22}
          rx={3}
          fill={COLORS.gray}
        />
        <rect
          x={r % 2 ? 32 : 22}
          y={r * 26}
          width={30}
          height={22}
          rx={3}
          fill={COLORS.gray}
        />
      </g>
    ))}
  </svg>
);

export const OneWaySign: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 11 } });
  if (frame < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 960,
        top: 190,
        transform: `translate(-50%, -50%) scale(${s}) rotate(${(1 - s) * -12}deg)`,
      }}
    >
      <svg width={460} height={150} viewBox="0 0 460 150">
        <rect x={0} y={0} width={460} height={150} rx={16} fill={COLORS.offWhite} />
        <rect x={10} y={10} width={440} height={130} rx={10} fill={COLORS.navy} />
        <polygon
          points="40,55 330,55 330,25 420,75 330,125 330,95 40,95"
          fill={COLORS.offWhite}
        />
        <text
          x={180}
          y={86}
          textAnchor="middle"
          fontFamily={FONT_SANS}
          fontWeight={800}
          fontSize={32}
          letterSpacing={3}
          fill={COLORS.navy}
        >
          ONE WAY
        </text>
      </svg>
    </div>
  );
};
