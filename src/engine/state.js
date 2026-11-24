// The save contract and its migrations.
//
// The save KEY is a contract: renaming it orphans every save on every device.
// The payload carries `v`; MIGRATIONS[v] upgrades version v to v + 1. Every
// version that ever shipped has a fixture in test/fixtures/ that must load and
// play on (test/save-contract.test.js).
//
// v1 was the scaffold's placeholder game (a 24-turn trading toy), which was
// on Pages for a day. A v1 save cannot become a lineage, so its migration
// starts a new lineage from the same seed and says so in `note`.

import { freshGame } from './game.js';

export const SAVE_KEY = 'deep-time.save.v1'; // never rename
export const SHELF_KEY = 'deep-time.shelf.v1'; // lineages set aside by going back to an earlier era
export const SAVE_VERSION = 2;
export const CODE_PREFIX = 'DEEP1.';

/** MIGRATIONS[v](save) returns the save at version v + 1. Add one per version bump. */
export const MIGRATIONS = {
  1: (old) => ({ ...freshGame({ seed: old.seed, setting: 'saved' }), note: 'A save from the first test build could not be carried over. A new lineage was begun in its place.' }),
};

export function migrate(save) {
  let s = save;
  if (!s || typeof s !== 'object' || !Number.isInteger(s.v)) throw new Error('not a save');
  if (s.v > SAVE_VERSION) throw new Error(`save is from a newer version (${s.v}) than this build (${SAVE_VERSION})`);
  while (s.v < SAVE_VERSION) {
    const step = MIGRATIONS[s.v];
    if (!step) throw new Error(`no migration from save version ${s.v}`);
    s = step(s);
  }
  return s;
}

export const serialize = (state) => JSON.stringify(state);
export const deserialize = (text) => migrate(JSON.parse(text));

/** A save as text, to move between devices or between itch and the Pages copy. */
export function toCode(state) {
  const b64 = btoa(unescape(encodeURIComponent(serialize(state))));
  return CODE_PREFIX + b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function fromCode(code) {
  const text = String(code).trim();
  if (!text.startsWith(CODE_PREFIX.slice(0, -2))) throw new Error('That is not a save code for this game.');
  const body = text.slice(text.indexOf('.') + 1).replace(/-/g, '+').replace(/_/g, '/');
  return deserialize(decodeURIComponent(escape(atob(body))));
}
