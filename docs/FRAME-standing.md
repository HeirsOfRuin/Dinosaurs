# Frame: standing, ways of living, and mouths

Status: **proposed 2026-11-25, waiting for the author's approval.** Nothing in
it is built. It changes how the game is won, what a turn offers and how food
works, so it reopens the kill gate: the numbers in `KILLGATE.md` round 5 will
not survive it and must be measured again.

## The author's words

After his first full run, 2026-11-25:

> "I don't think winning should be reliant on fitting a list of traits. It
> should be surging and having a score of how well you would do, with ranks
> compared to preset scores of others like the 4 current win species, or more
> if there are good choices."

> "There needs to be more you can do besides just adopt traits"

> "You shouldn't be able to change what you eat constantly, that's
> unrealistic. Once you have a certain type of mouth, it can evolve different
> aspects to improve or widen it's possible food sources, like an omnivore
> like bears or birds, scavenge or hunt, etc"

"Surging" is read as "surviving". If he meant something else, section 1
changes.

## What his run showed

From the save he sent (seed 1357618641, a save at every era):

- He came through all five eras and all five die-offs on his first try,
  with no era retried. Careful bots do that about 15% of the time.
- 17 alive at the end in three regions. Body: limbs 3, legs under the body 2,
  skin 3, egg 2, brain 3, burrowing 2, and three jaws (insects 2, plants 3,
  prey 3), eating mostly prey.
- The game called it "Still here": not a win. He was three steps short of the
  dinosaur's list (one of gait, one of egg, and warm blood) and had never
  been building toward it.

The game told the player who did the hard thing that he had not won, because
his animal was not on a list. That is the fault in his first point, and it is
a design fault, not a bug: the rules did what they were written to do.

His body is also his third point. Three jaws at once, and a food chosen
afresh each turn, is not an animal.

Classified by the playtest protocol: three design disagreements. No engine
bug was found in the run.

## 1. Standing: you win by coming through; how well is a rank

**Rule.** A lineage that is alive after the end-Triassic die-off has come
through. That is the win, whatever its body. How well it has done is its
**standing**: one number, worked out by the engine from the end state, and a
place on a ladder of the lineages that really came through.

**What standing measures.** How well this animal is set for the world that
comes next. Proposed, in three parts a player can see on the end screen:

| Part | What it is | Why |
|---|---|---|
| Prospects | How many of this body a panel of six Jurassic grounds would feed, by the same food and fit rules the game runs on | "How well you would do" |
| Numbers | How many are alive at the end | A lineage of nine is one bad year from nothing |
| Ground | Regions held at the end | Spread survives what comes |

One derivation: the prospects are computed by `capacity()`, the function
every turn resolves with. Nothing is scored by a second formula.

**The ladder.** The other rungs are real lineages, each a body in the data
table, scored by the same function as the player. Nobody's score is typed in.
Proposed eight rungs' worth of company:

| Lineage | Its body, in the game's terms |
|---|---|
| Dinosaurs | Legs under the body, warm, shelled egg |
| Crocodile line | Armoured, big, a hunter |
| Mammal line | Small, warm, burrowing, a brain |
| Great amphibians | Big fishers that never left the water |
| Lizard line | Small, scaled, insect-eaters; nothing special, and everywhere |
| Turtle line | Armoured, slow, eats what it finds |
| The beaked plant-eaters | Ruled the Permian; came through the Great Dying; faded here |

The last is on the ladder as the one that did not make it: a rung to finish
above. The end screen says where the player stands ("third of eight, between
the crocodile line and the lizards") and which lineage the body most
resembles. Resemblance is a description. It gates nothing.

**What goes.** The four fixed trait lists, the crossing in mid-Triassic, and
"only these four count as a win". The Body screen's "what this body could
become" becomes "what this body most resembles", live, with the standing it
would have if the game ended now.

**What this fixes besides his point.** Two faults open in the kill gate
dissolve: "the win is a list" (round 1) and "the tolerant body cannot win and
rarely dies" (rounds 4 and 5). It comes through, so it ranks, and the ladder
says how well.

**Worked example: his run.** 17 alive, three regions, a hunter-omnivore with
a big brain and no warm blood. Under this frame: he came through, so he won.
His prospects are good on dry and hot grounds and poor on cold ones; his
numbers are low. He would land mid-ladder, and the screen would say why.

## 2. More to do than adopt traits

**Rule.** A turn should offer a decision about how the lineage lives, not
only what it grows. Anything added must change the end state (nothing is
decoration) and must be best somewhere.

Three candidates, in the order recommended:

**A. Ways of living.** Behaviours, held one or two at a time. Chosen, not
grown, but not free: changing one takes a few turns to settle, and each has a
cost.

| Way of living | Gives | Costs |
|---|---|---|
| Active by night | Fewer caught; shelter from heat | Finds less food |
| Tending the young | Numbers recover faster after a loss | Upkeep |
| Living in herds or packs | Fewer caught; or better at prey | More mouths on one ground: food runs out sooner |
| Moving with the seasons | Bad ground hurts less | Slows every trait, like range |
| Laying down fat, sleeping through | Lasts through a die-off's worst turns | Grows slowly in good times |

**B. Moments.** Every few turns, something happens that is drawn from the
state of the world, with three ways to meet it and no wrong answer: a rival
abandons a region; a river moves; a new hunter appears; a plague takes the
neighbours. Each is shown once in a run. About a dozen to start.

**C. Acting on rivals.** Push a rival off a region at a cost in numbers, or
live in its shadow and eat what it leaves.

**Recommended:** A and B now, C later. A is cheap to build and measure. B is
where the stories come from, and its cost is writing, not code. C needs the
rivals to be visible first (there is no rivals screen).

## 3. One mouth

**Rule.** A lineage has one mouth. What it eats follows from the mouth. There
is no choice of food each turn.

- The first jaw brought to "developed" becomes the mouth: a fisher's, an
  insect-eater's, a plant-eater's or a hunter's. Until then the animal eats
  what it can, poorly.
- The other jaws stop being offered. A different mouth can be had only by
  letting the old one go, step by step, and growing the new: many turns of
  eating badly.
- From its mouth a lineage grows refinements, each built in steps like any
  trait:

| Refinement | What it does | From which mouths |
|---|---|---|
| Deeper | Better at its own food | Any |
| An omnivore's teeth | A second food at part strength | Any; the second food depends on the mouth |
| Scavenging | Eats the dead: a food that rises when predators are many and during a die-off | Hunter, insect-eater |
| Cracking and grinding | Hard food other mouths cannot use (shells, seeds, bone) | Fisher, plant-eater, hunter |

The trade the spec wants becomes visible in the mouth: deep and narrow eats
best while its food lasts; wide eats worse every turn and has something left
when a die-off takes one food.

**What goes.** "Eat mostly" on the Turn screen, and holding several jaws at
once.

## What will be measured

The kill gate runs again on the changed model. Claims, each with its number
and run count before any is believed:

1. No build order followed blind tops the ladder; reading the world does.
2. Finishers spread over the ladder. No one body is always first, and each
   of the reference lineages' bodies is reachable.
3. Each way of living is best somewhere, and none is best everywhere.
4. A deep mouth out-eats a wide one where its food is rich; a wide one
   survives a die-off that takes that food more often.
5. Removing the choice of food does not make any mouth unplayable in any era.
6. The share of careful play that comes through, on one life and saved,
   against the targets below.
7. The win is not a coin toss on the face of any die-off (the gate prints it).

## Decisions for the author

| # | Question | Recommendation |
|---|---|---|
| 1 | With "came through" as the win, how many should? It was about 15% on one life when a win also needed the right body. | About 30% on one life come through; the top three rungs are reached by about 10% |
| 2 | Which of the three additions in section 2, and in what order? | Ways of living and moments now; acting on rivals later |
| 3 | The ladder: these seven lineages, or others? | These seven; more can be added as bodies in a table |

## What it costs

- The kill gate reopens: at least two rounds, each a 27-minute run.
- Save version 3. Saves from version 2 cannot carry their jaws across; the
  migration would have to keep the strongest jaw as the mouth and say so.
- The Body and end screens change; the Turn screen loses a row and gains
  one.
- Moments are writing: about a dozen, each with three roads, read against the
  tone of the rest.
