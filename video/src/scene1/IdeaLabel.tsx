import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "./theme";

const ChainIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={64} height={64} viewBox="0 0 64 64">
    <g transform="rotate(-40 32 32)" fill="none" stroke={color} strokeWidth={6}>
      <rect x={4} y={22} width={32} height={20} rx={10} />
      <rect x={28} y={22} width={32} height={20} rx={10} />
    </g>
  </svg>
);

const PickaxeIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={64} height={64} viewBox="0 0 64 64">
    <g transform="rotate(-35 32 32)" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round">
      <path d="M 8 22 Q 32 4 56 22" />
      <line x1={32} y1={14} x2={32} y2={60} />
    </g>
  </svg>
);

// One of the two big ideas, sliding up from the bottom. Frame 0 = entrance.
export const IdeaLabel: React.FC<{
  text: string;
  icon: "chain" | "pickaxe";
  color: string;
  x: number;
  y: number;
}> = ({ text, icon, color, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 16, mass: 0.8 } });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, ${(1 - p) * 220}px)`,
        opacity: Math.min(1, p * 1.5),
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "18px 40px 18px 28px",
        borderRadius: 999,
        border: `3px solid ${color}`,
        background: "rgba(15, 23, 41, 0.85)",
        boxShadow: `0 0 ${40 * p}px ${color}40`,
      }}
    >
      {icon === "chain" ? <ChainIcon color={color} /> : <PickaxeIcon color={color} />}
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 56,
          letterSpacing: 8,
          color: color,
        }}
      >
        {text}
      </span>
    </div>
  );
};
