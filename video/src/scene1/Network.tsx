import {
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "./theme";
import { PageGlyph } from "./PageGlyph";
import { T } from "./timing";

// Globe + peer network, drawn in an SVG whose origin is the globe center.
export const CX = 960;
export const CY = 490;
const GLOBE_R = 410;
const NODE_COUNT = 40;
const NODE_SCALE = 1.25;
const BIG_SCALE = 9;

type P = { x: number; y: number };

const buildNodes = (): P[] => {
  const nodes: P[] = [{ x: 0, y: 0 }];
  for (let i = 0; nodes.length < NODE_COUNT && i < 20000; i++) {
    const a = random(`angle-${i}`) * Math.PI * 2;
    const d = Math.sqrt(random(`dist-${i}`)) * 355;
    const p = { x: Math.cos(a) * d, y: Math.sin(a) * d * 0.9 };
    if (nodes.every((n) => Math.hypot(n.x - p.x, n.y - p.y) > 74)) {
      nodes.push(p);
    }
  }
  return nodes;
};

const NODES = buildNodes();

const EDGES: [number, number][] = (() => {
  const seen = new Set<string>();
  const out: [number, number][] = [];
  NODES.forEach((n, i) => {
    NODES.map((m, j) => ({ j, d: Math.hypot(n.x - m.x, n.y - m.y) }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          out.push([Math.min(i, j), Math.max(i, j)]);
        }
      });
  });
  return out;
})();

// The copy that gets quietly rewritten: upper-right of the globe.
const TAMPER = NODES.reduce(
  (best, n, i) =>
    i > 0 &&
    Math.hypot(n.x - 230, n.y + 120) <
      Math.hypot(NODES[best].x - 230, NODES[best].y + 120)
      ? i
      : best,
  1,
);

const DOTS: { x: number; y: number; o: number }[] = (() => {
  const out: { x: number; y: number; o: number }[] = [];
  const step = 22;
  for (let y = -GLOBE_R; y <= GLOBE_R; y += step) {
    for (let x = -GLOBE_R; x <= GLOBE_R; x += step) {
      const r = Math.hypot(x, y) / GLOBE_R;
      if (r <= 1) out.push({ x, y, o: 0.08 + 0.32 * Math.sqrt(1 - r * r) });
    }
  }
  return out;
})();

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

export const Network: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (sec: number) => sec * fps;

  // --- Hero page (node 0): appears big, then shrinks into the network ---
  const heroIn = spring({ frame: frame - s(T.pageIn), fps, config: { damping: 200 } });
  const heroShrink = interpolate(frame, [s(T.spread), s(T.spread + 0.9)], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const heroScale = heroIn * interpolate(heroShrink, [0, 1], [BIG_SCALE, NODE_SCALE]);
  const lineP = [0, 1, 2].map((i) =>
    interpolate(frame, [s(T.linesIn + 0.6 + i * 0.45), s(T.linesIn + 1.1 + i * 0.45)], [0, 1], {
      ...clamp,
      easing: ease,
    }),
  ) as [number, number, number];
  const textOpacity =
    interpolate(frame, [s(T.linesIn), s(T.linesIn + 0.5)], [0, 1], clamp) *
    interpolate(heroShrink, [0, 0.4], [1, 0], clamp);

  // --- Globe, peer lines, packets ---
  const globeO = interpolate(frame, [s(T.spread + 0.2), s(T.spread + 1.4)], [0, 1], clamp);
  const peersP = interpolate(frame, [s(T.peers), s(T.peers + 1.4)], [0, 1], clamp);

  // --- Crown beat: dim the network so the crown reads clearly ---
  const crownDim = interpolate(
    frame,
    [s(T.crownIn), s(T.crownIn + 0.3), s(T.crownPop + 0.3), s(T.crownPop + 0.8)],
    [0, 1, 1, 0],
    clamp,
  );

  // --- Camera: push toward the tampered copy, then back out ---
  const zoom =
    interpolate(frame, [s(T.zoomIn), s(T.zoomIn + 1.6)], [0, 1], {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    }) -
    interpolate(frame, [s(T.zoomOut), s(T.zoomOut + 1.4)], [0, 1], {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    });
  const z = 1 + 0.55 * zoom;
  const fx = NODES[TAMPER].x * zoom;
  const fy = NODES[TAMPER].y * zoom;

  // --- Make room for the LINK / WORK labels ---
  const room = interpolate(frame, [s(T.labelsMakeRoom), s(T.labelsMakeRoom + 1)], [0, 1], {
    ...clamp,
    easing: ease,
  });

  // --- Tamper flash on one copy ---
  const tt = frame - s(T.tamper);
  const tamperDur = s(1.9);
  const red =
    tt < 0 || tt > tamperDur
      ? 0
      : interpolate(tt, [0, 5, tamperDur - 12, tamperDur], [0, 1, 1, 0], clamp) *
        (0.7 + 0.3 * Math.cos(tt * 0.45));
  const wiggle = tt < 0 || tt > tamperDur ? 0 : Math.sin(tt * 1.3) * 2.2 * (1 - tt / tamperDur);
  const ring = interpolate(tt, [0, 22], [0, 1], clamp);

  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0 }}
    >
      <g
        transform={`translate(${CX}, ${CY - 60 * room}) scale(${1 - 0.18 * room})`}
        opacity={1 - 0.55 * crownDim - 0.25 * room}
      >
        <g transform={`scale(${z}) translate(${-fx}, ${-fy})`}>
          {/* Dot-grid globe */}
          <g opacity={globeO}>
            <circle r={GLOBE_R + 14} fill="none" stroke={COLORS.grid} strokeOpacity={0.35} strokeWidth={1.5} />
            {DOTS.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={2} fill={COLORS.grid} opacity={d.o} />
            ))}
          </g>

          {/* Peer connections */}
          {EDGES.map(([a, b], i) => {
            const A = NODES[a];
            const B = NODES[b];
            const len = Math.hypot(B.x - A.x, B.y - A.y);
            const delay = (Math.hypot(A.x, A.y) / 400) * 0.6;
            const p = interpolate(peersP, [delay, delay + 0.4], [0, 1], clamp);
            const touchesTamper = a === TAMPER || b === TAMPER;
            return (
              <line
                key={i}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke={touchesTamper && red > 0 ? `rgba(255, 90, 95, ${0.3 + 0.5 * red})` : COLORS.peerLine}
                strokeWidth={1.6}
                strokeDasharray={len}
                strokeDashoffset={len * (1 - p)}
              />
            );
          })}

          {/* Little packets of gossip flowing between peers */}
          {frame > s(T.packets)
            ? new Array(16).fill(0).map((_, k) => {
                const [a, b] = EDGES[Math.floor(random(`edge-${k}`) * EDGES.length)];
                const period = 40 + Math.floor(random(`period-${k}`) * 30);
                const local = (frame - s(T.packets) + Math.floor(random(`off-${k}`) * period)) % period;
                const t = local / period;
                const fwd = random(`dir-${k}`) > 0.5;
                const A = NODES[fwd ? a : b];
                const B = NODES[fwd ? b : a];
                const fadeIn = interpolate(frame, [s(T.packets), s(T.packets + 0.6)], [0, 1], clamp);
                return (
                  <circle
                    key={k}
                    cx={A.x + (B.x - A.x) * t}
                    cy={A.y + (B.y - A.y) * t}
                    r={3}
                    fill={COLORS.offWhite}
                    opacity={fadeIn * 0.7 * Math.sin(Math.PI * t)}
                  />
                );
              })
            : null}

          {/* Red shock ring around the tampered copy */}
          {tt >= 0 && tt <= tamperDur ? (
            <circle
              cx={NODES[TAMPER].x}
              cy={NODES[TAMPER].y}
              r={26 + 40 * ring}
              fill="none"
              stroke={COLORS.red}
              strokeWidth={3}
              opacity={(1 - ring) * 0.9}
            />
          ) : null}

          {/* Copies of the notebook */}
          {NODES.map((n, i) => {
            if (i === 0) return null;
            const start = s(T.spread + 0.35) + i * 1.1;
            const p = spring({ frame: frame - start, fps, config: { damping: 14, mass: 0.7 } });
            const isT = i === TAMPER;
            return (
              <g key={i} transform={`translate(${n.x * p}, ${n.y * p})`}>
                <PageGlyph
                  scale={NODE_SCALE * Math.min(1, p * 1.4)}
                  opacity={Math.min(1, p * 2)}
                  red={isT ? red : 0}
                  wiggle={isT ? wiggle : 0}
                />
              </g>
            );
          })}

          {/* The original page (node 0), drawn last so it sits on top while big */}
          <PageGlyph
            scale={heroScale}
            lineProgress={lineP}
            textOpacity={textOpacity}
          />
        </g>
      </g>
    </svg>
  );
};
