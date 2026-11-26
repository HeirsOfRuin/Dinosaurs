// The rules of the world. One lineage steered by the player (or, in the
// measurement tools, by a policy) and two rival lineages steered by policies
// through the SAME functions. Pure: no DOM, no Math.random, no Date.
//
// The gate (sim/gate.js) measures these functions and the game runs on them:
// there is one model. Rewritten on 2026-11-25 after the author's first run
// (docs/FRAME-standing.md): one mouth, ways of living, moments, and standing
// in place of four fixed winning bodies.
import { streamFor } from './rng.js';
import { BASE_FOODS, FOODS, JAWS, TRAITS, START_TRAITS, START_POP, STEP_TURNS, SHED_TURNS, MOUTH_TURNS, COVERS, COVER_TURNS, BARS, WATCH_TURNS, RANGE_DRAG, MAX_REGIONS, HALF_SAT, MIN_VIABLE, WAYS, MAX_WAYS, WAY_SETTLE, MOMENT_EVERY, MOMENT_AT, MOMENTS, PANEL, STANDING, LINEAGES, HARSH, SENS, FOOD_FLOOR, LEAST, STARVE, DIEOFFS, DIEOFF_TURNS, ERAS } from '../data/world.data.js';

const clamp01 = (x) => Math.max(0, Math.min(1, x));
const lv = (t, id) => t[id] || 0;

/** The one jaw a set of traits holds, or null. */
export const mouthOf = (t) => Object.keys(JAWS).find((id) => lv(t, id) > 0) || null;
/** The one covering a set of traits holds, or null for bare skin. */
export const coverOf = (t) => COVERS.find((id) => lv(t, id) > 0) || null;

// The one derivation of what a body is worth: its traits, and the ways it lives.
export function body(t, ways = []) {
  const size = lv(t, 'size'), warm = lv(t, 'warm'), skin = lv(t, 'skin'), burrow = lv(t, 'burrow'), herd = lv(t, 'herd'), omni = lv(t, 'omni');
  const night = ways.includes('night'), tend = ways.includes('tend'), roam = ways.includes('roam'), fat = ways.includes('fat');
  const scales = lv(t, 'scales'), fur = lv(t, 'fur'), feathers = lv(t, 'feathers'), sail = lv(t, 'sail');
  const mob = 0.2 + 0.15 * lv(t, 'limbs') + 0.15 * lv(t, 'gait') + 0.08 * warm + 0.03 * feathers - 0.08 * lv(t, 'armour') - 0.03 * size;
  const mouth = mouthOf(t), own = mouth ? JAWS[mouth] : null;
  const eff = {};
  for (const f of BASE_FOODS) {
    let e = 0.35 + (f === own ? 0.25 * lv(t, mouth) - 0.08 * omni : 0.06 * omni) + 0.05 * lv(t, 'brain');
    if (f === 'prey') e = e * (0.55 + 0.6 * mob) + 0.08 * size + 0.04 * herd;
    if (f === 'insects') e = e * (0.8 + 0.25 * mob) - 0.08 * size;
    if (f === 'plants') e += 0.05 * size;
    eff[f] = Math.max(0.05, e);
  }
  eff.carrion = 0.22 * lv(t, 'scavenge');                 // nothing, without the stomach for it
  eff.hard = lv(t, 'crush') ? 0.2 * lv(t, 'crush') + 0.03 * size : 0;
  if (night) for (const f of FOODS) eff[f] *= 0.9;        // finds less in the dark
  let upkeep = 1 + (tend ? 0.06 : 0) + (roam ? 0.07 : 0);   // young to feed; miles to walk
  for (const id in t) upkeep += TRAITS[id].cost * t[id];
  upkeep += 0.015 * fur * size;                            // a coat costs more the more animal there is to cover
  return {
    dry: clamp01(0.15 + 0.12 * lv(t, 'lungs') + 0.12 * skin + 0.15 * lv(t, 'egg') + 0.06 * burrow + 0.04 * scales),   // a burrow is damp; scales keep water in
    // Cold: a warm metabolism under a coat. Fur holds heat best, feathers nearly; a sail soaks up the morning sun.
    lo: 0.40 - 0.06 * warm - 0.08 * fur - 0.06 * feathers - 0.03 * sail - 0.04 * size - 0.05 * burrow,
    // Heat: watertight skin, scales over it, a sail to shed it. A coat is worn in the heat too.
    hi: 0.65 + 0.06 * skin + 0.05 * scales + 0.05 * sail - 0.02 * fur - 0.01 * feathers - 0.05 * size - 0.04 * warm + 0.04 * burrow + (night ? 0.10 : 0),
    mob, eff, upkeep, mouth,
    defence: clamp01(0.12 * size + 0.15 * lv(t, 'armour') + 0.25 * mob + 0.10 * burrow * (3 - size) / 3 + 0.08 * herd + (night ? 0.2 : 0)),
    grow: (tend ? 0.68 : 0.5) * (fat ? 0.75 : 1),          // how fast numbers rise toward what the ground feeds
    // A heavy animal starves more slowly than a slight one; so does a slow one in armour, and one that has laid down fat.
    starve: (fat ? STARVE.fat : STARVE.plain) * (1 - STARVE.size * size - STARVE.armour * lv(t, 'armour') - STARVE.burrow * burrow * (3 - size) / 3),   // and a small one gone to ground                            // how fast they fall toward it
    ease: roam ? 0.55 : 1,                                 // how much of bad ground's harm is felt
    drag: 1,                                 // a lineage on the move changes more slowly
  };
}

export function fit(b, r) {
  const wetFit = clamp01(1 - 2.5 * Math.max(0, (1 - b.dry) - r.wet));
  const tempFit = clamp01(1 - 3 * Math.max(0, b.lo - r.temp, r.temp - b.hi));
  return 1 - (1 - wetFit * tempFit) * b.ease;
}

export const dieoffTurns = (era) => era.dieoffTurns || DIEOFF_TURNS;
export const totalPop = (l) => Object.values(l.pop).reduce((a, b) => a + b, 0);
export const held = (l) => Object.keys(l.pop).filter((id) => l.pop[id] > 0);
/** The ways of living that have taken hold. A new one does nothing for WAY_SETTLE turns. */
export const waysOf = (s, l) => Object.keys(l.ways || {}).filter((id) => s.clock - l.ways[id] >= WAY_SETTLE).sort();

/**
 * What closes a trait's next step off, or null: another covering, or the other half of a pair in
 * BARS. (The author, 2026-11-26: "add more traits and close some off if some are taken".)
 */
export function closedBy(t, id) {
  const T = TRAITS[id], next = lv(t, id) + 1;
  if (T.cover) { const c = coverOf(t); if (c && c !== id) return c; }
  for (const [[a, na], [b, nb]] of BARS) {
    if (a === id && next >= na && lv(t, b) >= nb && !(lv(t, a) >= na)) return b;
    if (b === id && next >= nb && lv(t, a) >= na && !(lv(t, b) >= nb)) return a;
  }
  return null;
}

export function canRaise(t, id) {
  const T = TRAITS[id], mouth = mouthOf(t);
  if (lv(t, id) >= 3 || !Object.entries(T.needs).every(([n, k]) => lv(t, n) >= k)) return false;
  if (T.under && !T.under.some((o) => lv(t, o) > 0)) return false;           // warm blood needs a coat over it
  if (closedBy(t, id)) return false;
  if (JAWS[id] && mouth && mouth !== id) return false;                       // one mouth
  if (T.jaw && (!mouth || lv(t, mouth) < T.jaw || (T.mouths && !T.mouths.includes(mouth)))) return false;
  return true;
}
/** What a turn to `to` would replace: the mouth, or the covering. */
export const turnsFrom = (t, to) => (JAWS[to] ? mouthOf(t) : TRAITS[to]?.cover ? coverOf(t) : null);
/** A mouth can be turned to any other food, and a covering to any other that nothing closes off. Neither is lost on the way. */
export function canTurn(t, to) {
  const from = turnsFrom(t, to);
  if (!from || from === to) return false;
  if (JAWS[to]) return true;
  const bare = { ...t }; delete bare[from];
  return !closedBy(bare, to);
}
export const turnTime = (to) => (JAWS[to] ? MOUTH_TURNS : COVER_TURNS);
/** What a turn to `to` could not keep: a mouth's refinements, or warm blood when the coat goes. */
export const lostOnTurn = (t, to) => Object.keys(t).filter((o) => t[o] > 0 && (JAWS[to] ? TRAITS[o].mouths && !TRAITS[o].mouths.includes(to) : TRAITS[o].under && !TRAITS[o].under.includes(to)));

export function canShed(t, id) {
  if (!lv(t, id)) return false;
  if (JAWS[id]) return false;   // a mouth is turned to another food, not let go
  if (Object.keys(t).some((o) => o !== id && t[o] > 0 && (TRAITS[o].needs[id] || 0) >= t[id])) return false;
  if (t[id] === 1 && Object.keys(t).some((o) => t[o] > 0 && TRAITS[o].under && TRAITS[o].under.includes(id))) return false;   // the coat under warm blood
  return true;
}

// The two foods a region yields besides what it grows. The dead are more where hunters are many,
// more again as a die-off begins, and few once it has run its course: there is nothing left to
// die. (At first the dead only rose with a die-off, and a scavenger slept through the Great
// Dying on 130 of carrion a region.) Hard food is a share of what grows.
function yields(food, pred, hit) {
  food.carrion = (5 + 30 * pred) * Math.max(0.2, 1 + 0.5 * hit - 0.65 * hit * hit);
  food.hard = 0.12 * (food.plants + food.fish + food.prey);
  return food;
}

// The regions as they stand this turn: template, drift, noise, the wet pulse,
// the recovery after the Great Dying, what a moment left behind, and the die-off as it ramps.
export function regionsNow(s) {
  const era = ERAS[s.era], rng = streamFor(s.seed, `${s.era}.${s.turn}.${s.attempt}`, 'world');
  const len = dieoffTurns(era), onset = era.turns - len, ramp = s.turn >= onset ? (s.turn - onset + 1) / len : 0;
  const d = DIEOFFS[s.dieoff.type];
  const mods = (s.mods || []).filter((m) => m.until > s.clock);
  return era.regions.map((r) => {
    let wet = r.wet + era.dWet * s.turn, temp = r.temp + era.dTemp * s.turn, pred = r.pred + (era.predRise || 0) * s.turn;
    const food = {};
    const back = era.recover ? Math.min(1, 0.5 + 0.5 * s.turn / era.recover) : 1;
    const pulse = era.pulse && s.turn >= era.pulse.from && s.turn < era.pulse.to;
    if (pulse) wet += era.pulse.dWet;
    const hit = s.opts.noDieoff ? 0 : Math.min(2.2, ramp * s.dieoff.sens[r.id] * era.mag * (era.gentle ? 1 : (s.opts.harsh ?? HARSH)));
    wet += d.dWet * hit; temp += d.dTemp * hit;
    for (const m of mods) if (m.pred) pred += m.pred;
    for (const f of BASE_FOODS) {
      let v = r.food[f] * back * rng.float(0.85, 1.15);
      if (pulse && f === 'plants') v *= era.pulse.plants;
      if (d.food[f] != null) v *= Math.max(s.opts.floor ?? FOOD_FLOOR, 1 - (1 - d.food[f]) * hit);
      food[f] = v;
    }
    yields(food, clamp01(pred), hit);
    for (const m of mods) if (m.food) for (const f of FOODS) if (m.food === 'all' || m.food === f) food[f] *= m.m;
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
    const ob = body(o.traits, waysOf(s, o)), m = {};
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

export function capacity(s, l, traits = l.traits, ways = waysOf(s, l)) {
  const b = body(traits, ways), out = {}, t = claims(s), was = t.mine.get(l) || {};
  for (const r of s.regions) {
    const p = l.pop[r.id] || 0; if (!(p > 0)) continue;
    const k = p * fit(b, r);
    let got = 0;
    for (const f of FOODS) { const c = k * b.eff[f]; if (c > 0) got += r.food[f] * c / (t.total[r.id][f] - (was[r.id]?.[f] || 0) + c); }
    out[r.id] = got / b.upkeep;
  }
  return out;
}

// ---- what the die-off would leave ------------------------------------------------

/**
 * A projection, not a promise: the lineage's numbers at the end of this era's die-off if it kept
 * the body and the ways given and nothing else changed. It walks the remaining turns with the
 * regions as the die-off will make them and the turn's own feeding rule; the rivals are held as
 * they are now. Changes no state. The author's second run ended in a Great Dying he had been
 * warned of eight turns out, 18,000 strong, having been told nothing of what would help.
 */
export function forecast(s, l, traits = l.traits, ways = waysOf(s, l)) {
  const era = ERAS[s.era], b = body(traits, ways), rivals = s.lineages.filter((o) => o !== l);
  let pop = { ...l.pop }, worst = Infinity;
  for (let t = s.turn; t < era.turns; t++) {
    const me = { ...l, traits, pop };
    const at = { ...s, turn: t, lineages: [me, ...rivals], rev: -1 - t };
    at.regions = regionsNow(at);
    const caps = capacity(at, me, traits, ways), next = {};
    let fed = 0;
    for (const r of at.regions) {
      const p = pop[r.id] || 0; if (!(p > 0)) continue;
      const k = caps[r.id] || 0; fed += k;
      let n = k > p ? Math.min(p + b.grow * (k - p), p * 1.6 + 1) : p + b.starve * (k - p);
      n *= 1 - 0.3 * r.pred * (1 - b.defence);
      if (n >= MIN_VIABLE) next[r.id] = n;
    }
    worst = Math.min(worst, fed);
    pop = next;
  }
  return { left: Object.values(pop).reduce((a, x) => a + x, 0), worst: worst === Infinity ? 0 : worst };
}

// ---- standing -----------------------------------------------------------------

/** How many of a body one ground would feed with nobody else on it: the food rule, run to rest. */
function alone(b, r) {
  const f0 = yields({ ...r.food }, r.pred, 0), k = fit(b, r);
  let p = 40;
  for (let i = 0; i < 16; i++) {
    let got = 0;
    for (const f of FOODS) { const c = p * k * b.eff[f]; if (c > 0) got += f0[f] * c / (HALF_SAT + c); }
    p = (got / b.upkeep) * (1 - 0.3 * r.pred * (1 - b.defence)) * (0.75 + 0.25 * b.grow / 0.5);   // what is fed, less what is caught, by how fast it breeds back
  }
  return p;
}

/** Standing, in its three parts. One function scores the player and every lineage on the ladder. */
export function standing({ traits, ways = [], numbers, ground }) {
  const b = body(traits, ways);
  // Counted by weight, not by head: a ground that feeds forty heavy animals is held more firmly than one that feeds forty slight ones.
  const prospects = PANEL.reduce((a, r) => a + alone(b, r), 0) * (1 + STANDING.weight * lv(traits, 'size'));
  const secure = 0.5 + 0.5 * Math.sqrt(Math.min(1, numbers / STANDING.fullAt));
  const spread = STANDING.grounds[Math.max(1, Math.min(3, ground)) - 1];
  return { prospects, secure, spread, score: Math.round(prospects * secure * spread) };
}

/** The lineage a body is nearest to, by steps of difference; a different mouth counts three. */
export function resembles(traits) {
  let best = null, gap = Infinity;
  for (const [id, L] of Object.entries(LINEAGES)) {
    let d = mouthOf(traits) === mouthOf(L.traits) ? 0 : 3;
    for (const k of new Set([...Object.keys(traits), ...Object.keys(L.traits)])) if (!JAWS[k]) d += Math.abs(lv(traits, k) - lv(L.traits, k));
    if (d < gap) { gap = d; best = id; }
  }
  return best;
}

/** The ladder: every lineage in the table and the player's, best first. */
export function ladder(s) {
  const you = s.lineages.find((l) => l.player);
  const rows = Object.entries(LINEAGES).map(([id, L]) => ({ id, you: false, ...standing(L) }));
  rows.push({ id: 'you', you: true, ...standing({ traits: you.traits, ways: waysOf(s, you), numbers: totalPop(you), ground: held(you).length }) });
  return rows.sort((a, b) => b.score - a.score || (a.you ? 1 : -1));
}

// ---- moments ------------------------------------------------------------------

function momentHolds(s, you, when) {
  if (when === 'rivalNear') return s.lineages.some((l) => !l.player && held(you).some((id) => l.pop[id] > 0));
  if (when === 'canSettle') return held(you).length < MAX_REGIONS;
  if (when === 'crowded') return totalPop(you) > 60;
  return true;
}

/** The moment that falls this turn, or null. Each comes once in a run; a dry deck leaves the turn plain. */
export function momentDue(s) {
  const era = ERAS[s.era];
  if (s.opts.noMoments || s.turn % MOMENT_EVERY !== MOMENT_AT || s.turn >= era.turns - dieoffTurns(era)) return null;
  const you = s.lineages.find((l) => l.player);
  const order = streamFor(s.seed, 'run', 'moments').shuffle(Object.keys(MOMENTS));
  return order.find((id) => !(s.seen || []).includes(id) && momentHolds(s, you, MOMENTS[id].when)) || null;
}

function bestOpen(s, l) {
  const b = body(l.traits, waysOf(s, l));
  return s.regions.filter((r) => !(l.pop[r.id] > 0)).map((r) => [r.id, fit(b, r) * FOODS.reduce((a, f) => a + r.food[f] * b.eff[f], 0)]).sort((a, c) => c[1] - a[1])[0];
}

function meet(s, you, id, pick, press) {
  const ops = MOMENTS[id].options[pick] || MOMENTS[id].options[0];
  for (const [op, a, b, c] of ops) {
    if (op === 'pop') for (const r of held(you)) you.pop[r] *= a;
    else if (op === 'rivals') for (const l of s.lineages) if (!l.player) for (const r of held(you)) if (l.pop[r] > 0) l.pop[r] *= a;
    else if (op === 'step') { if (press && lv(you.traits, press) >= 1 && canRaise(you.traits, press)) you.prog[press] = (you.prog[press] || 0) + a; }
    else if (op === 'settle') { const to = held(you).length < MAX_REGIONS ? bestOpen(s, you) : null; if (to && to[1] > 1) you.pop[to[0]] = a; }
    else if (op === 'food') (s.mods = s.mods || []).push({ food: a, m: b, until: s.clock + c });
    else if (op === 'pred') (s.mods = s.mods || []).push({ pred: a, until: s.clock + b });
  }
  (s.seen = s.seen || []).push(id);
  s.lastMoment = { id, pick, at: s.clock };
}

// ---- a turn -------------------------------------------------------------------

export function startEra(s) {
  const era = ERAS[s.era], rng = streamFor(s.seed, `${s.era}.${s.attempt}`, 'dieoff');
  s.turn = 0;
  s.dieoff = { type: rng.pick(era.dieoffs), sens: Object.fromEntries(era.regions.map((r) => [r.id, rng.float((s.opts.sens || era.sens || SENS)[0], (s.opts.sens || era.sens || SENS)[1])])) };
  s.lineages = s.lineages.filter((l) => l.player);
  s.faces = { ...(s.faces || {}), [s.era]: s.dieoff.type };
  if (!s.opts.noRivals) era.rivals.forEach((rv, i) => s.lineages.push({ id: 'rival' + i, player: false, plan: { plan: rv.plan, regions: 2 }, traits: { ...rv.traits }, prog: {}, ways: {}, pop: { [rv.home]: 15 } }));
  s.rev = (s.rev || 0) + 1;
  s.regions = regionsNow(s);
}

export function newGame(seed, opts = {}) {
  const s = { seed, opts, era: 0, turn: 0, attempt: 0, clock: 0, ended: false, outcome: null, lineages: [], log: [], eraLog: [], seen: [], mods: [] };
  s.lineages.push({ id: 'you', player: true, plan: opts.policy ?? null, traits: { ...START_TRAITS }, prog: {}, ways: {}, pop: { shallows: START_POP } });
  startEra(s);
  return s;
}

/** What this generation offers. A lineage with no mouth is offered mouths. */
export function offersFor(s, l) {
  const open = Object.keys(TRAITS).filter((id) => lv(l.traits, id) === 0 && canRaise(l.traits, id));
  const pool = mouthOf(l.traits) ? open : open.filter((id) => JAWS[id]);
  const three = streamFor(s.seed, `${s.era}.${s.turn}.${s.attempt}`, 'offer.' + l.id).shuffle(pool).slice(0, 3);
  // A trait the lineage has been watching for turns up once it has watched WATCH_TURNS turns and can grow it.
  const w = l.watch;
  if (w && !s.opts.noWatch && pool.includes(w.id) && !three.includes(w.id) && s.clock - w.since >= WATCH_TURNS) three[three.length - 1] = w.id;
  return three;
}

function apply(s, l, d, offers) {
  if (d.keep && offers.includes(d.keep)) l.traits[d.keep] = 1;
  if (d.watch !== undefined) {
    if (!d.watch || !TRAITS[d.watch]) delete l.watch;
    else if (!l.watch || l.watch.id !== d.watch) l.watch = { id: d.watch, since: s.clock };
  }
  if (l.watch && lv(l.traits, l.watch.id) > 0) delete l.watch;
  if (d.ways) {
    const want = d.ways.filter((id) => WAYS.includes(id)).slice(0, MAX_WAYS);
    for (const id of Object.keys(l.ways)) if (!want.includes(id)) delete l.ways[id];
    for (const id of want) if (!(id in l.ways)) l.ways[id] = s.clock;
  }
  const speed = body(l.traits, waysOf(s, l)).drag / (1 + RANGE_DRAG * (Math.max(1, held(l).length) - 1));
  if (d.turn && canTurn(l.traits, d.turn)) {
    // The mouth (or the covering) turns: the old one goes on working until the new one is ready, which arrives a step lower.
    for (const k of Object.keys(l.prog)) if (k.startsWith('turn.') && k !== 'turn.' + d.turn) delete l.prog[k];
    const k = 'turn.' + d.turn; l.prog[k] = (l.prog[k] || 0) + speed;
    if (l.prog[k] >= turnTime(d.turn)) {
      const old = turnsFrom(l.traits, d.turn), level = Math.max(1, l.traits[old] - 1);
      for (const o of lostOnTurn(l.traits, d.turn)) delete l.traits[o];
      delete l.traits[old]; delete l.prog[k]; delete l.prog[old];
      l.traits[d.turn] = level;
    }
  } else if (d.shed && canShed(l.traits, d.shed)) {
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
  // What moved the player's numbers this turn, kept for the turn's report: bred, starved, caught,
  // and the last of a region dying out. It records the turn; it decides nothing.
  const moved = { bred: 0, starved: 0, caught: 0, lost: 0 };
  s.lineages.forEach((l, i) => {
    const b = body(l.traits, waysOf(s, l));
    for (const r of s.regions) {
      const p = l.pop[r.id] || 0; if (!(p > 0)) continue;
      const k = caps[i][r.id];
      const fed = k > p ? Math.min(p + b.grow * (k - p), p * 1.6 + 1) : p + b.starve * (k - p);
      const n = fed * (1 - 0.3 * r.pred * (1 - b.defence));
      if (l.player) { if (fed > p) moved.bred += fed - p; else moved.starved += p - fed; moved.caught += fed - n; if (n < MIN_VIABLE) moved.lost += n; }
      if (n < MIN_VIABLE) delete l.pop[r.id]; else l.pop[r.id] = n;
    }
  });
  s.moved = moved;
}

// One turn. `decide` is the policy function (policies.js), passed in so that this file and that
// one do not import each other. `mine`, when given, is the player's own decision for this turn
// ({ keep, press, shed, turn, spread, ways, pick }) and the policy is not asked for the player.
export function step(s, decide, mine) {
  const you = s.lineages.find((l) => l.player);
  const turns = s.lineages.map((l) => { const offers = offersFor(s, l); return [l, l.player && mine ? mine : decide(s, l, offers, warning(s)), offers]; });
  const era0 = ERAS[s.era], before = { ...you.pop };
  if (s.turn === era0.turns - dieoffTurns(era0)) s.onset = { ...you.pop };   // numbers as the die-off begins
  const due = momentDue(s);
  if (due) { const d = turns.find((x) => x[0] === you)[1]; meet(s, you, due, d.pick ?? 0, d.shed ? null : d.press); }
  for (const [l, d, offers] of turns) apply(s, l, d, offers);
  s.rev += 1;
  feed(s);
  s.rev += 1;
  s.lineages = s.lineages.filter((l) => l.player || totalPop(l) >= 1);
  const era = ERAS[s.era], pop = totalPop(you), inDieoff = s.turn >= era.turns - dieoffTurns(era);
  s.log.push({ era: s.era, turn: s.turn, pop, regions: held(you).length, upkeep: body(you.traits, waysOf(s, you)).upkeep });
  s.clock += 1; s.turn += 1;
  if (pop < (s.opts.least ?? LEAST)) return end(s, 'extinct', inDieoff ? 'dieoff' : 'starved');
  if (s.turn < era.turns) { s.regions = regionsNow(s); s.rev += 1; return s; }
  s.eraLog.push({ era: s.era, pop, traits: { ...you.traits } });
  // What the die-off did, for the end-of-era report.
  s.lastEra = { era: s.era, kind: s.dieoff.type, onset: s.onset || before, after: { ...you.pop }, rivalsLeft: s.lineages.filter((l) => !l.player).length };
  if (s.era === ERAS.length - 1) {
    // Alive after the last die-off: the lineage has come through. How well is its place on the ladder.
    const rows = ladder(s), at = rows.findIndex((r) => r.you);
    s.standing = rows[at].score; s.rank = at + 1; s.like = resembles(you.traits);
    return end(s, 'through', null);
  }
  // The survivors walk into the next world and settle where they fit best.
  s.era += 1; s.attempt = 0; startEra(s);
  const best = bestOpen(s, { ...you, pop: {} });
  you.pop = best && best[1] > 1 ? { [best[0]]: pop * 0.7 } : {};
  if (totalPop(you) < (s.opts.least ?? LEAST)) return end(s, 'extinct', 'unfit');
  return s;
}

function end(s, outcome, cause) { s.ended = true; s.outcome = outcome; s.cause = cause; s.diedIn = outcome === 'extinct' ? s.era : null; return s; }

// Roll an era again from its opening save: a new attempt number, so a new die-off and new weather.
export function rerollEra(s, attempt) {
  s.attempt = attempt; s.ended = false; s.outcome = null; s.cause = null; s.diedIn = null;
  const you = s.lineages.find((l) => l.player), pop = { ...you.pop };
  startEra(s); you.pop = pop; s.rev += 1;
  return s;
}
