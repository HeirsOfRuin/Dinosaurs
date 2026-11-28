// Every word the game shows about the world, apart from numbers. Numbers come
// from src/data/world.data.js through the engine; none is typed here.
// The dates are from memory and are not yet checked against a source.

export const TITLE = 'Deep Time';

export const TRAIT_TEXT = {
  lungs:      { name: 'Lungs', does: 'Breathe air. Drier ground becomes liveable.', slot: 'tail' },
  limbs:      { name: 'Limbs', does: 'Walk further and faster. Fewer are caught.', slot: 'limbs' },
  skin:       { name: 'Watertight skin', does: 'Holds water in. Drier and hotter ground opens.', slot: 'skin' },
  egg:        { name: 'A shelled egg', does: 'Breed away from water. The driest ground opens.', slot: 'trunk' },
  jawInsects: { name: "An insect-eater's jaw", does: 'A mouth for insects. A lineage has one mouth. It can be turned to another food, and works until the new one is ready.', slot: 'jaw' },
  jawFish:    { name: "A fisher's jaw", does: 'A mouth for fish. A lineage has one mouth. It can be turned to another food, and works until the new one is ready.', slot: 'jaw' },
  jawPlants:  { name: "A grazer's jaw", does: 'A mouth for plants. A lineage has one mouth. It can be turned to another food, and works until the new one is ready.', slot: 'jaw' },
  jawPrey:    { name: "A hunter's jaw", does: 'A mouth for prey. A lineage has one mouth. It can be turned to another food, and works until the new one is ready.', slot: 'jaw' },
  omni:       { name: "An omnivore's teeth", does: 'Every other food feeds you somewhat; your own a little less. The one refinement any jaw can grow.', slot: 'jaw' },
  scavenge:   { name: 'A scavenger', does: "A hunter's refinement. Eats the dead, and what a bigger hunter leaves where you share its ground. There are more dead where hunters are many, and as a die-off begins.", slot: 'jaw' },
  crush:      { name: 'Crushing teeth', does: "Shellfish on a fisher's jaw, seeds on a grazer's: hard food other mouths leave.", slot: 'jaw' },
  tongue:     { name: 'A long tongue', does: "An insect-eater's refinement. Reaches the insects in bark and under the ground: insects feed you better.", slot: 'jaw' },
  wings:      { name: 'Wings', does: 'Gliding, then flight. Much quicker to move between regions and much harder to catch. Closes off a heavier body at step 2, and armour.', slot: 'trunk' },
  longNeck:   { name: 'A long neck', does: 'Reaches plants no one else can: plants feed you better. Closes off burrowing.', slot: 'trunk' },
  airSacs:    { name: 'Air sacs', does: 'Breathing through sacs that run through the body: better in heat, in dry ground and in thin air, and a little quicker.', slot: 'tail' },
  milk:       { name: 'Milk', does: 'The young are fed by the mother: numbers climb back faster and fall more slowly in a lean year.', slot: 'skull' },
  flippers:   { name: 'Flippers', does: 'Back to the water: fish feed you far better, and you are a little slower on land. Closes off legs under the body at step 2.', slot: 'limbs' },
  battery:    { name: 'Teeth in batteries', does: "A grazer's refinement: hundreds of teeth, worn down and replaced. Plants and hard food feed you better.", slot: 'jaw' },
  herd:       { name: 'Living in herds', does: 'Fewer are caught, and prey is easier taken together.', slot: 'skull' },
  size:       { name: 'A heavier body', does: 'Harder to catch and better in the cold. Worse in heat and on insects.', slot: 'trunk' },
  warm:       { name: 'Warm blood', does: 'Cold ground opens and you move faster. Heat is harder. It needs fur or feathers over it to hold the heat in.', slot: 'skin' },
  scales:     { name: 'Scales', does: 'A covering. Hotter and drier ground opens. A lineage wears one covering; it can be turned to another.', slot: 'skin' },
  fur:        { name: 'Fur', does: 'A covering. Colder ground opens; heat is a little harder. It costs more the bigger the animal. A lineage wears one covering; it can be turned to another.', slot: 'skin' },
  feathers:   { name: 'Feathers', does: 'A covering. Colder ground opens, and it is light: you move a little faster. A lineage wears one covering; it can be turned to another.', slot: 'skin' },
  sail:       { name: 'A sail on the back', does: 'Sheds heat at noon and soaks it up at dawn: hotter and colder ground both open. It cannot be worn under fur or feathers, nor taken down a burrow.', slot: 'trunk' },
  gait:       { name: 'Legs under the body', does: 'Much faster: better at hunting, and at not being hunted.', slot: 'limbs' },
  burrow:     { name: 'Burrowing', does: 'Shelter from heat, cold and drought. Works best in a small body, and a big one cannot learn to dig deep.', slot: 'limbs' },
  brain:      { name: 'A bigger brain', does: 'Every food feeds you a little better.', slot: 'skull' },
  claws:      { name: 'Claws', does: 'Prey a little easier to take, fewer of you caught, and more fight in a push.', slot: 'limbs' },
  horns:      { name: 'Horns', does: 'Much more fight in a push, and fewer caught. A heavy head: a little slower.', slot: 'skull' },
  tailClub:   { name: 'A clubbed tail', does: 'Fewer caught, and more fight in a push. A club is no balancing tail: it closes off legs fully under the body.', slot: 'tail' },
  venom:      { name: 'Venom', does: 'Prey easier to take, fewer caught, more fight. Only in a small body: it closes off growing large.', slot: 'jaw' },
  camouflage: { name: 'Camouflage', does: 'Colour that counts: fewer caught and prey easier where your colour matches the ground. Your colour turns toward the ground you mostly live on, a little each turn; move on and it has to turn again. Closes off display.', slot: 'skin' },
  display:    { name: 'Display', does: 'A bright frill: numbers climb back faster, and more are caught, both where you stand out from the ground; with venom, bright colours are a warning and fewer are caught instead. Your colour turns away from the ground you live on. Closes off camouflage.', slot: 'skull' },
  armour:     { name: 'Armour', does: 'Far fewer are caught. Slower. A full shell closes off running legs and burrowing.', slot: 'skin' },
};
// The branches of the tree on the Body screen.
export const TREE_TEXT = {
  air:   { name: 'Air and water', line: 'Breathing, holding water in, breeding away from it.' },
  cover: { name: 'Skin and covering', line: 'One covering at a time. Some of these close each other off.' },
  legs:  { name: 'Legs', line: 'How it moves, and whether it digs.' },
  mouth: { name: 'Mouth', line: 'One mouth, and what grows from it.' },
  frame: { name: 'Frame and wits', line: 'How big, how clever, how many together.' },
  arms:  { name: 'Weapons and colour', line: 'For a contest with a rival, against being caught, and colour that counts.' },
};
// What can be done about a rival (docs/FRAME-rivals.md).
export const STANCE_TEXT = {
  push:   { name: 'Push them out', does: 'Contest the ground you share. Both sides lose numbers, each by the other\'s strength. If they are left with under a third of it, they are driven out. They will push back.', doing: 'Pushing', short: 'pushing' },
  prey:   { name: 'Prey on them', does: 'Hunt them where you share ground. A hunter takes on what fights not much better than it does; what you take feeds you. They will push back.', doing: 'Preying on', short: 'preying' },
};
export const STEP_NAMES = ['not begun', 'a hint', 'developed', 'refined'];

export const FOOD_TEXT = { insects: 'insects', fish: 'fish', plants: 'plants', prey: 'prey', carrion: 'the dead', hard: 'hard food' };

export const REGION_TEXT = {
  shallows: 'Shallows', bank: 'River bank', floodplain: 'Floodplain', upland: 'Upland',
  swamp: 'Swamp', forestFloor: 'Forest floor', dryForest: 'Dry forest',
  river: 'River', scrub: 'Scrub', desertEdge: 'Desert edge', highland: 'Highland',
  plains: 'Plains', dryBasin: 'Dry basin', polarForest: 'Polar forest',
  redbeds: 'Red beds', desert: 'Desert',
  lagoon: 'Lagoon', riverForest: 'River forest', fernPrairie: 'Fern prairie', conifers: 'Conifers',
  flowerWood: 'Flowering wood', coast: 'Coast', uplands: 'Uplands', delta: 'Delta', forest: 'Forest', highlands: 'Highlands',
};

// from / to are millions of years ago.
export const ERA_TEXT = {
  shore:    { from: 375, to: 359, intro: 'A river mouth. Everything worth eating is in the water, and so is everything that eats you.', palette: ['#1c2e2c', '#27423c', '#2f5a4a', '#1a3a44'] },
  coal:     { from: 359, to: 299, intro: 'Forest to the horizon, and the air thick with insects. The swamps will not last.', palette: ['#1e2a1c', '#263524', '#2f4a2a', '#2b3320'] },
  drying:   { from: 299, to: 265, intro: 'The forests have gone to scrub. Bigger animals than you hold the best ground.', palette: ['#2e2a18', '#3a3520', '#57502a', '#4a3e22'] },
  shadow:   { from: 265, to: 252, intro: 'A world owned by others. Something very large is coming, and the signs are early.', palette: ['#2a2016', '#3a2a1c', '#5a3d24', '#4a2e1e'] },
  jurassic: { from: 201, to: 145, intro: 'Warm, wet and enormous. Everything on the plains is bigger than it was.', palette: ['#1a2a1e', '#22382a', '#2f5236', '#2a3a22'] },
  flowers:  { from: 145, to: 94, intro: 'Something new is growing: plants that flower, and the insects come with them.', palette: ['#232a1c', '#2e3a24', '#4a5a2e', '#3a4426'] },
  giants:   { from: 94, to: 66, intro: 'The largest animals that ever walked. The age is long, and it is ending.', palette: ['#2a241a', '#3a3022', '#5a4a2c', '#43381f'] },
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
  heavy:        { name: 'the seas falling back', sign: 'The shore is further away each year, and the big animals are thin.', did: 'The seas drew back, and the biggest went first.' },
  deadSeas:     { name: 'the dead seas', sign: 'The water is warm and nothing is coming up from the deep.', did: 'The seas lost their air, and the shores their fish.' },
  impactWinter: { name: 'the impact, and the dark', sign: 'There is a new light in the sky, brighter every night.', did: 'Something struck the world. The sky went black and the cold came, and nothing large lived through it.' },
  impactFire:   { name: 'the impact, and the burning', sign: 'There is a new light in the sky, brighter every night.', did: 'Something struck the world. The forests burned, and nothing large lived through it.' },
  deccan:       { name: 'the impact, and the long poison', sign: 'There is a new light in the sky, and the far mountains are smoking.', did: 'Something struck the world while the far mountains poured out fire. Nothing large lived through it.' },
};

// The lineages on the ladder. `example` is an animal that lived in that line. The examples and
// what is said of them are from memory and are not yet checked against a source.
export const LINEAGE_TEXT = {
  bird:        { name: 'Birds', line: 'Small, feathered, flying.', example: 'Vegavis: a duck-like bird that lived in the last of the Cretaceous and came through.', after: 'They are the dinosaurs that came through, and they will not say so.' },
  mammal:      { name: 'Mammal line', line: 'Small, warm, burrowing.', example: 'Purgatorius: a small climber, close to the root of the primates.', after: 'They have waited a very long time for the room, and now there is room.' },
  crocodile:   { name: 'Crocodile line', line: 'Armoured, cold-blooded, a hunter by the water.', example: 'Borealosuchus: a river crocodile that lived on both sides of the impact.', after: 'They will change very little, having found nothing to change for.' },
  turtle:      { name: 'Turtle line', line: 'Armoured, slow, eats what it finds.', example: 'Basilemys: a land turtle the size of a table.', after: 'They have found a shape that works and see no reason to discuss it.' },
  lizard:      { name: 'Lizards and snakes', line: 'Small, scaled, everywhere.', example: 'Polyglyphanodon: a plant-eating lizard about a metre long.', after: 'Nothing about them is remarkable, and they will be everywhere.' },
  frog:        { name: 'Frogs and salamanders', line: 'Small, wet-skinned, by the water.', example: 'Beelzebufo: a frog the size of a football, which ate small dinosaurs.', after: 'The water and the mud keep them, as they always have.' },
  champsosaur: { name: 'Champsosaurs', line: 'Long-snouted fish-eaters of the rivers.', example: 'Champsosaurus: shaped like a gharial, about a metre and a half long.', after: 'They will keep to the rivers for a long time yet, and then quietly not.' },
};
export const RANK_TEXT = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];
export const THROUGH_TEXT = [
  'Your lineage comes through at the head of everything alive. The world that is coming is largely its.',
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
  night: { short: 'by night', name: 'Active by night', gives: 'Fewer are caught, and the day\'s heat is slept through.', costs: 'Finds a tenth less of every food.' },
  tend:  { short: 'tending', name: 'Tending the young', gives: 'Numbers climb back faster after a loss.', costs: 'More upkeep, every turn.' },
  roam:  { short: 'roaming', name: 'Moving with the seasons', gives: 'Bad ground harms you less.', costs: 'More upkeep, every turn: the walking has to be paid for.' },
  fat:   { short: 'fat', name: 'Laying down fat', gives: 'When food fails, numbers fall more slowly.', costs: 'In good times numbers climb more slowly.' },
};

// Moments. Each is shown once in a run. Three roads; none is a refusal and none is the right answer.
export const MOMENT_TEXT = {
  flood:      { title: 'The river leaves its bed', text: 'After a wet season the river is somewhere else, and so is everything that lived beside it.', roads: ['Keep to the high ground. Some are lost; the mud grows plants for years.', 'Follow the water. Few are lost, and the fishing is good for a while.', 'Scatter. Some are lost, and a few fetch up on new ground.'] },
  newHunter:  { title: 'Something new is hunting', text: 'It is faster than what hunted you before, and it has noticed you.', roads: ['Run. The slow are taken, and what is left is quicker to change.', 'Hide. Nobody is taken, and for a while everybody eats less.', 'Stand together. A few are taken, and it learns to hunt something else.'] },
  plague:     { title: 'The neighbours are dying', text: 'A sickness is going through the rival animals on your ground. It does not seem to want you.', roads: ['Keep away from them. Food is thin while you do.', 'Move onto their ground at once. Some of you sicken; the eating is good afterwards.', 'Eat the dead. Some of you sicken, and there is a great deal of carrion.'] },
  richYear:   { title: 'A fat year', text: 'The rains came when they should and everything bred.', roads: ['Breed. There are many more of you.', 'Wander. The surplus young find new ground.', 'Play. The young have time to try things, and the trait under pressure moves on.'] },
  leanYear:   { title: 'A lean year', text: 'The rains did not come.', roads: ['Stay and go hungry. Many are lost, and there is more for those left.', 'Eat what you do not like. Fewer are lost, and the trait under pressure moves on a little.', 'Send the young away. Some are lost, and a few find new ground.'] },
  rivalYoung: { title: 'Their nests are unguarded', text: 'The rival animals on your ground have bred, and are careless about it.', roads: ['Raid the nests. There are fewer of them, more of you, and the hunters have noticed the commotion.', 'Leave them be, and watch how they do it. The trait under pressure moves on a little.', 'Crowd them off the best ground. A few on each side are lost.'] },
  landBridge: { title: 'A way across', text: 'The water has drawn back from a strip of land, and there is ground on the far side nobody is using.', roads: ['Cross in numbers. Some are lost on the way, and many arrive.', 'Send a few. They arrive.', 'Stay. Nothing is lost, and the trait under pressure moves on.'] },
  fire:       { title: 'Fire', text: 'Lightning, a dry month, and the horizon is the wrong colour.', roads: ['Flee. Many are lost, and some of those who ran settle where they stopped.', 'Go to ground. Fewer are lost, and there is little green to eat for a while.', 'Follow the burn. Some are lost, and everything small is out in the open.'] },
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
  'A lineage that is alive after the impact that ended the age of dinosaurs has come through. Its standing is worked out from the same food and climate rules as every turn, and it is placed among seven lineages that are scored the same way.',
  'The animal you begin as looks like an amphibian. It is an early four-legged animal, not an ancestor of frogs: dinosaurs, crocodiles and mammals do not descend from modern amphibians.',
  'The dates and die-offs from the Jurassic on were looked up in published summaries (docs/HISTORY.md); the earlier ones are from memory. The numbers behind the world are tuned for play, not measured from rock.',
  'Evolution has no aim. This game gives it one so that there is something to play for.',
];

export const PART_TEXT = {
  skull: { narrow: 'narrow', broad: 'broad', domed: 'domed', high: 'high-domed' },
  jaw: { plain: 'no settled mouth', jawInsects: 'needle teeth', jawFish: "a fisher's snout", jawPlants: 'grinding teeth', jawPrey: "a hunter's teeth" },
  trunk: { slight: 'slight', sturdy: 'sturdy', heavy: 'heavy', massive: 'massive' },
  limbs: { sprawlShort: 'sprawling, short', sprawlStrong: 'sprawling, strong', raised: 'half raised', upright: 'under the body' },
  tail: { fin: 'a fin', plain: 'plain', balance: 'held out for balance' },
  skin: { wet: 'wet', tight: 'watertight', scaled: 'scaled', furred: 'furred', feathered: 'feathered', armoured: 'armoured' },
};

// The lineage's colouring, in words. It changes no number: see src/engine/parts.js.
export const LOOK_TEXT = {
  hue: ['sea green', 'olive', 'ochre', 'rust', 'slate blue', 'dusk rose', 'moss', 'teal'],
  pattern: ['plain', 'spotted', 'striped', 'banded', 'dark along the back'],
};
