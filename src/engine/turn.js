// The game's three verbs and its one window. Pure: no DOM, no Date.now(), no
// Math.random(). Same seed and same choices give the same game.
//
//   advance(game, { keep })   one turn: keep an offered mutation (or none) and let time pass
//   setPlan(game, patch)      change a standing order: pressure, ways of living, settlers. No time passes
//   meet(game, road)          choose a road at a moment. No time passes; the turn then resolves with it
//   retry(game, era)          the saved setting: begin an era again from its opening save
//   view(game)                everything the screens show. The screens compute nothing
//
// The rules are model.js; this file only lets a person drive them.

import { FOODS, JAWS, TRAITS, ERAS, MOMENTS, WAYS, MAX_WAYS, WAY_SETTLE, STEP_TURNS, SHED_TURNS, RANGE_DRAG, MAX_REGIONS, MIN_VIABLE, HEADS, LENGTH_M } from '../data/world.data.js';
import { ERA_TEXT, TRAIT_TEXT } from '../data/text.data.js';
import { body, fit, capacity, held, totalPop, canRaise, canShed, warning, offersFor, step, rerollEra, dieoffTurns, mouthOf, waysOf, momentDue, ladder, resembles } from './model.js';
import { decide } from './policies.js';
import { freshGame } from './game.js';
import { parts } from './parts.js';

export const newGame = freshGame;

const lv = (t, id) => t[id] || 0;
const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const me = (s) => s.lineages.find((l) => l.player);

// ---- what is allowed, asked by the view and by the verbs alike ---------------

function pressCheck(s, id) {
  const t = me(s).traits;
  if (!TRAITS[id]) return 'No such trait.';
  if (!lv(t, id)) return 'Not held yet: it has to turn up as a mutation first.';
  if (lv(t, id) >= 3) return 'Already refined.';
  const lack = Object.entries(TRAITS[id].needs).find(([n, k]) => lv(t, n) < k);
  if (lack) return `Needs ${TRAIT_TEXT[lack[0]].name.toLowerCase()} at step ${lack[1]} first.`;
  const mouth = mouthOf(t);
  if (TRAITS[id].jaw && (!mouth || lv(t, mouth) < TRAITS[id].jaw)) return `Needs a mouth at step ${TRAITS[id].jaw} first.`;
  if (!canRaise(t, id)) return 'This mouth cannot grow it.';
  return null;
}

function shedCheck(s, id) {
  const you = me(s), t = you.traits;
  if (!lv(t, id)) return 'Not held.';
  if (!canShed(t, id)) {
    const dep = Object.keys(t).find((o) => o !== id && t[o] > 0 && ((TRAITS[o].needs[id] || 0) >= t[id] || (JAWS[id] && TRAITS[o].jaw >= t[id])));
    return dep ? `${TRAIT_TEXT[dep].name} rests on it.` : 'Something rests on it.';
  }
  return null;
}

/** What sending settlers to a region would do, as the tile shows it and as the turn resolves it. */
function spreadPreview(s, id) {
  const you = me(s), mine = held(you), b = body(you.traits, waysOf(s, you));
  const r = s.regions.find((x) => x.id === id);
  if (!r) return { ok: false, why: 'No such region.' };
  if (you.pop[id] > 0) return { ok: false, why: 'You already live here.' };
  if (mine.length >= MAX_REGIONS) return { ok: false, why: `A lineage holds ${MAX_REGIONS} regions at most.` };
  const from = mine.reduce((a, c) => (you.pop[a] >= you.pop[c] ? a : c));
  const sends = you.pop[from] * 0.3, arrive = sends * clamp01(0.3 + 0.6 * b.mob);
  const feeds = capacity(s, { ...you, pop: { [id]: arrive } })[id] || 0;
  if (arrive < MIN_VIABLE) return { ok: false, why: `Too few would arrive to last: ${Math.round(arrive * HEADS)}, and a region needs ${MIN_VIABLE * HEADS}.`, from, sends, arrive, feeds };
  return { ok: true, why: null, from, sends, arrive, feeds };
}

// ---- the verbs ---------------------------------------------------------------

/** setPlan(game, { press | shed | focus | spread }) -> game. Throws on an order the view marks as not allowed. */
export function setPlan(prev, patch) {
  if (prev.over) throw new Error('the lineage has ended');
  const g = structuredClone(prev), s = g.s;
  if ('press' in patch) {
    if (patch.press != null) { const why = pressCheck(s, patch.press); if (why) throw new Error(`not allowed: ${why}`); g.plan.shed = null; }
    g.plan.press = patch.press ?? null;
  }
  if ('shed' in patch) {
    if (patch.shed != null) { const why = shedCheck(s, patch.shed); if (why) throw new Error(`not allowed: ${why}`); g.plan.press = null; }
    g.plan.shed = patch.shed ?? null;
  }
  if ('ways' in patch) {
    const want = patch.ways || [];
    if (want.some((id) => !WAYS.includes(id))) throw new Error('not allowed: no such way of living');
    if (want.length > MAX_WAYS) throw new Error(`not allowed: a lineage lives ${MAX_WAYS} ways at most`);
    g.plan.ways = [...want];
  }
  if ('pick' in patch) g.plan.pick = patch.pick ?? null;
  if ('spread' in patch) {
    if (patch.spread != null) { const p = spreadPreview(s, patch.spread); if (!p.ok) throw new Error(`not allowed: ${p.why}`); }
    g.plan.spread = patch.spread ?? null;
  }
  return g;
}

/** meet(game, road) -> game. Choose one of the three roads at the moment that is waiting. */
export function meet(prev, road) {
  if (prev.over) throw new Error('the lineage has ended');
  const due = momentDue(prev.s);
  if (!due) throw new Error('not allowed: no moment is waiting');
  if (!(road >= 0 && road < MOMENTS[due].options.length)) throw new Error('not allowed: no such road');
  const g = structuredClone(prev);
  g.plan.pick = road;
  return g;
}

/** advance(game, { keep, plan? }) -> { state, record }. `plan` is a setPlan patch applied first. */
export function advance(prev, input = {}) {
  if (prev.over) throw new Error('the lineage has ended');
  const g = input.plan ? setPlan(prev, input.plan) : structuredClone(prev);
  const s = g.s, you = me(s);
  const offers = offersFor(s, you);
  const keep = input.keep ?? null;
  const due = momentDue(s);
  if (due && g.plan.pick == null) throw new Error('not allowed: a moment is waiting to be met');
  if (keep != null && !offers.includes(keep)) throw new Error(`not allowed: ${keep} was not offered this turn`);

  // An order that has stopped making sense is dropped, not obeyed.
  if (g.plan.press && pressCheck(s, g.plan.press)) g.plan.press = null;
  if (g.plan.shed && shedCheck(s, g.plan.shed)) g.plan.shed = null;
  if (g.plan.spread && !spreadPreview(s, g.plan.spread).ok) g.plan.spread = null;

  const before = { era: s.era, turn: s.turn, traits: { ...you.traits }, pop: { ...you.pop } };
  const wasDying = s.turn >= ERAS[s.era].turns - dieoffTurns(ERAS[s.era]);
  step(s, decide, { keep, press: g.plan.press, shed: g.plan.shed, spread: g.plan.spread, ways: g.plan.ways, pick: g.plan.pick ?? 0 });
  g.turns += 1;
  g.plan.spread = null;
  g.plan.pick = null;

  const now = me(s);
  const record = {
    era: before.era, turn: before.turn, kept: keep,
    popBefore: sum(before.pop) * HEADS, popAfter: totalPop(now) * HEADS, met: due ? { id: due, road: s.lastMoment.pick } : null,
    gained: Object.keys(now.traits).filter((id) => lv(now.traits, id) > lv(before.traits, id) && id !== keep),
    lost: Object.keys(before.traits).filter((id) => lv(now.traits, id) < lv(before.traits, id)),
    settled: s.era === before.era ? Object.keys(now.pop).filter((id) => !(before.pop[id] > 0)) : [],
    emptied: s.era === before.era ? Object.keys(before.pop).filter((id) => !(now.pop[id] > 0)) : [],
    dieoffBegan: null, eraEnded: null, ended: null,
  };
  if (s.era === before.era && !s.ended) {
    const dying = s.turn >= ERAS[s.era].turns - dieoffTurns(ERAS[s.era]);
    if (dying && !wasDying) record.dieoffBegan = s.dieoff.type;
  }
  const heads = (o) => Object.fromEntries(Object.entries(o).map(([k, x]) => [k, x * HEADS]));
  if (s.era !== before.era || (s.ended && s.outcome !== 'extinct')) record.eraEnded = { era: s.lastEra.era, kind: s.lastEra.kind, onset: heads(s.lastEra.onset), after: heads(s.lastEra.after), next: s.ended ? null : s.era, carried: s.ended ? null : totalPop(now) * HEADS };
  if (s.era !== before.era && g.setting === 'saved') { g.saves[s.era] = structuredClone(s); }
  if (s.ended) { g.over = true; g.outcome = s.outcome; record.ended = { outcome: s.outcome, cause: s.cause, era: s.diedIn ?? s.era }; }
  return { state: g, record };
}

/** retry(game, era) -> game. The saved setting only: the era's opening save, rolled again. */
export function retry(prev, era) {
  if (prev.setting !== 'saved') throw new Error('not allowed: this lineage has one life');
  if (!prev.saves[era]) throw new Error(`not allowed: no save at the start of era ${era + 1}`);
  const g = structuredClone(prev);
  g.tries[era] += 1;
  g.s = rerollEra(structuredClone(g.saves[era]), g.tries[era]);
  g.saves = g.saves.slice(0, era + 1);
  g.plan = { press: null, shed: null, spread: null, ways: Object.keys(me(g.s).ways || {}), pick: null };
  g.over = false; g.outcome = null; g.note = null;
  return g;
}

// ---- the window --------------------------------------------------------------

const outlookOf = (x) => (x < 0.5 ? 'spared' : x <= 1 ? 'hit' : 'hit hard');

/** Everything the screens show, computed by the engine. Numbers of animals are in heads (HEADS to one of the model's units). */
export function view(g) {
  const s = g.s, you = me(s), era = ERAS[s.era], et = ERA_TEXT[era.id];
  const t = you.traits, ways = waysOf(s, you), b = body(t, ways), mine = held(you);
  const caps = capacity(s, you), feeds = sum(caps), pop = totalPop(you);
  const warn = g.over ? null : warning(s);
  const onset = era.turns - dieoffTurns(era);
  const speed = b.drag / (1 + RANGE_DRAG * (Math.max(1, mine.length) - 1));
  const worth = (traits, w = ways) => sum(capacity(s, you, traits, w));
  const offers = g.over ? [] : offersFor(s, you);
  const due = g.over ? null : momentDue(s);
  const H = HEADS;
  let done = 0;
  for (let e = 0; e < s.era; e++) done += ERAS[e].turns;
  const perTurn = (et.from - et.to) / era.turns, at = Math.min(s.turn, era.turns);
  const rows = ladder(s), place = rows.findIndex((r) => r.you);
  const mineStanding = rows[place];
  const sizeOf = (tr) => LENGTH_M[lv(tr, 'size')];

  return {
    setting: g.setting, over: g.over, outcome: g.outcome, cause: s.cause || null, note: g.note,
    diedIn: s.diedIn ?? null,
    era: { index: s.era, id: era.id, name: era.name, turn: Math.min(s.turn + 1, era.turns), turns: era.turns, intro: et.intro, palette: et.palette,
      ma: et.from - perTurn * at, perTurn, since: ERA_TEXT[ERAS[0].id].from - (et.from - perTurn * at) },
    eras: ERAS.map((e, i) => ({ name: e.name, turns: e.turns, state: i < s.era ? 'done' : i === s.era ? 'now' : 'ahead', frac: i === s.era ? Math.min(1, s.turn / e.turns) : i < s.era ? 1 : 0 })),
    clock: { turn: Math.min(done + s.turn + 1, done + era.turns), of: ERAS.reduce((a, e) => a + e.turns, 0) },
    pop: pop * H, feeds: feeds * H, upkeep: b.upkeep, regionsHeld: mine.length, maxRegions: MAX_REGIONS, speed,
    least: MIN_VIABLE * H,
    dying: !g.over && s.turn >= onset,
    mouth: b.mouth,
    eats: Object.fromEntries(FOODS.map((f) => [f, b.eff[f]])),
    length: sizeOf(t),
    regions: s.regions.map((r) => {
      const sp = g.over ? { ok: false, why: 'The lineage has ended.' } : spreadPreview(s, r.id);
      return {
        id: r.id, mine: (you.pop[r.id] || 0) * H, feeds: (caps[r.id] || 0) * H,
        rivals: s.lineages.filter((l) => !l.player).reduce((a, l) => a + (l.pop[r.id] || 0), 0) * H,
        fit: fit(b, r), wet: r.wet, temp: r.temp, tooDry: (1 - b.dry) - r.wet > 0.02, tooCold: b.lo - r.temp > 0.02, tooHot: r.temp - b.hi > 0.02,
        food: Object.fromEntries(FOODS.map((f) => [f, r.food[f] * H])), pred: r.pred,
        spread: { ok: sp.ok, why: sp.why, sends: sp.sends != null ? sp.sends * H : null, arrive: sp.arrive != null ? sp.arrive * H : null, feeds: sp.feeds != null ? sp.feeds * H : null, queued: g.plan.spread === r.id },
        outlook: warn && warn.sens ? outlookOf(warn.sens[r.id] * era.mag) : null,
      };
    }),
    // The other animals on the ground, for the scene: what they are built like and how many there are.
    rivals: s.lineages.filter((l) => !l.player).map((l) => ({ id: l.id, parts: parts(l.traits), length: sizeOf(l.traits), pop: totalPop(l) * H, near: held(l).some((id) => you.pop[id] > 0), like: resembles(l.traits) })),
    warning: warn && s.turn < onset ? { turns: warn.toOnset, named: warn.kinds.length === 1, kinds: warn.kinds } : null,
    dieoff: !g.over && s.turn >= onset ? { kind: s.dieoff.type, left: era.turns - s.turn } : null,
    moment: due ? { id: due, picked: g.plan.pick, roads: MOMENTS[due].options.length } : null,
    pressure: g.plan.shed && !shedCheck(s, g.plan.shed) ? { kind: 'shed', id: g.plan.shed, left: Math.ceil((SHED_TURNS - (you.prog['shed.' + g.plan.shed] || 0)) / speed) }
      : g.plan.press && !pressCheck(s, g.plan.press) ? { kind: 'press', id: g.plan.press, to: lv(t, g.plan.press) + 1, left: Math.ceil((STEP_TURNS[lv(t, g.plan.press) + 1] - (you.prog[g.plan.press] || 0)) / speed), of: Math.ceil(STEP_TURNS[lv(t, g.plan.press) + 1] / speed) }
      : null,
    traits: Object.keys(TRAITS).filter((id) => lv(t, id)).map((id) => {
      const why = pressCheck(s, id), shedWhy = shedCheck(s, id);
      const down = { ...t, [id]: t[id] - 1 }; if (!down[id]) delete down[id];
      return {
        id, level: t[id], cost: TRAITS[id].cost * t[id], isMouth: !!JAWS[id],
        canPress: !why, pressWhy: why, pressing: g.plan.press === id,
        pressTurns: why ? null : Math.ceil((STEP_TURNS[t[id] + 1] - (you.prog[id] || 0)) / speed),
        pressFeeds: why ? null : (worth({ ...t, [id]: t[id] + 1 }) - feeds) * H,
        canShed: !shedWhy, shedWhy, shedding: g.plan.shed === id,
        shedFeeds: shedWhy ? null : (worth(down) - feeds) * H,
      };
    }),
    offers: offers.map((id) => ({ id, cost: TRAITS[id].cost, feeds: (worth({ ...t, [id]: 1 }) - feeds) * H, isMouth: !!JAWS[id] })),
    ways: WAYS.map((id) => {
      const held_ = (g.plan.ways || []).includes(id), since = you.ways[id];
      const settling = held_ && !ways.includes(id) ? (since == null ? WAY_SETTLE : Math.max(1, WAY_SETTLE - (s.clock - since))) : 0;
      const other = held_ ? ways.filter((w) => w !== id) : [...ways, id].slice(-MAX_WAYS);
      return { id, on: held_, settling, feeds: (worth(t, other.sort()) - feeds) * H, full: !held_ && (g.plan.ways || []).length >= MAX_WAYS };
    }),
    maxWays: MAX_WAYS, waySettle: WAY_SETTLE,
    // Standing as it would be if the run ended now, and the ladder it is placed on.
    standing: { score: mineStanding.score, prospects: mineStanding.prospects, secure: mineStanding.secure, spread: mineStanding.spread, rank: place + 1, of: rows.length, like: resembles(t) },
    ladder: rows.map((r, i) => ({ id: r.id, you: r.you, score: r.score, rank: i + 1 })),
    parts: parts(t),
    body: { dry: b.dry, lo: b.lo, hi: b.hi, mob: b.mob, defence: b.defence },
    saves: g.saves.map((x, e) => (x ? { era: e, name: ERAS[e].name, tries: g.tries[e] } : null)).filter(Boolean),
    last: s.lastEra || null,
  };
}


