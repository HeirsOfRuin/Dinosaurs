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
        assert.ok(Object.keys(l.traits).filter((id) => JAWS[id]).length <= 1, 'one mouth');
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
