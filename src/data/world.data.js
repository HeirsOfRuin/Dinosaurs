// Every number in the world. Each is TUNED, not sourced: set so that the
// decisions differ, not to describe the Palaeozoic. Dates are from memory and
// are checked before they are relied on.

// The four foods a region grows, and two it yields besides: the dead, and the
// hard food (shell, seed, bone) that only some mouths can use.
export const BASE_FOODS = ['insects', 'fish', 'plants', 'prey'];
export const FOODS = ['insects', 'fish', 'plants', 'prey', 'carrion', 'hard'];
export const JAWS = { jawInsects: 'insects', jawFish: 'fish', jawPlants: 'plants', jawPrey: 'prey' };

// needs: trait -> level that must be held before this one can appear or rise.
// cost: upkeep added per level. Effects are in model.js body(), the one place a
// trait becomes a number.
export const TRAITS = {
  lungs:  { cost: 0.02, needs: {} },
  limbs:  { cost: 0.03, needs: {} },
  skin:   { cost: 0.03, needs: { lungs: 2 } },   // scaled, watertight skin
  egg:    { cost: 0.03, needs: { skin: 1 } },    // the shelled egg
  // One mouth. A lineage holds one of these four at a time; another can be had only by letting
  // this one go. (Until 2026-11-25 all four could be held and the food chosen each turn. The
  // author, after his first run: "Once you have a certain type of mouth, it can evolve different
  // aspects to improve or widen it's possible food sources".)
  jawInsects: { cost: 0.04, needs: {} },
  jawFish:    { cost: 0.04, needs: {} },
  jawPlants:  { cost: 0.04, needs: {} },
  jawPrey:    { cost: 0.04, needs: {} },
  // What a mouth can grow into. `jaw` is the step the mouth must have reached; `mouths`, which mouths can.
  omni:     { cost: 0.04, needs: {}, jaw: 2 },                                            // an omnivore's teeth: every other food, in part
  scavenge: { cost: 0.04, needs: {}, jaw: 2, mouths: ['jawPrey', 'jawInsects'] },         // eats the dead
  crush:    { cost: 0.04, needs: {}, jaw: 2, mouths: ['jawFish', 'jawPlants', 'jawPrey'] }, // cracks shell, seed and bone
  herd:   { cost: 0.05, needs: { brain: 1 } },   // living in herds or packs
  size:   { cost: 0.08, needs: {} },
  // One covering. A lineage's skin grows scales, fur or feathers, or stays bare; it holds one at a
  // time and can turn it to another, as a mouth is turned. (The author, 2026-11-26: "we should add
  // more traits and close some off if some are taken... Maybe add feathers or fur?")
  scales:   { cost: 0.02, needs: { skin: 1 }, cover: true },   // heat and drought
  fur:      { cost: 0.03, needs: { skin: 1 }, cover: true },   // cold; dearer the bigger the animal
  feathers: { cost: 0.04, needs: { skin: 1 }, cover: true },   // cold, and light
  warm:   { cost: 0.07, needs: { skin: 1 }, under: ['fur', 'feathers'] },    // a faster, warmer metabolism; it needs a coat to hold the heat in
  sail:   { cost: 0.03, needs: { skin: 1 } },    // a sail on the back: sheds heat and soaks it up
  gait:   { cost: 0.04, needs: { limbs: 3 } },   // legs under the body
  burrow: { cost: 0.03, needs: { limbs: 2 } },
  brain:  { cost: 0.05, needs: {} },
  armour: { cost: 0.05, needs: { skin: 1 } },
};
export const START_TRAITS = { lungs: 1, limbs: 1, jawFish: 1 };
export const START_POP = 12;
export const STEP_TURNS = { 2: 4, 3: 6 };   // turns of full pressure to reach level 2, level 3
export const SHED_TURNS = 2;                // turns of pressure to lose one level
// Turns of pressure to turn the mouth to another food. The old jaw works until it is done, and
// the new one arrives a step lower. (Until 2026-11-26 a mouth had to be shed to nothing before
// another could be taken. The author: "Cutting mouths kills you. It just happened to me twice.")
export const MOUTH_TURNS = 6;
export const COVERS = ['scales', 'fur', 'feathers'];
export const COVER_TURNS = 4;   // a covering is turned to another faster than a mouth is
// Pairs that close each other off: a trait at the first step named cannot be grown while the other
// stands at its step, and the other way about. A body that already holds both (an old save) keeps both.
export const BARS = [
  [['armour', 3], ['gait', 2]],     // a shell is heavy and stiff
  [['armour', 3], ['burrow', 1]],
  [['burrow', 2], ['size', 2]],     // a big animal cannot go to ground
  [['sail', 1], ['fur', 1]],        // a sail is a radiator: it cannot be insulated,
  [['sail', 1], ['feathers', 1]],
  [['sail', 1], ['burrow', 1]],     // or dug with
];
// A trait a lineage is watching for is among what a generation offers once it has watched this many turns.
export const WATCH_TURNS = 2;
// The tree as the Body screen lays it out: branches, each a list of traits in the order they are met.
export const TREE = [
  { id: 'air', traits: ['lungs', 'skin', 'egg'] },
  { id: 'cover', traits: ['scales', 'fur', 'feathers', 'warm', 'sail', 'armour'] },
  { id: 'legs', traits: ['limbs', 'gait', 'burrow'] },
  { id: 'mouth', traits: ['jawFish', 'jawInsects', 'jawPlants', 'jawPrey', 'omni', 'scavenge', 'crush'] },
  { id: 'frame', traits: ['size', 'brain', 'herd'] },
];
export const RANGE_DRAG = 0.35;             // each region held beyond the first slows selection
export const MAX_REGIONS = 3;
export const HALF_SAT = 20;                 // food competition: claims needed to take half a stock
export const MIN_VIABLE = 3;                // a region's population below this dies out
export const LEAST = 1;                     // the lineage ends when its whole number falls below this
export const STARVE = { plain: 0.71, fat: 0.66, size: 0.075, armour: 0.025, burrow: 0.05 };   // the share of the gap closed each turn when the ground feeds fewer than there are
export const FOOD_FLOOR = 0.05;             // the least a die-off leaves of a food it takes

// Ways of living: behaviours, held two at a time at most. Chosen, not grown, but a new one takes
// WAY_SETTLE turns to take hold and does nothing until then. Effects are in model.js body().
export const WAYS = ['night', 'tend', 'roam', 'fat'];
export const MAX_WAYS = 2;
export const WAY_SETTLE = 3;

// A moment comes on these turns of an era, if the die-off has not begun and the deck is not dry.
export const MOMENT_EVERY = 7;
export const MOMENT_AT = 3;

// How many animals one unit of the model's numbers stands for, on every screen.
export const HEADS = 100;
// Snout to tail, in metres, at each step of size. For the drawing and the words; the rules use the step.
export const LENGTH_M = [0.4, 0.9, 2, 4];

// region: [id, wet, temp, insects, fish, plants, prey, predators]
const R = (id, wet, temp, insects, fish, plants, prey, pred) => ({ id, wet, temp, food: { insects, fish, plants, prey }, pred });

// A die-off takes the hunted hardest: whatever lives at the top of the food goes first.
export const DIEOFFS = {
  cold:     { dWet: 0,     dTemp: -0.35, food: { insects: 0.4, plants: 0.5, prey: 0.4, fish: 0.7 } },
  drought:  { dWet: -0.45, dTemp: 0.05,  food: { plants: 0.5, fish: 0.3, insects: 0.6, prey: 0.35 } },
  heat:     { dWet: -0.15, dTemp: 0.35,  food: { fish: 0.4, plants: 0.6, insects: 0.6, prey: 0.4 } },
  collapse: { dWet: 0,     dTemp: 0,     food: { plants: 0.25, prey: 0.25, insects: 0.5, fish: 0.6 } },
  greatHot: { dWet: -0.30, dTemp: 0.40,  food: { plants: 0.3, prey: 0.25, fish: 0.3, insects: 0.6 } },
  greatDry: { dWet: -0.50, dTemp: 0.25,  food: { plants: 0.25, prey: 0.25, fish: 0.2, insects: 0.6 } },
  // Two more faces of the Great Dying, so that it does not always favour the dry, scaled body.
  greatCold:  { dWet: 0,   dTemp: -0.65, food: { plants: 0.2, insects: 0.25, prey: 0.25, fish: 0.5 } },
  greatWaste: { dWet: 0.05, dTemp: 0.05, food: { plants: 0.1, prey: 0.12, insects: 0.25, fish: 0.5 } },
};
export const HARSH = 2.6;                   // every die-off's strength, one dial
export const SENS = [0.05, 1.5];            // how hard a die-off hits a region: the low end is a refuge
export const DIEOFF_TURNS = 3;              // the last turns of every era (an era may say more)

export const ERAS = [
  { id: 'shore', name: 'The Shore', turns: 12, dWet: 0, dTemp: 0, dieoffs: ['cold', 'collapse'], mag: 0.8, gentle: true,   // the first era teaches; the strength dial does not reach it
    regions: [R('shallows', 0.95, 0.55, 40, 120, 20, 10, 0.5), R('bank', 0.8, 0.55, 90, 30, 30, 10, 0.2), R('floodplain', 0.65, 0.6, 100, 0, 60, 10, 0.1), R('upland', 0.4, 0.5, 60, 0, 80, 0, 0.05)],
    rivals: [{ traits: { lungs: 1, limbs: 1, jawFish: 2, size: 1 }, home: 'shallows', plan: 'special' }, { traits: { lungs: 2, limbs: 2, jawInsects: 1 }, home: 'bank', plan: 'greedy' }] },
  { id: 'coal', name: 'The Coal Forests', turns: 25, dWet: -0.006, dTemp: 0, dieoffs: ['drought', 'collapse'], mag: 0.8, dieoffTurns: 4, sens: [0.25, 1.5],
    regions: [R('swamp', 0.9, 0.6, 130, 60, 60, 70, 0.3), R('forestFloor', 0.7, 0.6, 140, 0, 100, 80, 0.25), R('dryForest', 0.5, 0.55, 90, 0, 110, 80, 0.2), R('upland', 0.3, 0.45, 50, 0, 90, 60, 0.1)],
    rivals: [{ traits: { lungs: 2, limbs: 2, jawInsects: 2 }, home: 'swamp', plan: 'special' }, { traits: { lungs: 2, limbs: 2, skin: 1, jawPrey: 1 }, home: 'forestFloor', plan: 'greedy' }] },
  { id: 'drying', name: 'The Drying', turns: 20, dWet: 0, dTemp: 0.004, dieoffs: ['heat', 'drought'], mag: 1.2, dieoffTurns: 5, sens: [0.3, 1.5],
    regions: [R('river', 0.6, 0.65, 70, 70, 60, 50, 0.3), R('scrub', 0.4, 0.7, 60, 0, 90, 80, 0.35), R('desertEdge', 0.2, 0.8, 40, 0, 40, 50, 0.2), R('highland', 0.35, 0.4, 40, 0, 80, 50, 0.2)],
    rivals: [{ traits: { lungs: 2, limbs: 2, skin: 2, egg: 1, jawPrey: 2, size: 2 }, home: 'scrub', plan: 'special' }, { traits: { lungs: 2, limbs: 2, skin: 2, egg: 1, jawPlants: 2, size: 2 }, home: 'scrub', plan: 'greedy' }] },
  { id: 'shadow', name: 'The Long Shadow', turns: 20, dWet: 0, dTemp: 0.004, dieoffs: ['greatHot', 'greatDry', 'greatCold', 'greatWaste'], mag: 1.45, dieoffTurns: 5, lead: 8, sens: [0.4, 1.5],   // named earlier than the rest; and almost nowhere is spared
    regions: [R('river', 0.55, 0.62, 60, 60, 70, 70, 0.45), R('plains', 0.4, 0.65, 50, 0, 120, 110, 0.6), R('dryBasin', 0.2, 0.75, 50, 0, 40, 50, 0.35), R('polarForest', 0.5, 0.3, 50, 0, 100, 50, 0.3)],
    rivals: [{ traits: { lungs: 2, limbs: 3, skin: 2, egg: 2, jawPrey: 3, size: 3, fur: 1, warm: 1 }, home: 'plains', plan: 'special' }, { traits: { lungs: 2, limbs: 2, skin: 2, egg: 2, jawPlants: 3, size: 3 }, home: 'plains', plan: 'special' }] },
  { id: 'triassic', name: 'The Triassic', turns: 30, dWet: 0, dTemp: 0, dieoffs: ['heat', 'collapse', 'cold'], mag: 1.3, sens: [0.35, 1.5], dieoffTurns: 5,
    recover: 8,                               // turns for food to come back after the Great Dying
    pulse: { from: 12, to: 16, dWet: 0.25, plants: 1.6 },   // the wet episode near 233 Ma
    predRise: 0.008,
    regions: [R('river', 0.5, 0.7, 60, 50, 60, 50, 0.3), R('redbeds', 0.3, 0.78, 50, 0, 60, 80, 0.4), R('desert', 0.15, 0.85, 30, 0, 30, 40, 0.2), R('highland', 0.4, 0.5, 40, 0, 90, 60, 0.3)],
    rivals: [{ traits: { lungs: 2, limbs: 3, skin: 2, egg: 2, jawPrey: 2, size: 2, armour: 1 }, home: 'redbeds', plan: 'special' }, { traits: { lungs: 2, limbs: 2, skin: 2, egg: 2, jawPlants: 2, size: 1, burrow: 1 }, home: 'highland', plan: 'greedy' }] },
];

// ---- Standing -----------------------------------------------------------------
// A lineage that is alive after the last die-off has come through. How well it is set for what
// comes next is its standing: what PANEL would feed of its body, by the same food rule the game
// runs on, scaled by how many are left and how much ground they hold. The other lineages on the
// ladder are bodies in LINEAGES, scored by the same function; no score is typed in.
// (Until 2026-11-25 a win needed one of four fixed bodies. The author: "I don't think winning
// should be reliant on fitting a list of traits.")
export const PANEL = [
  R('fernPlain', 0.55, 0.62, 90, 0, 150, 90, 0.6),
  R('conifer', 0.4, 0.5, 70, 0, 130, 80, 0.55),
  R('coast', 0.8, 0.6, 60, 120, 40, 50, 0.5),
  R('dryInland', 0.2, 0.75, 50, 0, 60, 70, 0.45),
  R('coolSouth', 0.5, 0.3, 50, 20, 100, 60, 0.45),
  R('riverDelta', 0.9, 0.65, 110, 90, 80, 60, 0.6),
];
export const STANDING = { fullAt: 25, grounds: [0.8, 0.9, 1.0], weight: 0.2 };   // numbers that count as secure; the worth of 1, 2, 3 regions

// numbers and ground are what the lineage is taken to have had as the last die-off ended, in the
// game's terms: like the player's, they are what was left, not what there had been.
export const LINEAGES = {
  dinosaur:  { traits: { lungs: 2, limbs: 3, gait: 3, skin: 2, egg: 3, feathers: 1, warm: 2, size: 2, jawInsects: 2, omni: 2, herd: 1, brain: 1 }, ways: ['tend'], numbers: 9, ground: 2 },
  crocodile: { traits: { lungs: 2, limbs: 2, skin: 3, scales: 2, egg: 2, armour: 2, size: 2, jawPrey: 3, scavenge: 1 }, ways: ['tend'], numbers: 6, ground: 1 },
  mammal:    { traits: { lungs: 2, limbs: 2, skin: 1, egg: 1, fur: 2, warm: 3, brain: 2, burrow: 2, jawInsects: 2, omni: 1 }, ways: ['night', 'tend'], numbers: 8, ground: 2 },
  amphibian: { traits: { lungs: 3, limbs: 2, skin: 1, armour: 1, size: 3, jawFish: 3, burrow: 1 }, ways: ['tend', 'roam'], numbers: 4, ground: 1 },
  lizard:    { traits: { lungs: 2, limbs: 2, skin: 3, scales: 2, egg: 2, jawInsects: 2, burrow: 1 }, ways: ['night', 'tend'], numbers: 8, ground: 2 },
  turtle:    { traits: { lungs: 2, limbs: 2, skin: 2, scales: 1, egg: 2, armour: 3, size: 1, jawPlants: 2, omni: 2, crush: 1 }, ways: ['tend'], numbers: 5, ground: 1 },
  beaked:    { traits: { lungs: 2, limbs: 2, skin: 2, scales: 1, egg: 2, size: 3, jawPlants: 3, crush: 1, herd: 2, brain: 1 }, ways: [], numbers: 2, ground: 1 },
};

// ---- Moments ------------------------------------------------------------------
// when: any | rivalNear (a rival shares a region with you) | canSettle (room for a colony) | crowded (more than 60).
// Each option is a list of things done, in order:
//   ['pop', m]            your numbers everywhere, times m
//   ['rivals', m]         rivals' numbers on your ground, times m
//   ['step', n]           n turns' worth of progress on the trait under pressure
//   ['settle', n]         n of you found a colony on the best open ground, at no cost to the rest
//   ['food', id, m, n]    that food ('all' for every one) times m, everywhere, for n turns
//   ['pred', d, n]        hunters more (d > 0) or fewer, everywhere, for n turns
export const MOMENTS = {
  flood:      { when: 'any', options: [[['pop', 0.85], ['food', 'plants', 1.6, 6]], [['pop', 0.95], ['food', 'fish', 1.8, 6]], [['pop', 0.9], ['settle', 12]]] },
  newHunter:  { when: 'any', options: [[['pop', 0.85], ['step', 4]], [['food', 'all', 0.75, 4]], [['pop', 0.9], ['pred', -0.2, 8]]] },
  plague:     { when: 'rivalNear', options: [[['rivals', 0.5], ['food', 'all', 0.9, 2]], [['rivals', 0.5], ['pop', 0.8], ['food', 'all', 1.4, 5]], [['rivals', 0.5], ['pop', 0.9], ['food', 'carrion', 3, 5]]] },
  richYear:   { when: 'any', options: [[['pop', 1.4]], [['settle', 14]], [['step', 5]]] },
  leanYear:   { when: 'any', options: [[['pop', 0.75], ['food', 'all', 1.2, 4]], [['pop', 0.88], ['step', 3]], [['pop', 0.85], ['settle', 10]]] },
  rivalYoung: { when: 'rivalNear', options: [[['rivals', 0.55], ['pop', 1.1], ['pred', 0.1, 5]], [['step', 4]], [['rivals', 0.7], ['pop', 0.92]]] },
  landBridge: { when: 'canSettle', options: [[['pop', 0.85], ['settle', 20]], [['settle', 8]], [['step', 4]]] },
  fire:       { when: 'any', options: [[['pop', 0.85], ['settle', 6]], [['pop', 0.95], ['food', 'plants', 0.5, 4]], [['pop', 0.88], ['food', 'prey', 1.8, 4], ['food', 'insects', 1.5, 4]]] },
  oddYoung:   { when: 'any', options: [[['pop', 0.88], ['step', 7]], [['settle', 10]], [['pop', 1.2]]] },
  longWinter: { when: 'any', options: [[['pop', 0.88], ['pred', -0.2, 6]], [['food', 'insects', 0.5, 4], ['step', 4]], [['pop', 0.88], ['settle', 12]]] },
  giantDead:  { when: 'any', options: [[['pop', 1.3], ['pred', 0.15, 5]], [['pop', 1.1]], [['pop', 0.95], ['food', 'prey', 1.8, 5]]] },
  crowding:   { when: 'crowded', options: [[['settle', 20]], [['pop', 0.8], ['step', 5]], [['rivals', 0.6], ['pop', 0.9]]] },
};
