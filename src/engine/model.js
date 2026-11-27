// The rules of the world. One lineage steered by the player (or, in the
// measurement tools, by a policy) and two rival lineages steered by policies
// through the SAME functions. Pure: no DOM, no Math.random, no Date.
//
// The gate (sim/gate.js) measures these functions and the game runs on them:
// there is one model. Rewritten on 2026-11-25 after the author's first run
// (docs/FRAME-standing.md): one mouth, ways of living, moments, and standing
// in place of four fixed winning bodies.
import { streamFor } from './rng.js';
import { lookOf } from './parts.js';
import { BASE_FOODS, FOODS, JAWS, TRAITS, START_TRAITS, START_POP, STEP_TURNS, SHED_TURNS, MOUTH_TURNS, COVERS, COVER_TURNS, BARS, WATCH_TURNS, RANGE_DRAG, MAX_REGIONS, HALF_SAT, MIN_VIABLE, WAYS, MAX_WAYS, WAY_SETTLE, MOMENT_EVERY, MOMENT_AT, MOMENTS, PANEL, STANDING, LINEAGES, HARSH, SENS, FOOD_FLOOR, LEAST, STARVE, CARRION, COAT_SIZE, WARM_GROW, STANCES, FIGHT, PUSH, PREY, SHADOW, AVOID, HUE_DEG, GROUND_HUE, COLOUR, DIEOFFS, DIEOFF_TURNS, ERAS } from '../data/world.data.js';

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
  const small = (3 - size) / 3, claws = lv(t, 'claws'), horns = lv(t, 'horns'), club = lv(t, 'tailClub'), venom = lv(t, 'venom') * small;
  const mob = 0.2 + 0.15 * lv(t, 'limbs') + 0.15 * lv(t, 'gait') + 0.08 * warm + 0.03 * feathers - 0.08 * lv(t, 'armour') - 0.03 * size - 0.03 * horns;
  const mouth = mouthOf(t), own = mouth ? JAWS[mouth] : null;
  const eff = {};
  for (const f of BASE_FOODS) {
    let e = 0.35 + (f === own ? 0.25 * lv(t, mouth) - 0.08 * omni : 0.06 * omni) + 0.05 * lv(t, 'brain');
    if (f === 'prey') e = e * (0.55 + 0.6 * mob) + 0.08 * size + 0.04 * herd + 0.05 * claws + 0.08 * venom;
    if (f === 'insects') e = e * (0.8 + 0.25 * mob) - 0.08 * size;
    if (f === 'plants') e += 0.05 * size;
    eff[f] = Math.max(0.05, e);
  }
  // The dead: a scavenger's food, and a hunter's too, which eats what it finds as well as what it kills.
  // (A scavenger once had them to itself: the author's fourth run came first of eight on it.)
  eff.carrion = CARRION.scavenge * lv(t, 'scavenge') + (mouth === 'jawPrey' ? CARRION.hunter * lv(t, 'jawPrey') : 0);
  eff.hard = lv(t, 'crush') ? 0.2 * lv(t, 'crush') + 0.03 * size : 0;
  if (night) for (const f of FOODS) eff[f] *= 0.9;        // finds less in the dark
  let upkeep = 1 + (tend ? 0.06 : 0) + (roam ? 0.07 : 0);   // young to feed; miles to walk
  for (const id in t) upkeep += TRAITS[id].cost * t[id];
  upkeep += COAT_SIZE * fur * size;                            // a coat costs more the more animal there is to cover
  return {
    dry: clamp01(0.15 + 0.12 * lv(t, 'lungs') + 0.12 * skin + 0.15 * lv(t, 'egg') + 0.06 * burrow + 0.04 * scales),   // a burrow is damp; scales keep water in
    // Cold: a warm metabolism under a coat. Fur holds heat best, feathers nearly; a sail soaks up the morning sun.
    lo: 0.40 - 0.07 * warm - 0.10 * fur - 0.08 * feathers - 0.03 * sail - 0.04 * size - 0.05 * burrow,
    // Heat: watertight skin, scales over it, a sail to shed it. A coat is worn in the heat too.
    hi: 0.65 + 0.06 * skin + 0.05 * scales + 0.05 * sail - 0.02 * fur - 0.01 * feathers - 0.05 * size - 0.04 * warm + 0.04 * burrow + (night ? 0.10 : 0),
    mob, eff, upkeep, mouth,
    defence: clamp01(0.12 * size + 0.15 * lv(t, 'armour') + 0.25 * mob + 0.10 * burrow * (3 - size) / 3 + 0.08 * herd + 0.04 * claws + 0.05 * horns + 0.08 * club + 0.05 * venom + (night ? 0.2 : 0)),
    // Fight a head, for a push between lineages.
    fight: FIGHT.base + FIGHT.size * size + FIGHT.armour * lv(t, 'armour') + FIGHT.herd * herd + FIGHT.horns * horns + FIGHT.claws * claws + FIGHT.tailClub * club + FIGHT.venom * venom,
    grow: ((tend ? 0.68 : 0.5) + WARM_GROW * warm) * (fat ? 0.75 : 1),   // how fast numbers rise toward what the ground feeds; a warm body breeds faster
    // A heavy animal starves more slowly than a slight one; so does a slow one in armour, and one that has laid down fat.
    starve: (fat ? STARVE.fat : STARVE.plain) * (1 - STARVE.size * size - STARVE.armour * lv(t, 'armour') - STARVE.burrow * burrow * (3 - size) / 3),   // and a small one gone to ground                            // how fast they fall toward it
    ease: roam ? 0.55 : 1,                                 // how much of bad ground's harm is felt
    drag: 1,                                 // a lineage on the move changes more slowly
  };
}

// ---- colour (docs/FRAME-rivals.md section 6) ------------------------------------

/** A ground's colour in degrees, from how wet and how cold it is. */
export function groundHue(r) {
  const h = GROUND_HUE.dry + (GROUND_HUE.wet - GROUND_HUE.dry) * clamp01(r.wet);
  const cold = clamp01((GROUND_HUE.coldBelow - r.temp) / GROUND_HUE.coldBelow);
  return h + (GROUND_HUE.cold - h) * cold;
}
const hueGap = (a, b) => { const d = Math.abs(((a - b) % 360 + 360) % 360); return Math.min(d, 360 - d); };
/** How closely a lineage's colour matches a ground, 0 to 1. */
export const matchIn = (l, r) => (l.hue == null ? 0 : clamp01(1 - hueGap(l.hue, groundHue(r)) / COLOUR.across));
/** The colour a lineage is born with in an era: the seeded look, as a hue. */
export const bornHue = (s, l) => HUE_DEG[lookOf(s.seed, s.era, l.id).hue % HUE_DEG.length];
const shows = (t) => lv(t, 'camouflage') > 0 || lv(t, 'display') > 0;

/**
 * A body on one ground, its colour counted. Colour counts only with camouflage or display (the
 * author's word); without them this returns the body unchanged, and colour is free.
 */
export function shade(l, r, b, t = l.traits) {
  if (!shows(t)) return b;
  const c = lv(t, 'camouflage'), d = lv(t, 'display'), m = matchIn(l, r);
  return {
    ...b,
    defence: clamp01(b.defence + COLOUR.camo.defence * c * m - COLOUR.display.defence * d * (1 - m)),
    grow: b.grow + COLOUR.display.grow * d * (1 - m),
    eff: c ? { ...b.eff, prey: b.eff.prey + COLOUR.camo.prey * c * m } : b.eff,
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
      const k = p * fit(ob, r), eff = effIn(s, o, r.id, shade(o, r, ob).eff); m[r.id] = {};
      for (const f of FOODS) { m[r.id][f] = k * eff[f]; t.total[r.id][f] += m[r.id][f]; }
    }
    t.mine.set(o, m);
  }
  memo = { s, rev: s.rev, t };
  return t;
}

export function capacity(s, l, traits = l.traits, ways = waysOf(s, l), stance = l.stance) {
  const b = body(traits, ways), out = {}, t = claims(s), was = t.mine.get(l) || {};
  for (const r of s.regions) {
    const p = l.pop[r.id] || 0; if (!(p > 0)) continue;
    const k = p * fit(b, r), eff = effIn(s, { ...l, traits, stance }, r.id, shade(l, r, b, traits).eff);
    let got = 0;
    for (const f of FOODS) { const c = k * eff[f]; if (c > 0) got += r.food[f] * c / (t.total[r.id][f] - (was[r.id]?.[f] || 0) + c); }
    out[r.id] = got / b.upkeep;
  }
  return out;
}

// ---- rivals: stances (docs/FRAME-rivals.md) ---------------------------------------

export const byId = (s, id) => s.lineages.find((l) => l.id === id) || null;
/** The regions two lineages both hold. */
export const sharedGround = (a, b) => held(a).filter((r) => b.pop[r] > 0);
/** The food a lineage eats best, as a body. */
export const bestFood = (s, l) => { const e = body(l.traits, waysOf(s, l)).eff; return FOODS.reduce((x, f) => (e[f] > e[x] ? f : x)); };

/** Why lineage l cannot take stance `act` toward lineage R, or null. Asked by the player's verbs, the view, the bots and the rivals alike. */
export function stanceWhy(s, l, R, act) {
  if (!STANCES.includes(act)) return 'No such stance.';
  if (!R || R === l) return 'No such rival.';
  if (!sharedGround(l, R).length) return 'You share no ground with them.';
  if (act === 'prey') {
    if (mouthOf(l.traits) !== 'jawPrey') return "Only a hunter's mouth preys on other animals.";
    // Prey is whatever fights less well, head for head: a smaller body, or one without the weapons.
    // (At first it had to be smaller, and a hunter could prey on 1% of the turns it shared ground.)
    if (body(R.traits, waysOf(s, R)).fight >= PREY.edge * body(l.traits, waysOf(s, l)).fight) return 'Only on an animal that fights not much better than you, head for head.';
  }
  if (act === 'shadow') {
    if (mouthOf(R.traits) !== 'jawPrey') return 'They do not hunt: there is nothing left behind to eat.';
    if (lv(R.traits, 'size') <= lv(l.traits, 'size')) return 'Only a bigger hunter leaves enough behind.';
  }
  return null;
}
/** The stance l holds, if it still holds: toward a rival on ground r (or anywhere, with r null). */
function stanceOn(s, l, r, st = l.stance) {
  if (!st) return null;
  const R = byId(s, st.id);
  if (!R || (r && !(R.pop[r] > 0 && l.pop[r] > 0)) || stanceWhy(s, l, R, st.act)) return null;
  return { R, act: st.act };
}
/** l's share of the strength on ground r if it pushed R there. */
export function pushShare(s, l, R, r) {
  const a = (l.pop[r] || 0) * body(l.traits, waysOf(s, l)).fight, b = (R.pop[r] || 0) * body(R.traits, waysOf(s, R)).fight;
  return a + b > 0 ? a / (a + b) : 0;
}
/** R avoids l on ground r: then l can neither push nor prey on R there. */
const avoids = (s, R, l, r) => { const x = stanceOn(s, R, r); return !!x && x.act === 'avoid' && x.R === l; };

// What a lineage makes of each food on ground r, its stance counted: an avoided rival's best food
// is left to it; a shadowed hunter leaves more of the dead.
function effIn(s, l, r, eff) {
  const x = stanceOn(s, l, r);
  if (!x) return eff;
  if (x.act === 'avoid') { const f = bestFood(s, x.R); return { ...eff, [f]: eff[f] * AVOID.keep }; }
  if (x.act === 'shadow') return { ...eff, carrion: eff.carrion + SHADOW.carrion };
  return eff;
}

/**
 * What the lineages' stances do this turn, before they breed: what each loses on each ground
 * to a push or to being preyed on, what a hunter gains by preying, and who is driven out of where.
 * The one derivation: feed() resolves it and the view previews it.
 */
export function contact(s, caps) {
  const lose = new Map(), gain = new Map(), out = [], log = [];
  const add = (m, l, r, x) => { const o = m.get(l) || {}; o[r] = (o[r] || 0) + x; m.set(l, o); };
  for (const l of s.lineages) {
    const x = stanceOn(s, l, null);
    if (!x || (x.act !== 'push' && x.act !== 'prey')) continue;
    const R = x.R, bl0 = body(l.traits, waysOf(s, l)), bR0 = body(R.traits, waysOf(s, R));
    for (const r of sharedGround(l, R)) {
      if (avoids(s, R, l, r)) continue;
      const a = l.pop[r], b = R.pop[r], ground = s.regions.find((x) => x.id === r);
      const bl = ground ? shade(l, ground, bl0) : bl0, bR = ground ? shade(R, ground, bR0) : bR0;
      if (x.act === 'prey') {
        const taken = PREY.rate * Math.min(b, PREY.reach * a) * Math.min(1, bl.eff.prey) * (1 - bR.defence);
        add(lose, R, r, taken); add(gain, l, r, taken * PREY.worth / bl.upkeep);
        log.push({ by: l.id, on: R.id, act: 'prey', r, n: taken });
      } else {
        const sa = a * bl.fight, sb = b * bR.fight, share = sa / (sa + sb);
        add(lose, l, r, a * PUSH.loss * (1 - share)); add(lose, R, r, b * PUSH.loss * share);
        log.push({ by: l.id, on: R.id, act: 'push', r, share, n: b * PUSH.loss * share, cost: a * PUSH.loss * (1 - share) });
        // Only the pushed side can be driven out. The side that started it only bleeds (the author, 2026-11-27);
        // a rival's answering push is a push of its own and can drive the player out.
        if (1 - share < PUSH.yield) out.push([R, r]);
      }
    }
  }
  if (caps) s.lineages.forEach((l, i) => { const g = gain.get(l); if (g) for (const r in g) caps[i][r] = (caps[i][r] || 0) + g[r]; });
  return { lose, gain, out, log };
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
  const era = ERAS[s.era], b0 = body(traits, ways), rivals = s.lineages.filter((o) => o !== l);
  let pop = { ...l.pop }, worst = Infinity;
  for (let t = s.turn; t < era.turns; t++) {
    const me = { ...l, traits, pop };
    const at = { ...s, turn: t, lineages: [me, ...rivals], rev: -1 - t };
    at.regions = regionsNow(at);
    const caps = capacity(at, me, traits, ways), next = {}, lose = contact(at, null).lose.get(me) || {};
    let fed = 0;
    for (const r of at.regions) {
      const p = Math.max(0, (pop[r.id] || 0) - (lose[r.id] || 0)); if (!(p > 0)) continue;
      const k = caps[r.id] || 0, b = shade(me, r, b0, traits); fed += k;
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
  if (!s.opts.noRivals) era.rivals.forEach((rv, i) => s.lineages.push({ id: 'rival' + i, player: false, plan: { plan: rv.plan, regions: 2 }, traits: { ...rv.traits }, prog: {}, ways: {}, stance: null, pop: { [rv.home]: 15 } }));
  for (const l of s.lineages) {
    l.stance = null;   // a new era, new neighbours
    if (l.hue == null || !shows(l.traits)) l.hue = bornHue(s, l);   // colour that counts is carried; free colour is born anew
  }
  s.rev = (s.rev || 0) + 1;
  s.regions = regionsNow(s);
}

export function newGame(seed, opts = {}) {
  const s = { seed, opts, era: 0, turn: 0, attempt: 0, clock: 0, ended: false, outcome: null, lineages: [], log: [], eraLog: [], seen: [], mods: [] };
  s.lineages.push({ id: 'you', player: true, plan: opts.policy ?? null, traits: { ...START_TRAITS }, prog: {}, ways: {}, stance: null, pop: { shallows: START_POP } });
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
  if (d.stance !== undefined) {
    const R = d.stance && byId(s, d.stance.id);
    l.stance = d.stance && !stanceWhy(s, l, R, d.stance.act) ? { id: d.stance.id, act: d.stance.act } : null;
  }
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
  // Colour that counts turns, a little each turn: toward the ground most of the lineage lives on with
  // camouflage, away from it with display. Without either it stays as it was born.
  const main = held(l).sort((a, b) => l.pop[b] - l.pop[a])[0], ground = main && s.regions.find((r) => r.id === main);
  if (ground && shows(l.traits) && l.hue != null) {
    const to = lv(l.traits, 'camouflage') ? groundHue(ground) : groundHue(ground) + 180;
    const step = COLOUR.drift * (lv(l.traits, 'camouflage') || lv(l.traits, 'display'));
    const d = ((to - l.hue) % 360 + 540) % 360 - 180;
    l.hue = ((l.hue + Math.sign(d) * Math.min(Math.abs(d), step)) % 360 + 360) % 360;
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
  // What the stances do first: pushes, and hunters preying on other lineages (docs/FRAME-rivals.md).
  const c = contact(s, caps);
  s.was = Object.fromEntries(s.lineages.map((l) => [l.id, totalPop(l)]));
  // What moved the player's numbers this turn, kept for the turn's report: bred, starved, caught,
  // lost to rivals, and the last of a region dying out. It records the turn; it decides nothing.
  const moved = { bred: 0, starved: 0, caught: 0, lost: 0, rivals: 0 };
  s.lineages.forEach((l, i) => {
    const b0 = body(l.traits, waysOf(s, l)), lose = c.lose.get(l) || {};
    for (const r of s.regions) {
      const p0 = l.pop[r.id] || 0; if (!(p0 > 0)) continue;
      const p = Math.max(0, p0 - (lose[r.id] || 0)), k = caps[i][r.id], b = shade(l, r, b0);
      const fed = k > p ? Math.min(p + b.grow * (k - p), p * 1.6 + 1) : p + b.starve * (k - p);
      const shadow = stanceOn(s, l, r.id)?.act === 'shadow' ? SHADOW.pred : 0;   // close behind a hunter, more are caught
      const n = fed * (1 - 0.3 * Math.min(1, r.pred + shadow) * (1 - b.defence));
      if (l.player) { moved.rivals += p0 - p; if (fed > p) moved.bred += fed - p; else moved.starved += p - fed; moved.caught += fed - n; if (n < MIN_VIABLE) moved.lost += n; }
      if (n < MIN_VIABLE) delete l.pop[r.id]; else l.pop[r.id] = n;
    }
  });
  // Driven out by a push: half reach the lineage's largest other ground; with nowhere to go, it stays.
  const driven = [];
  for (const [l, r] of c.out) {
    if (!(l.pop[r] > 0)) continue;
    const to = held(l).filter((x) => x !== r).sort((a, b) => l.pop[b] - l.pop[a])[0];
    if (!to) continue;
    l.pop[to] += l.pop[r] * 0.5; delete l.pop[r];
    driven.push({ who: l.id, r, to });
  }
  s.contact = { log: c.log, driven };
  s.moved = moved;
}

// One turn. `decide` is the policy function (policies.js), passed in so that this file and that
// one do not import each other. `mine`, when given, is the player's own decision for this turn
// ({ keep, press, shed, turn, spread, ways, pick, watch, stance }) and the policy is not asked for the player.
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
