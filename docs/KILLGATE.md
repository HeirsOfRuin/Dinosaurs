# Kill gate: results

**Where the build is (2026-11-24):** Stage 1 (the spec) is approved. Stage 2
(this file) is at round 2: the three faults the author asked to be fixed first
are fixed in the model, and five are open. The repo is scaffolded, with the
kit's placeholder game in `src/`. A look-and-screens concept was shown to the
author on a design canvas the same day; nothing of it is in the repo. No
screen is built and nothing of this game is in `src/` until the author has
read this file and `docs/DESIGN.md` is approved.

The kill gate is a numbers-only model in `prototypes/killgate/`: one lineage
steered by a fixed policy, two rival lineages steered through the same
functions, five eras, 107 turns, four regions an era, fourteen traits, a
die-off at the end of every era, four endings that count as a win. No art, no
words, no screen.

Every number in `data.js` is tuned, not sourced. `npm run gate` reproduces
round 2's tables (about 73,000 runs, a quarter of an hour); `npm run
gate:check` proves the model is deterministic, that every run ended and moved
its clock, and that every policy part and world switch changes the end state
(17 parts, each changed 17 to 40 of 40 seeds).

Round 2 is the current model and verdict. Round 1 is kept below as the record;
its tables are from the model as it was then.

## Round 2: the three faults are fixed; five are open

The author, shown round 1: "Recommendation" to all three questions (targets of
about 15% on one life and 70% saved; fix the first three faults in the model
first; a replayed era rolls a new die-off), and "I want there to be several
endings considered wins".

What changed in the model:

- **Four endings win**, each with its own body: dinosaur (upright, warm,
  shelled egg), crocodile line (armour, size, a hunter's jaw), mammal line
  (small, warm, burrowing, a brain), great amphibian (big, a fisher, never
  takes the egg). A body can close a road: the egg closes the amphibian's,
  size closes the mammal's.
- **What the lineage eats is chosen every turn** and costs nothing to change:
  one food eaten 35% better, the rest 25% worse.
- **A region can be left**: everyone in it walks to another, and some arrive.
- **The warning names the die-off and which regions it will spare**, five
  turns out. Some regions are real refuges (a die-off hits a region at 0.05 to
  1.5 of its strength).
- Die-offs are 2.6 times stronger.

73,114 runs, every arm on the same seeds, ±1 SE. "Plan" is a road walked with
eyes open (chooses its food, heeds the warning, spreads to refuges); "list" is
the same road's build order followed blind.

### The claims

| # | Claim | Round 1 | Round 2 | The number |
|---|---|---|---|---|
| 1 | The win is not a list | failed | **holds** | Win on one life, list against plan: dinosaur 5.8 against 21.6%, crocodile 0.4 against 10.3%, mammal 4.6 against 16.7%, amphibian 4.3 against 14.5% (1,000 runs each, floor 3.2) |
| 2 | Warning matters, and more of it matters more | failed | **holds** | Plan win by turns of warning, four roads pooled: 0 turns 10.3%, 1 turn 12.0%, 3 turns 14.3%, 5 turns 15.8%, 8 turns 17.9% (4,000 runs each, floor 1.6) |
| 3 | Holding more regions is insurance | failed | **holds, restated** | Past the Great Dying holding 1, 2, 3 regions: 12.5, 15.9, 17.2%. Win: 11.1, 14.1, 14.8% (4,000 runs each). The price is not food (more regions feed more: 40, 49, 57 in mid-Coal) but time: the ending's body takes 38, 48, 48 turns |
| 4 | Policies end differently; nothing dominates | held | holds | Alive at the end, one life: generalist 13.5%, opportunist 12.3%, the four plans 10.3 to 21.6%, lists 0.4 to 5.8%, specialist, drifter and no evolution under 1% |
| 5 | The Great Dying kills most and not all | partly | holds | Of those who arrive: plans 17.4 to 26.1%, generalist 21.0%, opportunist 12.9%, lists 7.3 to 10.6%, no evolution 0.0% |

### Against the author's targets

| Setting | Target | Measured | |
|---|---|---|---|
| One life, a careful player | about 15% | 15.8 ±0.6%, four roads pooled (4,000 runs) | By road: dinosaur 21.6, mammal 16.7, amphibian 14.5, crocodile 10.3 |
| A save at every era | about 70% | 62.3%, the mean of four roads at five tries an era | Dinosaur 74.6, mammal 65.8, amphibian 62.0, crocodile 46.6 (1,000 runs each). At two tries an era: 52.7, 42.0, 38.6, 29.1 |

The saved number depends on how many tries are counted, and the bot does not
learn between tries. A person gets as many tries as they like and changes
their play, so they will do better than this where the save can be won at all.

### One life: how far each gets (1,000 seeds each, ±1.6 or less)

| Policy | Past Shore | Past Coal | Past Drying | Past the Great Dying | Alive at end | WIN |
|---|---|---|---|---|---|---|
| none | 73.4 | 43.8 | 38.8 | 0.0 | 0.0 | 0.0 |
| drifter | 71.8 | 44.4 | 41.4 | 0.9 | 0.4 | 0.0 |
| specialist | 99.7 | 61.1 | 23.1 | 0.1 | 0.0 | 0.0 |
| generalist | 73.9 | 73.7 | 73.7 | 15.5 | 13.5 | 0.0 |
| opportunist | 99.9 | 99.7 | 99.7 | 12.9 | 12.3 | 0.0 |
| dinosaur, list | 71.0 | 71.0 | 71.0 | 6.8 | 5.8 | 5.8 |
| dinosaur, plan | 92.9 | 92.6 | 92.6 | 24.2 | 21.6 | 21.6 |
| crocodile, list | 70.1 | 10.3 | 4.7 | 0.5 | 0.4 | 0.4 |
| crocodile, plan | 92.3 | 56.3 | 54.7 | 13.5 | 10.3 | 10.3 |
| mammal, list | 89.1 | 77.9 | 77.8 | 5.7 | 4.6 | 4.6 |
| mammal, plan | 96.3 | 93.8 | 93.8 | 18.7 | 16.7 | 16.7 |
| amphibian, list | 79.8 | 52.7 | 52.7 | 4.3 | 4.3 | 4.3 |
| amphibian, plan | 93.6 | 93.0 | 93.0 | 16.2 | 14.5 | 14.5 |

Every plan that won, won as the ending it set out for.

### Parts (the four plans pooled, 4,000 runs each, floor 1.6)

| Arm | Past the Great Dying | WIN |
|---|---|---|
| As designed | 18.1 | 15.8 |
| No rivals | 28.6 | 24.9 |
| No die-offs | 88.8 | 88.8 |
| No choice of food | 16.6 | 14.3 |
| Never leaves a region | 17.9 | 15.5 |
| Warning unheeded | 8.8 | 7.7 |

### Faults open

1. **The Shore kills.** The first era ends 4 to 8% of careful runs and 11 to
   30% of the lists, and 26.6% of lineages that do nothing. The die-off dial
   was turned for the Great Dying and took the Shore with it. The first era
   should teach, and its die-off should be the gentlest.
2. **Leaving a region does nothing.** A plan that never walks out wins 15.5%
   against 15.8%: inside the floor. Spreading into refuges does the work;
   walking out of a doomed region adds nothing as modelled. Cut it, or make
   it matter.
3. **Choosing food is worth little.** 1.5 points of win rate, at the floor.
   It is a decision every turn; it needs to earn that.
4. **The specialist is still best nowhere** (round 1's fault 4, not yet
   touched). It out-eats nobody: 37 in mid-Shore against the opportunist's 38,
   29 against 70 in mid-Coal.
5. **Saves that cannot be won.** On the saved setting, a save at the start of
   the Long Shadow lost five times in five in 16.8% (dinosaur) to 34.0%
   (amphibian) of runs: the body that arrived could not survive the Great
   Dying however it fell. The crocodile road has the same trap in the Coal
   Forests (24.3%). A player there must go back an era or two, and the game
   has to say so before they try a sixth time.
6. **The crocodile road is the hard one**: 10.3% against the dinosaur's
   21.6%, and it loses 39.0% of careful runs in the Coal Forests. Four roads
   of unequal difficulty may be right; it should be a decision.
7. **Die-offs now outweigh everything.** Removing them takes the win from
   15.8 to 88.8%; removing rivals takes it only to 24.9%. Most of the game's
   risk sits in the last five turns of era four.

### What round 2 found in its own bots

- A list-following bot took every hint on its list the turn it was offered,
  carried armour and size on the Shore, and starved there in 99 runs of 100.
  Bots now work on their next three steps only.
- Bots judged a region by its food alone, walked into the rivals' ground and
  starved (13% of plans died on the Shore). They now count who is already
  there.

## Round 1 (the record)

### Verdict

The game is there, and it is not yet balanced. Policies end very differently
on the same seeds, the win is reachable and not free, and rivals and die-offs
both bite. Two of the spec's five claims fail as modelled, and the win is too
close to following a list.

23 arms × 1,000 seeds = 23,000 runs, the same seeds for
every arm, ±1 standard error. Two rows differ when the gap is over 4.5 points.

### The five claims

| # | Claim in the spec | Holds? | The number |
|---|---|---|---|
| 1 | Policies end measurably differently | Yes | Alive at the end, one life: generalist 94.5%, opportunist 62.3%, planner 55.9%, recipe 39.0%, drifter 7.0%, specialist 0.2%, no evolution 0.0% |
| 2 | No policy wins everywhere; each is best in some era | Partly | Nothing dominates on every axis (the safest body cannot win; the winning bodies die more). But the specialist is best nowhere |
| 3 | The Great Dying kills most that reach it and not all | Partly | Of those who arrive: no evolution 0.0%, specialist 3.6%, drifter 22.0%, recipe 55.1%, opportunist 64.9%, planner 89.4%, generalist 99.9% |
| 4 | Five turns of warning matter; one turn does not | **No** | Planner's win rate by turns of warning: 0 turns 51.5%, 1 turn 54.0%, 3 turns 50.6%, 5 turns 55.9%, 8 turns 66.2%. Only eight clears the floor |
| 5 | Holding more regions lowers income and raises survival | **No** | Past the Great Dying with 1, 2, 3 regions: 44.7%, 36.9%, 39.6%. Three regions feed more, not fewer (78 against 61 in mid-Drying) |

### What the policies are

| Policy | Body plan | Regions | Heeds the warning |
|---|---|---|---|
| none | Keeps no mutation | 1 | no |
| drifter | Random | 2 | no |
| specialist | One food's jaw to the top, then size | 1 | no |
| generalist | Tolerance first: lungs, skin, egg, burrow, brain | 3 | no |
| opportunist | Whatever raises food most this turn | 2 | no |
| recipe | The dinosaur body in a fixed order | 1 | no |
| planner | The recipe, but turns to counter the named die-off | 2, then 3 | yes |

### One life: how far each gets (1,000 seeds)

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

### The saved setting (1,000 seeds)

A save at every era, up to five tries an era, the era rolled again each time.
The bot does not learn between tries, so this measures luck only; a person
would also change their play.

| Policy | WIN | Mean tries used | Saves that lost 5 of 5 |
|---|---|---|---|
| recipe | 89.1 ±1.0 | 1.60 | Triassic 9.9%, Long Shadow 1.2% |
| planner | 89.8 ±1.0 | 1.27 | Coal Forests 5.7%, Triassic 4.6% |

Saves take a careful policy from 39 to 56% up to about 89%. The two settings
are different games, as asked.

### Switches (planner, 1,000 seeds)

| World | Past the Great Dying | WIN |
|---|---|---|
| As designed | 58.9 | 55.9 |
| No rivals | 94.6 | 91.5 |
| No die-offs | 77.0 | 77.0 |

Rivals cost the planner 36 points of win rate and die-offs 21. Neither is
decoration.

### Faults open

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

### What the first run found and fixed

- With the first numbers the recipe won 100.0% of 300 runs and no competent
  policy ever died. Die-offs were made harsher, a region's numbers below 3 now
  die out, and the dinosaur body was made longer to build.
- The bot sent six settlers at a time, three arrived, and the colony died
  every turn it tried: holding two regions looked fatal (26.5% past the Great
  Dying against 82.5% for one, 200 runs). The bot now sends settlers only when
  enough will arrive. Check the bot before the design.
- A dinosaur could shed its warm blood and stay a dinosaur. It cannot now.

### Not modelled

Diet as a choice per region, the six drawn slots, predators as lineages
(predation is a number per region), the mammal-line and crocodile-line
endings, and anything a person would call fun.
