import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BookIcon,
  DroppingInput,
  fade,
  Funnel,
  HashRow,
  Hexagon,
  LengthBracket,
  OneWaySign,
  PageIcon,
  Wall,
  WordChip,
} from "./parts";
import {
  at,
  COLORS,
  FONT_SANS,
  FUNNEL_X,
  HASH_W,
  HASHES,
  HEX_Y,
  OUT_X,
  SCENE3_DURATION,
} from "./theme";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Row y-positions for output hashes
const ROW_TOP = 420;
const ROW_MID = 540;
const ROW_BOT = 660;

// ---- Timeline (frames), anchored to narration sentences ----
const T = {
  hexIn: at("intro", 0.3),
  rigIn: at("intro", 3.2),
  // "You feed it any data, a word, a page, a whole book…"
  word: at("feed", 0.4),
  page: at("feed", 1.65),
  book: at("feed", 2.9),
  bracket: at("feed", 4.2),
  // "The same input always gives the same output."
  same: at("same"),
  // "But change a single letter…"
  change: at("change"),
  flip: at("change", 0.9),
  // "And there's no way to work backwards…"
  oneway: at("oneway"),
  // "It's a one-way street."
  street: at("street"),
  end: SCENE3_DURATION - 18,
};

// Each input: appears, drops 10f later, hashes 14f after that, output starts 4f later
const drop = (appear: number) => appear + 10;
const hashAt = (appear: number) => drop(appear) + 14;
const outAt = (appear: number) => hashAt(appear) + 4;

const sameAppear = T.same + 6;
const changeAppear = T.change + 8;
const changeDrop = T.flip + 30;

const Caption: React.FC<{
  x: number;
  y: number;
  color: string;
  opacity: number;
  children: React.ReactNode;
}> = ({ x, y, color, opacity, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: HASH_W,
      textAlign: "center",
      fontFamily: FONT_SANS,
      fontWeight: 700,
      fontSize: 38,
      color,
      opacity,
    }}
  >
    {children}
  </div>
);

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulses = [
    hashAt(T.word),
    hashAt(T.page),
    hashAt(T.book),
    hashAt(sameAppear),
    changeDrop + 14,
  ];

  const sceneOut = interpolate(frame, [T.end, T.end + 18], [1, 0], clamp);

  // Act E: backwards arrow hits the wall
  const wallX = 800;
  const arrowStart = T.oneway + 22;
  const arrowHit = arrowStart + 16;
  const arrowProgress = interpolate(frame, [arrowStart, arrowHit], [0, 1], {
    ...clamp,
    easing: (t) => t * t,
  });
  const bounce = interpolate(frame, [arrowHit, arrowHit + 8], [0, 30], clamp);
  const arrowFromX = OUT_X + 420;
  const arrowTipX =
    arrowFromX + (wallX + 24 - arrowFromX) * arrowProgress + (frame > arrowHit ? bounce : 0);
  const shake =
    frame > arrowHit && frame < arrowHit + 14
      ? Math.sin((frame - arrowHit) * 2.2) * 8 * (1 - (frame - arrowHit) / 14)
      : 0;
  const hit = frame >= arrowHit;
  const xPop = spring({ frame: frame - arrowHit, fps, config: { damping: 10 } });
  const arrowY = 455;

  return (
    <AbsoluteFill style={{ background: COLORS.navy, fontFamily: FONT_SANS }}>
      <Audio src={staticFile("scene3/narration.wav")} />

      <AbsoluteFill style={{ opacity: sceneOut }}>
        {/* faint dot grid */}
        <AbsoluteFill
          style={{
            backgroundImage: `radial-gradient(${COLORS.dimGray} 1.5px, transparent 1.5px)`,
            backgroundSize: "48px 48px",
            opacity: 0.5,
          }}
        />

        {/* heading */}
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 60,
            fontSize: 30,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: COLORS.gray,
            opacity: fade(frame, 4),
          }}
        >
          <span style={{ color: COLORS.cyan, fontWeight: 700 }}>03</span>
          &nbsp;&nbsp;Digital Fingerprints
        </div>

        {/* machine rig */}
        <Funnel opacity={fade(frame, T.rigIn, T.oneway + 10)} />
        <Hexagon appearAt={T.hexIn} pulses={pulses} />
        <div
          style={{
            position: "absolute",
            left: 640 - 200,
            width: 400,
            top: HEX_Y + 165,
            textAlign: "center",
            fontSize: 30,
            color: COLORS.gray,
            opacity: fade(frame, T.rigIn - 20),
          }}
        >
          hash function
        </div>

        {/* ---------- Act B: any input → 64 chars ---------- */}
        <DroppingInput appearAt={T.word} dropAt={drop(T.word)}>
          <WordChip text="hello" />
        </DroppingInput>
        <DroppingInput appearAt={T.page} dropAt={drop(T.page)}>
          <PageIcon />
        </DroppingInput>
        <DroppingInput appearAt={T.book} dropAt={drop(T.book)}>
          <BookIcon />
        </DroppingInput>

        {/* "hello" row survives into acts C and D (dimmed in D) */}
        <HashRow
          y={ROW_TOP}
          hash={HASHES.hello}
          start={outAt(T.word)}
          label={frame < T.same ? "a word" : '"hello"'}
          color={frame < T.change ? COLORS.cyan : COLORS.gray}
          highlight={interpolate(frame, [T.same + 50, T.same + 58], [0, 1], clamp) *
            interpolate(frame, [T.change, T.change + 10], [1, 0], clamp)}
          opacity={
            interpolate(frame, [T.change, T.change + 12], [1, 0.55], clamp) *
            fade(frame, 0, T.oneway, 14)
          }
        />
        <HashRow
          y={ROW_MID}
          hash={HASHES.page}
          start={outAt(T.page)}
          label="a page"
          opacity={fade(frame, 0, T.same, 12)}
        />
        <HashRow
          y={ROW_BOT}
          hash={HASHES.book}
          start={outAt(T.book)}
          label="a whole book"
          opacity={fade(frame, 0, T.same, 12)}
        />
        <LengthBracket
          y={ROW_BOT + 34}
          at={T.bracket}
          opacity={fade(frame, T.bracket, T.same, 12)}
        />

        {/* ---------- Act C: same input → same output ---------- */}
        <DroppingInput appearAt={sameAppear} dropAt={drop(sameAppear)}>
          <WordChip text="hello" />
        </DroppingInput>
        <HashRow
          y={ROW_MID}
          hash={HASHES.hello}
          start={outAt(sameAppear)}
          label='"hello" again'
          highlight={interpolate(frame, [T.same + 50, T.same + 58], [0, 1], clamp)}
          opacity={fade(frame, 0, T.change, 12)}
        />
        <Caption
          x={OUT_X}
          y={ROW_MID + 60}
          color={COLORS.green}
          opacity={fade(frame, T.same + 52, T.change, 10)}
        >
          ✓ same input → same output
        </Caption>

        {/* ---------- Act D: change one letter → scramble ---------- */}
        <DroppingInput appearAt={changeAppear} dropAt={changeDrop}>
          <WordChip
            text="hellp"
            redIndex={4}
            fromChar="o"
            flipProgress={interpolate(frame, [T.flip, T.flip + 12], [0, 1], clamp)}
          />
        </DroppingInput>
        <HashRow
          y={ROW_MID}
          hash={HASHES.hellp}
          start={changeDrop + 18}
          mode="scramble"
          label='"hellp"'
        />
        <Caption
          x={OUT_X}
          y={ROW_MID + 60}
          color={COLORS.red}
          opacity={fade(frame, changeDrop + 85, T.oneway, 10)}
        >
          1 letter changed → a totally new fingerprint
        </Caption>

        {/* ---------- Act E: no way back ---------- */}
        <Wall x={wallX} opacity={fade(frame, T.oneway + 8)} shake={shake} />
        {frame >= arrowStart && (
          <svg
            width={1920}
            height={1080}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <line
              x1={arrowFromX}
              y1={arrowY}
              x2={arrowTipX + 18}
              y2={arrowY}
              stroke={hit ? COLORS.red : COLORS.offWhite}
              strokeWidth={6}
              strokeDasharray={hit ? "14 10" : undefined}
              strokeLinecap="round"
            />
            <polygon
              points={`${arrowTipX},${arrowY} ${arrowTipX + 26},${arrowY - 16} ${arrowTipX + 26},${arrowY + 16}`}
              fill={hit ? COLORS.red : COLORS.offWhite}
            />
          </svg>
        )}
        {hit && (
          <div
            style={{
              position: "absolute",
              left: wallX + 40,
              top: arrowY - 110,
              fontSize: 80,
              fontWeight: 800,
              color: COLORS.red,
              transform: `scale(${xPop})`,
            }}
          >
            ✕
          </div>
        )}
        {/* the unknown input */}
        <div
          style={{
            position: "absolute",
            left: FUNNEL_X,
            top: HEX_Y - 40,
            transform: `translate(-50%, -50%) scale(${spring({
              frame: frame - (arrowHit + 6),
              fps,
              config: { damping: 12 },
            })})`,
            fontSize: 140,
            fontWeight: 800,
            color: COLORS.gray,
            opacity: frame >= arrowHit + 6 ? 1 : 0,
          }}
        >
          ?
        </div>

        <OneWaySign at={T.street} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
