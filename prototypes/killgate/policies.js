// Fixed policies. A policy is parts, each of which must change the end state
// (check.js proves it): a plan for the body, the road it is walking, how many
// regions to hold, whether it chooses what to eat, and whether it heeds the
// die-off warning.
import { FOODS, TRAITS, MAX_REGIONS, MIN_VIABLE, ENDINGS } from './data.js';
import { body, fits, capacity, held, canRaise, canShed } from './model.js';
import { streamFor } from '../../src/engine/rng.js';

const lv = (t, id) => t[id] || 0;
const jawOf = (f) => 'jaw' + f[0].toUpperCase() + f.slice(1);
const TOLERANT = [['lungs', 2], ['skin', 1], ['egg', 1], ['limbs', 2], ['skin', 2], ['egg', 2], ['burrow', 1], ['brain', 1], ['lungs', 3], ['skin', 3], ['egg', 3], ['brain', 2], ['burrow', 2]];
// One build order per ending. A ".list" policy follows it and reads nothing else.
export const ROADS = {
  dinosaur:  [['lungs', 2], ['skin', 1], ['egg', 1], ['limbs', 2], ['limbs', 3], ['gait', 1], ['skin', 2], ['egg', 2], ['gait', 2], ['warm', 1], ['egg', 3], ['gait', 3], ['warm', 2], ['warm', 3]],
  crocodile: [['lungs', 2], ['jawPrey', 1], ['jawPrey', 2], ['skin', 1], ['egg', 1], ['limbs', 2], ['skin', 2], ['egg', 2], ['jawPrey', 3], ['skin', 3], ['size', 1], ['armour', 1], ['size', 2]],
  mammal:    [['lungs', 2], ['skin', 1], ['egg', 1], ['limbs', 2], ['jawInsects', 1], ['burrow', 1], ['jawInsects', 2], ['warm', 1], ['burrow', 2], ['brain', 1], ['brain', 2], ['warm', 2], ['warm', 3]],
  amphibian: [['lungs', 2], ['jawFish', 2], ['lungs', 3], ['jawFish', 3], ['size', 1], ['size', 2], ['limbs', 2], ['brain', 1]],
};
const COUNTER = {
  cold: [['warm', 1], ['burrow', 2], ['size', 1]], drought: [['lungs', 2], ['skin', 2], ['egg', 2], ['skin', 3]],
  heat: [['lungs', 2], ['skin', 2], ['burrow', 2], ['skin', 3]], collapse: [['jawInsects', 2], ['brain', 1], ['jawFish', 1]],
  greatHot: [['lungs', 2], ['skin', 2], ['egg', 2], ['burrow', 2], ['skin', 3], ['jawInsects', 1]],
  greatDry: [['lungs', 2], ['skin', 2], ['egg', 2], ['skin', 3], ['egg', 3], ['jawInsects', 1]],
  greatCold: [['warm', 1], ['burrow', 1], ['burrow', 2], ['warm', 2], ['size', 1]],
  greatWaste: [['jawFish', 1], ['jawFish', 2], ['brain', 1], ['jawInsects', 2]],
};

export const POLICIES = {
  none:        { plan: 'none', regions: 1 },
  drifter:     { plan: 'random', regions: 2 },
  specialist:  { plan: 'special', regions: 1 },
  generalist:  { plan: 'tolerant', regions: 3 },
  opportunist: { plan: 'greedy', regions: 2, diet: true },
};
for (const road of Object.keys(ROADS)) {
  POLICIES[road + '.list'] = { plan: 'recipe', road, regions: 1 };
  POLICIES[road + '.plan'] = { plan: 'recipe', road, regions: 2, diet: true, heed: true };
}

const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
const worth = (s, l, traits, focus) => sum(capacity(s, l, traits, focus));
const allowAll = () => true;

// Walk an ordered list of (trait, level) targets: take the hint when it is
// offered, press the first target that can be pressed, fetch what it rests on.
// Only the next `ahead` unmet targets are worked on: the first bot took every
// hint on its list the turn it was offered, carried armour and size on the
// Shore, and starved there in 99 runs of 100.
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
      if (!canShed(l.traits, id)) continue;
      const t = { ...l.traits, [id]: l.traits[id] - 1 }; if (!t[id]) delete t[id];
      if (!allow(t)) continue;
      const w = worth(s, l, t); if (w > best) { best = w; d.shed = id; }
    }
  }
  return d;
}

function special(s, l, offers) {
  // The richest food where the lineage lives; its jaw, then size, then brain.
  const home = held(l)[0], r = s.regions.find((x) => x.id === home);
  if (!r) return {};
  const food = l.food && lv(l.traits, jawOf(l.food)) >= 1 ? l.food : FOODS.reduce((a, f) => (r.food[f] > r.food[a] ? f : a));
  return { ...follow(l, offers, [[jawOf(food), 3], ['lungs', 2], ['skin', 1], ['egg', 1], ['size', 2], ['brain', 2], ['size', 3]]), food };
}

export function decide(s, l, offers, warn) {
  const p = l.plan || POLICIES.none;
  let d = {};
  if (p.plan === 'random') {
    const rng = streamFor(s.seed, `${s.era}.${s.turn}.${s.attempt}`, 'drift.' + l.id);
    const mine = Object.keys(l.traits).filter((id) => canRaise(l.traits, id));
    d = { keep: rng.chance(0.5) ? rng.pick(offers) : null, press: rng.pick(mine) || null };
  } else if (p.plan === 'special') { d = special(s, l, offers); if (d.food) { l.food = d.food; d.focus = d.food; } delete d.food; }
  else if (p.plan === 'tolerant') d = follow(l, offers, TOLERANT);
  else if (p.plan === 'greedy') d = greedy(s, l, offers);
  // On a road: never take a step the ending forbids, and never drop below what it needs.
  const end = p.plan === 'recipe' ? ENDINGS[p.road || 'dinosaur'] : null;
  const allow = end ? (t) => Object.entries(end.max).every(([id, n]) => lv(t, id) <= n) && Object.entries(end.min).every(([id, n]) => lv(t, id) >= Math.min(n, lv(l.traits, id))) : allowAll;
  if (end) {
    d = follow(l, offers, ROADS[p.road || 'dinosaur'], allow);
    if (!d.press && !d.keep && fits(l.traits, end)) d = greedy(s, l, offers, allow);
    else if (!d.press) d.press = greedy(s, l, [], allow).press;
  }
  let wantRegions = Math.min(MAX_REGIONS, p.regions || 1);
  const named = p.heed && warn && warn.kinds.length === 1 && warn.sens;
  // A second try at an era (the saved setting) is played for survival first: range at once,
  // tolerance before the road. A person who has just lost an era does not play it the same way.
  if (p.heed && s.attempt > 0 && !named) {
    const c = follow(l, offers, TOLERANT, allow, 2);
    if (c.keep) d.keep = c.keep;
    if (c.press) { d.press = c.press; delete d.shed; }
    wantRegions = MAX_REGIONS;
  }
  if (named) {
    const c = follow(l, offers, COUNTER[warn.kinds[0]], allow, 2);
    if (c.keep) d.keep = c.keep;
    if (c.press) { d.press = c.press; delete d.shed; }
    if (!p.fixedRange) wantRegions = MAX_REGIONS;
  }
  // What to eat is chosen every turn and costs nothing to change.
  if (p.diet) d.focus = [null, ...FOODS].map((f) => [f, worth(s, l, l.traits, f)]).sort((a, c) => c[1] - a[1])[0][0];
  const mine = held(l), b = body(l.traits), arrive = Math.max(0, Math.min(1, 0.3 + 0.6 * b.mob));
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
