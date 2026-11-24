# Kill gate: results

**Where the build is (2026-11-24):** Stage 1 (the spec) is approved. Stage 2
(this file) has been run once and found faults. The repo is scaffolded, with
the kit's placeholder game in `src/`. No screen is drawn and nothing of this
game is in `src/` until the author has read this file.

The kill gate is a numbers-only model in `prototypes/killgate/`: one lineage
steered by a fixed policy, two rival lineages steered through the same
functions, five eras, 107 turns, four regions an era, fourteen traits, a
die-off at the end of every era. No art, no words, no screen. It asks whether
the decisions in `SPEC.md` are interesting as a table of numbers.

Every number in `data.js` is tuned, not sourced. `npm run gate` reproduces the
tables below; `npm run gate:check` proves the model is deterministic, that
every run ended and moved its clock, and that every policy part and world
switch changes the end state (12 parts, each changed 30 to 40 of 40 seeds).

## Verdict

The game is there, and it is not yet balanced. Policies end very differently
on the same seeds, the win is reachable and not free, and rivals and die-offs
both bite. Two of the spec's five claims fail as modelled, and the win is too
close to following a list.

23 arms × 1,000 seeds = 23,000 runs, the same seeds for
every arm, ±1 standard error. Two rows differ when the gap is over 4.5 points.

## The five claims

| # | Claim in the spec | Holds? | The number |
|---|---|---|---|
| 1 | Policies end measurably differently | Yes | Alive at the end, one life: generalist 94.5%, opportunist 62.3%, planner 55.9%, recipe 39.0%, drifter 7.0%, specialist 0.2%, no evolution 0.0% |
| 2 | No policy wins everywhere; each is best in some era | Partly | Nothing dominates on every axis (the safest body cannot win; the winning bodies die more). But the specialist is best nowhere |
| 3 | The Great Dying kills most that reach it and not all | Partly | Of those who arrive: no evolution 0.0%, specialist 3.6%, drifter 22.0%, recipe 55.1%, opportunist 64.9%, planner 89.4%, generalist 99.9% |
| 4 | Five turns of warning matter; one turn does not | **No** | Planner's win rate by turns of warning: 0 turns 51.5%, 1 turn 54.0%, 3 turns 50.6%, 5 turns 55.9%, 8 turns 66.2%. Only eight clears the floor |
| 5 | Holding more regions lowers income and raises survival | **No** | Past the Great Dying with 1, 2, 3 regions: 44.7%, 36.9%, 39.6%. Three regions feed more, not fewer (78 against 61 in mid-Drying) |

## What the policies are

| Policy | Body plan | Regions | Heeds the warning |
|---|---|---|---|
| none | Keeps no mutation | 1 | no |
| drifter | Random | 2 | no |
| specialist | One food's jaw to the top, then size | 1 | no |
| generalist | Tolerance first: lungs, skin, egg, burrow, brain | 3 | no |
| opportunist | Whatever raises food most this turn | 2 | no |
| recipe | The dinosaur body in a fixed order | 1 | no |
| planner | The recipe, but turns to counter the named die-off | 2, then 3 | yes |

## One life: how far each gets (1,000 seeds)

| Policy | Past Shore | Past Coal | Past Drying | Past the Great Dying | Alive at end | WIN |
|---|---|---|---|---|---|---|
| none | 100.0 | 94.1 | 40.0 | 0.0 | 0.0 | 0.0 |
| drifter | 100.0 | 80.0 | 70.3 | 15.5 | 7.0 | 0.0 |
| specialist | 100.0 | 91.3 | 52.6 | 1.9 | 0.2 | 0.0 |
| generalist | 100.0 | 99.4 | 99.4 | 99.3 | 94.5 | 0.0 |
| opportunist | 100.0 | 100.0 | 100.0 | 64.9 | 62.3 | 0.0 |
| recipe | 100.0 | 81.1 | 81.1 | 44.7 | 39.0 | 39.0 |
| planner | 100.0 | 65.9 | 65.9 | 58.9 | 55.9 | 55.9 |

All ±1.6 or less. Only a lineage that builds the dinosaur body can win, so
five of the seven never do; that is the design, not a fault.

## The saved setting (1,000 seeds)

A save at every era, up to five tries an era, the era rolled again each time.
The bot does not learn between tries, so this measures luck only; a person
would also change their play.

| Policy | WIN | Mean tries used | Saves that lost 5 of 5 |
|---|---|---|---|
| recipe | 89.1 ±1.0 | 1.60 | Triassic 9.9%, Long Shadow 1.2% |
| planner | 89.8 ±1.0 | 1.27 | Coal Forests 5.7%, Triassic 4.6% |

Saves take a careful policy from 39 to 56% up to about 89%. The two settings
are different games, as asked.

## Switches (planner, 1,000 seeds)

| World | Past the Great Dying | WIN |
|---|---|---|
| As designed | 58.9 | 55.9 |
| No rivals | 94.6 | 91.5 |
| No die-offs | 77.0 | 77.0 |

Rivals cost the planner 36 points of win rate and die-offs 21. Neither is
decoration.

## Faults open

1. **The win is a list.** The recipe policy reads nothing about the world,
   follows thirteen steps in a fixed order, and wins 39.0% on one life and
   89.1% saved. A fixed target body makes a fixed build order. The dinosaur
   needs more than one road to it, or the road has to bend to the era.
2. **Warnings do not matter until eight turns out.** A step takes four to six
   turns, so five turns of warning buys one step at most. Either the warning
   comes earlier, or the answer to a die-off is something faster than a trait
   (moving, a change of diet).
3. **Range is not insurance.** Three regions did not survive the Great Dying
   more often than one (39.6% against 44.7%), and they fed more, not fewer.
   What range does do is slow the body: the dinosaur body takes 41, 45 and 50
   turns at 1, 2 and 3 regions. The slowing works; the insurance does not.
4. **The specialist is best nowhere.** It never out-eats the opportunist (30
   against 37 in mid-Shore, 24 against 71 in mid-Coal). As modelled,
   specialising in one food is simply worse. The spec's central tension needs
   it to be better somewhere.
5. **The safe body is too safe.** The generalist is alive at the end of 94.5%
   of one-life runs. It cannot win, but nothing threatens it either.
6. **The Coal Forests are where the dinosaur road dies.** Recipe loses 18.9%
   of runs there and planner 34.1%, with numbers at 17 to 29 against the
   opportunist's 71: the tolerance traits cost food before they pay. This may
   be the investment the author asked for, or a bad second hour. It needs a
   person to say.
7. **Saves that cannot be won.** On the saved setting, 9.9% of recipe runs
   reach a Triassic save that loses five times in five. A player there has to
   go back two eras; the game must say so.

## What the first run found and fixed

- With the first numbers the recipe won 100.0% of 300 runs and no competent
  policy ever died. Die-offs were made harsher, a region's numbers below 3 now
  die out, and the dinosaur body was made longer to build.
- The bot sent six settlers at a time, three arrived, and the colony died
  every turn it tried: holding two regions looked fatal (26.5% past the Great
  Dying against 82.5% for one, 200 runs). The bot now sends settlers only when
  enough will arrive. Check the bot before the design.
- A dinosaur could shed its warm blood and stay a dinosaur. It cannot now.

## Not modelled

Diet as a choice per region, the six drawn slots, predators as lineages
(predation is a number per region), the mammal-line and crocodile-line
endings, and anything a person would call fun.
