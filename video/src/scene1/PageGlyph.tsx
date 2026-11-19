import { interpolateColors } from "remotion";
import { COLORS, MONO } from "./theme";

// A notebook "page" drawn in local units (30 x 38), centered on (0, 0).
export const PAGE_W = 30;
export const PAGE_H = 38;

const LINES = [
  { y: 18, len: 18 },
  { y: 25, len: 18 },
  { y: 32, len: 12 },
];

export const PageGlyph: React.FC<{
  scale: number;
  opacity?: number;
  /** 0..1 draw-in progress for each of the three lines */
  lineProgress?: [number, number, number];
  textOpacity?: number;
  /** 0..1 red flash amount */
  red?: number;
  /** horizontal wiggle (local units) applied to the middle line */
  wiggle?: number;
}> = ({
  scale,
  opacity = 1,
  lineProgress = [1, 1, 1],
  textOpacity = 0,
  red = 0,
  wiggle = 0,
}) => {
  if (scale <= 0.001 || opacity <= 0.001) return null;
  const border = interpolateColors(red, [0, 1], ["rgba(0,0,0,0)", COLORS.red]);
  return (
    <g transform={`scale(${scale})`} opacity={opacity}>
      <rect
        x={-PAGE_W / 2}
        y={-PAGE_H / 2}
        width={PAGE_W}
        height={PAGE_H}
        rx={3.5}
        fill={interpolateColors(red, [0, 1], [COLORS.offWhite, "#FFD9DA"])}
        stroke={border}
        strokeWidth={2.4}
      />
      {textOpacity > 0 ? (
        <text
          x={-PAGE_W / 2 + 5.5}
          y={-PAGE_H / 2 + 10.5}
          fontFamily={MONO}
          fontSize={2.6}
          fontWeight={700}
          fill={COLORS.navy}
          opacity={textOpacity}
        >
          Alice → Bob: 2
        </text>
      ) : null}
      {LINES.map((l, i) => {
        const p = lineProgress[i];
        if (p <= 0) return null;
        const isTamper = i === 1;
        const color = isTamper
          ? interpolateColors(red, [0, 1], [COLORS.ink, COLORS.red])
          : COLORS.ink;
        const x0 = -PAGE_W / 2 + 6 + (isTamper ? wiggle : 0);
        return (
          <line
            key={i}
            x1={x0}
            x2={x0 + l.len * p}
            y1={-PAGE_H / 2 + l.y}
            y2={-PAGE_H / 2 + l.y}
            stroke={color}
            strokeWidth={isTamper ? 1.3 + red * 1.4 : 1.3}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
};
