// The save contract. Every save version that ever shipped has a fixture in
// test/fixtures/v<N>-save.json; each must load through migrate() and play on.
// When SAVE_VERSION goes up: add MIGRATIONS[old], and commit a fixture saved by
// the old build BEFORE changing it.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { SAVE_VERSION, MIGRATIONS, deserialize, serialize, toCode, fromCode } from '../src/engine/state.js';
import { newGame, advance, view } from '../src/engine/turn.js';

const dir = new URL('./fixtures/', import.meta.url);
const fixtures = readdirSync(dir).filter((f) => /^v\d+-save\.json$/.test(f)).sort();

test('there is a fixture for every save version up to the current one', () => {
  for (let v = 1; v <= SAVE_VERSION; v++) assert.ok(fixtures.includes(`v${v}-save.json`), `missing test/fixtures/v${v}-save.json`);
});

test('there is a migration from every older version', () => {
  for (let v = 1; v < SAVE_VERSION; v++) assert.equal(typeof MIGRATIONS[v], 'function', `no MIGRATIONS[${v}]`);
});

for (const f of fixtures) {
  test(`${f} loads and plays on`, () => {
    let g = deserialize(readFileSync(new URL(f, dir), 'utf8'));
    assert.equal(g.v, SAVE_VERSION);
    for (let i = 0; i < 3 && !g.over; i++) g = advance(g, { keep: view(g).offers[0]?.id ?? null }).state;
    assert.ok(g.turns >= 1);
  });
}

test('a save from the placeholder build becomes a new lineage, and says so', () => {
  const g = deserialize(readFileSync(new URL('v1-save.json', dir), 'utf8'));
  assert.match(g.note, /could not be carried over/);
  assert.equal(g.turns, 0);
});

test('a save code round-trips', () => {
  let g = newGame({ seed: 99 });
  for (let i = 0; i < 5; i++) g = advance(g, { keep: null }).state;
  assert.deepEqual(fromCode(toCode(g)), g);
  assert.deepEqual(deserialize(serialize(g)), g);
});

test('a save from a newer build is refused with a reason, not loaded wrongly', () => {
  assert.throws(() => deserialize(JSON.stringify({ ...newGame(), v: SAVE_VERSION + 1 })), /newer version/);
});
