# Kill gate: results

**Where the build is (2026-11-25):** Stage 7. The game is built and has been
played once by the author. After that run it was rebuilt on a changed design
(`docs/FRAME-standing.md`): a lineage wins by coming through, is ranked by
standing, has one mouth, chooses ways of living and meets moments. Round 6
below is the measurement of that game. Rounds 5 to 1 measured an earlier
design, in which a win needed one of four fixed bodies; they are kept as the
record and their numbers no longer describe the game.

The gate measures the game's own engine (`src/engine/model.js`,
`src/data/world.data.js`, `src/engine/policies.js`). Every number in the data
table is tuned, not sourced. `npm run gate` reproduces round 7 (127,000 runs,
about an hour); `npm run gate:check` proves the model is deterministic, that
every run ended and moved its clock, that no lineage wears two coverings,
holds warm blood without a coat or grew both halves of a closed pair, and
that every policy part and world switch changes the end state (26 parts;
watching changes 29 of 40 seeds, the rest 37 to 40).

Round 7 is the current measurement. Rounds 6a and 6 are the same design
before coverings, and their reading of ways of living, moments and the
warning still holds where round 7 does not say otherwise.

## Round 7: the tree, coverings, and traits that close each other off (2026-11-26)

The author: "Instead of how it is now, do we change trait selection to a
tree?" and, to the answer (a tree that is shown, chance still dealing, one
trait watched for; coverings and the closing pairs with it): "I agree. Do as
you suggest". What was built is `docs/FRAME-bodies.md` section 6. 127,000
runs, the seeds of round 6.

**Before any re-levelling** the new rules roughly halved survival: careful
play by body came through 8 to 34% (300 seeds each) against 24 to 54%. The
bots were checked first. Watching for traits made no difference on or off;
the loss was in the rules: a covering is upkeep, warm blood now waits on a
coat, heat tolerance had been taken from skin, and the Long Shadow's hunter
had been given a sail in place of warm blood and was cheaper to feed. Eased:
the starvation rate 0.72 to 0.71 (fat 0.67 to 0.66), warm blood 0.08 to 0.07
upkeep, skin's heat 0.05 back to 0.06, the hunter given fur and warm blood.

| | Round 6a | Round 7 |
|---|---|---|
| Careful play through, one life (7,000 runs) | 34.9 ±0.6% | 34.7 ±0.6% |
| Top three (7,000 runs) | 11.4 ±0.4% | 11.7 ±0.4% |
| Turtle body through (1,000 seeds each from here down) | 40.9 | 49.7 ±1.6 |
| Lizard | 53.6 | 47.9 ±1.6 |
| Crocodile | 37.5 | 43.5 ±1.6 |
| Dinosaur | 29.9 | 27.5 ±1.4 |
| Careful, no body in mind | 29.2 | 26.7 ±1.4 |
| Amphibian | 23.9 | 24.6 ±1.4 |
| Mammal | 29.0 | 23.0 ±1.3 |
| Top three: crocodile / turtle / amphibian | 25.7 / - / - | 23.8 / 20.4 / 18.9 |
| Top three: lizard / careful / dinosaur / mammal | | 12.4 / 3.5 / 2.0 / 0.8 |
| Saved setting, three tries an era, by body | 57.5 to 86.8 | 51.2 to 86.7 |

Both targets hold (about 30% and about 10%).

What the round found:

1. **Bodies are not level, and the coated ones are at the bottom.** 23.0 to
   49.7% through, a little over two to one, as before; but the order has
   changed. The three scaled bodies lead and the mammal fell six points. Of
   those who came through, 74% wore scales, 14% fur, 11% feathers and none
   were bare (2,429 finishers). Fur and feathers cost more than scales and
   carry warm blood's upkeep besides. Open.
2. **The warm bodies cannot reach the top.** Mammal 0.8% and dinosaur 2.0% in
   the top three against crocodile 23.8%. The mammal stands last on the ladder
   (494) and a lineage like it ranks eighth. This was open as "the crocodile
   is the glory pick" and is now three bodies wide. Open.
3. **The Great Dying by cold is the hard face.** Through, of those who met
   it: hot 54.2 ±1.3%, dry 45.6, waste 45.0, cold 28.2 ±1.2 (1,319 to 1,476
   runs each). A cold answer now takes a coat and then warm blood. Not a coin
   toss yet, but the face to watch when coats are re-costed.
4. **Watching for a trait does not help the bots.** As designed 34.7 ±0.6%,
   with watching switched off 35.8 ±0.6% (7,000 runs each, floor 1.5): no
   gain, and within the floor of none. The bots seldom wait long for a
   mutation, so there is little for it to save them. It is not inert (it
   changes 29 of 40 seeds). Its case is a person's: it is what makes the tree
   a plan and not a picture. Only a playtest can say whether it does.
5. **Ways of living, moments, warning, range: as round 6a.** Night +5.6
   points at best, roaming +6.8, fat +6.6, tending +1.9 (still open).
   Warning 0, 3, 5, 8 turns: 16.0, 31.5, 34.7, 36.6%. One, two, three
   regions: 20.8, 33.0, 34.6%. The road at a moment decides 12.1 ±1.0% of
   seeds.
6. **The closing pairs were not measured against their absence.** No bot
   wants both halves of a pair, so the gate has nothing to say about them.
   They are checked (no lineage ever grows both) and not weighed.

**Found after round 7, by the author's fourth run** (`docs/SPEC.md`,
2026-11-26): an eighth body beats all seven on the ladder. An insect mouth
refined to a scavenger, with armour, made for with eyes open: 49.8% through
and 31.5% top three (400 seeds), crocodile 39.5 and 21.5 on the same seeds.
Without its scales and sail it does better still, 67.8% through. Carrion is
eaten by no rival, so a scavenger's food is uncontested; and for this body a
covering costs more than it gives.

Open after round 7: a scavenger with armour beats every body on the ladder; bodies not level (1); warm bodies and the top three (2);
tending earns nothing alone; deep against wide mouths; half of finishers
rank eighth (52%); only seven bodies tested; the saved setting has no target.


## Round 6a: after mouths were made to turn (2026-11-26)

The author: "Cutting mouths kills you. It just happened to me twice. It
should be easier". A mouth is now turned to another food over six turns while
the old jaw goes on working (`docs/FRAME-standing.md` section 3). The bots
change mouths the same way, so the gate was run again: 120,000 runs, same
seeds as round 6. This is the current measurement; round 6's tables below are
from the day before.

| | Round 6 | Round 6a |
|---|---|---|
| Careful play through, one life (7,000 runs) | 33.1 ±0.6% | 34.9 ±0.6% |
| Top three (7,000 runs) | 10.5 ±0.4% | 11.4 ±0.4% |
| Lizard body through (1,000 seeds each from here down) | 47.5 | 53.6 |
| Turtle | 38.8 | 40.9 |
| Crocodile | 36.8 | 37.5 |
| Dinosaur | 30.1 | 29.9 |
| Careful, no body in mind | 29.2 | 29.2 |
| Mammal | 25.4 | 29.0 |
| Amphibian (keeps the mouth it starts with) | 23.9 | 23.9 |
| Crocodile, top three | 23.4 | 25.7 |
| Saved setting, three tries an era, by body | 56.0 to 81.0 | 57.5 to 86.8 |

Both targets still hold. Bodies that change their mouth gained a little, the
lizard most, so the spread between bodies widened again: 23.9 to 53.6%, a
little over two to one. The ways of living, the moments, the warning and
range read as in round 6 (night +7.0 points at best, roaming +7.6, fat +6.7,
tending +1.8; warning 0, 3, 5, 8 turns 15.7, 30.9, 34.9, 37.5%; 1, 2, 3
regions 25.6, 33.1, 35.1%). The open faults are round 6's, with the second
(bodies not level) a little worse.

A blind list that turns its mouth to prey on the Shore, where there is almost
none, dies there: the crocodile list passes the Shore 70.5% of the time. The
Body screen shows what a turn would feed before it is ordered.

## Round 6: after the first playtest

The author, 2026-11-25: "I would like you to work on fixing all the balance
faults." The faults were those of the first measurement of the rebuilt game
(1,000 seeds a policy, the "before" column below).

"Careful play" is seven policies pooled: one with no animal in mind, and one
making for each of six lineages' bodies, all heeding the warning. "Through"
is alive after the last die-off. 120,000 runs, same seeds per arm, ±1 SE.

### Against the author's targets

| Target | Measured | Met? |
|---|---|---|
| About 30% of careful play comes through on one life | 33.1 ±0.6% (7,000 runs) | Yes |
| About 10% reaches the top three rungs | 10.5 ±0.4% (7,000 runs) | Yes |
| The saved setting (no target set since the rebuild) | 56.0 to 81.0% through within three tries an era, by body; mean 67.1% (1,000 seeds each) | |

### The faults

| Fault | Before | After | Fixed? |
|---|---|---|---|
| One body dominates survival | Lizard 81.4% through; amphibian 2.7% | Lizard 47.5, turtle 38.8, crocodile 36.8, dinosaur 30.1, careful 29.2, mammal 25.4, amphibian 23.9 (1,000 seeds each, ±1.6) | Much reduced; not level (two to one) |
| The safest body also ranks best | Lizard: 21.0% top three, the most | Crocodile 23.4, lizard 13.6, turtle 12.8, amphibian 11.7, dinosaur 8.5, careful 2.6, mammal 1.1 | Changed: the heavy hunter now ranks best. See open fault 1 |
| Nobody reaches first | 0% of those through | 17% of those through | Yes |
| Laying down fat doubles survival | "As designed" 57.7% against 27.3% with no way of living | Fat alone: +6.7 points on the careful body, -0.8 on the mammal, +4.4 on the amphibian | Yes |
| More warning is worse than less | 8 turns 27.1%, 5 turns 33.1% | 0, 3, 5, 8 turns: 17.1, 30.9, 33.1, 34.3% (7,000 runs each, floor 1.5) | Yes |
| Night and roaming earn nothing | Both at or below no way of living | Night +5.9 points on the mammal; roaming +7.6 on the amphibian (floor 4.1) | Yes |
| Tending the young | (not a fault before) | Alone, its best is +1.6 points: inside the floor | **No.** See open fault 3 |
| Moments do not matter | Roads 57.7 / 58.0 / 57.7%; none 58.3% | Roads 29.2 / 26.5 / 28.6%; none 27.9%. The road taken decides whether the lineage comes through on 12.9 ±1.1% of seeds | Yes: no road is right, and the road changes one run in eight |
| A wide mouth out-eats a deep one everywhere | Wide ahead in Coal and Drying, deep nowhere | At one region, mid-era numbers: deep 41/50/53/65, wide 39/60/82/53. Deep is ahead on the Shore and in the Long Shadow | Partly. See open fault 4 |

### What was changed to do it

- A heavy animal starves more slowly than a slight one; so does one in
  armour, and a small one that burrows. Starvation is faster overall.
- Weight counts in standing, so a heavy body that comes through outranks a
  slight one. The safe body is no longer the one that ranks best.
- Die-offs take prey hardest.
- Carrion rises as a die-off begins and fails as it deepens. (A scavenger had
  been sleeping through the Great Dying on it.)
- Fat slows starvation less and slows breeding less; the bot lays it down
  only as the die-off arrives.
- Night hides more and costs a tenth of all food; roaming is paid for in
  upkeep, not in slower change.
- Warm blood, brain, size and armour cost less upkeep.
- An omnivore's teeth give less on other foods and take more from the
  mouth's own.
- Every road of every moment does about twice what it did.
- The lineages on the ladder were given the small numbers a die-off leaves,
  as the player has.

### One life, by policy (1,000 seeds each, ±1.6 or less)

| Policy | Past Coal | Past Drying | Past the Great Dying | THROUGH | Top three | Median standing |
|---|---|---|---|---|---|---|
| none | 20.1 | 0.0 | 0.0 | 0.0 | 0.0 | |
| drifter | 46.6 | 13.4 | 3.7 | 0.9 | 0.1 | 469 |
| eater | 88.9 | 28.9 | 1.4 | 0.4 | 0.0 | 476 |
| tolerant | 96.1 | 75.2 | 12.4 | 2.4 | 0.0 | 402 |
| careful | 81.5 | 80.0 | 36.3 | 29.2 | 2.6 | 445 |
| dinosaur, list / plan | 89.3 / 95.1 | 28.0 / 89.9 | 2.4 / 44.6 | 1.0 / 30.1 | 0.2 / 8.5 | 528 / 476 |
| crocodile, list / plan | 54.1 / 88.2 | 18.5 / 75.2 | 12.7 / 50.8 | 8.7 / 36.8 | 5.1 / 23.4 | 577 / 632 |
| mammal, list / plan | 74.0 / 90.1 | 41.3 / 89.1 | 5.7 / 37.1 | 3.1 / 25.4 | 0.0 / 1.1 | 410 / 408 |
| amphibian, list / plan | 17.4 / 50.7 | 17.0 / 42.9 | 11.0 / 28.6 | 9.3 / 23.9 | 8.7 / 11.7 | 592 / 559 |
| lizard, list / plan | 73.6 / 90.4 | 69.0 / 89.7 | 16.4 / 55.9 | 8.6 / 47.5 | 2.0 / 13.6 | 478 / 496 |
| turtle, list / plan | 83.7 / 93.5 | 57.2 / 87.4 | 18.4 / 54.7 | 10.3 / 38.8 | 1.8 / 12.8 | 491 / 489 |

A body followed blind comes through 1.0 to 10.3% of the time; with eyes open,
23.9 to 47.5%. Everyone passes the Shore (99.8% or more of careful play).

### The ladder

Each scored by the function that scores the player: dinosaurs 616, crocodile
line 577, lizard line 559, turtle line 540, beaked plant-eaters 522, mammal
line 507, great amphibians 503.

Of careful play that came through, by place, first to eighth: 17, 9, 6, 7,
6, 5, 1, 49%. What they most resembled: mammal 22%, lizard 22%, turtle 17%,
crocodile 16%, dinosaur 13%, amphibian 10%.

### The rest

- **By face of the Great Dying**, careful play through, of those who met it:
  hot 52.6%, dry 44.2%, waste 38.2%, cold 31.7% (about 1,400 runs each).
  Graded; no face is a coin toss.
- **Range**: 1, 2, 3 regions give 27.6, 31.6, 33.5% through and 3.7, 9.3,
  10.3% in the top three (7,000 runs each).
- **Switches**: with no rivals 79.7% come through; with no die-offs 96.5%;
  warning unheeded 11.6%.
- **Careful survival of those arriving**, by era: Coal 50.7 to 95.1%, Drying
  84.6 to 99.2%, Great Dying 41.6 to 67.6%, Triassic 67.5 to 85.0%.

### Faults open after round 6

1. **The crocodile's body is the glory pick.** It comes through a little more
   often than most (36.8%) and reaches the top three two to twenty times as
   often as the others (23.4%). Weight in standing and a hunter's mouth on
   grounds rich in prey do it.
2. **Bodies are not level.** 23.9 to 47.5% through: two to one, from thirty to
   one. The lizard's is still the safest.
3. **Tending the young does not earn its place alone** (+1.6 points at best,
   inside the floor), though every lineage's best pairing in the sweeps
   included it.
4. **A deep mouth out-eats a wide one in two eras of five** (the Shore and the
   Long Shadow), and the wide one survives the Coal Forests more often (78%
   against 62%). The trade exists; it is not yet the clear one the frame
   asked for.
5. **Half of those who come through are last.** 49% stand eighth of eight. A
   lineage that squeaks through with few numbers on one region scores under
   every lineage on the ladder.
6. **Only seven bodies were tested.** The policies make for the ladder's own
   lineages or for none. A body between them, with ways of living chosen to
   suit, may beat all of these; a table of every body by every pair of ways
   (150 seeds) found none above 53%, before the last changes.
7. **The saved setting has no target since the rebuild** and is uneven: 56.0%
   (mammal) to 81.0% (lizard).

## Rounds 5 to 1 (the record: an earlier design)

## Round 5: the saved setting, as far as it goes

The author, offered a move to design with the saved setting carried as a
risk: "Fix the saved setting".

### Against the targets (91,677 runs, ±1 SE)

| Target | Round 4 | Round 5 | Met? |
|---|---|---|---|
| About 15% on one life | 16.0% | 15.4%, four roads pooled (4,000 seeds a road) | Yes |
| The four roads within 10% of each other, one life | 15.1 to 16.9% | Dinosaur 16.4, crocodile 15.8, mammal 15.0, amphibian 14.6% (each ±0.6); highest over lowest 1.12 | At the edge |
| About 70% saved, a win within three tries an era | Mean 56.9%; 42.3 to 68.7% by road | Mean 60.7%; dinosaur 65.4, mammal 61.8, amphibian 59.5, crocodile 56.2% (1,000 seeds each, ±1.6) | No |
| The same, within six tries an era | Mean 74.3% | Mean 81.2%; 75.9 to 85.8% | |

### What changed

- **The bot's cautious retry is gone.** On a second try at an era it put
  tolerance before its road. That cost the crocodile 13 points of saved wins
  (41.3 against 54.0%, 400 seeds). A retry is played like a first try.
- **Danger moved out of the Great Dying.** Die-off strength: Coal Forests
  1.0 to 1.4, the Drying 1.4 to 1.7, the Great Dying 1.8 to 1.45. Careful
  survival of those arriving is now Coal 64 to 91%, Drying 53 to 64%, Great
  Dying 49 to 55%, Triassic 49 to 68%. A retry is worth more when no one era
  is a wall.
- **The roads re-levelled**: the dinosaur at warm 2 and size 2, taking skin
  and egg before its third limb step; the amphibian with an early burrow.

### Why it stops short

On the way, the same bot at two tunings (2,000 seeds a road on one life, 600
saved): one life 15.3% gave saved 64.3%; one life 19.0% gave saved 67.3%.
Four points of one-life win buy three of saved. About 15 and about 70 are not
both reachable with this bot.

If tries were independent, the era survivals above would give about 75%
saved. They are not: a retry starts from the body that has just failed, and
the bot plays it the same way. A person who has lost an era changes what they
do. The saved number is a floor, and how far above it a person lands cannot
be measured here.

### The rest, re-measured (pooled, 4,000 runs each, floor 1.6)

A list followed blind wins 1.3 to 7.2% by road (1,000 seeds each). Warning 0,
1, 3, 5, 8 turns out: 8.3, 9.1, 12.2, 14.7, 20.3% win. Holding 1, 2, 3
regions: 9.8, 12.8, 14.7%. Without rivals 48.5%, without die-offs 99.3%,
without a choice of food 11.8%, warning unheeded 5.8%. Win by face of the
Great Dying, of those who met it: 22 to 34% (dinosaur), 26 to 43%
(crocodile), 23 to 35% (mammal), 35 to 45% (amphibian). No careful run died
on the Shore.

### Faults open after round 5

1. **The saved setting: 60.7% against about 70%.** See above. The choices are
   to accept it as a floor, to let one life rise to about 20%, or to count
   the target at four tries an era (not yet measured).
2. **With range, tolerance is free, and it got worse.** The tolerant body at
   three regions is alive at the end of 34.6% of one-life runs (26.3% in
   round 4), more than twice any road, and can never win. Moving danger into
   the eras it is best at did this.
3. **The crocodile list dies on the Shore** in 46.4% of runs.
4. **The roads were levelled by changing the bodies**, tuned to a number.

## Round 4 (the record)

The tables below are round 4's own.

### Round 4's verdict: the specialist was a bot fault and a wrong comparison

The author, shown round 3's open faults: "Fix this one now" (the specialist
is best nowhere).

### What was wrong

- **The specialist bot kept the fish jaw it started with for the whole run**,
  through eras with almost no fish. It now picks the richest food of each
  era. Mid-Coal, one region: 37 before, 55 after.
- **The tables compared unequal range.** The specialist held one region and
  was set against bodies holding two and three. More regions feed more.

Round 3 said a jaw only matters against rivals. That was wrong: alone on a
food, a lineage of 40 takes about 41% of it with no jaw for it and 69% with
a full one.

### Specialise or stay general, at the same range (1,000 seeds each)

Numbers at mid-era, then survival of those who arrived.

| Body, regions | Shore | Coal | Drying | Long Shadow | Triassic | | Shore | Coal | Drying | Great Dying | Triassic |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Eater, 1 | 39 | 99 | 107 | 59 | 86 | | 100% | 87% | 60% | 20% | 48% |
| Tolerant, 1 | 21 | 46 | 95 | 83 | 84 | | 100% | 89% | 100% | 36% | 54% |
| Specialist, 1 | 37 | 55 | 57 | 55 | 15 | | 100% | 83% | 14% | 12% | 0% |
| Eater, 3 | 38 | 80 | 107 | 101 | 114 | | 100% | 76% | 57% | 36% | 54% |
| Tolerant, 3 | 21 | 98 | 115 | 102 | 92 | | 100% | 99% | 100% | 45% | 59% |

The eater takes whatever step feeds it most this turn. The tolerant body
builds lungs, skin and egg first. The specialist masters the one richest food
of each era.

- **The spec's tension holds at one region.** The body built to eat out-eats
  the tolerant one on the Shore, in the Coal Forests (99 against 46) and in
  the Drying. The tolerant body survives the Drying (100% against 60%) and
  the Great Dying (36% against 20%).
- **At three regions it does not.** The tolerant body both out-eats the eater
  in the Coal Forests (98 against 80) and the Drying, and out-survives it
  everywhere. Tolerance opens ground, and ground is food. This is open
  fault 2 below.
- **The rigid one-food specialist loses to the eater in every era.** That is
  left as it is. The eater is a specialist that chooses again each turn, and
  one food's stock is a ceiling. The specialist does beat the tolerant body
  on the Shore and in the Coal Forests.

### Tried and rejected (300 seeds a road)

| Change | Result |
|---|---|
| A food is worth only what the jaw can make of it (half with no jaw) | The tolerant body starved on the Shore in 45% of runs; the dinosaur road fell to 8.0% win |
| A steeper trade-off between jaws (0.10 for 0.05) | The four roads pooled fell to 2.6% win |

### The targets after round 4

Rivals use the specialist bot, so fixing it moved the roads. The dinosaur
went back to one size step and no brain, and the Great Dying from 1.7 to 1.8.

| Target | Measured | Met? |
|---|---|---|
| About 15% on one life | 16.0%, four roads pooled (4,000 seeds a road) | Yes |
| The four roads within 10% of each other | Dinosaur 16.9, mammal 16.2, crocodile 15.9, amphibian 15.1% (each ±0.6). Highest over lowest 1.12; spread 1.8 points against a floor of 1.6 | At the edge |
| About 70% saved, a win within three tries an era | Amphibian 68.7, mammal 58.9, dinosaur 57.8, crocodile 42.3% (1,000 seeds each): mean 56.9%. Within six tries: mean 74.3% | No |

Pooled, 4,000 runs each, floor 1.6: a list followed blind wins 2.2 to 6.9%
by road (1,000 seeds each); warning 0, 1, 3, 5, 8 turns out gives 8.5, 9.6,
13.2, 14.8, 19.6% win; holding 1, 2, 3 regions gives 11.1, 12.9, 14.1%;
without rivals 42.7%, without die-offs 99.4%, without a choice of food
12.3%, warning unheeded 6.3%. Careful survival of those arriving: Coal
Forests 69 to 97%, the Drying 67 to 79%, the Great Dying 38 to 44%, the
Triassic 52 to 65%.

### Faults open after round 4

1. **The saved setting is short and uneven**: 56.9% against about 70%, from
   42.3% (crocodile) to 68.7% (amphibian).
2. **With range, tolerance is free.** At three regions the tolerant body
   eats more and dies less than the eater. It cannot win (it is no ending's
   body), and it is alive at the end of 26.3% of one-life runs, more than
   any road.
3. **The crocodile list dies on the Shore** in 46.4% of runs: a prey jaw
   where there is no prey.
4. **The roads were levelled by changing the bodies** (the amphibian's
   armour, the dinosaur's size). Tuned to a number, not drawn from the
   animals.

## Round 3 (the record)

The tables below are round 3's own.

### Round 3's verdict: the targets on one life are met; the saved setting is short

The author, shown round 2: "All of them!" (fix every open fault), the four
roads "Within 10% of each other", and, told that nearly all the danger sat in
the Great Dying, "Go with your recommendation on the saved setting" (spread
the danger over eras two to five).

"Plan" is a road walked with eyes open (chooses its food, heeds the warning,
spreads to refuges). "List" is the same road's build order followed blind.
86,278 runs, every arm on the same seeds, ±1 SE.

### Against the author's targets

| Target | Measured | Met? |
|---|---|---|
| A careful player wins about 15% on one life | 15.5%, four roads pooled (4,000 seeds a road) | Yes |
| The four roads within 10% of each other | Amphibian 16.1, mammal 15.8, crocodile 15.6, dinosaur 14.5% (each ±0.6). Highest over lowest 1.11; the spread is 1.6 points, which is the floor between two roads | At the edge, inside the noise |
| About 70% with a save at every era, a win within three tries an era | Amphibian 72.1, mammal 59.1, dinosaur 56.1, crocodile 42.5% (1,000 seeds each, ±1.6): mean 57.5%. At six tries an era: 87.4, 73.4, 72.6, 60.9, mean 73.6% | No |

The saved figure is a floor: the bot plays a retried era more cautiously but
does not learn what killed it. It is also unequal across the roads, which the
one-life figure is not.

### What was asked to be fixed

| Round 2's fault | Round 3 | The number |
|---|---|---|
| The Shore kills | **Fixed** | No careful run of 4,000 died on the Shore (round 2: 4 to 8%). The strength dial no longer reaches the first era |
| Leaving a region does nothing | **Cut** | It moved the win 0.3 points in round 2 (4,000 runs each). The action is gone |
| Choosing food is worth little | **Fixed, by a side road** | Without it the win falls from 14.6 to 12.2% (4,000 runs each, floor 1.6). Nothing about the choice changed: die-offs now thin every food, so which one the lineage eats matters when they come |
| Saves that cannot be won | **Renamed and reduced** | See below |
| The specialist is best nowhere | **Open** | 37 in mid-Shore against the opportunist's 38, 37 against 84 in mid-Coal |
| The crocodile road is the hard one | **Fixed** | 15.6% against the dinosaur's 14.5% |
| Die-offs outweigh everything, in one era | **Reduced** | Careful survival of those arriving: Coal Forests 69 to 97%, the Drying 67 to 82%, the Great Dying 39 to 47%, the Triassic 42 to 66%. In round 2 the first two were near 100% and the Great Dying 17 to 26% |

**On "saves that cannot be won."** Round 2 called a save that lost five times
in five unwinnable. Two errors. The count was six tries, not five (k retries
is k + 1 tries; the columns were mislabelled in rounds 2 and 3). And a save
with an 18% chance loses six in a row a third of the time by arithmetic
alone: those saves were hard, not doomed. Now 3 to 18% of saved runs lose six
of six at the Great Dying and 9 to 15% at the Triassic.

### The claims, re-measured

| Claim | The number |
|---|---|
| The win is not a list | List against plan, one life: dinosaur 1.1 against 14.5%, crocodile 2.6 against 15.6%, mammal 7.6 against 15.8%, amphibian 4.9 against 16.1% |
| Warning matters, and more matters more | Plan win by turns of warning, pooled: 0 turns 8.5%, 1 turn 9.4%, 3 turns 13.2%, 5 turns 14.7%, 8 turns 19.6% (4,000 runs each, floor 1.6) |
| Holding more regions is insurance, paid for in time | Win holding 1, 2, 3 regions: 10.8, 12.5, 14.1%. The ending's body takes 42, 48, 52 turns |
| No face of the Great Dying is a coin toss | Win by face, of those who met it: dinosaur 15 to 22%, crocodile 19 to 31%, mammal 16 to 28%, amphibian 27 to 37% |

### One life: how far each gets (1,000 seeds each, ±1.6 or less)

| Policy | Past Shore | Past Coal | Past Drying | Past the Great Dying | Alive at end | WIN |
|---|---|---|---|---|---|---|
| none | 100.0 | 63.9 | 3.5 | 0.0 | 0.0 | 0.0 |
| drifter | 98.4 | 64.8 | 18.7 | 3.8 | 0.7 | 0.0 |
| specialist | 100.0 | 55.7 | 5.8 | 0.7 | 0.0 | 0.0 |
| generalist | 100.0 | 99.4 | 99.4 | 47.1 | 27.4 | 0.0 |
| opportunist | 100.0 | 77.1 | 44.2 | 15.0 | 8.5 | 0.0 |
| dinosaur, list | 100.0 | 70.0 | 17.1 | 4.1 | 1.1 | 1.1 |
| dinosaur, plan | 100.0 | 93.9 | 76.8 | 29.7 | 12.6 | 12.6 |
| crocodile, list | 53.6 | 29.3 | 10.5 | 2.9 | 2.6 | 2.6 |
| crocodile, plan | 100.0 | 84.9 | 61.4 | 24.0 | 15.9 | 15.9 |
| mammal, list | 100.0 | 88.1 | 48.4 | 13.7 | 7.6 | 7.6 |
| mammal, plan | 100.0 | 97.3 | 65.4 | 25.2 | 15.6 | 15.6 |
| amphibian, list | 100.0 | 54.9 | 28.5 | 8.2 | 4.9 | 4.9 |
| amphibian, plan | 100.0 | 69.4 | 48.6 | 22.6 | 14.3 | 14.3 |

The plan rows here are 1,000 seeds; the target table above uses 4,000.

### Parts (the four plans pooled, 4,000 runs each, floor 1.6)

| Arm | Past the Great Dying | WIN |
|---|---|---|
| As designed | 25.4 | 14.6 |
| No rivals | 57.9 | 44.0 |
| No die-offs | 99.4 | 99.4 |
| No choice of food | 22.1 | 12.2 |
| Warning unheeded | 11.0 | 6.7 |

### Faults open

1. **The saved setting is short and uneven.** 57.5% at three tries an era
   against about 70%, and from 42.5% (crocodile) to 72.1% (amphibian). The
   roads were levelled on one life; a retried era does not treat them alike.
2. **The specialist is best nowhere.** A lineage alone on a food takes all of
   it whatever its jaw, so a jaw only matters against rivals. A fix was tried
   (a food is worth what the jaw can make of it) and backed out: with it,
   heeding the warning and holding range both did worse than not. It needs
   its own round.
3. **The safe body is safe again.** The generalist is alive at the end of
   27.4% of one-life runs, more than any road, and can never win.
4. **The crocodile list dies on the Shore** in 46.4% of runs: a prey jaw
   where there is no prey. A blind list is a bot, not a player, but a new
   player may make the same first move; the Shore should say so.
5. **The roads were levelled by changing the bodies.** The dinosaur now needs
   size 2 and a brain, the amphibian armour 2. These were tuned to a number,
   not drawn from the animals; the canon should be checked against them.

### What round 3 found on the way

- **A win rate that was a coin toss.** At one tuning the pooled win was 27%
  and looked right. By face of the Great Dying: cold, 93 to 97% survived;
  hot, dry and waste, 0% (400 seeds a road). The win was whether the die
  came up cold. The gate now prints the win by face.
- **One threshold for a region and for the lineage punished spreading**:
  three regions of nine died where one of twenty-seven lived. They are two
  numbers now.
- **Ordinary die-offs cut two foods of four**, so a careful lineage ate
  something else and eras two and three killed nobody (97 to 100% survival,
  400 seeds a road). They now thin all four.

## Round 2 (the record)

### What round 2 fixed, and what it left open

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
