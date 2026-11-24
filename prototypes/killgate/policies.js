// Fixed policies. A policy is three parts, each of which must change the end
// state (check.js proves it): a plan for the body, how many regions to hold,
// and whether to heed the die-off warning.
import { FOODS, TRAITS, MAX_REGIONS, MIN_VIABLE, DINOSAUR } from './data.js';
import { body, fit, capacity, held, totalPop, canRaise, canShed } from './model.js';
import { streamFor } from '../../src/engine/rng.js';

export const POLICIES = {
  none:        { plan: 'none', regions: 1 },
  drifter:     { plan: 'random', regions: 2 },
  specialist:  { plan: 'special', regions: 1 },
  generalist:  { plan: 'tolerant', regions: 3 },
  opportunist: { plan: 'greedy', regions: 2 },
  recipe:      { plan: 'recipe', regions: 1 },
  planner:     { plan: 'recipe', regions: 2, heed: true },
};

const lv = (t, id) => t[id] || 0;
const jawOf = (f) => 'jaw' + f[0].toUpperCase() + f.slice(1);
const TOLERANT = [['lungs', 2], ['skin', 1], ['egg', 1], ['limbs', 2], ['skin', 2], ['egg', 2], ['burrow', 1], ['brain', 1], ['lungs', 3], ['skin', 3], ['egg', 3], ['brain', 2], ['burrow', 2]];
const RECIPE = [['lungs', 2], ['skin', 1], ['egg', 1], ['limbs', 2], ['limbs', 3], ['gait', 1], ['skin', 2], ['egg', 2], ['gait', 2], ['warm', 1], ['egg', 3], ['gait', 3], ['warm', 2]];
const COUNTER = {
  cold: [['warm', 1], ['burrow', 2], ['size', 1]], drought: [['lungs', 2], ['skin', 2], ['egg', 2], ['skin', 3]],
  heat: [['lungs', 2], ['skin', 2], ['burrow', 2], ['skin', 3]], collapse: [['jawInsects', 2], ['brain', 1], ['jawFish', 1]],
  greatHot: [['lungs', 2], ['skin', 2], ['egg', 2], ['burrow', 2], ['skin', 3], ['jawInsects', 1]],
  greatDry: [['lungs', 2], ['skin', 2], ['egg', 2], ['skin', 3], ['egg', 3], ['jawInsects', 1]],
};

const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
const worth = (s, l, traits) => sum(capacity(s, l, traits));

// Walk an ordered list of (trait, level) targets: take the hint when it is
// offered, press the first target that can be pressed, fetch what it rests on.
function follow(l, offers, targets) {
  const d = {}, want = [];
  for (const [id, n] of targets) {
    if (lv(l.traits, id) >= n) continue;
    want.push(id);
    for (const need of Object.keys(TRAITS[id].needs)) if (lv(l.traits, need) < TRAITS[id].needs[need]) want.push(need);
  }
  d.keep = want.find((id) => offers.includes(id)) || null;
  d.press = want.find((id) => lv(l.traits, id) >= 1 && canRaise(l.traits, id)) || null;
  return d;
}

function greedy(s, l, offers) {
  const now = worth(s, l), d = { keep: null, press: null };
  let best = now * 1.01;
  for (const id of offers) { const w = worth(s, l, { ...l.traits, [id]: 1 }); if (w > best) { best = w; d.keep = id; } }
  best = now * 1.005;
  for (const id of Object.keys(l.traits)) {
    if (!canRaise(l.traits, id)) continue;
    const w = worth(s, l, { ...l.traits, [id]: l.traits[id] + 1 }); if (w > best) { best = w; d.press = id; }
  }
  if (!d.press) {
    best = now * 1.03;
    for (const id of Object.keys(l.traits)) {
      if (!canShed(l.traits, id)) continue;
      const t = { ...l.traits, [id]: l.traits[id] - 1 }; if (!t[id]) delete t[id];
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
  const jaw = jawOf(food);
  return { ...follow(l, offers, [[jaw, 3], ['lungs', 2], ['skin', 1], ['egg', 1], ['size', 2], ['brain', 2], ['size', 3]]), food };
}

export function decide(s, l, offers, warn) {
  const p = l.plan || POLICIES.none;
  let d = {};
  if (p.plan === 'random') {
    const rng = streamFor(s.seed, `${s.era}.${s.turn}.${s.attempt}`, 'drift.' + l.id);
    const mine = Object.keys(l.traits).filter((id) => canRaise(l.traits, id));
    d = { keep: rng.chance(0.5) ? rng.pick(offers) : null, press: rng.pick(mine) || null };
  } else if (p.plan === 'special') { d = special(s, l, offers); if (d.food) l.food = d.food; delete d.food; }
  else if (p.plan === 'tolerant') d = follow(l, offers, TOLERANT);
  else if (p.plan === 'greedy') d = greedy(s, l, offers);
  else if (p.plan === 'recipe') {
    d = follow(l, offers, RECIPE);
    if (!d.press && !d.keep && Object.entries(DINOSAUR).every(([id, n]) => lv(l.traits, id) >= n)) d = greedy(s, l, offers);
    else if (!d.press) d.press = greedy(s, l, []).press;
  }
  let wantRegions = Math.min(MAX_REGIONS, p.regions || 1);
  if (p.heed && warn && warn.kinds.length === 1 && warn.toOnset > -1) {
    const c = follow(l, offers, COUNTER[warn.kinds[0]]);
    if (c.keep) d.keep = c.keep;
    if (c.press) { d.press = c.press; delete d.shed; }
    wantRegions = MAX_REGIONS;
  }
  const mine = held(l);
  // Settlers are sent only when enough of them will arrive to last (the first
  // bot sent six, three arrived, and the colony died every turn it tried).
  const b = body(l.traits), big = Math.max(0, ...mine.map((id) => l.pop[id]));
  if (mine.length < wantRegions && big * 0.3 * Math.max(0, Math.min(1, 0.3 + 0.6 * b.mob)) >= 2 * MIN_VIABLE) {
    const open = s.regions.filter((r) => !mine.includes(r.id)).map((r) => [r.id, fit(b, r), fit(b, r) * FOODS.reduce((a, f) => a + r.food[f] * b.eff[f], 0)]).filter((x) => x[1] > 0.2).sort((a, c) => c[2] - a[2]);
    if (open.length) d.spread = open[0][0];
  }
  return d;
}
