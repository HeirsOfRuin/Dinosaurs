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
- `docs/FRAME-standing.md` is the approved design of how the game is won and
  what a turn offers. Where it differs from `SPEC.md` it wins.
- A lineage that is alive after the last die-off has come through: that is the
  win, whatever its body. The author, after being told his survivor had not
  won: "I don't think winning should be reliant on fitting a list of traits."
  How well is its standing, placed on a ladder of seven lineages that are
  bodies in `src/data/world.data.js` scored by the same function. Never type a
  score in, and never gate a win on a body.
- One mouth. The author: "You shouldn't be able to change what you eat
  constantly, that's unrealistic." A lineage holds one jaw; what it eats
  follows from it; refinements grow from it. Do not add a choice of food.
  A mouth is turned to another food while the old one goes on working; it is
  never shed and a lineage is never without one. Shedding it to change it
  killed the author twice ("Cutting mouths kills you... It should be easier").
- Ways of living are chosen, not grown, and take turns to settle. Herding is
  a trait (the author: "Herd mentality should be a trait").
- A moment comes once in a run and has three roads, none a refusal and none
  the right answer. The gate measures the three roads against each other.
- Animals are shown in heads: `HEADS` to one unit of the model, applied in
  `view` and nowhere else. The author asked for "500 instead of 5".
- Acting on rivals is built (`docs/FRAME-rivals.md`): four stances, one
  toward one rival at a time, resolved by `contact()` in `model.js` for the
  player and the rivals alike. A rival hunts a smaller player and pushes back
  against one that pushes or hunts it; rivals do not act on each other yet.
  Camouflage and display are not built: they would make colour mean
  something, and colour is free at the author's word. Ask before building
  them.
- The author's targets: about 30% of careful play comes through on one life,
  about 10% reaches the top three rungs. A replayed era rolls a new die-off.
- A win rate can be right and still be a coin toss. One tuning read 27% and
  was "did the Great Dying come cold". Read the win by face of the die-off
  (the gate prints it) before believing a pooled number.
- Every drawn part changes a number. A part that does not is not drawn: the
  slots and marks are worked out from the traits and ways of living in
  `src/engine/parts.js`. One exception, at the author's word ("colour of
  animals should be more randomized... it's always the same now"): a
  lineage's colour, pattern and small features of outline come from the seed
  and the era and change nothing. The Body screen says so.
- `docs/FRAME-bodies.md`: coverings, the closing pairs and the tree are built
  (its section 6 says how they differ from the proposal). Weapons and
  defences (section 4) wait for acting on rivals; randomising what a run
  offers (section 5) is "not yet". Build neither without the author's word.
- One covering, as one mouth: scales, fur or feathers, turned to another
  while the old one works, never two at once. Warm blood rests on fur or
  feathers. The pairs that close each other off are `BARS` in the data table;
  a new trait that ought to close another off goes there, not in an `if`.
- Mutations arrive by chance and the tree shows everything; a watched trait
  is offered within `WATCH_TURNS`. Do not turn the tree into a shop: nothing
  is bought, and a trait still has to turn up.
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
