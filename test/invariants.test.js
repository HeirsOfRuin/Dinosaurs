// What can never be true. Impossibility assertions, not magnitudes: magnitude
// asserts get deleted on the first rebalance, impossibility asserts survive it.
// Each test plays real games through the bot, so "it held" means it held over
// games that actually happened.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newGame, advance, setPlan, meet, retry, view } from '../src/engine/turn.js';
import { totalPop } from '../src/engine/model.js';
import { TRAITS, JAWS, LINEAGES, MAX_REGIONS, MAX_WAYS, HEADS } from '../src/data/world.data.js';
import { POLICIES as PLANS } from '../src/engine/policies.js';
import { decide, playGame } from '../sim/bot.js';
import { play } from '../sim/play.js';

const ROADS = ['careful', 'dinosaur.plan', 'mammal.plan', 'lizard.plan'];

function playThrough(seed, policy, setting, each = () => {}) {
  let g = newGame({ seed, setting });
  for (let i = 0; !g.over && i < 1000; i++) { g = advance(g, decide(g, policy)).state; each(g); }
  return g;
}

test('no number is ever NaN, infinite or below nothing', () => {
  for (let seed = 1; seed <= 12; seed++) {
    playThrough(seed, ROADS[seed % 4], 'oneLife', (g) => {
      for (const l of g.s.lineages) {
        assert.ok(Number.isFinite(totalPop(l)), `numbers at seed ${seed}`);
        for (const p of Object.values(l.pop)) assert.ok(p >= 0);
        for (const [id, n] of Object.entries(l.traits)) { assert.ok(TRAITS[id], id); assert.ok(Number.isInteger(n) && n >= 1 && n <= 3, `${id} at ${n}`); }
        assert.equal(Object.keys(l.traits).filter((id) => JAWS[id]).length, 1, 'one mouth, and never none');
        assert.ok(Object.keys(l.ways).length <= MAX_WAYS);
      }
      const v = view(g);
      for (const k of ['pop', 'feeds', 'upkeep']) assert.ok(Number.isFinite(v[k]), `${k} at seed ${seed}`);
      assert.ok(Number.isFinite(v.standing.score) && v.standing.rank >= 1 && v.standing.rank <= Object.keys(LINEAGES).length + 1);
      assert.ok(v.regionsHeld <= MAX_REGIONS);
    });
  }
});

test('every game ends, and the clock advances every turn', () => {
  for (let seed = 1; seed <= 12; seed++) {
    let last = 0;
    const g = playThrough(seed, ROADS[seed % 4], 'oneLife', (x) => { assert.ok(x.turns === last + 1); last = x.turns; assert.equal(x.s.log.length, x.s.clock); });
    assert.ok(g.over, `seed ${seed} never ended`);
    assert.ok(['through', 'extinct'].includes(g.outcome));
    assert.ok(g.turns <= 107);
  }
});

test('same seed and same choices give the same game', () => {
  assert.deepEqual(playThrough(7, 'mammal.plan', 'saved'), playThrough(7, 'mammal.plan', 'saved'));
});

test('whoever is alive at the end has come through, whatever its body, and has a place on the ladder', () => {
  let through = 0;
  for (let seed = 1; seed <= 40; seed++) {
    const g = playThrough(seed * 7919, ROADS[seed % 4], 'oneLife');
    const alive = totalPop(g.s.lineages.find((l) => l.player)) >= 1 && g.s.eraLog.length === 5;
    assert.equal(g.outcome === 'through', alive, `seed ${seed}`);
    if (g.outcome !== 'through') continue;
    through++;
    const v = view(g);
    assert.equal(v.ladder.length, Object.keys(LINEAGES).length + 1);
    assert.equal(v.ladder.find((r) => r.you).rank, g.s.rank);
    assert.ok(LINEAGES[g.s.like], 'resembles a lineage in the table');
    for (let i = 1; i < v.ladder.length; i++) assert.ok(v.ladder[i - 1].score >= v.ladder[i].score, 'the ladder is in order');
  }
  assert.ok(through > 0, 'no game in forty came through: the test proved nothing');
});

test('the lineages on the ladder are scored by the function that scores the player', async () => {
  const { standing } = await import('../src/engine/model.js');
  const v = view(newGame({ seed: 5 }));
  for (const row of v.ladder.filter((r) => !r.you)) assert.equal(row.score, standing(LINEAGES[row.id]).score);
});

test('a number of animals shown is the model\'s number times HEADS, everywhere', () => {
  const g = newGame({ seed: 9 }), v = view(g), you = g.s.lineages.find((l) => l.player);
  assert.equal(v.pop, totalPop(you) * HEADS);
  assert.equal(v.regions.reduce((a, r) => a + r.mine, 0), v.pop);
});

test('a moment must be met before the turn, and comes once', () => {
  let g = newGame({ seed: 3 }), met = 0;
  const seen = new Set();
  for (let i = 0; i < 60 && !g.over; i++) {
    const v = view(g);
    if (v.moment) {
      assert.ok(!seen.has(v.moment.id), 'a moment came twice'); seen.add(v.moment.id);
      assert.throws(() => advance(g, { keep: null }), /moment is waiting/);
      assert.throws(() => meet(g, 7), /not allowed/);
      g = meet(g, i % 3); met++;
    } else assert.throws(() => meet(g, 0), /no moment/);
    g = advance(g, { keep: null }).state;
  }
  assert.ok(met >= 2, 'expected at least two moments in sixty turns');
});

test('the game played through its verbs is the game the gate measured', () => {
  // The gate drives model.step directly. A person drives advance(). Same policy, same seed, same end.
  for (const policy of ROADS) for (let seed = 1; seed <= 6; seed++) {
    const a = playThrough(seed * 6151, policy, 'oneLife').s, b = play(seed * 6151, { policy: PLANS[policy] });
    assert.deepEqual([a.outcome, a.cause, a.standing, a.rank, a.eraLog, a.log], [b.outcome, b.cause, b.standing, b.rank, b.eraLog, b.log], `${policy} seed ${seed}`);
  }
});

test('an order the view marks as not allowed is refused by the engine', () => {
  const g = newGame({ seed: 3 });
  const v = view(g);
  const closed = v.regions.find((r) => !r.spread.ok);
  assert.ok(closed, 'expected a region that cannot be settled on turn one');
  assert.throws(() => setPlan(g, { spread: closed.id }), /not allowed/);
  assert.throws(() => setPlan(g, { press: 'gait' }), /not allowed/);
  assert.throws(() => setPlan(g, { ways: ['night', 'tend', 'fat'] }), /at most/);
  assert.throws(() => setPlan(g, { ways: ['flying'] }), /no such way/);
  const notOffered = Object.keys(TRAITS).find((id) => !v.offers.some((o) => o.id === id));
  assert.throws(() => advance(g, { keep: notOffered }), /not allowed/);
});

test('one life has no way back; a saved era can be begun again and rolls anew', () => {
  const one = playThrough(11, 'none', 'oneLife');
  assert.equal(one.outcome, 'extinct');
  assert.equal(one.saves.length, 0);
  assert.throws(() => retry(one, 0), /one life/);

  const dead = playThrough(11, 'none', 'saved');
  assert.equal(dead.outcome, 'extinct');
  const era = dead.s.diedIn;
  assert.ok(dead.saves[era], 'a save at the start of the era it died in');
  const again = retry(dead, era);
  assert.equal(again.over, false);
  assert.equal(again.s.era, era);
  assert.equal(again.s.turn, 0);
  assert.equal(again.tries[era], 1);
  assert.deepEqual(retry(dead, era), again, 'the same retry gives the same era');
  assert.equal(dead.outcome, 'extinct', 'going back leaves the lost run as it was');
});

test('with retries the bot finishes more often than without', () => {
  let once = 0, thrice = 0;
  for (let seed = 1; seed <= 30; seed++) {
    if (playGame(newGame({ seed: seed * 7919, setting: 'saved' }), 'mammal.plan', { retries: 0 }).outcome === 'through') once++;
    if (playGame(newGame({ seed: seed * 7919, setting: 'saved' }), 'mammal.plan', { retries: 2 }).outcome === 'through') thrice++;
  }
  assert.ok(thrice > once, `${thrice} with retries against ${once} without`);
});

test('the forecast of a die-off changes nothing, and names only changes that are allowed', () => {
  let g = newGame({ seed: 21 }), seen = 0;
  for (let i = 0; i < 70 && !g.over; i++) {
    const before = JSON.stringify(g), v = view(g);
    assert.equal(JSON.stringify(g), before, 'view() must not change the game');
    if (v.forecast) {
      seen++;
      assert.ok(Number.isFinite(v.forecast.left) && v.forecast.left >= 0);
      for (const h of v.forecast.helps) {
        assert.ok(h.left > v.forecast.left, 'a help leaves more than doing nothing');
        if (h.kind === 'trait') setPlan(g, { press: h.id });
        if (h.kind === 'settle') setPlan(g, { spread: h.id });
      }
    }
    if (v.moment) g = meet(g, 0);
    g = advance(g, decide(g, 'careful')).state;
  }
  assert.ok(seen > 3, 'expected the forecast to appear once a die-off was named');
});

test('a mouth is turned, never lost: it works until the new one is ready', () => {
  let g = newGame({ seed: 4 });
  assert.throws(() => setPlan(g, { shed: 'jawFish' }), /not let go/);
  assert.throws(() => setPlan(g, { turn: 'jawFish' }), /not allowed/);
  g = setPlan(g, { turn: 'jawInsects' });
  let turned = null;
  for (let i = 0; i < 12 && !turned; i++) {
    if (view(g).moment) g = meet(g, 0);
    const r = advance(g, { keep: null }); g = r.state; turned = r.record.turned;
    const jaws = Object.keys(g.s.lineages.find((l) => l.player).traits).filter((id) => JAWS[id]);
    assert.equal(jaws.length, 1, 'never without a mouth, never with two');
  }
  assert.deepEqual(turned, { from: 'jawFish', to: 'jawInsects' });
  assert.equal(view(g).mouth, 'jawInsects');
  assert.equal(view(g).pressure, null, 'the order is finished and dropped');
});

test('a lineage wears one covering, and turns it without going bare', () => {
  let g = newGame({ seed: 5 });
  const you = () => g.s.lineages.find((l) => l.player);
  Object.assign(you().traits, { lungs: 2, skin: 1, fur: 2, warm: 1 });
  let v = view(g);
  assert.equal(v.cover, 'fur');
  assert.equal(v.tree.flatMap((b) => b.traits).find((n) => n.id === 'scales').state, 'closed');
  assert.throws(() => setPlan(g, { watch: 'scales' }), /not allowed/);
  assert.equal(setPlan(g, { shed: 'fur' }).plan.shed, 'fur');   // at step 2 it can fade a step and warm blood still has a coat
});

test('warm blood needs a coat, and goes when the coat is turned to scales', () => {
  let g = newGame({ seed: 5 });
  const you = () => g.s.lineages.find((l) => l.player);
  Object.assign(you().traits, { lungs: 2, skin: 1, warm: 1 });
  assert.equal(view(g).traits.find((t) => t.id === 'warm').canPress, false);
  Object.assign(you().traits, { fur: 1 });
  assert.equal(view(g).traits.find((t) => t.id === 'warm').canPress, true);
  assert.equal(view(g).traits.find((t) => t.id === 'fur').canShed, false);
  const to = view(g).traits.find((t) => t.id === 'fur').turns;
  assert.deepEqual(to.find((o) => o.to === 'scales').loses, ['warm']);
  assert.deepEqual(to.find((o) => o.to === 'feathers').loses, []);
  g = setPlan(g, { turn: 'scales' });
  let seen = false;
  for (let i = 0; i < 12 && !g.over && !seen; i++) {
    if (view(g).moment) g = meet(g, 0);
    const r = advance(g, { keep: null }); g = r.state;
    assert.ok(view(g).cover, 'never bare while turning');
    if (r.record.recovered) { seen = true; assert.deepEqual(r.record.recovered, { from: 'fur', to: 'scales' }); }
  }
  assert.ok(seen, 'the covering turned');
  assert.equal(you().traits.warm, undefined);
});

test('traits that close each other off cannot both be grown', () => {
  const g = newGame({ seed: 5 });
  const you = g.s.lineages.find((l) => l.player);
  Object.assign(you.traits, { lungs: 2, skin: 1, limbs: 2, sail: 1, size: 2, burrow: 1 });
  const v = view(g), node = (id) => v.tree.flatMap((b) => b.traits).find((n) => n.id === id);
  assert.equal(node('fur').state, 'closed');
  assert.match(node('fur').why, /sail/);
  assert.match(v.traits.find((t) => t.id === 'burrow').pressWhy, /Closed off by a heavier body/);
  assert.throws(() => setPlan(g, { press: 'burrow' }), /not allowed/);
  assert.ok(!v.offers.some((o) => o.id === 'fur' || o.id === 'feathers'));
});

test('a trait watched for is offered within the turns the screen promises', () => {
  for (const seed of [3, 17, 99, 2024]) {
    let g = newGame({ seed });
    g.s.lineages.find((l) => l.player).traits.lungs = 2;
    assert.equal(view(g).tree.flatMap((b) => b.traits).find((n) => n.id === 'skin').state, 'open');
    g = setPlan(g, { watch: 'skin' });
    let got = -1;
    for (let i = 0; i <= view(g).watchTurns + 1 && got < 0; i++) {
      const v = view(g);
      if (v.offers.some((o) => o.id === 'skin')) { got = i; assert.ok(v.offers.find((o) => o.id === 'skin').watched); break; }
      assert.equal(v.watch.turns <= view(g).watchTurns, true);
      if (v.moment) g = meet(g, 0);
      g = advance(g, { keep: null }).state;
    }
    assert.ok(got >= 0 && got <= view(g).watchTurns, `seed ${seed}: offered after ${got} turns`);
    g = advance(view(g).moment ? meet(g, 0) : g, { keep: 'skin' }).state;
    assert.equal(view(g).watch, null);
  }
});

// ---- rivals (docs/FRAME-rivals.md) ----
import { contact, stanceWhy, byId, hunterAbove, canRaise } from '../src/engine/model.js';

function sharedStart(seed) {
  // A game with a rival on the player's ground, found by playing the careful bot forward.
  let g = newGame({ seed });
  for (let i = 0; i < 60 && !g.over; i++) {
    const r = view(g).rivals.find((x) => x.ground.length);
    if (r) return { g, r };
    if (view(g).moment) g = meet(g, 0);
    g = advance(g, decide(g, 'careful')).state;
  }
  return null;
}

test('a stance the Rivals screen marks as not allowed is refused, with its reason', () => {
  const found = sharedStart(11);
  assert.ok(found, 'expected a rival on shared ground');
  const { g, r } = found;
  for (const x of r.stances) {
    if (x.ok) assert.equal(setPlan(g, { stance: { id: r.id, act: x.act } }).plan.stance.act, x.act);
    else assert.throws(() => setPlan(g, { stance: { id: r.id, act: x.act } }), /not allowed/);
  }
  const far = view(g).rivals.find((x) => !x.ground.length);
  if (far) assert.throws(() => setPlan(g, { stance: { id: far.id, act: 'push' } }), /share no ground/);
});

test('a pushed rival pushes back, by the same rules', () => {
  const found = sharedStart(11);
  let { g, r } = found;
  g = setPlan(g, { stance: { id: r.id, act: 'push' } });
  if (view(g).moment) g = meet(g, 0);
  const first = advance(g, { keep: null });
  assert.ok(first.record.rivals.log.some((e) => e.by === 'you' && e.act === 'push'), 'the push was resolved');
  // The rival decides at the start of a turn, so it answers on the next one, as the player would.
  let h = first.state;
  if (view(h).moment) h = meet(h, 0);
  if (!view(h).stance) return;   // the push ended it: one side was driven out
  const second = advance(h, { keep: null }).state, R = byId(second.s, r.id);
  assert.ok(R, 'the rival is still there');
  assert.deepEqual(R.stance, { id: 'you', act: 'push' });
});

test('a scavenger eats behind a bigger hunter on its ground, without a stance; the old stances are gone', () => {
  // The author, 2026-11-28: two stances, push and prey. Following a hunter became the scavenger's own.
  const s = { seed: 1, opts: {}, era: 0, turn: 0, attempt: 0, clock: 0, rev: 1, lineages: [], regions: [{ id: 'a', wet: 0.6, temp: 0.5, pred: 0.2, food: { insects: 40, fish: 40, plants: 40, prey: 40, carrion: 5, hard: 5 } }] };
  const you = { id: 'you', player: true, traits: { lungs: 2, limbs: 2, jawPrey: 2, scavenge: 1 }, prog: {}, ways: {}, stance: null, pop: { a: 30 } };
  const R = { id: 'rival0', player: false, traits: { lungs: 2, limbs: 2, jawPrey: 2, size: 2 }, prog: {}, ways: {}, stance: null, pop: { a: 60 } };
  s.lineages = [you, R];
  assert.ok(hunterAbove(s, you, 'a'), 'a bigger hunter shares the ground');
  R.traits = { lungs: 2, limbs: 2, jawPlants: 2, size: 2 };
  assert.ok(!hunterAbove(s, you, 'a'), 'a plant-eater leaves nothing behind');
  for (const act of ['shadow', 'avoid']) assert.match(stanceWhy(s, you, R, act), /No such stance/);
});

test('each mouth refinement grows only on its own jaw; the omnivore\'s teeth on any', () => {
  assert.ok(canRaise({ lungs: 1, jawPrey: 2 }, 'scavenge'));
  assert.ok(!canRaise({ lungs: 1, jawInsects: 2 }, 'scavenge'));
  assert.ok(!canRaise({ lungs: 1, jawPrey: 2 }, 'crush'));
  assert.ok(canRaise({ lungs: 1, jawFish: 2 }, 'crush') && canRaise({ lungs: 1, jawPlants: 2 }, 'crush'));
  assert.ok(canRaise({ lungs: 1, jawInsects: 2 }, 'tongue') && !canRaise({ lungs: 1, jawPlants: 2 }, 'tongue'));
  for (const j of ['jawFish', 'jawInsects', 'jawPlants', 'jawPrey']) assert.ok(canRaise({ lungs: 1, [j]: 2 }, 'omni'));
});

// ---- colour (the author, 2026-11-27: "Have your colours only affect the numbers if you have those") ----
import { shade, matchIn, body as bodyOf } from '../src/engine/model.js';

test('colour changes nothing without camouflage or display', () => {
  const r = { id: 'a', wet: 0.8, temp: 0.5, pred: 0.3 };
  const t = { lungs: 2, limbs: 2, skin: 1, jawInsects: 2 }, b = bodyOf(t);
  for (const hue of [0, 45, 150, 300]) assert.deepEqual(shade({ traits: t, hue }, r, b), b);
});

test('camouflage hides where the colour matches; display shows where it stands out', () => {
  const wet = { id: 'a', wet: 1, temp: 0.5, pred: 0.3 };   // green ground, hue 150
  const camo = { lungs: 2, limbs: 2, skin: 1, jawInsects: 2, camouflage: 2 }, disp = { ...camo, camouflage: undefined, display: 2 };
  delete disp.camouflage;
  const bc = bodyOf(camo), bd = bodyOf(disp);
  assert.ok(matchIn({ hue: 150 }, wet) > 0.99 && matchIn({ hue: 330 }, wet) === 0);
  assert.ok(shade({ traits: camo, hue: 150 }, wet, bc).defence > shade({ traits: camo, hue: 330 }, wet, bc).defence);
  assert.ok(shade({ traits: disp, hue: 330 }, wet, bd).grow > shade({ traits: disp, hue: 150 }, wet, bd).grow);
  assert.ok(shade({ traits: disp, hue: 330 }, wet, bd).defence < bd.defence);
});

test('a camouflaged lineage\'s colour turns toward the ground it lives on, and is drawn as it is', () => {
  let g = newGame({ seed: 41 });
  const you = () => g.s.lineages.find((l) => l.player);
  Object.assign(you().traits, { skin: 1, camouflage: 2 });
  const start = view(g).colour, home = start.grounds.find((x) => x.mine);
  for (let i = 0; i < 8 && !g.over; i++) { if (view(g).moment) g = meet(g, 0); g = advance(g, { keep: null }).state; }
  const now = view(g).colour, there = now.grounds.find((x) => x.id === home.id);
  if (there && there.mine) assert.ok(there.match >= home.match, `match ${home.match.toFixed(2)} -> ${there.match.toFixed(2)}`);
  assert.equal(view(g).parts.look.deg, you().hue);
});
