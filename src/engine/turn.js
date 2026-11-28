// The game's three verbs and its one window. Pure: no DOM, no Date.now(), no
// Math.random(). Same seed and same choices give the same game.
//
//   advance(game, { keep })   one turn: keep an offered mutation (or none) and let time pass
//   setPlan(game, patch)      change a standing order: pressure, ways of living, settlers, what is watched for. No time passes
//   meet(game, road)          choose a road at a moment. No time passes; the turn then resolves with it
//   retry(game, era)          the saved setting: begin an era again from its opening save
//   view(game)                everything the screens show. The screens compute nothing
//
// The rules are model.js; this file only lets a person drive them.

import { FOODS, JAWS, TRAITS, ERAS, MOMENTS, WAYS, MAX_WAYS, WAY_SETTLE, STEP_TURNS, SHED_TURNS, COVERS, TREE, WATCH_TURNS, STANCES, PUSH, RANGE_DRAG, MAX_REGIONS, MIN_VIABLE, HEADS, LENGTH_M } from '../data/world.data.js';
import { ERA_TEXT, TRAIT_TEXT } from '../data/text.data.js';
import { body, fit, capacity, held, totalPop, canRaise, canShed, warning, offersFor, step, rerollEra, dieoffTurns, mouthOf, waysOf, momentDue, ladder, resembles, forecast, canTurn, lostOnTurn, closedBy, coverOf, turnsFrom, turnTime, byId, stanceWhy, sharedGround, pushShare, bestFood, contact, matchIn, groundHue, shade } from './model.js';
import { decide } from './policies.js';
import { freshGame } from './game.js';
import { parts, lookOf } from './parts.js';

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
  const under = TRAITS[id].under;
  if (under && !under.some((o) => lv(t, o) > 0)) return `Needs ${under.map((o) => TRAIT_TEXT[o].name.toLowerCase()).join(' or ')} over it.`;
  const shut = closedBy(t, id);
  if (shut) return `Closed off by ${TRAIT_TEXT[shut].name.toLowerCase()}.`;
  if (!canRaise(t, id)) return 'This mouth cannot grow it.';
  return null;
}

// Why a trait not yet held cannot be begun, for the tree: { state, why }. 'open' means it can turn up as a mutation.
function nodeCheck(t, id) {
  const T = TRAITS[id], mouth = mouthOf(t), cover = coverOf(t);
  if (JAWS[id] && mouth) return { state: 'closed', why: `A lineage has one mouth. Yours can be turned to this from ${TRAIT_TEXT[mouth].name.toLowerCase()}.` };
  if (T.cover && cover) return { state: 'closed', why: `A lineage wears one covering. Yours can be turned to this from ${TRAIT_TEXT[cover].name.toLowerCase()}.` };
  const shut = closedBy(t, id);
  if (shut) return { state: 'closed', why: `Closed off by ${TRAIT_TEXT[shut].name.toLowerCase()}. It opens if that is let go.` };
  if (T.mouths && mouth && !T.mouths.includes(mouth)) return { state: 'closed', why: 'This mouth cannot grow it.' };
  const lack = Object.entries(T.needs).find(([n, k]) => lv(t, n) < k);
  if (lack) return { state: 'needs', why: `Rests on ${TRAIT_TEXT[lack[0]].name.toLowerCase()} at step ${lack[1]}.` };
  if (T.jaw && (!mouth || lv(t, mouth) < T.jaw)) return { state: 'needs', why: `Rests on the mouth at step ${T.jaw}.` };
  if (T.under && !T.under.some((o) => lv(t, o) > 0)) return { state: 'needs', why: `Needs ${T.under.map((o) => TRAIT_TEXT[o].name.toLowerCase()).join(' or ')} over it.` };
  return { state: 'open', why: null };
}

function shedCheck(s, id) {
  const you = me(s), t = you.traits;
  if (!lv(t, id)) return 'Not held.';
  if (JAWS[id]) return 'A mouth is not let go. It can be turned to another food.';
  if (!canShed(t, id)) {
    const dep = Object.keys(t).find((o) => o !== id && t[o] > 0 && ((TRAITS[o].needs[id] || 0) >= t[id] || (JAWS[id] && TRAITS[o].jaw >= t[id])));
    const over = Object.keys(t).find((o) => t[o] > 0 && TRAITS[o].under && TRAITS[o].under.includes(id));
    return dep ? `${TRAIT_TEXT[dep].name} rests on it.` : over ? `${TRAIT_TEXT[over].name} needs it. It can be turned to another covering that holds heat.` : 'Something rests on it.';
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
  // Pressure is on one thing at a time: growing a trait, letting one fade, or turning the mouth.
  if ('press' in patch) {
    if (patch.press != null) { const why = pressCheck(s, patch.press); if (why) throw new Error(`not allowed: ${why}`); g.plan.shed = null; g.plan.turn = null; }
    g.plan.press = patch.press ?? null;
  }
  if ('shed' in patch) {
    if (patch.shed != null) { const why = shedCheck(s, patch.shed); if (why) throw new Error(`not allowed: ${why}`); g.plan.press = null; g.plan.turn = null; }
    g.plan.shed = patch.shed ?? null;
  }
  if ('turn' in patch) {
    if (patch.turn != null) { if (!canTurn(me(s).traits, patch.turn)) throw new Error('not allowed: it cannot be turned to that'); g.plan.press = null; g.plan.shed = null; }
    g.plan.turn = patch.turn ?? null;
  }
  if ('ways' in patch) {
    const want = patch.ways || [];
    if (want.some((id) => !WAYS.includes(id))) throw new Error('not allowed: no such way of living');
    if (want.length > MAX_WAYS) throw new Error(`not allowed: a lineage lives ${MAX_WAYS} ways at most`);
    g.plan.ways = [...want];
  }
  if ('watch' in patch) {
    if (patch.watch != null) {
      if (!TRAITS[patch.watch]) throw new Error('not allowed: no such trait');
      if (lv(me(s).traits, patch.watch)) throw new Error('not allowed: already held');
      const n = nodeCheck(me(s).traits, patch.watch);
      if (n.state === 'closed') throw new Error(`not allowed: ${n.why}`);
    }
    g.plan.watch = patch.watch ?? null;
  }
  if ('stance' in patch) {
    const st = patch.stance;
    if (st != null) { const why = stanceWhy(s, me(s), byId(s, st.id), st.act); if (why) throw new Error(`not allowed: ${why}`); }
    g.plan.stance = st ? { id: st.id, act: st.act } : null;
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
  if (g.plan.turn && !canTurn(you.traits, g.plan.turn)) g.plan.turn = null;
  if (g.plan.stance && stanceWhy(s, you, byId(s, g.plan.stance.id), g.plan.stance.act)) g.plan.stance = null;
  if (g.plan.watch && (lv(you.traits, g.plan.watch) || keep === g.plan.watch || nodeCheck(you.traits, g.plan.watch).state === 'closed')) g.plan.watch = null;

  const before = { era: s.era, turn: s.turn, traits: { ...you.traits }, pop: { ...you.pop } };
  const wasDying = s.turn >= ERAS[s.era].turns - dieoffTurns(ERAS[s.era]);
  step(s, decide, { keep, press: g.plan.press, shed: g.plan.shed, turn: g.plan.turn ?? null, spread: g.plan.spread, ways: g.plan.ways, pick: g.plan.pick ?? 0, watch: g.plan.watch ?? null, stance: g.plan.stance ?? null });
  g.turns += 1;
  g.plan.spread = null;
  g.plan.pick = null;

  const now = me(s);
  // A covering turned to another (not one begun on bare skin, nor one let go).
  const recovered = !!coverOf(before.traits) && !!coverOf(now.traits) && coverOf(before.traits) !== coverOf(now.traits);
  const record = {
    era: before.era, turn: before.turn, kept: keep,
    popBefore: sum(before.pop) * HEADS, popAfter: totalPop(now) * HEADS, met: due ? { id: due, road: s.lastMoment.pick } : null,
    // Why the numbers moved: what was bred, what hunger took, what the hunters took. From the turn itself.
    moved: s.moved && s.era === before.era ? { bred: s.moved.bred * HEADS, starved: s.moved.starved * HEADS, caught: s.moved.caught * HEADS, lost: s.moved.lost * HEADS, rivals: s.moved.rivals * HEADS } : null,
    turned: mouthOf(now.traits) !== mouthOf(before.traits) ? { from: mouthOf(before.traits), to: mouthOf(now.traits) } : null,
    recovered: recovered ? { from: coverOf(before.traits), to: coverOf(now.traits) } : null,
    gained: Object.keys(now.traits).filter((id) => lv(now.traits, id) > lv(before.traits, id) && id !== keep && !JAWS[id] && !(recovered && COVERS.includes(id))),
    lost: Object.keys(before.traits).filter((id) => lv(now.traits, id) < lv(before.traits, id) && !JAWS[id] && !(recovered && COVERS.includes(id))),
    settled: s.era === before.era ? Object.keys(now.pop).filter((id) => !(before.pop[id] > 0)) : [],
    // What passed between the player and the rivals this turn: pushes, hunting, and who was driven from where.
    rivals: s.era === before.era && s.contact ? {
      log: s.contact.log.filter((e) => e.by === 'you' || e.on === 'you').map((e) => ({ ...e, n: e.n * HEADS, cost: e.cost != null ? e.cost * HEADS : null })),
      driven: s.contact.driven.filter((d) => d.who === 'you' || (s.contact.log.some((e) => e.by === 'you' && e.on === d.who))),
    } : null,
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
  g.plan = { press: null, shed: null, turn: null, spread: null, ways: Object.keys(me(g.s).ways || {}), pick: null, watch: me(g.s).watch?.id ?? null, stance: null };
  g.over = false; g.outcome = null; g.note = null;
  return g;
}

// ---- the window --------------------------------------------------------------

const outlookOf = (x) => (x < 0.5 ? 'spared' : x <= 1 ? 'hit' : 'hit hard');

// Once the die-off is named (or under way): what it would leave of the lineage as it stands, and
// which changes within reach would leave more. Every figure is model.forecast, in heads.
function outlook(g, s, you, t, ways, H) {
  if (g.over) return null;
  const warn = warning(s), era = ERAS[s.era], left0 = era.turns - s.turn;
  if (!warn || warn.kinds.length !== 1) return null;
  const base = forecast(s, you, t, ways), helps = [];
  const planned = (g.plan.ways || []).slice().sort();
  for (const id of WAYS) {
    if (planned.includes(id)) continue;
    const settle = WAY_SETTLE, with_ = [...ways, id].slice(-MAX_WAYS).sort();
    if (settle >= left0) continue;   // it would not take hold in time
    helps.push({ kind: 'way', id, left: forecast(s, you, t, with_).left * H, swaps: planned.length >= MAX_WAYS });
  }
  const speed = body(t, ways).drag / (1 + RANGE_DRAG * (Math.max(1, held(you).length) - 1));
  for (const id of Object.keys(t)) {
    if (pressCheck(s, id)) continue;
    const turns = Math.ceil((STEP_TURNS[t[id] + 1] - (you.prog[id] || 0)) / speed);
    if (turns >= left0) continue;    // it would not be grown in time
    helps.push({ kind: 'trait', id, turns, left: forecast(s, you, { ...t, [id]: t[id] + 1 }, ways).left * H });
  }
  // A hint on offer this turn: a coat before a cold, scales before a heat.
  for (const id of offersFor(s, you)) helps.push({ kind: 'offer', id, left: forecast(s, you, { ...t, [id]: 1 }, ways).left * H });
  for (const r of s.regions) {
    const sp = spreadPreview(s, r.id);
    if (!sp.ok || left0 < 2) continue;
    const pop = { ...you.pop, [sp.from]: you.pop[sp.from] - sp.sends, [r.id]: sp.arrive };
    helps.push({ kind: 'settle', id: r.id, left: forecast(s, { ...you, pop }, t, ways).left * H });
  }
  const now = totalPop(you) * H, left = base.left * H;
  return { now, left, worst: base.worst * H, helps: helps.filter((h) => h.left > left * 1.1 + 50).sort((a, b) => b.left - a.left).slice(0, 3) };
}

// One rival as the Rivals screen shows it, with what each stance toward it would do as things stand.
// Every figure is from the rules: contact() for pushes and hunting, capacity() for food.
function rivalView(g, s, you, R, caps, H) {
  const sizeOf = (tr) => LENGTH_M[lv(tr, 'size')];
  const ground = sharedGround(you, R), feeds = sum(caps), was = s.was?.[R.id];
  const toYou = R.stance && R.stance.id === 'you' && !stanceWhy(s, R, you, R.stance.act) ? R.stance.act : null;
  const lastTurn = (s.contact?.log || []).filter((e) => (e.by === R.id && e.on === 'you') || (e.by === 'you' && e.on === R.id)).map((e) => ({ by: e.by, act: e.act, r: e.r, n: e.n * H, cost: e.cost != null ? e.cost * H : null }));
  const as = (act) => ({ ...s, lineages: s.lineages.map((l) => (l === you ? { ...you, stance: { id: R.id, act } } : l)), rev: -1e9 - s.clock });
  const stances = STANCES.map((act) => {
    const why = g.over ? 'The lineage has ended.' : stanceWhy(s, you, R, act);
    const on = !!g.plan.stance && g.plan.stance.id === R.id && g.plan.stance.act === act;
    if (why) return { act, ok: false, why, on: false };
    const hyp = as(act), mine = hyp.lineages.find((l) => l.player);
    const feedsAfter = sum(capacity(hyp, mine, mine.traits, waysOf(hyp, mine), mine.stance));
    const c = contact(hyp, null), mineLog = c.log.filter((e) => e.by === 'you');
    return {
      act, ok: true, why: null, on,
      feeds: (feedsAfter - feeds + (act === 'prey' ? sum(c.gain.get(mine) || {}) : 0)) * H,
      takes: act === 'prey' ? mineLog.reduce((a, e) => a + e.n, 0) * H : null,
      push: act === 'push' ? ground.map((r) => { const share = pushShare(s, you, R, r); return { r, share, out: 1 - share < PUSH.yield ? 'them' : null, cost: (you.pop[r] || 0) * (1 - share) * PUSH.loss * H }; }) : null,
    };
  });
  return {
    id: R.id, parts: { ...parts(R.traits, waysOf(s, R)), look: { ...lookOf(s.seed, s.era, R.id), deg: R.hue ?? null } }, length: sizeOf(R.traits), pop: totalPop(R) * H,
    trend: was != null ? (totalPop(R) - was) * H : null, near: ground.length > 0, like: resembles(R.traits), mouth: mouthOf(R.traits), best: bestFood(s, R),
    ground, home: held(R), toYou, lastTurn, stances,
  };
}

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
        fit: fit(b, r), match: lv(t, 'camouflage') || lv(t, 'display') ? matchIn(you, r) : null, wet: r.wet, temp: r.temp, tooDry: (1 - b.dry) - r.wet > 0.02, tooCold: b.lo - r.temp > 0.02, tooHot: r.temp - b.hi > 0.02,
        food: Object.fromEntries(FOODS.map((f) => [f, r.food[f] * H])), pred: r.pred,
        spread: { ok: sp.ok, why: sp.why, sends: sp.sends != null ? sp.sends * H : null, arrive: sp.arrive != null ? sp.arrive * H : null, feeds: sp.feeds != null ? sp.feeds * H : null, queued: g.plan.spread === r.id },
        outlook: warn && warn.sens ? outlookOf(warn.sens[r.id] * era.mag) : null,
      };
    }),
    // The other animals on the ground, for the scene: what they are built like and how many there are.
    rivals: s.lineages.filter((l) => !l.player).map((l) => rivalView(g, s, you, l, caps, H)),
    stance: g.plan.stance && !g.over && !stanceWhy(s, you, byId(s, g.plan.stance.id), g.plan.stance.act) ? { ...g.plan.stance } : null,
    warning: warn && s.turn < onset ? { turns: warn.toOnset, named: warn.kinds.length === 1, kinds: warn.kinds } : null,
    dieoff: !g.over && s.turn >= onset ? { kind: s.dieoff.type, left: era.turns - s.turn } : null,
    moment: due ? { id: due, picked: g.plan.pick, roads: MOMENTS[due].options.length } : null,
    forecast: outlook(g, s, you, t, ways, H),
    pressure: g.plan.turn && canTurn(t, g.plan.turn) ? { kind: 'turn', id: g.plan.turn, cover: !JAWS[g.plan.turn], left: Math.ceil((turnTime(g.plan.turn) - (you.prog['turn.' + g.plan.turn] || 0)) / speed), of: Math.ceil(turnTime(g.plan.turn) / speed) }
      : g.plan.shed && !shedCheck(s, g.plan.shed) ? { kind: 'shed', id: g.plan.shed, left: Math.ceil((SHED_TURNS - (you.prog['shed.' + g.plan.shed] || 0)) / speed) }
      : g.plan.press && !pressCheck(s, g.plan.press) ? { kind: 'press', id: g.plan.press, to: lv(t, g.plan.press) + 1, left: Math.ceil((STEP_TURNS[lv(t, g.plan.press) + 1] - (you.prog[g.plan.press] || 0)) / speed), of: Math.ceil(STEP_TURNS[lv(t, g.plan.press) + 1] / speed) }
      : null,
    traits: Object.keys(TRAITS).filter((id) => lv(t, id)).map((id) => {
      const why = pressCheck(s, id), shedWhy = shedCheck(s, id);
      const down = { ...t, [id]: t[id] - 1 }; if (!down[id]) delete down[id];
      return {
        id, level: t[id], cost: TRAITS[id].cost * t[id], isMouth: !!JAWS[id], isCover: !!TRAITS[id].cover,
        canPress: !why, pressWhy: why, pressing: g.plan.press === id,
        pressTurns: why ? null : Math.ceil((STEP_TURNS[t[id] + 1] - (you.prog[id] || 0)) / speed),
        pressFeeds: why ? null : (worth({ ...t, [id]: t[id] + 1 }) - feeds) * H,
        canShed: !shedWhy, shedWhy, shedding: g.plan.shed === id,
        shedFeeds: shedWhy ? null : (worth(down) - feeds) * H,
        // For the mouth: the three foods it could be turned to, and what each would cost and bring.
        // The same for a covering. One that something closes off is listed with what closes it.
        turns: JAWS[id] || TRAITS[id].cover ? (JAWS[id] ? Object.keys(JAWS) : COVERS).filter((to) => to !== id).map((to) => {
          const after = { ...t }; for (const o of lostOnTurn(t, to)) delete after[o];
          delete after[id]; after[to] = Math.max(1, t[id] - 1);
          const ok = canTurn(t, to), bare = { ...t }; delete bare[id];
          return { to, ok, why: ok ? null : `Closed off by ${TRAIT_TEXT[closedBy(bare, to)].name.toLowerCase()}.`, turning: g.plan.turn === to, turns: Math.ceil((turnTime(to) - (you.prog['turn.' + to] || 0)) / speed), level: after[to], loses: lostOnTurn(t, to), feeds: (worth(after) - feeds) * H };
        }) : null,
      };
    }),
    // safer: how much less of the lineage is caught with the trait, for the offer's mark.
    offers: offers.map((id) => ({ id, cost: TRAITS[id].cost, feeds: (worth({ ...t, [id]: 1 }) - feeds) * H, safer: body({ ...t, [id]: 1 }, waysOf(s, you)).defence - body(t, waysOf(s, you)).defence, isMouth: !!JAWS[id], watched: g.plan.watch === id })),
    // The tree: every trait there is, by branch, with where the lineage stands on each. A trait not
    // held is open (it can turn up), resting on something not yet grown, or closed off by something that is.
    tree: TREE.map((br) => ({ id: br.id, traits: br.traits.map((id) => {
      if (lv(t, id)) return { id, level: t[id], state: 'held', why: null, watching: false };
      const n = nodeCheck(t, id);
      return { id, level: 0, state: n.state, why: n.why, cost: TRAITS[id].cost, watching: g.plan.watch === id, feeds: n.state === 'open' ? (worth({ ...t, [id]: 1 }) - feeds) * H : null };
    }) })),
    // What is being watched for, and how long before it is among what a generation offers.
    watch: g.plan.watch && !lv(t, g.plan.watch) ? (() => {
      const n = nodeCheck(t, g.plan.watch), since = you.watch && you.watch.id === g.plan.watch ? you.watch.since : s.clock;
      return { id: g.plan.watch, open: n.state === 'open', why: n.why, turns: Math.max(0, since + WATCH_TURNS - s.clock), offered: offers.includes(g.plan.watch) };
    })() : null,
    watchTurns: WATCH_TURNS,
    cover: coverOf(t),
    ways: WAYS.map((id) => {
      const held_ = (g.plan.ways || []).includes(id), since = you.ways[id];
      const settling = held_ && !ways.includes(id) ? (since == null ? WAY_SETTLE : Math.max(1, WAY_SETTLE - (s.clock - since))) : 0;
      const other = held_ ? ways.filter((w) => w !== id) : [...ways, id].slice(-MAX_WAYS);
      return { id, on: held_, settling, feeds: (worth(t, other.sort()) - feeds) * H, full: !held_ && (g.plan.ways || []).length >= MAX_WAYS };
    }),
    maxWays: MAX_WAYS, waySettle: WAY_SETTLE,
    // Fat held when the ground would feed many more than there are is slowing the climb back, and no die-off is near.
    fatSlows: ways.includes('fat') && feeds > pop * 1.25 && !(warn && warn.kinds.length === 1),
    // Standing as it would be if the run ended now, and the ladder it is placed on.
    standing: { score: mineStanding.score, prospects: mineStanding.prospects, secure: mineStanding.secure, spread: mineStanding.spread, rank: place + 1, of: rows.length, like: resembles(t) },
    ladder: rows.map((r, i) => ({ id: r.id, you: r.you, score: r.score, rank: i + 1 })),
    parts: { ...parts(t, ways), look: { ...lookOf(s.seed, s.era, 'you'), deg: you.hue ?? null } },
    // Colour, and whether it counts: only with camouflage or display. Each ground's colour and how well you match it.
    colour: { hue: you.hue ?? null, counts: lv(t, 'camouflage') > 0 || lv(t, 'display') > 0, by: lv(t, 'camouflage') ? 'camouflage' : lv(t, 'display') ? 'display' : null,
      grounds: s.regions.map((r) => ({ id: r.id, hue: groundHue(r), match: matchIn(you, r), mine: you.pop[r.id] > 0 })) },
    body: { dry: b.dry, lo: b.lo, hi: b.hi, mob: b.mob, defence: b.defence },
    saves: g.saves.map((x, e) => (x ? { era: e, name: ERAS[e].name, tries: g.tries[e] } : null)).filter(Boolean),
    last: s.lastEra || null,
  };
}


