# Deep Time: design, as built

Stage 3 of the workflow was a proposal for the author's approval before game
code. It was not written as a separate step: on 2026-11-24, shown round 5 of
the kill gate, the author said "Go with your recommendation and build this bad
boy", and the build went ahead on the spec, the kill gate and the look he had
approved ("yes I liked the design style"). This file records what was built
and what it rests on. Inputs: `SPEC.md`, `KILLGATE.md`.

Stage 4 (engine and instruments) is done. Stages 5 and 6 (the author's verdict
on voice, look and density; a slice he wants to go on playing) are his, and
are next.

---

## 1. Decisions already made

| Decision | Source |
|---|---|
| Phone first, installable, offline, no accounts, turn-based | The author, 2026-11-24: "Correct" |
| Shape B: vanilla ES modules, no build step, bundled to one file | game-scaffold |
| The rules are the kill-gate model, unchanged | `KILLGATE.md` round 5; proved below |
| Two settings: a save at every era, or one life; going back forks | The author, 2026-11-24 |
| Four endings win | The author, 2026-11-24 |
| The look: dark ground, the era sets the colour, a 32 by 20 pixel animal in six slots, block type for headings only | The author, 2026-11-24 |

## 2. Architecture

```
src/data/world.data.js   every number: traits, eras, die-offs, endings. Tuned, not sourced
src/data/text.data.js    every word about the world. No number is typed here
src/engine/model.js      the rules: body, fit, food, one turn, the die-off. Pure
src/engine/policies.js   how a lineage decides without a person: the rivals, and the bots
src/engine/turn.js       the game's verbs: advance, setPlan, retry; and view
src/engine/game.js       a game: the world, the setting, standing orders, era saves
src/engine/state.js      the save contract: key, version, migrations, save codes
src/engine/parts.js      the six drawn slots, worked out from the traits
src/engine/rng.js        named random streams (kit copy)
src/ui/app.js            the screens. Reads view(); computes nothing
src/ui/sprite.js         the animal and its ground, as pixels, from the slots
sim/gate.js              the kill gate's tables, from the engine
sim/gate-check.js        the model is deterministic and nothing in it is decoration
sim/play.js              whole games by policy, for the gate and the tests
sim/bot.js, adapter.js   the reference player, through the game's own verbs
```

Imports run one way: data, then model, then policies, then turn, then the
screens. `model.step` is handed the policy function so the two files do not
import each other (the bundler refuses a cycle).

## 3. The rules are the measured rules

The kill-gate prototype is retired: `prototypes/killgate/` is gone, and its
model, data and policies are now `src/engine/model.js`, `src/data/world.data.js`
and `src/engine/policies.js`. Two models drift; there is one.

Proof that nothing moved: a fingerprint of 13 policies × 40 seeds, plus 12
saved-setting runs, hashed over every outcome, every era's body and every
turn's numbers, is the same before the move and after it
(`6ea6d029…ab73a`). A test (`the game played through its verbs is the game the
gate measured`) holds the other half: a policy driving `advance()` ends
exactly as the same policy driving the rules directly, 4 roads × 6 seeds.

So the numbers in `KILLGATE.md` round 5 are this game's numbers.

## 4. A turn, for a person

| The person does | The verb | Time passes |
|---|---|---|
| Keeps one of three offered mutations, or none | `advance(game, { keep })` | One turn |
| Puts pressure on a trait, or lets one fade | `setPlan(game, { press })`, `{ shed }` | None |
| Chooses what to eat mostly | `setPlan(game, { focus })` | None |
| Sends settlers to a region | `setPlan(game, { spread })` | None; they leave next turn |
| Begins an era again (saved setting) | `retry(game, era)` | Back to that era's opening |

Pressure and food are standing orders: they hold until changed, so a quiet
turn is one tap. An order that stops making sense (the trait is refined) is
dropped and the screen says nothing is under pressure. `view(game)` gives the
screens everything, including what each choice would do, from the same
functions the turn resolves with; the screens compute nothing.

Anything the view marks as not allowed, the engine refuses, with the reason
the screen shows.

## 5. Saves

Key `deep-time.save.v1` (never renamed), payload version 2, save codes
`DEEP1.`. Version 1 was the scaffold's placeholder game, which was on Pages
for a day; its migration begins a new lineage from the same seed and says so.
Fixtures for both versions load and play on.

- **A save at every era**: the world as each era opened is kept in the save.
  A lost lineage may begin any era it reached again; each try rolls a new
  die-off. Going back from a living lineage sets it aside (up to six, under
  key `deep-time.shelf.v1`) so it can be picked up again: a fork, not an
  overwrite.
- **One life**: the running save only. A lost lineage is lost.

## 6. Screens

| Screen | Shows |
|---|---|
| Title | Continue, new lineage (then the setting), load a save code |
| Turn | The animal on its era's ground; the warning or the die-off; what is under pressure; three offers and "keep none"; the regions; what to eat |
| Body | The animal; its six slots; traits held, each opening to grow or let go; the four endings and how far the body is toward each |
| Menu | The setting; go back; lineages set aside; save codes; notes |
| Sheets | A region; a trait; the die-off beginning; the end of an era; crossing into an ending |
| The end | What became of them; on the saved setting, the eras that can be begun again |

The turn's one required decision (keep or not) sits above the fold at
390 × 844. Every locked or empty state says why and what would change it.

## 7. Look

No web fonts (the game runs offline): headings are the device's monospace,
upper case; text is the system sans. The animal is drawn from rectangles on a
32 by 20 grid from its six slots, and each slot is a function of traits the
rules use, so a part that changes nothing cannot be drawn. The sprites and
scenes are first drawings and are meant to be redrawn.

## 8. Instruments

| Command | Question | Asserts |
|---|---|---|
| `npm test` | Is it true? | Finite numbers, the clock moves, determinism, a win has its body, verbs equal the gate, refused orders, the two settings, the save contract |
| `npm run gate:check` | Can the model be believed? | Deterministic; every run ends; every policy part and switch changes the end |
| `npm run gate` | Is it balanced? | The KILLGATE tables, 1,000 seeds (27 minutes) |
| `npm run sim -- --runs=50 --by=policy` | Does the bot finish through the verbs? | No stalled run |
| `npm run smoke` | Does the real page work on a phone? | Ten turns through the UI, three tabs, no overflow, no raw tokens, the save survives a reload |
| `npm run check` | All of the above but the long gate | |

## 9. Known gaps

- **Nobody has played it.** Whether it is fun is not known. That is the next
  gate, and it is the author's.
- The faults open in `KILLGATE.md`: the saved setting at 60.7% against about
  70%; a tolerant body with wide range that cannot win and rarely dies.
- The history is unchecked. The game says so in its notes.
- No tutorial beyond the opening note. The Shore's die-off is the gentlest,
  and is meant to teach.
- No sound. No itch page. Pages deploys from the default branch.
- The rivals are numbers on a tile; there is no rivals screen.
- Prose is thin: one line an era, one a die-off, one an ending.
