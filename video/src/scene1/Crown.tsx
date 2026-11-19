import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./theme";
import { CX, CY } from "./Network";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// "No one in charge": a crown appears at center, shrinks, then pops out of existence.
// Frame 0 = when the crown starts appearing. `popAt` is in seconds from that point.
export const Crown: React.FC<{ popAt: number }> = ({ popAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = popAt * fps;

  const enter = spring({ frame, fps, config: { damping: 12 } });
  // shrink a little, a quick swell, then gone
  const exit = interpolate(frame, [pop - 8, pop, pop + 4, pop + 9], [1, 0.72, 0.9, 0], clamp);
  const scale = enter * exit;
  const bob = Math.sin(frame / 9) * 5 * (frame < pop ? 1 : 0);

  const burst = interpolate(frame, [pop + 4, pop + 22], [0, 1], clamp);

  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${CX}, ${CY - 10 + bob})`}>
        {scale > 0.001 ? (
          <g transform={`scale(${scale * 1.5})`}>
            <path
              d="M -60 30 L -70 -38 L -32 -6 L 0 -52 L 32 -6 L 70 -38 L 60 30 Z"
              fill={COLORS.offWhite}
              stroke={COLORS.navy}
              strokeWidth={4}
              strokeLinejoin="round"
            />
            <rect x={-60} y={34} width={120} height={16} rx={5} fill={COLORS.offWhite} />
            <circle cx={-70} cy={-44} r={7} fill={COLORS.offWhite} />
            <circle cx={0} cy={-58} r={7} fill={COLORS.offWhite} />
            <circle cx={70} cy={-44} r={7} fill={COLORS.offWhite} />
          </g>
        ) : null}
        {burst > 0 && burst < 1
          ? new Array(10).fill(0).map((_, i) => {
              const a = (i / 10) * Math.PI * 2;
              const r1 = 20 + 110 * burst;
              const r0 = 20 + 70 * burst;
              return (
                <line
                  key={i}
                  x1={Math.cos(a) * r0}
                  y1={Math.sin(a) * r0}
                  x2={Math.cos(a) * r1}
                  y2={Math.sin(a) * r1}
                  stroke={COLORS.offWhite}
                  strokeWidth={4}
                  strokeLinecap="round"
                  opacity={1 - burst}
                />
              );
            })
          : null}
      </g>
    </svg>
  );
};
