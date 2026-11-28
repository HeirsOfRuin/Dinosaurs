# Deep Time (working title): design spec

Steer a lineage from a Devonian shore to the first dinosaurs.

Status: **playable; rebuilt 2026-11-25 after the author's first run**
(`docs/FRAME-standing.md`, `docs/DESIGN.md`). A lineage wins by coming through
the end of the Triassic and is ranked by its standing; it has one mouth; it
chooses ways of living; moments come every few turns. Sections 3, 5, 7 and 8
below were written before that and are superseded where the frame differs.
The kill gate is at round 6 (`docs/KILLGATE.md`). Next: the author plays it
again.

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
4. The player sets where the lineage lives (which regions it holds) and what
   it mostly eats. Both can change every turn. A region cannot be walked out
   of as an action: it was modelled and changed nothing. *(kill gate)*
5. The turn resolves: food in, upkeep out, numbers up or down per region.
6. The warning signs of the era's die-off are shown as they build. Eight
   turns out the game says what it might be; five turns out it names it and
   the regions it will spare. *(kill gate)*

Room for investment:

- **A trait is built, not bought.** Three steps (a hint, developed, refined).
  A step takes four to six turns of pressure.
- **Traits rest on other traits.** An upright gait needs the limbs first.
- **Nothing is undone cheaply.** Losing a step takes two turns, and its upkeep
  is paid until it is gone.
- **The lineage holds ground.** Up to three regions of an era map. More
  regions are insurance against the die-off and slow selection: a spread-out
  lineage changes more slowly. *(kill gate: 12.5, 15.9, 17.2% past the Great
  Dying at 1, 2, 3 regions; the body takes 38, 48, 48 turns; 4,000 runs each)*

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

## 7. The ways to win

The author, 2026-11-24: "I want there to be several endings considered wins".
Carry the lineage through the end-Triassic die-off as one of four animals.
The lineage crosses into the first one its body fits, partway through Era 5,
and the rest of the era is played as that animal.

| Ending | The body | What closes the road |
|---|---|---|
| Dinosaur | Legs under the body, warm, shelled egg | |
| Crocodile line | Armour, size, a hunter's jaw | |
| Mammal line | Small, warm, burrowing, a brain | Growing large |
| Great amphibian | Big, a fisher, at home in water | Taking the shelled egg |

A lineage that survives as none of these gets its own ending and is not a
win. The author on their difficulty: "Within 10% of each other". *(kill
gate)* Careful play wins 14.6 to 16.4% on one life by road (4,000 runs
each). To level them the dinosaur also needs two size steps and the
amphibian armour; those were tuned, not drawn from the animals.

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
| 1 | Having played it: is it fun, is the Turn screen too dense, and is 107 turns the right length? | Nothing changes until he has played |
| 2 | With three regions the tolerant body eats more and dies less than the body built to eat. It cannot win. A fault to fix, or what range is for? | Carry into design as a named risk |
| 3 | The bodies tuned to level the roads (dinosaur: two size steps; amphibian: armour): acceptable, or level them another way? | Acceptable until the canon is checked |
| 4 | Names for the two settings and the title | Placeholders stay |

---

## Decisions log
Newest first. Quote the author; give the numbers with their run counts.

| Date | Decision |
|---|---|
| 2026-11-27 | **The balance plan, approved with every recommendation** (`docs/FRAME-balance.md`). Shown five decisions, the author: "Go ahead". So: each body 25 to 45% through and at least 5% top three, a band and not "within 10% of each other"; pushing a stronger rival only bleeds you, it does not drive you out (a rival's answering push still can); the saved setting's target is about 75% within three tries an era; no more than a third of those who come through should rank last; rounds A (stances), B (prices), C (bodies and ladder) in that order, each measured before the next, then the starvation rate. |
| 2026-11-28 | **A clearer game, then a longer one** (`docs/FRAME-next.md`). After his fifth playtest the author asked for fewer words and more picture, mouths that make sense, less to keep track of, and a game that runs to the end of the dinosaurs. Shown seven decisions, he said: "Go with recommendations". So: clarity first, then the look, then three new eras to the impact; two stances (push and prey), following a hunter folded into the scavenger; each mouth refinement on its own jaw; any body can come through the impact if it changes in time; at most 60 words on the Turn screen before a tap. **Tending the young was to be cut and was not:** the recommendation rested on a measurement (+1.6 points at best) that compared tending against no way of living at all. Cut in play, it cost the crocodile 20 points and the turtle 12 (200 seeds a body), so it stays, and this is reported to him. |
| 2026-11-27 | **Balance round D.** Shown rounds A to C measured and a proposed round D (the hot Great Dying leaves fewer insects, for the lizard and the spread of the faces; the amphibian's Coal Forests diagnosed before a lever; then the starvation rate), the author: "Go". |
| 2026-11-27 | **Camouflage and display built; colour counts only with them.** Told they had been left out because they would make colour mean something, the author: "I want them. Have your colours only affect the numbers if you have those." Built as `docs/FRAME-rivals.md` section 6: each ground has a colour; camouflage hides where yours matches and turns your colour toward your ground; display makes numbers climb back faster and more be caught where you stand out, and turns it away. Without either, colour still changes nothing. Save version 6. Then: "Now I want you to figure out how we might balance this stuff" (`docs/FRAME-balance.md`). |
| 2026-11-26 | **Balance round 8, then rivals, then measure again.** The author: "Run the balance round. Then I want to do the rival update we talked about, then run another balance test after that to see what it changed". Round 8 (`docs/KILLGATE.md`): carrion contested, coats and warm blood re-costed. Then acting on rivals was built as `docs/FRAME-rivals.md` describes, from the notes in `FRAME-standing.md` section 5 and `FRAME-bodies.md` section 4: a Rivals screen; four stances (push, prey on them, follow a bigger hunter, keep out of the way); rivals that hunt a smaller player and push back; four weapons (claws, horns, a clubbed tail, venom). Camouflage and display were left out because they would make colour mean something; that needs its own decision. His instruction to build was taken as approval of the frame. Round 9 measures what it changed. |
| 2026-11-26 | **Fourth playtest: a save sent without comment** (seed 380114001, one life, no era replayed). Came through, **first of eight**, standing 611 against the dinosaur's 593, through a Great Dying by cold. The body: an insect mouth refined to a scavenger at step 3, armour 2, scales 2, a sail 2, size 2, watertight skin 3, a bigger brain 3, laying down fat; most like the crocodile. Not a bug, and nothing went unsaid. What it found is a body stronger than any on the ladder: a bot making for it with eyes open came through 49.8% and reached the top three 31.5% (400 seeds), against the crocodile's 39.5 and 21.5 on the same seeds. Taken apart, the strength is the scavenger and the armour (without scavenging 36.5% through; without armour 42.0%); the covering and the sail cost it (without both 67.8% through, 30.3% top three). Carrion is a food no rival eats, so it is uncontested. Round 7's fault "only seven bodies tested" is now a measured one. No rule or number changed. |
| 2026-11-26 | **A tree, coverings, and traits that close each other off: built** (`docs/FRAME-bodies.md` section 6, `docs/KILLGATE.md` round 7). The author: "Instead of how it is now, do we change trait selection to a tree?" Offered a tree that is shown while mutations still arrive by chance, with one trait marked to watch for and offered within two turns, built together with coverings and the closing pairs in one round of the gate, weapons left for rivals and randomised offers "not yet": "I agree. Do as you suggest". Built: scales, fur and feathers (one at a time, turned like a mouth), a sail, warm blood resting on fur or feathers, six closing pairs, the tree on the Body screen, watching. Save version 4. Coverings made every body hungrier and warm blood slower to reach: careful play fell from 34.9% to about 20% through (seven policies, 300 seeds each) before any re-levelling. The starvation rate was eased from 0.72 to 0.71 and warm blood from 0.08 to 0.07 upkeep. |
| 2026-11-26 | **More bodies; choices that close each other off** (`docs/FRAME-bodies.md`). The author: "Yes I figured it was the heat. Sometimes I think we should add more traits and close some off if some are taken. Like watertight skin and warm blooded? Do those really go together? Maybe add feathers or fur? We should increase the amount of different art for traits. And colour of animals should be more randomized or something, it's always the same now. And maybe some body aspects could be randomized? Maybe adding things like weapons or defensive aspects ?" Built at once, changing no rule: more of the animal is drawn (armour by step, a warm coat, what the mouth has grown, the ways of living), and each lineage has a seeded colour, pattern and outline that change with the era. The colouring changes no number: an exception, at his word, to "every drawn part changes a number". Proposed and waiting for him: one covering (scales, fur, feathers or bare), other pairs that close each other off, weapons and defences, and randomising what a run offers. |
| 2026-11-26 | **Third playtest: a save sent without comment** (seed 474644471, one life). Extinct on turn 28 of 30 of the Triassic, in its closing heat. The lineage had come through the Great Dying (22,000 down to 700, laying down fat) and entered the Triassic with 534, which is ordinary: of 1,240 careful lineages that entered it, 1,111 had under 800, and 74% of those came through. What was not ordinary was the body: four metres long and warm-blooded in a hot, dry world, so its numbers peaked at 4,700 and fell for ten turns before the die-off began; and fat, taken up for the Great Dying, was kept for forty turns and slowed the climb back. Not a rules bug. Two things the game did not say are now said: each turn's note gives why the numbers moved (bred, hunger, hunters, a region dying out), from the turn's own account; and the Turn screen says when fat is slowing a recovery. No rule or number changed; the gate was not re-run. |
| 2026-11-26 | **A mouth is turned, not shed.** The author: "Cutting mouths kills you. It just happened to me twice. It should be easier". Changing mouths had meant fading the old jaw to nothing and waiting, mouthless, for the new one to be offered. Now it is one order from the Body screen: six turns of pressure, the old jaw working throughout, the new one arriving a step lower. A jaw can no longer be let go. Sweep after the change, careful play by body, 250 seeds each: lizard 53, turtle 42, crocodile 37, careful 27, mammal 26, amphibian 26, dinosaur 25% through; pooled 33.7% (round 6: 33.1%). |
| 2026-11-25 | **Second playtest: a save sent without comment** (seed 1617845666, one life). The lineage died on the last turn of the Great Dying, by famine, from 18,250 in three regions, having never taken a way of living; the die-off spared no region (each hit at 1.03 to 1.38 of its strength). Not a rules bug. Measured (seven careful policies, 500 seeds each, the same kind of draw and 12,000 or more at its onset): 37% pass using ways of living, 8% without. The game had named the die-off eight turns out and said nothing of what would help: correct but silent. Built: under a named die-off the Turn screen now says how many would be left as things stand and which changes within reach would leave more (`forecast` in `src/engine/model.js`, a projection by the turn's own feeding rule), and a line says when no way of living is chosen. No rule or number changed; the gate was not re-run. |
| 2026-11-25 | **Kill gate round 6: the balance faults** (`docs/KILLGATE.md`, 120,000 runs). The author: "I would like you to work on fixing all the balance faults." Careful play through on one life 33.1 ±0.6%, top three 10.5 ±0.4% (7,000 runs), both on target. By body 23.9 to 47.5% through, from 2.7 to 81.4% (1,000 seeds each). Fat, night, roaming, the warning and moments fixed; tending the young, the crocodile's rank and the deep mouth are open. |
| 2026-11-25 | **The frame approved, with additions; built.** The author: "Go with your recommendations" (about 30% of careful play comes through on one life and about 10% reaches the top three rungs; ways of living and moments now, acting on rivals later; seven lineages on the ladder). He added: "Herd mentality should be a trait"; "Need more art for animals... show other animals around, other rivals, show some idea of how big you actually are"; "I want the interactions with rivals, so if that is paused for now, make notes"; "Lineages should also give an example of something that was living in that line"; "a moving calender would be nice, so you see how many years are going by"; "a better population gauge would be nice, so like 500 instead of 5". And corrected the reading of his run: "Wrong, I had to retry several times." All in `docs/FRAME-standing.md` sections 4 and 5. |
| 2026-11-25 | **First playtest, three changes asked for** (`docs/FRAME-standing.md`). The author came through all five eras with 17 alive (having begun two of them more than once) and was told it was not a win, his animal being on none of the four lists. His words: "I don't think winning should be reliant on fitting a list of traits. It should be surging and having a score of how well you would do, with ranks compared to preset scores of others like the 4 current win species, or more if there are good choices." "There needs to be more you can do besides just adopt traits". "You shouldn't be able to change what you eat constantly, that's unrealistic. Once you have a certain type of mouth, it can evolve different aspects to improve or widen it's possible food sources, like an omnivore like bears or birds, scavenge or hunt, etc". "Surging" is read as "surviving". |
| 2026-11-24 | **Build it.** Offered three ways to settle the saved setting (accept 60.7% as a floor and move on; let one life rise to about 20%; count the target at four tries an era), the author: "Go with your recommendation and build this bad boy". So: 60.7% is accepted as a floor, and the game is built (`docs/DESIGN.md`). The design proposal was not put to him as a separate step; his word to build is taken as its approval. The model was moved into the engine with every result unchanged (fingerprint over 13 policies × 40 seeds and 12 saved runs, identical before and after). |
| 2026-11-24 | **Kill gate round 5** (`docs/KILLGATE.md`, 91,677 runs). Saved, a win within three tries an era: mean 60.7%, 56.2 to 65.4% by road (1,000 seeds each), from 56.9% and 42.3 to 68.7%. One life 15.4% pooled, roads 14.6 to 16.4% (4,000 seeds a road). The two targets trade off with this bot: one life 15.3% gave saved 64.3%, one life 19.0% gave 67.3%. |
| 2026-11-24 | **Fix the saved setting.** Offered a move to the design document with the saved setting carried as a risk, the author: "Fix the saved setting". |
| 2026-11-24 | **Kill gate round 4** (`docs/KILLGATE.md`, 91,248 runs). The specialist was a bot fault (it kept its first jaw all run) and a comparison at unequal range. At one region the body built to eat out-eats the tolerant one in three eras of five (99 against 46 in mid-Coal) and survives worse (60% against 100% of the Drying; 1,000 seeds each). Two rule changes were tried and rejected. One life: 16.0% pooled, roads 15.1 to 16.9% (4,000 seeds a road). Saved, three tries an era: 56.9% mean. |
| 2026-11-24 | **The specialist: fix it now.** Offered the choice of fixing "the specialist is best nowhere" before design or carrying it as a named risk, the author: "Fix this one now". The other two questions put with it (accept the saved setting at 57.5% and move to design; keep the bodies tuned to level the roads) were not answered and stand at their defaults. |
| 2026-11-24 | **Kill gate round 3** (`docs/KILLGATE.md`, 86,278 runs). Careful play wins 15.5% on one life, four roads pooled; by road 14.5 to 16.1% (4,000 seeds a road, ±0.6), highest over lowest 1.11. Saved, a win within three tries an era: 57.5% mean, 42.5 to 72.1% by road (1,000 seeds each). The Shore kills no careful run; leaving a region is cut. Open: the saved setting, the specialist. |
| 2026-11-24 | **The saved setting: spread the danger.** Told that nearly all the risk sat in the Great Dying, so that the saved setting meant replaying one era until it fell right, and offered the alternative of spreading the danger across eras two to five, the author: "Go with your recommendation on the saved setting". The saved target is counted as a win within three tries an era. (It was first offered as two; at about 15% on one life over four dangerous eras, two tries cannot reach 70% however the danger is shared: the most is about 54%.) |
| 2026-11-24 | **The look.** Shown the canvas concept (three phone screens and an art sheet: dark ground, the era sets the colour, a 32 by 20 pixel animal in six slots, pixel type for headings only), the author: "yes I liked the design style". The sprites on it are placeholders to be redrawn. |
| 2026-11-24 | **Fix all the open faults; the four roads within 10% of each other.** Asked which of round 2's faults to fix before design, the author: "All of them!" Asked whether the four endings should be equally hard: "Within 10% of each other". Read as: the four roads' win rates within a tenth of one another, measured on one life. |
| 2026-11-24 | **Kill gate round 2** (`docs/KILLGATE.md`, 73,114 runs). Careful play wins 15.8 ±0.6% on one life (four roads pooled, 4,000 runs) against the target of about 15%; 62.3% saved at five tries an era against about 70%. A list followed blind wins 0.4 to 5.8% (1,000 runs each). Warning and range now matter. Five faults open. |
| 2026-11-24 | **Several winning endings; the three questions.** The author: "I want there to be several endings considered wins". Four: dinosaur, crocodile line, mammal line, great amphibian. On win-rate targets, fix order and replayed eras: "Recommendation" to each, so about 15% on one life and 70% saved, the first three faults fixed in the model first, and a replayed era rolls a new die-off. |
| 2026-11-24 | **Kill gate run** (`docs/KILLGATE.md`, 1,000 seeds an arm). Three of the spec's five claims hold, two fail, and six faults are open. No screen is drawn until the author has read it. |
| 2026-11-24 | **Two settings, fork, repo.** The author: "Fork. And make 2 difficulty settings, one saves at every era, one doesn't." Phone first and offline: "Correct". "Use the Dinosaurs repo". |
| 2026-11-24 | **Size.** Asked whether three to four hours in five sittings is right, the author: "Yes". |
| 2026-11-24 | **Turn-based lineage; the Triassic is played.** The author: "Yes that's fine, but don't make it fly by without any room for investment. I also think the Triassic should be a playable age as well, with save points between every era". Traits are built over several turns; Era 5 runs to 201 Ma. |
