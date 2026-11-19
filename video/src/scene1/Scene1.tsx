import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { COLORS } from "./theme";
import { Crown } from "./Crown";
import { IdeaLabel } from "./IdeaLabel";
import { Network } from "./Network";
import { T } from "./timing";

// Scene 1 — The Shared Notebook (28s). See script.md.
export const Scene1: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navy }}>
      <Audio name="Narration" src={staticFile("scene1/narration.wav")} />

      <Sequence name="Notebook network">
        <Network />
      </Sequence>

      <Sequence
        name="Crown (no one in charge)"
        from={Math.round(T.crownIn * fps)}
        durationInFrames={Math.round((T.crownPop - T.crownIn + 1) * fps)}
      >
        <Crown popAt={T.crownPop - T.crownIn} />
      </Sequence>

      <Sequence name="LINK label" from={Math.round(T.link * fps)}>
        <IdeaLabel text="LINK" icon="chain" color={COLORS.cyan} x={760} y={900} />
      </Sequence>

      <Sequence name="WORK label" from={Math.round(T.work * fps)}>
        <IdeaLabel text="WORK" icon="pickaxe" color={COLORS.gold} x={1160} y={900} />
      </Sequence>
    </AbsoluteFill>
  );
};
