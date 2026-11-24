// The six drawn slots, worked out from the traits. Each slot's variant is a
// function of numbers the rules use, so a part that changes nothing cannot be
// drawn: there is nothing to draw it from.

const lv = (t, id) => t[id] || 0;
const JAWS = ['jawInsects', 'jawFish', 'jawPlants', 'jawPrey'];

export function parts(t) {
  const jaw = JAWS.reduce((a, id) => (lv(t, id) > lv(t, a) ? id : a), JAWS[0]);
  return {
    skull: ['narrow', 'broad', 'domed', 'high'][lv(t, 'brain')],
    jaw: lv(t, jaw) ? jaw : 'plain',
    trunk: ['slight', 'sturdy', 'heavy', 'massive'][lv(t, 'size')],
    limbs: lv(t, 'gait') >= 2 ? 'upright' : lv(t, 'gait') === 1 ? 'raised' : lv(t, 'limbs') >= 2 ? 'sprawlStrong' : 'sprawlShort',
    claws: lv(t, 'burrow') >= 1,
    tail: lv(t, 'gait') >= 2 ? 'balance' : lv(t, 'lungs') >= 2 ? 'plain' : 'fin',
    skin: lv(t, 'armour') >= 1 ? 'armoured' : lv(t, 'warm') >= 2 ? 'insulated' : lv(t, 'skin') >= 2 ? 'scaled' : lv(t, 'skin') === 1 ? 'scaling' : 'wet',
  };
}
