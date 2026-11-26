# Frame: more bodies, and choices that close each other off

Status: **sections 1 to 3 built (2026-11-26), with the tree in section 6.**
The author, shown the four decisions at the foot of this file and the tree:
"I agree. Do as you suggest". Section 4 (weapons and defences) waits for
acting on rivals; section 5 (randomising what a run offers) is "not yet".
`docs/KILLGATE.md` round 7 is the measurement. What was built differs from
what was proposed in three places, listed in section 6.

## The author's words

2026-11-26, after his third run:

> "Sometimes I think we should add more traits and close some off if some are
> taken. Like watertight skin and warm blooded? Do those really go together?
> Maybe add feathers or fur? We should increase the amount of different art
> for traits. And colour of animals should be more randomized or something,
> it's always the same now. And maybe some body aspects could be randomized?
> Maybe adding things like weapons or defensive aspects ?"

## His question: do watertight skin and warm blood go together?

Yes. Every warm-blooded animal alive has watertight skin: fur and feathers
both grow from it, and a mammal dries out no faster than a lizard. So those
two should not close each other off.

His instinct is still right, and the game is missing it. The real fork is not
skin against warm blood. It is what the skin grows: scales, fur or feathers.
An animal has one covering. Section 2 builds the idea on that.

## 1. Built now: more of the animal is drawn, and no two lineages look alike

No rule or number changed, so the gate was not re-run.

| Now drawn | From |
|---|---|
| Armour in three steps: scutes, plates, a shell over the back | The armour trait's step |
| A warm animal's covering: tufts, then a coat | The warm blood trait's step |
| What the mouth has grown: mixed teeth, a cracking beak, a scavenger's hook | The three refinements |
| A night animal's large eye; a fat animal's deep belly; young at heel | The ways of living |
| The lineage's colour (eight) and pattern (five) | The seed, the era and whose lineage it is |
| A crest, a frill or a sail-like ridge; a tail tip | The same |

The last two rows change no number. That breaks a rule this repo had ("every
drawn part changes a number"), at his word. They come from the seed, so a
save redraws the same animal; they change at each new era; and rivals get
their own, so they are no longer mistaken for the player. The Body screen
names the colouring and says it changes nothing.

## 2. Proposed: a covering, chosen once

**Rule.** From watertight skin a lineage grows one covering. Growing a second
is not offered. Changing it means turning it, as a mouth is turned: several
turns, working throughout, arriving a step lower.

| Covering | Good at | Bad at | Who had it |
|---|---|---|---|
| Scales | Heat and drought | Cold | Lizards, crocodiles, most early reptiles |
| Fur | Cold; cheap warmth for a small body | Heat; costs more the bigger the animal | The mammal line |
| Feathers | Cold; light, so no cost to speed; display (see section 4) | Wet ground; heat | The dinosaur line, later |
| Bare and wet | Water; breathing through the skin | Dry ground | The great amphibians |

This makes his third run's problem a decision instead of a surprise. A
four-metre animal in fur in the Triassic is a choice he would have seen
coming; a four-metre animal in scales would have lived.

Warm blood would then rest on a covering (fur or feathers) rather than on
skin alone, which is also truer.

## 3. Proposed: other pairs that close each other off

Each is a real trade in the fossil record, and each replaces a quiet penalty
the game has now with a visible fork.

| If you take | You cannot take | Why |
|---|---|---|
| A shell (armour at its third step) | Legs under the body past the first step; burrowing | A shell is heavy and stiff |
| Burrowing past the first step | Size past the first step | A big animal cannot go to ground |
| Legs under the body at the third step | A fin tail; a shell | Built to run |
| A sail on the back (new: sheds heat or soaks it up) | Fur, feathers, burrowing | It is a radiator; it cannot be insulated or dug with |

The Body screen would show a closed trait as closed, with the trait that
closes it, before the choice is made.

## 4. Proposed: weapons and defences

The author wants to act on rivals (`FRAME-standing.md` section 5). These are
the traits that would make that a contest of bodies and not only of numbers,
so they should arrive together with it or just before.

| Trait | Does | Costs |
|---|---|---|
| Claws | Prey easier taken; fewer caught | A little upkeep |
| Horns or tusks | Fewer caught; wins a push against a rival | Upkeep; a heavy head, slower |
| A clubbed or spiked tail | Far fewer caught by big hunters; nothing against small ones | Upkeep; no balancing tail |
| Venom | Prey easier taken by a small animal; fewer caught | Works only small |
| Camouflage | Fewer caught where the ground matches; prey easier | Tied to one kind of ground: moving on loses it |
| Display (a crest, a frill, bright feathers) | Numbers climb faster | More caught: it is seen |

Camouflage and display would make colour mean something: colour would stop
being free. If they are built, the seeded colouring of section 1 gives way to
them where they are held.

## 5. On randomising the body

Two things he might mean, and they are different:

- **How it looks.** Built: colour, pattern and small features of outline.
- **What it can become.** Not built. Each run could offer a slightly
  different set of traits: one run has no fur to find, another offers a sail
  early. Runs would differ more and a favourite build could not be repeated.
  The risk is a run that deals an unplayable hand, and it would have to be
  measured that none does.

## 6. Built: the tree, and what differs from the proposal

The author asked: "Instead of how it is now, do we change trait selection to
a tree?" The answer he agreed to was both. Mutations still arrive three at a
time, by chance. The Body screen now shows every trait there is, in five
branches (`TREE` in `src/data/world.data.js`), each marked held, able to turn
up, resting on something not yet grown, or closed off, with the reason. One
trait can be marked to **watch for**: once it can be grown and has been
watched `WATCH_TURNS` (2) turns, it is among the three offered. So chance
still deals, and a player with a plan is not kept waiting on it.

What differs from sections 2 and 3 as proposed:

- **A covering is not chosen once.** It is turned to another over
  `COVER_TURNS` (4) turns, the old one working meanwhile and the new arriving
  a step lower, as a mouth is. It can also be let go, back to bare skin.
  Turning a coat to scales loses warm blood, and the screen says so first.
- **Warm blood rests on fur or feathers.** That is the answer to his
  question about watertight skin and warm blood: they go together, but only
  under a coat. A coat under warm blood cannot be let go.
- **Bare skin has no bonus of its own** and feathers no penalty on wet
  ground. Bare costs nothing; that is its case. Heat tolerance was moved
  partly from watertight skin (0.07 to 0.06 a step) onto scales (0.05), and
  cold tolerance partly from warm blood (0.10 to 0.06) onto fur (0.08) and
  feathers (0.06).

The closing pairs are `BARS` in the data table: a shell against legs under
the body past the first step and against burrowing; burrowing past the first
step against size past the first; a sail against fur, feathers and
burrowing. "A fin tail" is not a trait and was dropped. A body from an old
save that holds both halves of a pair keeps both and can grow neither.

## What will be measured

1. No covering is best in every era, and each is best in at least one.
2. Each pair in section 3 is a real fork: lineages take each side, and neither
   side always does better.
3. Each weapon and defence is best somewhere and none is always taken.
4. The share of careful play that comes through, and the top three, against
   the targets (about 30% and about 10%).
5. If offers are randomised: no seed in a thousand deals a hand from which a
   careful policy cannot come through.

## Decisions for the author

| # | Question | Recommendation |
|---|---|---|
| 1 | Coverings (section 2): build? | Yes, first. It answers his own run and is the fork his question was reaching for |
| 2 | The closing pairs (section 3): build? | Yes, with coverings: one round of the gate covers both |
| 3 | Weapons and defences (section 4): now, or with acting on rivals? | With rivals. Without a contest to win, most of them are another way to be caught less |
| 4 | Randomise what a run offers (section 5)? | Not yet. Add the traits first and see whether runs still feel alike |

## What it costs

- The kill gate reopens: sections 2 and 3 are one round, about an hour's
  run, and bodies will need levelling again.
- Save version 4: a warm-blooded lineage must be given a covering. It would
  get fur if small, feathers if it has legs under the body, and be told.
- More drawing: each covering and each weapon in the sprite.
