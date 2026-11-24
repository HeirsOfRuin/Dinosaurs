# Deep Time

Steer a lineage from a Devonian shore to the first dinosaurs.

Status, 2026-11-24: spec approved (`docs/SPEC.md`), kill gate run once
(`docs/KILLGATE.md`, `npm run gate`). What plays today is the scaffold's
placeholder game, not this one.

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
| `npm run sim -- --runs=200 --by=difficulty` | Is it balanced? Batch runs by cell, ±1 SE (game-measure) |
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
