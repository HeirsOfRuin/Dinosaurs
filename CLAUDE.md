# Deep Time (working title): working rules

- Read `docs/SPEC.md` first in every new session (the design, the open
  questions and every decision in the author's words), then `docs/KILLGATE.md`
  (what the numbers model showed, and the faults still open). Do not re-derive
  either from chat.
- Built with the HeirsOfRuin game-building skills (`Game-Workshop/skills/`).
  Read `game-building/SKILL.md` before writing game logic. Follow its stages
  and gates; skipping a stage is allowed, skipping it silently is not.
- The stage this repo is at is written at the top of `docs/KILLGATE.md`. No
  screen is drawn and nothing of this game goes in `src/` until the author has
  read the kill gate and `docs/DESIGN.md` is approved. What is in `src/` today
  is the scaffold's placeholder game, there so every instrument has something
  to prove.
- The kill-gate model is `prototypes/killgate/`. Its numbers are tuned, not
  sourced. `npm run gate` prints its tables; `npm run gate:check` proves it is
  deterministic and that every part changes the end state. Re-run both after
  any change to `data.js`, `model.js` or `policies.js`, and put the numbers,
  with their run counts, in the commit message. When the real engine exists
  and reproduces it, retire the prototype; two models drift.
- When a result surprises, check the bot before the design. The first range
  table said two regions were fatal; the bot was sending settlers to die.
  "The specialist is best nowhere" stood for three rounds: its bot kept its
  first jaw all run, and it was compared at one region against two and three.
  Compare bodies at the same range.
- Two settings: one keeps a save at the start of every era, one has one life.
  Going back to an earlier save forks the run. Every balance number is
  reported for both.
- A trait is built over several turns and rests on earlier traits. The author:
  "don't make it fly by without any room for investment." Do not add anything
  that is bought in one turn.
- Four endings win: dinosaur, crocodile line, mammal line, great amphibian.
  The author: "I want there to be several endings considered wins". A change
  that helps one road is measured on all four.
- The author's targets: a careful player wins about 15% on one life and about
  70% with a save at every era, counted as a win within three tries an era;
  the four roads within 10% of each other. A replayed era rolls a new die-off.
- A win rate can be right and still be a coin toss. One tuning read 27% and
  was "did the Great Dying come cold". Read the win by face of the die-off
  (the gate prints it) before believing a pooled number.
- Every drawn part changes a number. A part that does not is not drawn.
- The history is from memory until checked. Dates and die-offs are checked
  before they shape a number, and the source goes beside the number.
- The kit files in `sim/` (`run.js`, `stats.js`, `measure-lib.js`) and
  `src/engine/rng.js` are copies from Game-Workshop and are not edited here.
- Every commit runs `npm run check` first. Numbers in a commit message carry
  their run counts.
- Decisions go in the SPEC's dated table with the author's words quoted.
- Scratch files are `tools/_*.mjs` or `*.tmp.*` and are never committed.
  `dist/`, `out/`, `release/` are output and never committed.
- Do not open a pull request unless the author asks.
- Write for a reader who was not there: plain words, the failure behind each
  rule, the number that was measured.
