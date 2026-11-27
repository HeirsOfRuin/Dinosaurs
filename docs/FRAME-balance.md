# Frame: how to balance what is now in the game

Status: **approved 2026-11-27.** The author, shown the decisions at the end:
"Go ahead", taken as every recommendation. Rounds A to C are built and
measured in `docs/KILLGATE.md` ("Balance rounds A to C"). Met: the top-three
floor for every body, the weapon and colour prices but horns, ranking last.
Open: the lizard and the amphibian outside 25 to 45%, the faces 16 points
apart, three bodies under 75% saved. The global dial was not turned: it
would push the amphibian further out (KILLGATE, fault 6).

The author, after camouflage and display were built: "Now I want you to
figure out how we might balance this stuff". "This stuff" is read as
everything added since round 7: coverings and the closing pairs, the four
stances toward rivals, rivals that hunt and push back, the six weapons and
colour traits, on top of the bodies, ways of living and the ladder.

Every number below is measured. "300 seeds" numbers are quick sweeps (±2.5
points on a rate near 30%); "round 9" numbers are the gate, 1,000 seeds an
arm (±1.5). Round 10, the gate with camouflage and display in, is running
and will be added to `KILLGATE.md`.

## 1. What "balanced" should mean here

The game has one hard target today, set by the author: about 30% of careful
play comes through on one life, about 10% reaches the top three. It holds
(round 9: 34.5% and 9.8%). Everything else has no target, which is why the
faults keep coming back round after round: a body or a trait drifts, and
there is no line it has crossed. The proposal is to give each kind of thing a
line, measured the same way every round:

| What | Line proposed | Today |
|---|---|---|
| Careful play, one life | 30% through, 10% top three (the author's) | 34.5 / 9.8 |
| Each body, made for with eyes open | 25 to 45% through; at least 5% top three | 23.0 to 49.4; 3.1 to 21.3 |
| Each trait, grown besides by the careful player | within 5 points of not growing it, unless it is meant to be a specialist's (then best somewhere: one era, one face, one body) | armour 1 +15, display −17, horns −9 |
| Each stance | open on at least a quarter of the turns that share ground; best somewhere | prey open 1%; none clears the floor |
| Each face of the Great Dying | within 10 points of the others | cold 33.5 against 41.0 to 54.4 |
| Who comes through, by rank | no more than a third rank last | 51% rank eighth |
| Saved setting, three tries an era | a target is needed | 51.8 to 88.5 by body |

Four of these lines are the author's to set (section 6).

## 2. What is wrong, and why

### Stances do not matter yet (round 9: together +1.5 points, none alone clears the floor)

Measured on 22,283 bot turns (seven policies, 40 seeds each):

- The player shares ground with a rival on 88% of turns, so stances are
  almost always relevant.
- On shared ground the rival has 1.6 times the player's numbers at the
  median (quartiles 0.8 and 3.3). That is less lopsided than feared.
- **Pushing is nearly always a loss.** The player's share of the strength is
  30% at the median; it reaches the 70% that drives a rival out on 7% of
  turns, and is under the 30% that gets the *player* driven out on half.
  Push is open 89% of the time and right almost never.
- **Preying is almost never open: 1% of shared turns.** It needs a hunter's
  mouth and a rival with a smaller body, and the rivals are mostly as big or
  bigger.
- Following a bigger hunter is open 20% of the time; keeping out of the way
  89%. A rival acts on the player on 19% of shared turns.

### Weapons and colour are priced wrong (careful policy, 300 seeds each)

| Grown besides | Through | Top three |
|---|---|---|
| Nothing | 28.3% | 4.0% |
| Armour step 1 alone | 43.7 | 5.7 |
| Clubbed tail (with armour 1) | 41.7 | 7.0 |
| Camouflage | 36.3 | 4.0 |
| Venom | 30.0 | 4.7 |
| Claws | 25.7 | 4.7 |
| A heavier body, step 1 alone | 24.3 | 3.7 |
| Horns (with size 1) | 19.7 | 2.0 |
| Display | 11.0 | 1.0 |

The club is worth nothing of its own: all its value is the step of armour it
rests on. **Armour's first step is the cheapest survival in the game** (+15
points). Display is a trap: where it stands out, more are caught, and it
stands out by design. Horns are a trap because their strength only counts in
a push, which (above) is almost never right.

### Half of those who come through rank last (round 9: 51%)

Taken apart (465 finishers, seven policies, 200 seeds each):

| | Standing | Prospects | Secure | Spread | Numbers | Regions |
|---|---|---|---|---|---|---|
| Ranked eighth | 429 | 722 | 0.72 | 0.8 | 482 | 1 |
| Ranked first to third | 619 | 786 | 0.89 | 0.9 | 1,518 | 2 |
| Ladder entries | 500 to 645 | 770 to 1,015 | 0.64 to 0.80 | 0.8 to 0.9 | | |

Two causes, about equal. Survivors come out of the last die-off thin and in
one region, so "secure" and "spread" mark them down. And their bodies feed
less on the ladder's grounds than the ladder's own bodies do (prospects 722
against 770 to 1,015), because a body that survives five die-offs carries
tolerance it paid for. Held at the ladder's own secure and spread, 31% would
still rank last.

### Bodies are not level (round 9: 23.0 to 49.4%)

- The lizard (49.4%) is small and lives at night, which hides it from the
  rivals that now hunt.
- The amphibian (23.0%) dies in the Coal Forests on half of its runs, almost
  all in the die-off (150 of 300). Check the bot first: it makes for a
  heavy, three-step body early, which is hungry.
- The warm bodies come through (mammal 35.6, dinosaur 28.0) but seldom reach
  the top three (5.1, 3.1).

### Smaller faults still open

Tending the young earns nothing alone (+0.7). The saved setting has no
target. The cold face of the Great Dying is 8 to 21 points behind the others.

## 3. How to balance it: the method

Every past round that went wrong did so by changing several things and
reading one pooled number. The method that has worked:

1. **Check the bot before the design.** A thing no bot uses cannot be
   measured. Today no bot grows a weapon or a colour trait, and the bots
   take a stance on under 4% of turns. Fix that first, or the gate will say
   these things are balanced because nobody touched them.
2. **Build a trait audit** into the gate: every trait in turn grown besides
   by the careful player, through and top three, against growing nothing.
   Table 13 already does this for six traits; extend it to all of them. It
   is the price list, and it would have caught armour 1 rounds ago.
3. **One lever per fault, swept at 300 seeds, confirmed in the gate at
   1,000.** Each fault in section 4 names its lever.
4. **Structure first, prices second, bodies third, the global dial last.**
   Fixing what a stance can do changes what every trait is worth; pricing
   traits changes what every body is worth; the starvation rate is turned
   last to put careful play back on 30%.
5. **Read each result on its second axis**: by face of the Great Dying, by
   body, on one life and saved. A pooled 30% can hide a coin toss.

## 4. Proposed changes, in order

### Round A: what the stances can do (structure)

| Fault | Lever | Expect | Risk |
|---|---|---|---|
| Prey open 1% | A hunter may prey on any rival whose fight a head is below its own, not only a smaller body | Prey open on perhaps a fifth of a hunter's shared turns | Hunters get stronger; the crocodile already leads the top three |
| Push nearly always a loss | The side that starts a push is never driven out by it; it only bleeds. A rival that answers is a push of its own and can drive you out | Push becomes a choice of cost, not a trap | A weak player pushing loses numbers for nothing; the screen already says so |
| Horns useless | Follows from the two above: fight now matters | Horns and claws worth something | |
| Bots never act | Teach the bots to grow weapons when they intend to push or prey, and to take stances at the same reading a person would | The gate measures the stances honestly | Gate numbers move with bot changes; compare against round 10 |

### Round B: what the new traits cost (prices)

| Fault | Lever | Expect |
|---|---|---|
| Armour step 1 is +15 | Raise armour's upkeep (0.05 to about 0.07 a step), or halve its starvation bonus at step 1 | Within 5 points of nothing |
| Display −17 | Halve the extra caught (0.05 to about 0.025); raise the faster climb (0.06 to about 0.08) | A gamble that pays in safe ground |
| Camouflage +8 | Trim the hiding (0.06 to about 0.045) | Within 5 points; still best for a small body that stays put |
| Clubbed tail adds nothing over armour | Give it its own defence against the hunters that prey on you (it halves what a rival hunter takes) | Worth taking where a rival hunts you |
| Tending +0.7 | Lower its upkeep (0.06 to 0.04) | Worth a few points to bodies that breed slowly |

### Round C: bodies and the ladder

| Fault | Lever | Expect |
|---|---|---|
| Half rank last | Secure reaches full sooner (`STANDING.fullAt` 25 to about 12, that is 1,200 heads) | Ranked last falls toward a third. Ranks move; no survival number does |
| Lizard 49%, pulling away | Night hides less from a rival that hunts (rival hunting ignores the night bonus to defence) | Lizard toward 40% |
| Amphibian dies in the Coal Forests | Check its bot's order first (size last, not first); only then the body | Amphibian toward 30% |
| Warm bodies seldom top three | Re-measure after rounds A and B; warm blood's faster breeding now feeds standing | Mammal and dinosaur at 5% or better |
| Cold face 33.5% | Leave until after A to C; it moved 5 points in round 8 and may move again | Within 10 points |

### Then: the global dial

Turn the starvation rate (0.72 today) to put careful play back on 30% and
10%, and run the full gate.

## 5. What it costs

- Three rounds, each a sweep (half an hour) and a gate run (about an hour
  and a half). About a day of machine time; most of it runs unattended.
- One gate table extended (the trait audit) and one added (stances open,
  and taken, per policy).
- Bot changes in round A will move every gate number a little. Round 10 is
  the baseline they are compared against.
- No save version change: everything proposed is a number or a rule, not a
  new thing to store.

## 6. Decisions for the author

| # | Question | Recommendation |
|---|---|---|
| 1 | How close should the bodies be? You asked on 2026-11-24 for the four winning roads "within 10% of each other". | A band: every body 25 to 45% through and at least 5% top three. Within 10% of each other (say 32 to 38%) would flatten the bodies until choosing one stopped mattering |
| 2 | If you push a rival stronger than you, should you be driven out, or only bleed? | Only bleed. Being driven out by your own push reads as a trap; a rival's answering push can still drive you out |
| 3 | The saved setting (a save at every era, three tries each): what share should come through? | About 75%. It is 51.8 to 88.5% by body today; the amphibian is the one below 70 |
| 4 | Is half of the survivors ranking last a problem? | Yes: no more than a third. Ranking last after coming through five die-offs reads as failure |
| 5 | Run rounds A, B and C in that order, each measured before the next? | Yes |
