// Beat times in seconds, aligned to public/scene1/narration.wav
// (sentence boundaries measured when the Kokoro narration was generated).
//
//  0.50 – 3.62  "Imagine a shared notebook that records who paid whom."
//  3.97 – 7.25  "Thousands of strangers around the world each keep a copy."
//  7.60 – 10.31 "There's no bank, no referee, no one in charge."
// 10.66 – 11.90 "So here's the puzzle."
// 12.25 – 16.94 "If anyone can add a page, what stops a cheater from quietly rewriting an old one?"
// 17.29 – 19.89 "Bitcoin's answer rests on two simple ideas."
// 20.24 – 24.83 "Link every page to the one before it, and make every page expensive to write."
export const SCENE1_SECONDS = 28;

export const T = {
  pageIn: 0.3,
  linesIn: 1.0,
  spread: 4.0, // "Thousands of strangers..."
  peers: 5.2,
  packets: 6.6,
  crownIn: 8.9, // "...no one in charge"
  crownPop: 10.0,
  zoomIn: 13.6,
  tamper: 15.5, // "...rewriting an old one"
  zoomOut: 17.4,
  labelsMakeRoom: 19.6,
  link: 20.25, // "Link every page..."
  work: 22.45, // "...make every page expensive to write"
};
