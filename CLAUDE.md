# Deep Time (working title): working rules

- Read `docs/SPEC.md` first in every new session (the design, the open
  questions and every decision in the author's words), then `docs/KILLGATE.md`
  (what the numbers model showed, and the faults still open). Do not re-derive
  either from chat.
- Built with the HeirsOfRuin game-building skills (`Game-Workshop/skills/`).
  Read `game-building/SKILL.md` before writing game logic. Follow its stages
  and gates; skipping a stage is allowed, skipping it silently is not.
- The stage this repo is at is written at the top of `docs/KILLGATE.md`, and
  what is built in `docs/DESIGN.md`. Read it before touching `src/`.
- The rules are `src/engine/model.js`, their numbers `src/data/world.data.js`
  (tuned, not sourced), and the lineages' policies `src/engine/policies.js`.
  They were the kill-gate prototype and were moved without changing a result.
  `npm run gate` prints the KILLGATE tables from the game (27 minutes);
  `npm run gate:check` proves the model is deterministic and that every part
  changes the end state. Re-run both after any change to those three files,
  and put the numbers, with their run counts, in the commit message.
- A person plays through `advance`, `setPlan` and `retry` in
  `src/engine/turn.js`, and the screens show only what `view` gives them. A
  test holds that a policy driving those verbs ends exactly as it does
  driving the rules. Keep it true: what is measured must be what is played.
- Words about the world go in `src/data/text.data.js`. No number is typed
  there, and none on a screen: a number shown comes from `view`.
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
- Every drawn part changes a number. A part that does not is not drawn: the
  six slots are worked out from the traits in `src/engine/parts.js`.
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
