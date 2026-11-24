# Deep Time

Steer a lineage from a Devonian shore to the first dinosaurs.

Status, 2026-11-24: playable. Five eras, 107 turns, two settings (a save at
every era, or one life), four endings that count as a win. Built on the model
the kill gate measured (`docs/KILLGATE.md`); what is built is in
`docs/DESIGN.md`. Nobody has played it through yet.

The history in it is from memory and unchecked, and the numbers are tuned for
play. The game says so in its notes.

## Play as an app

Once the Pages workflow has run on the default branch: open
https://heirsofruin.github.io/Dinosaurs/ on a phone and choose Install (Chrome)
or Share → Add to Home Screen (Safari). It plays with the network off. Saves
live in that browser; Menu → Copy a save code moves a game anywhere.

## Run

```
npm run serve        # then open http://localhost:8000
npm run build        # dist/<slug>.html (one file), dist/site/ (installable)
```

## Check

```
npm run check     # tests, a 50-game bot batch, the bundle, the bundle check, the phone smoke test
```

Must pass before every commit.

## Instruments

| Command | Question |
|---|---|
| `npm test` | Is it true? Invariants and the save contract |
| `npm run gate` | Is it balanced? The kill gate's tables from the game, 1,000 seeds (27 minutes) |
| `npm run gate:check` | Can the model be believed? Deterministic, and nothing in it is decoration |
| `npm run sim -- --runs=50 --by=policy` | Does the bot finish through the game's own verbs? |
| `npm run sim -- --trace --seed=3` | One game, turn by turn |
| `npm run smoke` | Does the real page work at 390px? |

## Layout

```
src/data/     logic-free tables
src/engine/   pure: rng, state (save contract), turn, derive, ledger
src/ui/       screens; read the engine, compute nothing
sim/          bot, adapter, game-measure kit
test/         invariants, save contract, fixtures
tools/        bundle, check-bundle, smoke, icons, stamp, browser
```

## Sources
<!-- Real figures and their sources; "rounded for a game, do not cite". -->
