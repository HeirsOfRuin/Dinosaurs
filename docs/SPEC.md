# Deep Time (working title): design spec

Steer a lineage from a Devonian shore to the first dinosaurs.

Status: **Stage 1 spec approved 2026-11-24; Stage 2 kill gate run the same
day.** The gate found faults; they are in `docs/KILLGATE.md` and wait for the
author. Rules changed by what the gate found are marked *(kill gate)*.

The author's brief, 2026-11-24: "a 2d [pixel] type game similar to spore, but
you [evolve] your simple amphibian like animal into [one of] the first
dinosaurs".

---

## 1. Setting

The shore of a Late Devonian river, about 375 million years ago, to the end of
the Triassic, about 201 million years ago. The player steers one lineage of
four-legged animals, not one animal. It is a game because the real history is
a run of body-plan bets, each paid for in food, with known die-offs that
punished whoever had bet too narrowly.

All dates and events are from memory and are checked before they shape a
number. The starting animal looks amphibian but is an early tetrapod;
dinosaurs do not descend from modern amphibians. The game says so once.

| Era | Span (Ma) | Turns | The test | Ends with |
|---|---|---|---|---|
| 1 The Shore | 375 to 359 | 12 | Limbs, lungs, leaving the water | End-Devonian die-off |
| 2 The Coal Forests | 359 to 299 | 25 | The shelled egg; living away from water | Rainforest collapse, about 305 |
| 3 The Drying | 299 to 265 | 20 | Heat, drought, the mammal-line rivals on top | A mid-Permian die-off |
| 4 The Long Shadow | 265 to 252 | 20 | Living small under bigger animals | The Great Dying, 252 |
| 5 The Triassic | 252 to 201 | 30 | Upright gait; the lineage becomes a dinosaur near 230 and is played as one | End-Triassic die-off, 201 |

About 107 turns. Estimated 30 to 45 minutes an era, three to four hours a full
run, in five sittings. The author on that size, 2026-11-24: "Yes". The
estimate itself is not measured.

## 2. Pillars

1. A lineage, not an animal. The player selects; nobody designs a creature.
2. Every trait is paid for in food, every turn it is held.
3. A trait is built over several turns and rests on earlier traits. The author:
   "don't make it fly by without any room for investment".
4. The die-off is seen coming, but not its exact shape.
5. Rivals evolve by the same rules as the player.
6. Every drawn part changes a number; a part that does not is not drawn.
7. The Triassic is played, as a dinosaur for its back half.

## 3. Core loop (one turn = a stretch of deep time)

1. The world moves: climate, plants and prey shift in each region; rivals
   evolve.
2. The turn offers three mutations, drawn from what the current body allows.
3. The player keeps one or none, and points the lineage's selection pressure
   at one trait already under way (or at losing one).
4. The player sets where the lineage lives: which regions it holds.
5. The turn resolves: food in, upkeep out, numbers up or down per region.
6. The warning signs of the era's die-off are shown as they build.

Room for investment:

- **A trait is built, not bought.** Three steps (a hint, developed, refined).
  A step takes four to six turns of pressure.
- **Traits rest on other traits.** An upright gait needs the limbs first.
- **Nothing is undone cheaply.** Losing a step takes two turns, and its upkeep
  is paid until it is gone.
- **The lineage holds ground.** Up to three regions of an era map. Each region
  beyond the first slows selection: a spread-out lineage changes more slowly.

## 4. The scarce resource

Energy. Every trait has an upkeep in food: size, warm blood, armour, a big
brain. A body that cannot feed itself where it lives shrinks. The earlier
games spent money, men or time; this one spends calories, and the price of
food changes under the player as the climate does.

## 5. The per-turn decision

Specialise or stay general. A specialist out-eats its rivals in the world as
it is. A generalist eats worse every turn and survives the die-off the era has
been warning about. A trait started now is not finished for several turns.

## 6. The ways to lose

- **Starved out.** Upkeep outgrows food in every region held.
- **Out-competed.** A rival lineage takes the food and the numbers fall to
  nothing.
- **Caught by the die-off.** No region held is survivable for the body built.

## 7. The one way to win

Carry the lineage through the end-Triassic die-off as a dinosaur. The lineage
crosses into dinosaurs partway through Era 5 if it has the body for it, and
the rest of the era is played as one. A lineage that survives as something
else gets its own ending and is not a win.

## 8. Difficulties and saves

Two settings. The author, 2026-11-24: "make 2 difficulty settings, one saves
at every era, one doesn't."

| Setting | Saves | A loss |
|---|---|---|
| Saved (name to come) | A kept save at the start of every era | Back to the start of that era |
| One life (name to come) | The ordinary running save only | The lineage is gone; start again at the Shore |

Going back to an earlier era's save forks a new run and leaves the later one
as it was. The author: "Fork."

## 9. Look and platform

2D pixel art. The animal is drawn from layered parts in six slots (skull, jaw,
trunk, limbs, tail, skin), about five drawn variants each. Phone first,
offline, installable, no backend, turn-based, like the other builds (the
author, asked: "Correct").

## 10. Open questions for the author

| # | Question | Default if unanswered |
|---|---|---|
| 1 | What should a careful player's chance of winning be on one life, and on the saved setting? | One life about 15%; saved about 70% |
| 2 | The gate's six faults (`docs/KILLGATE.md`): fix in the model before design, or carry into `DESIGN.md` as named risks? | Fix the first three in the model first |
| 3 | Does a replayed era roll a new die-off, or the same one? | A new one, so a replay is not a memory test |
| 4 | Names for the two settings and the title | Placeholders stay |

---

## Decisions log
Newest first. Quote the author; give the numbers with their run counts.

| Date | Decision |
|---|---|
| 2026-11-24 | **Kill gate run** (`docs/KILLGATE.md`, 1,000 seeds an arm). Three of the spec's five claims hold, two fail, and six faults are open. No screen is drawn until the author has read it. |
| 2026-11-24 | **Two settings, fork, repo.** The author: "Fork. And make 2 difficulty settings, one saves at every era, one doesn't." Phone first and offline: "Correct". "Use the Dinosaurs repo". |
| 2026-11-24 | **Size.** Asked whether three to four hours in five sittings is right, the author: "Yes". |
| 2026-11-24 | **Turn-based lineage; the Triassic is played.** The author: "Yes that's fine, but don't make it fly by without any room for investment. I also think the Triassic should be a playable age as well, with save points between every era". Traits are built over several turns; Era 5 runs to 201 Ma. |
