import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Scene1 } from "./scene1/Scene1";
import { SCENE1_SECONDS } from "./scene1/timing";
import { Scene2 } from "./scene2/Scene2";
import { DURATION as SCENE2_DURATION } from "./scene2/timing";
import { Scene3 } from "./scene3/Scene3";
import { SCENE3_DURATION } from "./scene3/theme";

// Crossfade length. Each scene ends with >= 2s of silent hold and starts with
// 0.5s of silence, so a 20-frame overlap never clips narration.
export const TRANSITION_FRAMES = 20;

const SCENE1_DURATION = SCENE1_SECONDS * 30;

export const SCENES_1_TO_3_DURATION =
  SCENE1_DURATION + SCENE2_DURATION + SCENE3_DURATION - 2 * TRANSITION_FRAMES;

export const Scenes1to3: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENE1_DURATION}>
        <Scene1 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />
      <TransitionSeries.Sequence durationInFrames={SCENE2_DURATION}>
        <Scene2 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />
      <TransitionSeries.Sequence durationInFrames={SCENE3_DURATION}>
        <Scene3 />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
