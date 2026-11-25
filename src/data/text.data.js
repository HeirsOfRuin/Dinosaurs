// Every word the game shows about the world, apart from numbers. Numbers come
// from src/data/world.data.js through the engine; none is typed here.
// The dates are from memory and are not yet checked against a source.

export const TITLE = 'Deep Time';

export const TRAIT_TEXT = {
  lungs:      { name: 'Lungs', does: 'Breathe air. Drier ground becomes liveable.', slot: 'tail' },
  limbs:      { name: 'Limbs', does: 'Walk further and faster. Fewer are caught.', slot: 'limbs' },
  skin:       { name: 'Watertight skin', does: 'Holds water in. Drier and hotter ground opens.', slot: 'skin' },
  egg:        { name: 'A shelled egg', does: 'Breed away from water. The driest ground opens.', slot: 'trunk' },
  jawInsects: { name: 'Needle teeth', does: 'A mouth for insects. A lineage has one mouth; another means letting this one go.', slot: 'jaw' },
  jawFish:    { name: "A fisher's jaw", does: 'A mouth for fish. A lineage has one mouth; another means letting this one go.', slot: 'jaw' },
  jawPlants:  { name: 'Grinding teeth', does: 'A mouth for plants. A lineage has one mouth; another means letting this one go.', slot: 'jaw' },
  jawPrey:    { name: "A hunter's jaw", does: 'A mouth for prey. A lineage has one mouth; another means letting this one go.', slot: 'jaw' },
  omni:       { name: "An omnivore's teeth", does: 'Every other food feeds you somewhat; your own a little less.', slot: 'jaw' },
  scavenge:   { name: 'A scavenger', does: 'Eats the dead. There are more of them where hunters are many, and as a die-off begins.', slot: 'jaw' },
  crush:      { name: 'Cracking and grinding', does: 'Shell, seed and bone: hard food that other mouths leave.', slot: 'jaw' },
  herd:       { name: 'Living in herds', does: 'Fewer are caught, and prey is easier taken together.', slot: 'skull' },
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

// The lineages on the ladder. `example` is an animal that lived in that line. The examples and
// what is said of them are from memory and are not yet checked against a source.
export const LINEAGE_TEXT = {
  dinosaur:  { name: 'Dinosaurs', line: 'Upright, fast and warm.', example: 'Coelophysis: a light, two-legged hunter about three metres long, which lived in packs.', after: 'They will own the land for a hundred and thirty million years, and some of them will fly.' },
  crocodile: { name: 'Crocodile line', line: 'Armoured, big, a hunter.', example: 'Protosuchus: a land crocodile the size of a dog, long in the leg.', after: 'They will outlast the dinosaurs and change very little, having seen no reason to.' },
  beaked:    { name: 'Beaked plant-eaters', line: 'Heavy, tusked, in herds.', example: 'Lystrosaurus: a pig-sized burrower that all but owned the world after the Great Dying. Placerias, the size of an ox, was among the last.', after: 'They ruled the Permian and came through its end. They do not come through this one.' },
  mammal:    { name: 'Mammal line', line: 'Small, warm, burrowing.', example: 'Morganucodon: the size of a shrew, active at night, eating insects.', after: 'They will spend a very long time being overlooked, which will turn out to have been the right idea.' },
  lizard:    { name: 'Lizard line', line: 'Small, scaled, everywhere.', example: 'Clevosaurus: a hand-long insect-eater. Its last living relative is the tuatara.', after: 'Nothing about them is remarkable, and they will still be here at the end.' },
  amphibian: { name: 'Great amphibians', line: 'Never left the water.', example: 'Mastodonsaurus: as long as a car, most of it head, lying in wait in rivers.', after: 'The water keeps them a while longer. The crocodiles are coming for their rivers.' },
  turtle:    { name: 'Turtle line', line: 'Armoured, slow, eats what it finds.', example: 'Proganochelys: a metre long, already in a full shell, unable to pull its head in.', after: 'They have found a shape that works and will not be talked out of it.' },
};
export const RANK_TEXT = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];
export const THROUGH_TEXT = [
  'Your lineage comes through at the head of everything alive. What the dinosaurs were about to do, it will do.',
  'Your lineage comes through among the few that will shape what follows.',
  'Your lineage comes through among the few that will shape what follows.',
  'Your lineage comes through with a firm hold on the world that is coming.',
  'Your lineage comes through with a place in the world that is coming, though not a large one.',
  'Your lineage comes through. It will have to make its living at the edges.',
  'Your lineage comes through, thin on the ground and poorly set for what follows. It is alive, which most are not.',
  'Your lineage comes through last of those that did. It is alive, which most are not.',
];
export const STANDING_TEXT = {
  prospects: 'Prospects: what six grounds of the world to come would feed of this body, counted by weight.',
  secure: 'Numbers: how many are left. A few hundred are one bad year from none.',
  spread: 'Ground: how many regions you hold.',
};

export const WAY_TEXT = {
  night: { name: 'Active by night', gives: 'Fewer are caught, and the day\'s heat is slept through.', costs: 'Finds a tenth less of every food.' },
  tend:  { name: 'Tending the young', gives: 'Numbers climb back faster after a loss.', costs: 'More upkeep, every turn.' },
  roam:  { name: 'Moving with the seasons', gives: 'Bad ground harms you less.', costs: 'Every trait grows a fifth more slowly.' },
  fat:   { name: 'Laying down fat', gives: 'When food fails, numbers fall more slowly.', costs: 'In good times numbers climb more slowly.' },
};

// Moments. Each is shown once in a run. Three roads; none is a refusal and none is the right answer.
export const MOMENT_TEXT = {
  flood:      { title: 'The river leaves its bed', text: 'After a wet season the river is somewhere else, and so is everything that lived beside it.', roads: ['Keep to the high ground. Some are lost; the mud grows plants for years.', 'Follow the water. Few are lost, and the fishing is good for a while.', 'Scatter. Some are lost, and a few fetch up on new ground.'] },
  newHunter:  { title: 'Something new is hunting', text: 'It is faster than what hunted you before, and it has noticed you.', roads: ['Run. The slow are taken, and what is left is quicker to change.', 'Hide. Nobody is taken, and for a while everybody eats less.', 'Stand together. A few are taken, and it learns to hunt something else.'] },
  plague:     { title: 'The neighbours are dying', text: 'A sickness is going through the rival animals on your ground. It does not seem to want you.', roads: ['Keep away from them. Food is thin while you do.', 'Move onto their ground at once. Some of you sicken; the eating is good afterwards.', 'Eat the dead. Some of you sicken, and there is a great deal of carrion.'] },
  richYear:   { title: 'A fat year', text: 'The rains came when they should and everything bred.', roads: ['Breed. There are many more of you.', 'Wander. The surplus young find new ground.', 'Play. The young have time to try things, and the trait under pressure moves on.'] },
  leanYear:   { title: 'A lean year', text: 'The rains did not come.', roads: ['Stay and go hungry. Many are lost.', 'Eat what you do not like. Fewer are lost, and the trait under pressure moves on a little.', 'Send the young away. Some are lost, and a few find new ground.'] },
  rivalYoung: { title: 'Their nests are unguarded', text: 'The rival animals on your ground have bred, and are careless about it.', roads: ['Raid the nests. There are fewer of them, more of you, and the hunters have noticed the commotion.', 'Leave them be, and watch how they do it. The trait under pressure moves on a little.', 'Crowd them off the best ground. A few on each side are lost.'] },
  landBridge: { title: 'A way across', text: 'The water has drawn back from a strip of land, and there is ground on the far side nobody is using.', roads: ['Cross in numbers. Some are lost on the way, and many arrive.', 'Send a few. They arrive.', 'Stay. Nothing is lost, and the trait under pressure moves on.'] },
  fire:       { title: 'Fire', text: 'Lightning, a dry month, and the horizon is the wrong colour.', roads: ['Flee. Many are lost.', 'Go to ground. Fewer are lost, and there is little green to eat for a while.', 'Follow the burn. Some are lost, and everything small is out in the open.'] },
  oddYoung:   { title: 'A strange litter', text: 'Some of this year\'s young are not like their parents.', roads: ['Let them breed. A few of the ordinary are crowded out, and the trait under pressure leaps on.', 'Drive them off. They found a colony somewhere else.', 'Pay no attention. A good year for numbers.'] },
  longWinter: { title: 'A long winter', text: 'The cold season has not ended when it should.', roads: ['Sleep through it. Some do not wake; nor do some of the hunters.', 'Keep foraging. Insects are scarce for a while, and the trait under pressure moves on.', 'Move toward the sun. Some are lost, and a few find new ground.'] },
  giantDead:  { title: 'Something enormous has died', text: 'It lies on your ground, and it will feed whoever gets there.', roads: ['Feast. There are more of you, and every hunter for miles has come to the same place.', 'Wait until the others have finished. A little more of you.', 'Hunt the ones who came to eat. A few are lost, and prey is easy for a while.'] },
  crowding:   { title: 'Too many', text: 'There are more of you than the ground likes, and tempers are short.', roads: ['Split. A large party leaves to find new ground.', 'Let it thin. Many are lost, and what is left is quicker to change.', 'Push the neighbours. Fewer of them, and some of you lost doing it.'] },
};

// How long an animal of each size step is, in words. LENGTH_M in the world table gives the metres.
export const SIZE_TEXT = ['about the length of a cat', 'about the length of a large dog', 'about the length of a lion', 'about the length of a saltwater crocodile'];

export const OTHER_ENDINGS = {
  starved: 'There was not enough to eat where they lived. The last of them went quietly.',
  dieoff: 'No ground they held could be lived on. The last of them did not see the end of it.',
  unfit: 'They came through, and found nowhere in the new world they could live.',
};

export const SETTING_TEXT = {
  saved:   { name: 'A save at every era', line: 'Lose an era and you may begin it again. Each try rolls a new die-off.' },
  oneLife: { name: 'One life', line: 'The lineage ends when it ends. Start again at the Shore.' },
};

export const NOTES = [
  'A lineage that is alive at the end of the Triassic has come through. Its standing is worked out from the same food and climate rules as every turn, and it is placed among seven lineages that are scored the same way.',
  'The animal you begin as looks like an amphibian. It is an early four-legged animal, not an ancestor of frogs: dinosaurs, crocodiles and mammals do not descend from modern amphibians.',
  'The dates and the die-offs are from memory and have not yet been checked against a source. The numbers behind the world are tuned for play, not measured from rock.',
  'Evolution has no aim. This game gives it one so that there is something to play for.',
];

export const PART_TEXT = {
  skull: { narrow: 'narrow', broad: 'broad', domed: 'domed', high: 'high-domed' },
  jaw: { plain: 'no settled mouth', jawInsects: 'needle teeth', jawFish: "a fisher's snout", jawPlants: 'grinding teeth', jawPrey: "a hunter's teeth" },
  trunk: { slight: 'slight', sturdy: 'sturdy', heavy: 'heavy', massive: 'massive' },
  limbs: { sprawlShort: 'sprawling, short', sprawlStrong: 'sprawling, strong', raised: 'half raised', upright: 'under the body' },
  tail: { fin: 'a fin', plain: 'plain', balance: 'held out for balance' },
  skin: { wet: 'wet', scaling: 'scaling over', scaled: 'scaled', insulated: 'insulated', armoured: 'armoured' },
};
