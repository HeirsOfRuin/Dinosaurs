// Every word the game shows about the world, apart from numbers. Numbers come
// from src/data/world.data.js through the engine; none is typed here.
// The dates are from memory and are not yet checked against a source.

export const TITLE = 'Deep Time';

export const TRAIT_TEXT = {
  lungs:      { name: 'Lungs', does: 'Breathe air. Drier ground becomes liveable.', slot: 'tail' },
  limbs:      { name: 'Limbs', does: 'Walk further and faster. Fewer are caught.', slot: 'limbs' },
  skin:       { name: 'Watertight skin', does: 'Holds water in. Drier and hotter ground opens.', slot: 'skin' },
  egg:        { name: 'A shelled egg', does: 'Breed away from water. The driest ground opens.', slot: 'trunk' },
  jawInsects: { name: 'Needle teeth', does: 'Insects feed you better; every other food a little worse.', slot: 'jaw' },
  jawFish:    { name: "A fisher's jaw", does: 'Fish feed you better; every other food a little worse.', slot: 'jaw' },
  jawPlants:  { name: 'Grinding teeth', does: 'Plants feed you better; every other food a little worse.', slot: 'jaw' },
  jawPrey:    { name: "A hunter's jaw", does: 'Prey feeds you better; every other food a little worse.', slot: 'jaw' },
  size:       { name: 'A heavier body', does: 'Harder to catch and better in the cold. Worse in heat and on insects.', slot: 'trunk' },
  warm:       { name: 'Warm blood', does: 'Cold ground opens and you move faster. Heat is harder.', slot: 'skin' },
  gait:       { name: 'Legs under the body', does: 'Much faster: better at hunting, and at not being hunted.', slot: 'limbs' },
  burrow:     { name: 'Burrowing', does: 'Shelter from heat, cold and drought. Works best in a small body.', slot: 'limbs' },
  brain:      { name: 'A bigger brain', does: 'Every food feeds you a little better.', slot: 'skull' },
  armour:     { name: 'Armour', does: 'Far fewer are caught. Slower.', slot: 'skin' },
};
export const STEP_NAMES = ['not begun', 'a hint', 'developed', 'refined'];

export const FOOD_TEXT = { insects: 'insects', fish: 'fish', plants: 'plants', prey: 'prey' };

export const REGION_TEXT = {
  shallows: 'Shallows', bank: 'River bank', floodplain: 'Floodplain', upland: 'Upland',
  swamp: 'Swamp', forestFloor: 'Forest floor', dryForest: 'Dry forest',
  river: 'River', scrub: 'Scrub', desertEdge: 'Desert edge', highland: 'Highland',
  plains: 'Plains', dryBasin: 'Dry basin', polarForest: 'Polar forest',
  redbeds: 'Red beds', desert: 'Desert',
};

// from / to are millions of years ago.
export const ERA_TEXT = {
  shore:    { from: 375, to: 359, intro: 'A river mouth. Everything worth eating is in the water, and so is everything that eats you.', palette: ['#1c2e2c', '#27423c', '#2f5a4a', '#1a3a44'] },
  coal:     { from: 359, to: 299, intro: 'Forest to the horizon, and the air thick with insects. The swamps will not last.', palette: ['#1e2a1c', '#263524', '#2f4a2a', '#2b3320'] },
  drying:   { from: 299, to: 265, intro: 'The forests have gone to scrub. Bigger animals than you hold the best ground.', palette: ['#2e2a18', '#3a3520', '#57502a', '#4a3e22'] },
  shadow:   { from: 265, to: 252, intro: 'A world owned by others. Something very large is coming, and the signs are early.', palette: ['#2a2016', '#3a2a1c', '#5a3d24', '#4a2e1e'] },
  triassic: { from: 252, to: 201, intro: 'Nearly empty, and hot. What is left of the world belongs to whoever takes it.', palette: ['#2e1e16', '#42281a', '#6a3d24', '#5a3320'] },
};

export const DIEOFF_TEXT = {
  cold:       { name: 'a long cold', sign: 'The winters are lengthening.', did: 'The cold came down and stayed.' },
  drought:    { name: 'a drought', sign: 'The water is drawing back.', did: 'The rains failed, and went on failing.' },
  heat:       { name: 'a great heat', sign: 'Each summer is worse than the last.', did: 'The heat did not break.' },
  collapse:   { name: 'a collapse of the food', sign: 'The forests are thinning.', did: 'The plants failed, and what ate them followed.' },
  greatHot:   { name: 'the Great Dying, by heat', sign: 'The sky is dark with ash and the air is warming.', did: 'The world cooked.' },
  greatDry:   { name: 'the Great Dying, by drought', sign: 'The sky is dark with ash and the rivers are shrinking.', did: 'The rivers stopped.' },
  greatCold:  { name: 'the Great Dying, by cold', sign: 'The sky is dark with ash and the sun is weak.', did: 'The sun went out for a long time.' },
  greatWaste: { name: 'the Great Dying, by famine', sign: 'The sky is dark with ash and nothing is growing.', did: 'Nothing grew.' },
};

export const ENDING_TEXT = {
  dinosaur:  { name: 'Dinosaur', line: 'Upright, fast and warm.', won: 'Your lineage walks out of the Triassic on two legs. Its descendants will own the land for a hundred and thirty million years, and some of them will fly.' },
  crocodile: { name: 'Crocodile line', line: 'Armoured, big, a hunter.', won: 'Your lineage comes through armoured and patient. Its kind will outlast the dinosaurs and change very little, having seen no reason to.' },
  mammal:    { name: 'Mammal line', line: 'Small, warm, burrowing.', won: 'Your lineage comes through small, warm and underground. It will spend a very long time being overlooked, which will turn out to have been the right idea.' },
  amphibian: { name: 'Great amphibian', line: 'Never left the water.', won: 'Your lineage never left the water, and the water kept it. It comes through the size of a rowing boat, with a head like a shovel.' },
};
export const OTHER_ENDINGS = {
  survived: 'Your lineage is alive at the end of the Triassic. It is none of the four animals that inherit the world: a survivor, unremarkable, and still here.',
  starved: 'There was not enough to eat where they lived. The last of them went quietly.',
  dieoff: 'No ground they held could be lived on. The last of them did not see the end of it.',
  unfit: 'They came through, and found nowhere in the new world they could live.',
};

export const SETTING_TEXT = {
  saved:   { name: 'A save at every era', line: 'Lose an era and you may begin it again. Each try rolls a new die-off.' },
  oneLife: { name: 'One life', line: 'The lineage ends when it ends. Start again at the Shore.' },
};

export const NOTES = [
  'The animal you begin as looks like an amphibian. It is an early four-legged animal, not an ancestor of frogs: dinosaurs, crocodiles and mammals do not descend from modern amphibians.',
  'The dates and the die-offs are from memory and have not yet been checked against a source. The numbers behind the world are tuned for play, not measured from rock.',
  'Evolution has no aim. This game gives it one so that there is something to play for.',
];

export const PART_TEXT = {
  skull: { narrow: 'narrow', broad: 'broad', domed: 'domed', high: 'high-domed' },
  jaw: { plain: 'plain', jawInsects: 'needle teeth', jawFish: "a fisher's snout", jawPlants: 'grinding teeth', jawPrey: "a hunter's teeth" },
  trunk: { slight: 'slight', sturdy: 'sturdy', heavy: 'heavy', massive: 'massive' },
  limbs: { sprawlShort: 'sprawling, short', sprawlStrong: 'sprawling, strong', raised: 'half raised', upright: 'under the body' },
  tail: { fin: 'a fin', plain: 'plain', balance: 'held out for balance' },
  skin: { wet: 'wet', scaling: 'scaling over', scaled: 'scaled', insulated: 'insulated', armoured: 'armoured' },
};
