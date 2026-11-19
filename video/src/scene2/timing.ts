// Scene 2 — "The Whole Idea in Thirty Seconds"
// All values are frames at 30 fps. Cue points follow the pauses measured in
// public/scene2/narration.wav (22.8s), shifted by AUDIO_START.

export const FPS = 30;
export const AUDIO_START = 15; // 0.5s of silence before the voice starts

const at = (seconds: number) => Math.round(AUDIO_START + seconds * FPS);

export const T = {
  // "Here's the whole idea in thirty seconds."
  titleIn: at(0),
  titleOut: at(2.4),
  // "Each page, called a block, carries a digital fingerprint of the block before it."
  blocksIn: at(2.7), // blocks slide in, staggered
  blockStagger: 14,
  arrowsIn: at(5.0), // cyan arrows draw back to predecessors
  arrowStagger: 20,
  // "To add a new block, computers called miners must win a guessing game..."
  miningStart: at(7.4),
  miningEnd: at(12.2), // ring completes, block 3 becomes solid
  // "And because every block is chained to the last,"
  chainPulse: at(12.8),
  // "changing old history"
  tamper: at(15.2),
  waveDuration: 45,
  // "means redoing all that effort, faster than everyone else combined."
  stopwatchIn: at(18.0),
  // "Now let's build it, piece by piece."
  collapse: at(20.7),
  collapseDuration: 40,
};

export const DURATION = at(22.8) + 2 * FPS; // narration + 2s hold = 25.3s

export const COLORS = {
  bg: "#0F1729",
  block: "#F4F1EA",
  blockLine: "#B9C0CF",
  cyan: "#3DD6F5",
  gold: "#F5B83D",
  red: "#FF5A5F",
  dim: "#5B6785",
};
