# Frame: acting on rivals, and weapons and defences

Status: **built 2026-11-26 at the author's word.** He asked for this twice:
"I want the interactions with rivals, so if that is paused for now, make
notes" (2026-11-25), and, after the fourth playtest, "Run the balance round.
Then I want to do the rival update we talked about, then run another balance
test after that to see what it changed". The notes were
`docs/FRAME-standing.md` section 5 and `docs/FRAME-bodies.md` section 4
(weapons and defences "with rivals", which he agreed to on 2026-11-26). This
file turns those notes into the rules that were built. No separate approval
of this file was asked for: his instruction to build is taken as approval,
and the choices below that the notes left open are marked as mine.

## What a rival is

Two rival lineages an era, steered by policies through the player's own
rules. Before this they touched the player only by eating the same food on
the same ground. They are usually far more numerous than the player (22,000
to 500 in one Coal Forests picture), which every rule below has to survive.

## 1. The rivals screen

A fourth tab. For each rival: the lineage it most resembles, its length, its
numbers and whether they rose or fell last turn, the food it eats best, the
regions it shares with you, and what it is doing to you. Below each, the four
things you can do about it, each with what it would do as things stand, or
why it cannot be done.

## 2. Four stances

A stance is a standing order, like settlers: it holds from turn to turn until
changed, and applies in every region you share with that rival. One stance,
toward one rival, at a time.

| Stance | Who can | Does | Costs |
|---|---|---|---|
| Push | Anyone | Contest the ground. Both sides lose numbers each turn, each in proportion to the other's share of the strength there. A side left with under 30% of the strength in a region is driven out: half go to its largest other region, the rest are lost. With nowhere else to go it stays and bleeds | Numbers. Push a bigger population and it is you who leaves |
| Prey on them | A hunter's mouth, on a rival with a smaller body | Their numbers there become your food. What you take is limited by your own numbers, your skill at prey and their defence | They push back |
| Shadow | Anyone, behind a rival hunter bigger than you | Eat what it leaves: more of the dead for you there | More of you are caught |
| Avoid | Anyone | Give up the food that rival eats best, where you share ground. In return it cannot push you or prey on you there | Less food |

Strength in a region is numbers times fight. Fight comes from the body: size,
armour, herding, and the four new weapons below (`FIGHT` in the data table).

## 3. Rivals answer by the same rules

Rule 7 of the game-building skill: the world plays by the player's rules.
The rivals' stances go through the same functions as the player's. What they
choose (my choice; the notes said only "a pushed rival may push back, and a
rival may prey on you"):

- A rival with a hunter's mouth preys on a player smaller than it, where they
  share ground. This is the one act a rival starts.
- A rival pushes back against a player that pushes it or preys on it.
- Rivals do not act on each other. That is left out to keep the turn
  readable; it can be added later through the same functions.

The bots that measure the game choose a stance by the same reading a person
would: prey where they can, push only where they are far the stronger,
avoid a rival that is preying on them when it costs less than it saves, and
shadow a bigger hunter when they can eat the dead.

## 4. Weapons and defences

From `FRAME-bodies.md` section 4. Four of the six are built; they make a
contest one of bodies and not only of numbers. A new branch of the tree.

| Trait | Rests on | Does | Closes off |
|---|---|---|---|
| Claws | Limbs at step 2 | Prey a little easier; fewer caught; more fight | |
| Horns | A heavier body | Much more fight; fewer caught; a little slower | |
| A clubbed tail | Armour | Fewer caught; more fight | Legs under the body at step 3 (no balancing tail) |
| Venom | | Prey easier, fewer caught and more fight, all only in a small body | A heavier body at step 2 |

Not built (my choice): camouflage and display. Both would make colour mean
something, and colour is the one thing drawn that is free (the author's
word, 2026-11-26). They need their own decision.

## 5. What will be measured

Kill gate round 9, the same seeds as round 8:

1. Careful play through and top three, on one life and saved, against the
   targets (about 30% and 10%).
2. Each stance best somewhere and none always right: careful play with each
   stance alone against no stances.
3. What rivals acting does: careful play with rivals answering and with
   rivals passive.
4. Bodies, the face of the Great Dying, ways of living, moments: as round 8.

## What it costs

- Save version 5 (a stance in the plan; nothing to carry over).
- A fourth tab; the Turn screen gains a line when a rival is acting on you.
- The kill gate: one round, about an hour.
