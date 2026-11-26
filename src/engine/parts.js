// What is drawn of an animal, worked out from what it is.
//
// parts(): the slots and marks that come from traits and ways of living. Each
// is a function of something the rules use, so a part that changes nothing
// cannot be drawn: there is nothing to draw it from.
//
// lookOf(): the lineage's colouring and a few small features of its outline.
// These change no number. They are the one exception to the rule above, made
// at the author's word on 2026-11-26 ("colour of animals should be more
// randomized or something, it's always the same now... maybe some body aspects
// could be randomized?"). They come from the seed, so a save redraws the same
// animal, and they change with the era: fifty million years is long enough.

import { hashString } from './rng.js';

const lv = (t, id) => t[id] || 0;
const JAWS = ['jawInsects', 'jawFish', 'jawPlants', 'jawPrey'];

export function parts(t, ways = []) {
  const jaw = JAWS.reduce((a, id) => (lv(t, id) > lv(t, a) ? id : a), JAWS[0]);
  return {
    skull: ['narrow', 'broad', 'domed', 'high'][lv(t, 'brain')],
    jaw: lv(t, jaw) ? jaw : 'plain',
    teeth: { mixed: lv(t, 'omni') > 0, beak: lv(t, 'crush') > 0, hook: lv(t, 'scavenge') > 0 },
    trunk: ['slight', 'sturdy', 'heavy', 'massive'][lv(t, 'size')],
    limbs: lv(t, 'gait') >= 2 ? 'upright' : lv(t, 'gait') === 1 ? 'raised' : lv(t, 'limbs') >= 2 ? 'sprawlStrong' : 'sprawlShort',
    claws: lv(t, 'burrow') >= 1,
    herd: lv(t, 'herd'),   // how many of its own kind are drawn beside it
    tail: lv(t, 'gait') >= 2 ? 'balance' : lv(t, 'lungs') >= 2 ? 'plain' : 'fin',
    skin: lv(t, 'armour') >= 1 ? 'armoured' : lv(t, 'warm') >= 2 ? 'insulated' : lv(t, 'skin') >= 2 ? 'scaled' : lv(t, 'skin') === 1 ? 'scaling' : 'wet',
    armour: lv(t, 'armour'),   // scutes, then plates, then a shell
    coat: lv(t, 'warm'),       // tufts, then a full coat
    // Ways of living that show: a night animal's eye, a fat animal's belly, young at heel.
    night: ways.includes('night'), fat: ways.includes('fat'), young: ways.includes('tend'),
  };
}

export const HUES = 8, PATTERNS = 5, RIDGES = 4, TIPS = 3;

/** Colouring and outline for one lineage in one era. `who` is 'you' or a rival's id. */
export function lookOf(seed, era, who) {
  const h = hashString(`${seed >>> 0}|look|${era}|${who}`);
  return { hue: h % HUES, pattern: (h >>> 4) % PATTERNS, ridge: (h >>> 8) % RIDGES, tip: (h >>> 12) % TIPS };
}
