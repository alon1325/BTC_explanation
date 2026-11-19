# How Bitcoin Achieves Trustless Consensus

**Topic:** How Bitcoin's Proof-of-Work and cryptographic hash chaining achieve trustless consensus
**Style:** Minimalist geometric 2D explainer (Remotion)
**Length:** 11 scenes · ~770 words · ~310 seconds

**Palette:** navy background `#0F1729` · off-white blocks · cyan `links / valid hashes` · gold `work / mining` · red `#FF5A5F` `tampering / broken links`

| # | Title | Duration |
|---|-------|----------|
| 1 | The Shared Notebook | 28s |
| 2 | The Whole Idea in Thirty Seconds | 27s |
| 3 | Digital Fingerprints | 30s |
| 4 | Forging the Chain | 32s |
| 5 | Linking Isn't Enough | 19s |
| 6 | The Nonce Guessing Game | 32s |
| 7 | How Hard Is Hard? | 32s |
| 8 | Hard to Find, Easy to Check | 27s |
| 9 | The Heaviest Chain Wins | 22s |
| 10 | The Cheater's Impossible Race | 35s |
| 11 | Trust, Replaced by Work | 26s |

---

## Scene 1 — The Shared Notebook
**Duration:** 28s

**Narration**
> Imagine a shared notebook that records who paid whom. Thousands of strangers around the world each keep a copy. There's no bank, no referee, no one in charge. So here's the puzzle. If anyone can add a page, what stops a cheater from quietly rewriting an old one? Bitcoin's answer rests on two simple ideas. Link every page to the one before it, and make every page expensive to write.

**Visuals**
Dark navy background (#0F1729). A single off-white rounded rectangle (a "page") fades in center with three thin horizontal lines inside ("Alice → Bob: 2"). It duplicates outward into ~40 identical small copies scattered across a faint dot-grid globe silhouette, connected by thin gray lines (peer network). On "no one in charge", a crown icon appears at center, then shrinks and pops out of existence. On "rewriting an old one", one copy's line wiggles and flashes red (#FF5A5F). On the final sentence, two labels slide up from the bottom: a cyan chain-link icon "LINK" and a gold pickaxe/gear icon "WORK".

---

## Scene 2 — The Whole Idea in Thirty Seconds
**Duration:** 27s

**Narration**
> Here's the whole idea in thirty seconds. Each page, called a block, carries a digital fingerprint of the block before it. To add a new block, computers called miners must win a guessing game that takes enormous effort. And because every block is chained to the last, changing old history means redoing all that effort, faster than everyone else combined. Now let's build it, piece by piece.

**Visuals**
Preview montage on navy. Three rounded squares (blocks) slide in left to right; a cyan arrow draws from each block back to its predecessor, labeled with a short hex string "a3f9…". A gold progress ring spins around the newest block while tiny dice glyphs tumble inside it, then the ring completes with a soft pulse. Cut to: the first block flashes red; a red wave travels right through every arrow, turning them dashed. A gold stopwatch appears above the chain with a long bar labeled "redo all work". Everything then collapses back into a single block at center to transition.

---

## Scene 3 — Digital Fingerprints
**Duration:** 30s

**Narration**
> Start with the fingerprint. Bitcoin uses a function called SHA two fifty-six. You feed it any data, a word, a page, a whole book, and it returns a fixed string of sixty-four characters. The same input always gives the same output. But change a single letter, and the output transforms completely, with no pattern you can predict. And there's no way to work backwards from the fingerprint to the input. It's a one-way street.

**Visuals**
A geometric "machine": a hexagon labeled "SHA-256" in the center. Left side: the word "hello" drops into a funnel; right side: a 64-character hex string types out in monospace cyan. Repeat with a paragraph block, then a thick book icon; output length stays identical each time (highlight with a bracket showing "64"). Then input "hello" → "hellp" with the changed letter in red; the output string scrambles character-by-character in a slot-machine animation into a totally different string. Finally, an arrow tries to go from output back into the machine and hits a wall; a one-way road sign icon appears.

---

## Scene 4 — Forging the Chain
**Duration:** 32s

**Narration**
> Now the chain. Every block holds a list of transactions, plus one extra line, the fingerprint of the previous block. That fingerprint becomes part of this block's own data, so it feeds into this block's fingerprint, which the next block stores, and so on. Each block is locked to everything before it. Tweak one payment deep in the past, and its fingerprint changes. The next block's link no longer matches, and the break ripples forward through every block after it.

**Visuals**
Four blocks in a horizontal row. Zoom into Block 2: it shows three transaction lines and a top field "prev: 7c1e…" in cyan. Block 1's fingerprint "7c1e…" travels as a glowing token along an arrow into Block 2's "prev" field. Block 2 runs through a mini SHA hexagon, producing "4b8d…", which flies into Block 3's "prev" field; repeat for Block 4. Each lock snaps shut with a small padlock icon. Then pull back: a transaction in Block 1 changes "2" → "20" (red). Block 1's fingerprint scrambles to a new value; the padlock between Block 1 and 2 breaks open, arrow turns red and dashed, mismatch shown as two hex strings side by side with a red ≠. The red break cascades right through Blocks 3 and 4.

---

## Scene 5 — Linking Isn't Enough
**Duration:** 19s

**Narration**
> But wait. Computers calculate fingerprints in a blink. A cheater could simply edit the old block and recompute every fingerprint after it, in under a second. Linking alone isn't enough. We need to make each block costly to create. That's where the work comes in.

**Visuals**
Continue from the broken red chain. A small cheater figure (simple geometric silhouette with a triangle mask) appears. A stopwatch reads 0.00s; the cheater taps each block quickly and every red arrow flips back to cyan, padlocks re-snap. Stopwatch stops at 0.3s. Hold one beat; the chain looks valid again. A large question mark fades in, then morphs into a gold coin-stack/weight icon labeled "COST".

---

## Scene 6 — The Nonce Guessing Game
**Duration:** 32s

**Narration**
> Bitcoin adds a rule. A block only counts if its fingerprint starts with a certain number of zeros. You can't choose a fingerprint directly, it's unpredictable. So each block includes a spare number called the nonce, short for number used once. Miners change the nonce, compute the fingerprint, and check. Not enough zeros? Change the nonce, and try again. And again. There's no shortcut, no clever math. Just guessing, billions of times per second, until someone gets lucky.

**Visuals**
A single block, enlarged, with fields: "prev", "transactions", and a new gold field "nonce: 0". Above it, a target bar shows "0000…" in gold with remaining characters as gray placeholders. Loop: nonce ticks 0 → 1 → 2, each tick sends the block through the SHA hexagon; the output hash appears below and its first characters are compared against the target (red X when they don't match). The loop accelerates: nonce counter blurs into a rapid odometer, hashes stream by as a waterfall of red-tinted strings. Suddenly the stream freezes on one hash starting with "0000" — its leading zeros glow gold, a green check pops, and the block border turns gold.

---

## Scene 7 — How Hard Is Hard?
**Duration:** 32s

**Narration**
> How hard is that? Each fingerprint character can be one of sixteen symbols. So requiring one leading zero takes about sixteen guesses. Two zeros, about two hundred fifty-six. Every extra zero multiplies the work by sixteen. Today, the whole network makes more than a hundred billion billion guesses every second, and it still takes about ten minutes to find a winner. And every two weeks, the network adjusts the target, adding or removing difficulty to keep that ten-minute pace.

**Visuals**
A 4x4 grid of the 16 hex symbols (0–9, a–f); the "0" tile glows gold: label "1 in 16". Then a staircase of bars grows: "0" → 16, "00" → 256, "000" → 4,096, "0000" → 65,536, each bar ×16 taller, camera tilting up as bars exceed the frame. Transition to a globe of tiny pulsing dots (miners) emitting hash particles, with a counter reading "> 100,000,000,000,000,000,000 / sec". A circular clock face fills to 10 minutes. Finally, a dial labeled "difficulty" rotates slightly up and down on a calendar strip marked every two weeks, keeping a needle steady on "10 min".

---

## Scene 8 — Hard to Find, Easy to Check
**Duration:** 27s

**Narration**
> Here's the beautiful part. Finding the winning nonce takes trillions upon trillions of tries. But checking it takes just one. Any computer can hash the block once and see the zeros. So when a miner announces a new block, everyone verifies it instantly, adds it to their copy, and starts racing on the next one. The winner earns newly created bitcoin, a reward for the work.

**Visuals**
Split screen. Left: "FIND" — a massive gold mountain of discarded hash strings piling up. Right: "CHECK" — a single hash passes through the SHA hexagon once; leading zeros glow; a green check appears in a fraction of a second. Then the network map returns: one node flashes gold and broadcasts the block as an expanding ring; each receiving node flashes a quick green check and appends the block to its local chain (tiny chains under each node grow by one in sync). A small coin icon flies to the winning node. All nodes immediately start spinning gold rings for the next block.

---

## Scene 9 — The Heaviest Chain Wins
**Duration:** 22s

**Narration**
> But what if two versions of history appear? The rule is simple. Everyone follows the chain with the most accumulated work, which is usually the longest one. No vote, no authority. Computing power is the only ballot. Just a shared rule that anyone can check. The heaviest chain wins.

**Visuals**
The chain forks at its tip into two branches, A and B, each one block long. Each block is drawn with a gold "weight" bar beneath it proportional to its work. Branch B gets one more block added; its total weight bar grows longer. A balance scale appears, tips toward B. Branch A fades to gray and dissolves; all network nodes swing their arrows to point at B. A small gavel icon appears and gets crossed out, replaced by a scale icon.

---

## Scene 10 — The Cheater's Impossible Race
**Duration:** 35s

**Narration**
> Now replay the cheater's plan. To erase a payment from six blocks ago, they must redo that block's puzzle, then the five blocks after it, each with a fresh, unpredictable nonce. Meanwhile, the honest network keeps adding new blocks on top. The cheater is chasing a moving finish line. To catch up, they'd need more computing power than the rest of the world combined, with hardware and electricity costing billions. And even then, everyone would see it. Every new block buried on top makes the past dramatically harder to change.

**Visuals**
Two parallel horizontal tracks. Top track: the honest chain, cyan blocks appearing steadily on the right, powered by a large cluster of gold miner dots. Bottom track: the cheater branches off at a red-edited block six positions back, powered by a small cluster of red dots; each of their blocks fills slowly with a gold progress ring. A finish-line flag sits at the honest chain's tip and keeps sliding right as new honest blocks appear. A gap counter ("behind by: 6… 7… 8…") grows. Brief overlay: the cheater's cluster swells to match half the globe with a price tag "$ billions" and a lightning bolt. Final shot: zoom out showing the edited block buried under many layers of blocks stacked like sediment, each layer labeled with a weight icon.

---

## Scene 11 — Trust, Replaced by Work
**Duration:** 26s

**Narration**
> So let's put it together. Fingerprints chain every block to the one before it, so any change is visible. The nonce puzzle makes every block costly to produce, but trivial to check. And the heaviest chain rule lets thousands of strangers agree on one history. No central authority. Just math and work, standing guard. Rewriting the past isn't forbidden. It's simply too expensive to try.

**Visuals**
Three icons arrange in a triangle, each lighting up on its line: cyan chain-link ("LINK"), gold die with leading zeros "0000" ("WORK"), and a balance scale ("CONSENSUS"). Lines connect them into a triangle that rotates into the center of the network globe from Scene 1. The crown icon from Scene 1 briefly reappears and fades away. The camera pulls back along an endless glowing chain of blocks receding into the distance. End card: "Rewriting the past isn't forbidden. It's just too expensive." in clean sans-serif, fade to navy.

---

## Notes
- **Text-to-speech:** Numbers are spelled out and "SHA-256" is written as "SHA two fifty-six" so the voice reads them correctly.
- **Simplification:** "Leading zeros" stands in for the real rule, which is that the fingerprint must be a number below a target value. It is the standard way to explain it and keeps the "×16 per zero" intuition correct.
- **Hashrate:** "More than a hundred billion billion guesses per second" (over 10²⁰/s) is a safe lower bound for the current network.
