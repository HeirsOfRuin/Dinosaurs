// Every per-era list in a game is as long as the eras: five fixed tries broke the saved setting past the
// Triassic once the run grew to eight eras (round F gate: 523 saved runs never ended).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newGame, advance, retry } from '../src/engine/turn.js';
import { decide } from '../sim/bot.js';
import { ERAS } from '../src/data/world.data.js';

test('a saved game counts tries for every era, and a retry counts as a whole number', () => {
  const g0 = newGame({ seed: 7, setting: 'saved' });
  assert.equal(g0.tries.length, ERAS.length);
  let g = g0;
  for (let i = 0; i < 400 && !g.over; i++) g = advance(g, decide(g, 'none')).state;
  assert.ok(g.over);
  const era = g.s.diedIn;
  const again = retry(g, era);
  assert.equal(again.tries[era], 1);
  assert.ok(again.tries.every(Number.isInteger));
});

import { deserialize, serialize } from '../src/engine/state.js';
test('a save made with five counts of tries loads with one an era', () => {
  const g = newGame({ seed: 9, setting: 'saved' });
  const old = JSON.parse(serialize(g)); old.tries = [0, 0, 0, 0, 0];
  assert.equal(deserialize(JSON.stringify(old)).tries.length, ERAS.length);
});
