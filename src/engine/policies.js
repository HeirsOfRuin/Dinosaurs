// How a lineage decides without a person: the rivals in the game, and the bots
// that measure it. A policy is parts, each of which must change the end state
// (sim/gate-check.js proves it): a plan for the body, the lineage it is making
// for, how many regions to hold, the ways it lives, whether it heeds the
// die-off warning, whether it braces for it, and which road it takes at a moment.
import { TRAITS, JAWS, MAX_REGIONS, MIN_VIABLE, LINEAGES } from '../data/world.data.js';
import { body, capacity, held, totalPop, canRaise, canShed, mouthOf, waysOf } from './model.js';
import { streamFor } from './rng.js';

const lv = (t, id) => t[id] || 0;
const TOLERANT = [['lungs', 2], ['skin', 1], ['egg', 1], ['limbs', 2], ['skin', 2], ['egg', 2], ['burrow', 1], ['brain', 1], ['lungs', 3], ['skin', 3], ['egg', 3], ['brain', 2], ['burrow', 2]];
// What to grow against each face of a die-off, when it has been named.
const COUNTER = {
  cold: [['warm', 1], ['burrow', 2], ['size', 1]], drought: [['lungs', 2], ['skin', 2], ['egg', 2], ['skin', 3]],
  heat: [['lungs', 2], ['skin', 2], ['burrow', 2], ['skin', 3]], collapse: [['omni', 1], ['brain', 1], ['omni', 2]],
  greatHot: [['lungs', 2], ['skin', 2], ['egg', 2], ['burrow', 2], ['skin', 3]],
  greatDry: [['lungs', 2], ['skin', 2], ['egg', 2], ['skin', 3], ['egg', 3]],
  greatCold: [['warm', 1], ['burrow', 1], ['burrow', 2], ['warm', 2], ['size', 1]],
  greatWaste: [['omni', 1], ['scavenge', 1], ['brain', 1], ['omni', 2]],
};
// The order a body is built in when making for a lineage: each trait to step 1, then to 2, then to 3.
const ORDER = ['lungs', 'limbs', 'jawInsects', 'jawFish', 'jawPlants', 'jawPrey', 'skin', 'egg', 'burrow', 'brain', 'herd', 'gait', 'warm', 'size', 'armour', 'omni', 'scavenge', 'crush'];
// The hungry traits come last: a bot that took warm blood and size as hints on the Shore starved
// in the Coal Forests in 56 runs of 100.
const HUNGRY = ['warm', 'size', 'armour', 'herd', 'brain'];
export const roadTo = (target) => [(id) => !HUNGRY.includes(id), (id) => HUNGRY.includes(id)].flatMap((part) => [1, 2, 3].flatMap((n) => ORDER.filter((id) => part(id) && lv(target, id) >= n).map((id) => [id, n])));

export const POLICIES = {
  none:    { plan: 'none', regions: 1 },
  drifter: { plan: 'random', regions: 2 },
  eater:   { plan: 'greedy', regions: 2 },
  tolerant: { plan: 'tolerant', regions: 3 },
  // A careful player with no animal in mind: tolerance first, then whatever feeds it, eyes open.
  careful: { plan: 'mixed', regions: 2, heed: true, brace: true, ways: ['tend'] },
};
export const ROADS = Object.keys(LINEAGES).filter((id) => id !== 'beaked');
for (const road of ROADS) {
  POLICIES[road + '.list'] = { plan: 'recipe', road, regions: 1, ways: LINEAGES[road].ways };
  POLICIES[road + '.plan'] = { plan: 'recipe', road, regions: 2, heed: true, brace: true, ways: LINEAGES[road].ways };
}

const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
const worth = (s, l, traits) => sum(capacity(s, l, traits));
const allowAll = () => true;

// Walk an ordered list of (trait, level) targets: take the hint when it is
// offered, press the first target that can be pressed, fetch what it rests on.
// Only the next `ahead` unmet targets are worked on: a bot that took every hint
// on its list the turn it was offered carried armour and size on the Shore and
// starved there in 99 runs of 100.
function follow(l, offers, targets, allow = allowAll, ahead = 3) {
  const d = {}, want = [];
  let unmet = 0;
  for (const [id, n] of targets) {
    if (lv(l.traits, id) >= n || !allow({ ...l.traits, [id]: lv(l.traits, id) + 1 })) continue;
    if (++unmet > ahead) break;
    want.push(id);
    for (const need of Object.keys(TRAITS[id].needs)) if (lv(l.traits, need) < TRAITS[id].needs[need]) want.push(need);
  }
  d.keep = want.find((id) => offers.includes(id)) || null;
  d.press = want.find((id) => lv(l.traits, id) >= 1 && canRaise(l.traits, id)) || null;
  return d;
}

// The step that raises food most this turn. `allow` refuses bodies the road forbids.
function greedy(s, l, offers, allow = allowAll) {
  const now = worth(s, l), d = { keep: null, press: null };
  let best = now * 1.01;
  for (const id of offers) { const t = { ...l.traits, [id]: 1 }; if (!allow(t)) continue; const w = worth(s, l, t); if (w > best) { best = w; d.keep = id; } }
  best = now * 1.005;
  for (const id of Object.keys(l.traits)) {
    const t = { ...l.traits, [id]: l.traits[id] + 1 };
    if (!canRaise(l.traits, id) || !allow(t)) continue;
    const w = worth(s, l, t); if (w > best) { best = w; d.press = id; }
  }
  if (!d.press) {
    best = now * 1.03;
    for (const id of Object.keys(l.traits)) {
      if (!canShed(l.traits, id) || JAWS[id]) continue;   // a bot does not talk itself out of its mouth for one turn's gain
      const t = { ...l.traits, [id]: l.traits[id] - 1 }; if (!t[id]) delete t[id];
      if (!allow(t)) continue;
      const w = worth(s, l, t); if (w > best) { best = w; d.shed = id; }
    }
  }
  return d;
}

// Making for a lineage's body. If it has the wrong mouth, the old one goes first: its
// refinements, then the jaw; then the new mouth is taken when a generation offers it.
function towards(s, l, offers, target, allow) {
  const have = mouthOf(l.traits), want = mouthOf(target);
  // The old mouth is let go only once there are enough to live through the lean turns without one.
  // (Bots that changed mouths on the first turn, twelve strong, starved on the Shore half the time.)
  if (want && have && have !== want && totalPop(l) < 25) return greedy(s, l, offers.filter((id) => !JAWS[id]), allow);
  if (want && have && have !== want) {
    const rest = Object.keys(l.traits).find((id) => TRAITS[id].jaw && canShed(l.traits, id));
    return { keep: null, press: null, shed: rest || (canShed(l.traits, have) ? have : null) };
  }
  if (want && !have) return { keep: offers.includes(want) ? want : null, press: null };
  const d = follow(l, offers, roadTo(target), allow);
  const done = Object.entries(target).every(([id, n]) => lv(l.traits, id) >= n);
  if (!d.press && !d.keep && done) return greedy(s, l, offers, allow);
  if (!d.press) d.press = greedy(s, l, [], allow).press;
  return d;
}

export function decide(s, l, offers, warn) {
  const p = l.plan || POLICIES.none;
  let d = {};
  let allow = allowAll;
  if (p.plan === 'random') {
    const rng = streamFor(s.seed, `${s.era}.${s.turn}.${s.attempt}`, 'drift.' + l.id);
    const mine = Object.keys(l.traits).filter((id) => canRaise(l.traits, id));
    d = { keep: rng.chance(0.5) ? rng.pick(offers) : null, press: rng.pick(mine) || null };
  } else if (p.plan === 'special') {
    // A rival that masters the mouth it has, then grows.
    const jaw = mouthOf(l.traits);
    d = follow(l, offers, [...(jaw ? [[jaw, 3]] : []), ['lungs', 2], ['skin', 1], ['egg', 1], ['size', 2], ['brain', 2], ['size', 3]]);
  } else if (p.plan === 'wide') {
    // The mouth it has to step 2, then an omnivore's teeth, then the same growth as the rival above.
    const jaw = mouthOf(l.traits);
    d = follow(l, offers, [...(jaw ? [[jaw, 2]] : []), ['omni', 1], ['omni', 2], ['lungs', 2], ['omni', 3], ['skin', 1], ['egg', 1], ['size', 2], ['brain', 2]]);
  } else if (p.plan === 'tolerant') d = follow(l, offers, TOLERANT);
  else if (p.plan === 'greedy') d = greedy(s, l, offers);
  else if (p.plan === 'mixed') {
    d = follow(l, offers, TOLERANT.slice(0, 6));
    const g = greedy(s, l, offers);
    if (!d.keep) d.keep = g.keep;
    if (!d.press) { d.press = g.press; d.shed = g.shed; }
  } else if (p.plan === 'recipe') {
    const target = LINEAGES[p.road || 'dinosaur'].traits;
    // On a road: never drop below what the lineage's body needs.
    allow = (t) => Object.entries(target).every(([id, n]) => lv(t, id) >= Math.min(n, lv(l.traits, id)));
    d = towards(s, l, offers, target, allow);
  }
  // What was grown to meet the last die-off and is not on the road is let go once it costs
  // more than it feeds. (The first heeding bots kept warm blood from the Shore's cold for good.)
  let wantRegions = Math.min(MAX_REGIONS, p.regions || 1);
  let ways = p.ways ? [...p.ways] : [];
  const named = p.heed && warn && warn.kinds.length === 1 && warn.sens;
  if (named) {
    const c = follow(l, offers, COUNTER[warn.kinds[0]], allow, 2);
    if (c.keep) d.keep = c.keep;
    if (c.press) { d.press = c.press; delete d.shed; }
    if (!p.fixedRange) wantRegions = MAX_REGIONS;
    if (p.brace) ways = [ways[0], 'fat'].filter(Boolean);   // lay down fat for what is coming
  }
  d.ways = ways;
  d.pick = p.pick ?? 0;
  const mine = held(l), b = body(l.traits, waysOf(s, l)), arrive = Math.max(0, Math.min(1, 0.3 + 0.6 * b.mob));
  const big = Math.max(0, ...mine.map((id) => l.pop[id]));
  // What a region would feed if `n` of the lineage arrived, with everyone already there counted.
  // (The first bots judged a region by its food alone, walked into the rivals' ground and starved.)
  const prospect = (id, n) => capacity(s, { ...l, pop: { [id]: n } })[id] || 0;
  const settlers = big * 0.3 * arrive;
  const open = s.regions.filter((r) => !mine.includes(r.id)).map((r) => ({ id: r.id, k: prospect(r.id, settlers) * (named ? 1.6 - warn.sens[r.id] : 1) })).sort((a, c) => c.k - a.k);
  // Settlers are sent only when enough of them will arrive to last (the first
  // bot sent six, three arrived, and the colony died every turn it tried) and
  // the place can feed more than arrive.
  if (mine.length < wantRegions && open.length && settlers >= 2 * MIN_VIABLE && prospect(open[0].id, settlers) > settlers) d.spread = open[0].id;
  return d;
}


