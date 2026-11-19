import timings from "./timings.json";

export const FPS = 30;
export const SCENE3_DURATION = 30 * FPS;

export const COLORS = {
  navy: "#0F1729",
  panel: "#18233B",
  offWhite: "#F2EFE6",
  cyan: "#3DDCF2",
  gold: "#F5B83D",
  red: "#FF5A5F",
  green: "#4ADE80",
  gray: "#5B6680",
  dimGray: "#2E3A55",
};

export const FONT_SANS = "'Segoe UI', Helvetica, Arial, sans-serif";
export const FONT_MONO = "Consolas, 'Courier New', monospace";

type Segment = keyof Omit<typeof timings, "_total">;

/** Frame at which a narration sentence starts (plus an optional offset in seconds). */
export const at = (segment: Segment, offsetSec = 0) =>
  Math.round((timings[segment].start + offsetSec) * FPS);

/** Real SHA-256 digests of the inputs shown on screen. */
export const HASHES = {
  hello: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
  hellp: "fdd7585e08c4e2afd71dcabdb4636c89d557a3f42db9e2040c8bbd1708aa4ce7",
  page: "a528d142ba39d6c53a279aa91517be3acf680dfe99f97333cfe6e1f29841e6c9",
  book: "a66c76106adf99414373709cfa169d9ab7d3da9832f7b68bede173cebfd2273d",
};

// Layout (1920x1080)
export const HEX_X = 640;
export const HEX_Y = 540;
export const HEX_R = 120;
export const FUNNEL_X = 300;
export const OUT_X = 860;
export const MONO_SIZE = 25;
export const CHAR_W = MONO_SIZE * 0.55; // Consolas advance width
export const HASH_W = CHAR_W * 64;
