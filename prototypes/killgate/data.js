// Kill-gate data. Every number here is TUNED, not sourced: it exists to find out
// whether the decisions differ, not to describe the Palaeozoic. Dates are from
// memory and are checked before the real game uses them.

export const FOODS = ['insects', 'fish', 'plants', 'prey'];

// needs: trait -> level that must be held before this one can appear or rise.
// cost: upkeep added per level. Effects are in model.js body(), the one place a
// trait becomes a number.
export const TRAITS = {
  lungs:  { cost: 0.02, needs: {} },
  limbs:  { cost: 0.03, needs: {} },
  skin:   { cost: 0.03, needs: { lungs: 2 } },   // scaled, watertight skin
  egg:    { cost: 0.03, needs: { skin: 1 } },    // the shelled egg
  jawInsects: { cost: 0.04, needs: {} },
  jawFish:    { cost: 0.04, needs: {} },
  jawPlants:  { cost: 0.04, needs: {} },
  jawPrey:    { cost: 0.04, needs: {} },
  size:   { cost: 0.10, needs: {} },
  warm:   { cost: 0.12, needs: { skin: 1 } },    // a faster, warmer metabolism
  gait:   { cost: 0.04, needs: { limbs: 3 } },   // legs under the body
  burrow: { cost: 0.03, needs: { limbs: 2 } },
  brain:  { cost: 0.06, needs: {} },
  armour: { cost: 0.07, needs: { skin: 1 } },
};
export const START_TRAITS = { lungs: 1, limbs: 1, jawFish: 1 };
export const START_POP = 12;
export const STEP_TURNS = { 2: 4, 3: 6 };   // turns of full pressure to reach level 2, level 3
export const SHED_TURNS = 2;                // turns of pressure to lose one level
export const RANGE_DRAG = 0.35;             // each region held beyond the first slows selection
export const MAX_REGIONS = 3;
export const HALF_SAT = 20;                 // food competition: claims needed to take half a stock
export const MIN_VIABLE = 3;                // a region's population below this dies out
// The endings that count as a win. The lineage crosses into the first one its
// body fits, from FORM_FROM_TURN of era 5 (about 230 Ma), and stays it: it
// cannot afterwards shed below `min`. `max` is what the body must NOT have.
export const ENDINGS = {
  dinosaur:  { min: { limbs: 3, gait: 3, skin: 2, egg: 3, warm: 3, size: 2, brain: 1 }, max: {} },
  crocodile: { min: { armour: 2, size: 2, jawPrey: 3, skin: 3, egg: 2 }, max: {} },
  mammal:    { min: { warm: 3, brain: 2, burrow: 2, jawInsects: 2, egg: 1 }, max: { size: 1 } },
  amphibian: { min: { lungs: 3, jawFish: 3, size: 2, armour: 2 }, max: { egg: 0 } },
};
export const FORM_FROM_TURN = 12;
export const FOCUS = { on: 1.35, off: 0.75 };   // eating mostly one food: better at it, worse at the rest

// region: [id, wet, temp, insects, fish, plants, prey, predators]
const R = (id, wet, temp, insects, fish, plants, prey, pred) => ({ id, wet, temp, food: { insects, fish, plants, prey }, pred });

export const DIEOFFS = {
  cold:     { dWet: 0,     dTemp: -0.35, food: { insects: 0.4, plants: 0.5, prey: 0.7, fish: 0.7 } },
  drought:  { dWet: -0.45, dTemp: 0.05,  food: { plants: 0.5, fish: 0.3, insects: 0.6, prey: 0.6 } },
  heat:     { dWet: -0.15, dTemp: 0.35,  food: { fish: 0.4, plants: 0.6, insects: 0.6, prey: 0.7 } },
  collapse: { dWet: 0,     dTemp: 0,     food: { plants: 0.25, prey: 0.4, insects: 0.5, fish: 0.6 } },
  greatHot: { dWet: -0.30, dTemp: 0.40,  food: { plants: 0.3, prey: 0.4, fish: 0.3, insects: 0.6 } },
  greatDry: { dWet: -0.50, dTemp: 0.25,  food: { plants: 0.25, prey: 0.5, fish: 0.2, insects: 0.6 } },
  // Two more faces of the Great Dying, so that it does not always favour the dry, scaled body.
  greatCold:  { dWet: 0,   dTemp: -0.65, food: { plants: 0.2, insects: 0.25, prey: 0.4, fish: 0.5 } },
  greatWaste: { dWet: 0.05, dTemp: 0.05, food: { plants: 0.1, prey: 0.2, insects: 0.25, fish: 0.5 } },
};
export const HARSH = 2.6;                   // every die-off's strength, one dial
export const SENS = [0.05, 1.5];            // how hard a die-off hits a region: the low end is a refuge
export const DIEOFF_TURNS = 3;              // the last turns of every era (an era may say more)

export const ERAS = [
  { id: 'shore', name: 'The Shore', turns: 12, dWet: 0, dTemp: 0, dieoffs: ['cold', 'collapse'], mag: 0.8, gentle: true,   // the first era teaches; the strength dial does not reach it
    regions: [R('shallows', 0.95, 0.55, 40, 120, 20, 10, 0.5), R('bank', 0.8, 0.55, 90, 30, 30, 10, 0.2), R('floodplain', 0.65, 0.6, 100, 0, 60, 10, 0.1), R('upland', 0.4, 0.5, 60, 0, 80, 0, 0.05)],
    rivals: [{ traits: { lungs: 1, limbs: 1, jawFish: 2, size: 1 }, home: 'shallows', plan: 'special' }, { traits: { lungs: 2, limbs: 2, jawInsects: 1 }, home: 'bank', plan: 'greedy' }] },
  { id: 'coal', name: 'The Coal Forests', turns: 25, dWet: -0.006, dTemp: 0, dieoffs: ['drought', 'collapse'], mag: 1.0, dieoffTurns: 4, sens: [0.15, 1.5],
    regions: [R('swamp', 0.9, 0.6, 130, 60, 60, 70, 0.3), R('forestFloor', 0.7, 0.6, 140, 0, 100, 80, 0.25), R('dryForest', 0.5, 0.55, 90, 0, 110, 80, 0.2), R('upland', 0.3, 0.45, 50, 0, 90, 60, 0.1)],
    rivals: [{ traits: { lungs: 2, limbs: 2, jawInsects: 2 }, home: 'swamp', plan: 'special' }, { traits: { lungs: 2, limbs: 2, skin: 1, jawInsects: 1, jawPrey: 1 }, home: 'forestFloor', plan: 'greedy' }] },
  { id: 'drying', name: 'The Drying', turns: 20, dWet: 0, dTemp: 0.004, dieoffs: ['heat', 'drought'], mag: 1.4, dieoffTurns: 5, sens: [0.15, 1.5],
    regions: [R('river', 0.6, 0.65, 70, 70, 60, 50, 0.3), R('scrub', 0.4, 0.7, 60, 0, 90, 80, 0.35), R('desertEdge', 0.2, 0.8, 40, 0, 40, 50, 0.2), R('highland', 0.35, 0.4, 40, 0, 80, 50, 0.2)],
    rivals: [{ traits: { lungs: 2, limbs: 2, skin: 2, egg: 1, jawPrey: 2, size: 2 }, home: 'scrub', plan: 'special' }, { traits: { lungs: 2, limbs: 2, skin: 2, egg: 1, jawPlants: 2, size: 2 }, home: 'scrub', plan: 'greedy' }] },
  { id: 'shadow', name: 'The Long Shadow', turns: 20, dWet: 0, dTemp: 0.004, dieoffs: ['greatHot', 'greatDry', 'greatCold', 'greatWaste'], mag: 1.7, dieoffTurns: 5, lead: 8, sens: [0.1, 1.5],   // named earlier than the rest; and almost nowhere is spared
    regions: [R('river', 0.55, 0.62, 60, 60, 70, 70, 0.45), R('plains', 0.4, 0.65, 50, 0, 120, 110, 0.6), R('dryBasin', 0.2, 0.75, 50, 0, 40, 50, 0.35), R('polarForest', 0.5, 0.3, 50, 0, 100, 50, 0.3)],
    rivals: [{ traits: { lungs: 2, limbs: 3, skin: 2, egg: 2, jawPrey: 3, size: 3, warm: 1 }, home: 'plains', plan: 'special' }, { traits: { lungs: 2, limbs: 2, skin: 2, egg: 2, jawPlants: 3, size: 3 }, home: 'plains', plan: 'special' }] },
  { id: 'triassic', name: 'The Triassic', turns: 30, dWet: 0, dTemp: 0, dieoffs: ['heat', 'collapse', 'cold'], mag: 1.3, sens: [0.2, 1.5], dieoffTurns: 5,
    recover: 8,                               // turns for food to come back after the Great Dying
    pulse: { from: 12, to: 16, dWet: 0.25, plants: 1.6 },   // the wet episode near 233 Ma
    predRise: 0.008,
    regions: [R('river', 0.5, 0.7, 60, 50, 60, 50, 0.3), R('redbeds', 0.3, 0.78, 50, 0, 60, 80, 0.4), R('desert', 0.15, 0.85, 30, 0, 30, 40, 0.2), R('highland', 0.4, 0.5, 40, 0, 90, 60, 0.3)],
    rivals: [{ traits: { lungs: 2, limbs: 3, skin: 2, egg: 2, jawPrey: 2, size: 2, armour: 1 }, home: 'redbeds', plan: 'special' }, { traits: { lungs: 2, limbs: 2, skin: 2, egg: 2, jawPlants: 2, size: 1, burrow: 1 }, home: 'highland', plan: 'greedy' }] },
];
