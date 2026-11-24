// Kill-gate model: numbers only, no screen. One lineage steered by a policy,
// two rival lineages steered by policies through the SAME functions.
// Pure: play(seed, opts) -> end state; no Math.random, no Date.
import { streamFor } from '../../src/engine/rng.js';
import { FOODS, TRAITS, START_TRAITS, START_POP, STEP_TURNS, SHED_TURNS, RANGE_DRAG, MAX_REGIONS, HALF_SAT, MIN_VIABLE, ENDINGS, FORM_FROM_TURN, FOCUS, HARSH, SENS, DIEOFFS, DIEOFF_TURNS, ERAS } from './data.js';
import { decide } from './policies.js';

const clamp01 = (x) => Math.max(0, Math.min(1, x));
const lv = (t, id) => t[id] || 0;

// The one derivation of what a set of traits is worth.
export function body(t, focus = null) {
  const size = lv(t, 'size'), warm = lv(t, 'warm'), skin = lv(t, 'skin'), burrow = lv(t, 'burrow');
  const mob = 0.2 + 0.15 * lv(t, 'limbs') + 0.15 * lv(t, 'gait') + 0.08 * warm - 0.08 * lv(t, 'armour') - 0.03 * size;
  const jaws = FOODS.map((f) => lv(t, 'jaw' + f[0].toUpperCase() + f.slice(1)));
  const jawSum = jaws.reduce((a, b) => a + b, 0);
  const eff = {};
  FOODS.forEach((f, i) => {
    let e = 0.35 + 0.25 * jaws[i] - 0.05 * (jawSum - jaws[i]) + 0.05 * lv(t, 'brain');
    if (f === 'prey') e = e * (0.55 + 0.6 * mob) + 0.08 * size;
    if (f === 'insects') e = e * (0.8 + 0.25 * mob) - 0.08 * size;
    if (f === 'plants') e += 0.05 * size;
    if (focus) e *= f === focus ? FOCUS.on : FOCUS.off;
    eff[f] = Math.max(0.05, e);
  });
  let upkeep = 1;
  for (const id in t) upkeep += TRAITS[id].cost * t[id];
  return {
    dry: clamp01(0.15 + 0.12 * lv(t, 'lungs') + 0.12 * skin + 0.15 * lv(t, 'egg')),
    lo: 0.40 - 0.10 * warm - 0.04 * size - 0.05 * burrow,
    hi: 0.65 + 0.07 * skin - 0.05 * size - 0.04 * warm + 0.04 * burrow,
    mob, eff, upkeep,
    defence: clamp01(0.12 * size + 0.15 * lv(t, 'armour') + 0.25 * mob + 0.10 * burrow * (3 - size) / 3),
  };
}

export function fit(b, r) {
  const wetFit = clamp01(1 - 2.5 * Math.max(0, (1 - b.dry) - r.wet));
  const tempFit = clamp01(1 - 3 * Math.max(0, b.lo - r.temp, r.temp - b.hi));
  return wetFit * tempFit;
}

export const dieoffTurns = (era) => era.dieoffTurns || DIEOFF_TURNS;
export const fits = (t, e) => Object.entries(e.min).every(([id, n]) => lv(t, id) >= n) && Object.entries(e.max).every(([id, n]) => lv(t, id) <= n);
export const formOf = (t) => Object.keys(ENDINGS).find((id) => fits(t, ENDINGS[id])) || null;
export const totalPop = (l) => Object.values(l.pop).reduce((a, b) => a + b, 0);
export const held = (l) => Object.keys(l.pop).filter((id) => l.pop[id] > 0);
export const canRaise = (t, id) => lv(t, id) < 3 && Object.entries(TRAITS[id].needs).every(([n, k]) => lv(t, n) >= k);
export const canShed = (t, id) => lv(t, id) > 0 && !Object.keys(t).some((o) => o !== id && t[o] > 0 && (TRAITS[o].needs[id] || 0) >= t[id]);

// The regions as they stand this turn: template, drift, noise, the wet pulse,
// the recovery after the Great Dying, and the die-off as it ramps.
export function regionsNow(s) {
  const era = ERAS[s.era], rng = streamFor(s.seed, `${s.era}.${s.turn}.${s.attempt}`, 'world');
  const len = dieoffTurns(era), onset = era.turns - len, ramp = s.turn >= onset ? (s.turn - onset + 1) / len : 0;
  const d = DIEOFFS[s.dieoff.type];
  return era.regions.map((r) => {
    let wet = r.wet + era.dWet * s.turn, temp = r.temp + era.dTemp * s.turn, pred = r.pred + (era.predRise || 0) * s.turn;
    const food = {};
    const back = era.recover ? Math.min(1, 0.5 + 0.5 * s.turn / era.recover) : 1;
    const pulse = era.pulse && s.turn >= era.pulse.from && s.turn < era.pulse.to;
    if (pulse) wet += era.pulse.dWet;
    const hit = s.opts.noDieoff ? 0 : Math.min(2.2, ramp * s.dieoff.sens[r.id] * era.mag * (era.gentle ? 1 : (s.opts.harsh ?? HARSH)));
    wet += d.dWet * hit; temp += d.dTemp * hit;
    for (const f of FOODS) {
      let v = r.food[f] * back * rng.float(0.85, 1.15);
      if (pulse && f === 'plants') v *= era.pulse.plants;
      if (d.food[f] != null) v *= Math.max(0.05, 1 - (1 - d.food[f]) * hit);
      food[f] = v;
    }
    return { id: r.id, wet: clamp01(wet), temp: clamp01(temp), pred: clamp01(pred), food };
  });
}

// What the die-off will be, as far as the lineage can tell this turn.
export function warning(s) {
  const era = ERAS[s.era], toOnset = era.turns - dieoffTurns(era) - s.turn, lead = s.opts.lead ?? era.lead ?? 5;
  if (toOnset > lead + 3) return null;
  // Named `lead` turns out, with which regions it will spare; before that, only what it might be.
  return toOnset <= lead ? { toOnset, kinds: [s.dieoff.type], sens: s.dieoff.sens } : { toOnset, kinds: era.dieoffs, sens: null };
}

// Carrying capacity of lineage l in each region it holds, given everyone's claims.
// Everyone's claims on every food are worked out once per phase of a turn
// (s.rev moves whenever traits, numbers or regions change), not once per question.
let memo = { s: null, rev: -1, t: null };
function claims(s) {
  if (memo.s === s && memo.rev === s.rev) return memo.t;
  const t = { total: {}, mine: new Map() };
  for (const r of s.regions) t.total[r.id] = Object.fromEntries(FOODS.map((f) => [f, HALF_SAT]));
  for (const o of s.lineages) {
    const ob = body(o.traits, o.focus), m = {};
    for (const r of s.regions) {
      const p = o.pop[r.id] || 0; if (!(p > 0)) continue;
      const k = p * fit(ob, r); m[r.id] = {};
      for (const f of FOODS) { m[r.id][f] = k * ob.eff[f]; t.total[r.id][f] += m[r.id][f]; }
    }
    t.mine.set(o, m);
  }
  memo = { s, rev: s.rev, t };
  return t;
}

export function capacity(s, l, traits = l.traits, focus = l.focus) {
  const b = body(traits, focus), out = {}, t = claims(s), was = t.mine.get(l) || {};
  for (const r of s.regions) {
    const p = l.pop[r.id] || 0; if (!(p > 0)) continue;
    const k = p * fit(b, r);
    let got = 0;
    for (const f of FOODS) { const c = k * b.eff[f]; got += r.food[f] * c / (t.total[r.id][f] - (was[r.id]?.[f] || 0) + c); }
    out[r.id] = got / b.upkeep;
  }
  return out;
}

function startEra(s) {
  const era = ERAS[s.era], rng = streamFor(s.seed, `${s.era}.${s.attempt}`, 'dieoff');
  s.turn = 0;
  s.dieoff = { type: rng.pick(era.dieoffs), sens: Object.fromEntries(era.regions.map((r) => [r.id, rng.float((s.opts.sens || era.sens || SENS)[0], (s.opts.sens || era.sens || SENS)[1])])) };
  s.lineages = s.lineages.filter((l) => l.player);
  if (s.era === 3) s.faceShadow = s.dieoff.type;
  if (!s.opts.noRivals) era.rivals.forEach((rv, i) => s.lineages.push({ id: 'rival' + i, player: false, plan: { plan: rv.plan, regions: 2 }, traits: { ...rv.traits }, prog: {}, pop: { [rv.home]: 15 }, focus: null, form: null }));
  s.rev = (s.rev || 0) + 1;
  s.regions = regionsNow(s);
}

export function newGame(seed, opts = {}) {
  const s = { seed, opts, era: 0, turn: 0, attempt: 0, clock: 0, ended: false, outcome: null, lineages: [], log: [], eraLog: [] };
  s.lineages.push({ id: 'you', player: true, plan: opts.policy, traits: { ...START_TRAITS }, prog: {}, pop: { shallows: START_POP }, focus: null, form: null });
  startEra(s);
  return s;
}

function offersFor(s, l) {
  const open = Object.keys(TRAITS).filter((id) => lv(l.traits, id) === 0 && canRaise(l.traits, id));
  return streamFor(s.seed, `${s.era}.${s.turn}.${s.attempt}`, 'offer.' + l.id).shuffle(open).slice(0, 3);
}

function apply(s, l, d, offers) {
  if (d.keep && offers.includes(d.keep)) l.traits[d.keep] = 1;
  if (d.focus !== undefined) l.focus = FOODS.includes(d.focus) ? d.focus : null;
  const speed = 1 / (1 + RANGE_DRAG * (Math.max(1, held(l).length) - 1));
  // A dinosaur stays one: it cannot shed below what made it a dinosaur.
  if (d.shed && l.form && lv(l.traits, d.shed) <= (ENDINGS[l.form].min[d.shed] || 0)) d = { ...d, shed: null };
  if (d.shed && canShed(l.traits, d.shed)) {
    const k = 'shed.' + d.shed; l.prog[k] = (l.prog[k] || 0) + speed;
    if (l.prog[k] >= SHED_TURNS) { l.prog[k] = 0; l.traits[d.shed] -= 1; if (!l.traits[d.shed]) delete l.traits[d.shed]; }
  } else if (d.press && lv(l.traits, d.press) >= 1 && canRaise(l.traits, d.press)) {
    l.prog[d.press] = (l.prog[d.press] || 0) + speed;
    if (l.prog[d.press] >= STEP_TURNS[l.traits[d.press] + 1]) { l.prog[d.press] = 0; l.traits[d.press] += 1; }
  }
  const mine = held(l);
  if (d.spread && !(l.pop[d.spread] > 0) && mine.length && mine.length < MAX_REGIONS && s.regions.some((r) => r.id === d.spread)) {
    const from = mine.reduce((a, b) => (l.pop[a] >= l.pop[b] ? a : b)), moved = l.pop[from] * 0.3;
    l.pop[from] -= moved;
    l.pop[d.spread] = moved * clamp01(0.3 + 0.6 * body(l.traits).mob);   // some of the settlers arrive
  }
}

function feed(s) {
  const caps = s.lineages.map((l) => capacity(s, l));
  s.lineages.forEach((l, i) => {
    const b = body(l.traits);
    for (const r of s.regions) {
      const p = l.pop[r.id] || 0; if (!(p > 0)) continue;
      const k = caps[i][r.id];
      let n = k > p ? Math.min(p + 0.5 * (k - p), p * 1.6 + 1) : p + 0.6 * (k - p);
      n *= 1 - 0.3 * r.pred * (1 - b.defence);
      if (n < MIN_VIABLE) delete l.pop[r.id]; else l.pop[r.id] = n;
    }
  });
}

export function step(s) {
  const you = s.lineages.find((l) => l.player);
  const turns = s.lineages.map((l) => { const offers = offersFor(s, l); return [l, decide(s, l, offers, warning(s)), offers]; });
  for (const [l, d, offers] of turns) apply(s, l, d, offers);
  s.rev += 1;
  feed(s);
  s.rev += 1;
  s.lineages = s.lineages.filter((l) => l.player || totalPop(l) >= 1);
  const shape = formOf(you.traits);
  if (s.bodyAt == null && shape) s.bodyAt = s.clock;
  if (s.era === 4 && s.turn >= FORM_FROM_TURN && !you.form && shape) { you.form = shape; s.form = shape; s.formAt = s.turn; }
  const era = ERAS[s.era], pop = totalPop(you), inDieoff = s.turn >= era.turns - dieoffTurns(era);
  s.log.push({ era: s.era, turn: s.turn, pop, regions: held(you).length, upkeep: body(you.traits).upkeep });
  s.clock += 1; s.turn += 1;
  if (pop < 1) return end(s, 'extinct', inDieoff ? 'dieoff' : 'starved');
  if (s.turn < era.turns) { s.regions = regionsNow(s); s.rev += 1; return s; }
  s.eraLog.push({ era: s.era, pop, traits: { ...you.traits } });
  if (s.era === ERAS.length - 1) return end(s, you.form ? 'win' : 'survived', null);
  // The survivors walk into the next world and settle where they fit best.
  s.era += 1; s.attempt = 0; startEra(s);
  const b = body(you.traits);
  const best = s.regions.map((r) => [r.id, fit(b, r) * FOODS.reduce((a, f) => a + r.food[f] * b.eff[f], 0)]).sort((a, c) => c[1] - a[1])[0];
  you.pop = best[1] > 1 ? { [best[0]]: pop * 0.7 } : {};
  if (totalPop(you) < 1) return end(s, 'extinct', 'unfit');
  return s;
}

function end(s, outcome, cause) { s.ended = true; s.outcome = outcome; s.cause = cause; s.diedIn = outcome === 'extinct' ? s.era : null; return s; }

export function play(seed, opts = {}) {
  const s = newGame(seed, opts);
  for (let guard = 0; !s.ended && guard < 1000; guard++) step(s);
  return s;
}

// Easy setting: a save at the start of every era. A loss goes back to that save
// and the era is rolled again (new attempt, new die-off). Returns the end state
// with s.retries per era. The bot does not learn between tries, so this measures
// luck only; a person would also change their play.
export function playSaved(seed, opts = {}, maxRetries = 5) {
  // A replayed era rolls a new die-off (the author, 2026-11-24: a replay is not a memory test).
  let s = newGame(seed, opts), save = structuredClone(s);
  const retries = [0, 0, 0, 0, 0];
  for (let guard = 0; guard < 5000; guard++) {
    const era = s.era;
    step(s);
    if (s.ended && s.outcome === 'extinct') {
      const at = save.era;
      if (retries[at] >= maxRetries) break;
      retries[at] += 1;
      s = structuredClone(save); s.attempt = retries[at]; s.ended = false;
      const you = s.lineages.find((l) => l.player), pop = { ...you.pop };
      startEra(s); you.pop = pop; s.rev += 1;
      continue;
    }
    if (s.ended) break;
    if (s.era !== era) save = structuredClone(s);
  }
  s.retries = retries;
  return s;
}
