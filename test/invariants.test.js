// What can never be true. Impossibility assertions, not magnitudes: magnitude
// asserts get deleted on the first rebalance, impossibility asserts survive it.
// Each test plays real games through the bot, so "it held" means it held over
// games that actually happened.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newGame, advance, setPlan, retry, view } from '../src/engine/turn.js';
import { totalPop } from '../src/engine/model.js';
import { TRAITS, ENDINGS, MAX_REGIONS } from '../src/data/world.data.js';
import { POLICIES as PLANS } from '../src/engine/policies.js';
import { decide, playGame } from '../sim/bot.js';
import { play } from '../sim/play.js';

const ROADS = ['dinosaur.plan', 'crocodile.plan', 'mammal.plan', 'amphibian.plan'];

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
      }
      const v = view(g);
      for (const k of ['pop', 'feeds', 'upkeep']) assert.ok(Number.isFinite(v[k]), `${k} at seed ${seed}`);
      assert.ok(v.regionsHeld <= MAX_REGIONS);
    });
  }
});

test('every game ends, and the clock advances every turn', () => {
  for (let seed = 1; seed <= 12; seed++) {
    let last = 0;
    const g = playThrough(seed, ROADS[seed % 4], 'oneLife', (x) => { assert.ok(x.turns === last + 1); last = x.turns; assert.equal(x.s.log.length, x.s.clock); });
    assert.ok(g.over, `seed ${seed} never ended`);
    assert.ok(['win', 'survived', 'extinct'].includes(g.outcome));
    assert.ok(g.turns <= 107);
  }
});

test('same seed and same choices give the same game', () => {
  assert.deepEqual(playThrough(7, 'mammal.plan', 'saved'), playThrough(7, 'mammal.plan', 'saved'));
});

test('a win is always one of the four animals, with the body for it', () => {
  let wins = 0;
  for (let seed = 1; seed <= 60; seed++) {
    const g = playThrough(seed * 7919, ROADS[seed % 4], 'oneLife');
    if (g.outcome !== 'win') continue;
    wins++;
    const you = g.s.lineages.find((l) => l.player);
    assert.ok(ENDINGS[you.form]);
    for (const [id, n] of Object.entries(ENDINGS[you.form].min)) assert.ok((you.traits[id] || 0) >= n, `${you.form} without ${id}`);
  }
  assert.ok(wins > 0, 'no game in sixty was won: the test proved nothing');
});

test('the game played through its verbs is the game the gate measured', () => {
  // The gate drives model.step directly. A person drives advance(). Same policy, same seed, same end.
  for (const policy of ROADS) for (let seed = 1; seed <= 6; seed++) {
    const a = playThrough(seed * 6151, policy, 'oneLife').s, b = play(seed * 6151, { policy: PLANS[policy] });
    assert.deepEqual([a.outcome, a.cause, a.form, a.eraLog, a.log], [b.outcome, b.cause, b.form, b.eraLog, b.log], `${policy} seed ${seed}`);
  }
});

test('an order the view marks as not allowed is refused by the engine', () => {
  const g = newGame({ seed: 3 });
  const v = view(g);
  const closed = v.regions.find((r) => !r.spread.ok);
  assert.ok(closed, 'expected a region that cannot be settled on turn one');
  assert.throws(() => setPlan(g, { spread: closed.id }), /not allowed/);
  assert.throws(() => setPlan(g, { press: 'gait' }), /not allowed/);
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
    if (playGame(newGame({ seed: seed * 7919, setting: 'saved' }), 'dinosaur.plan', { retries: 0 }).outcome === 'win') once++;
    if (playGame(newGame({ seed: seed * 7919, setting: 'saved' }), 'dinosaur.plan', { retries: 2 }).outcome === 'win') thrice++;
  }
  assert.ok(thrice > once, `${thrice} with retries against ${once} without`);
});
