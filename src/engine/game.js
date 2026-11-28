// A game: the world (model.js state `s`) plus what belongs to the player's
// sitting rather than to the world: the setting, the standing orders (what is
// under pressure, the ways of living, settlers waiting to leave, the road chosen
// at a moment), the era saves and how many times each era has been tried.

import { newGame as newWorld } from './model.js';
import { ERAS } from '../data/world.data.js';

export const SETTINGS = ['saved', 'oneLife'];

export function freshGame({ seed = 1, setting = 'saved' } = {}) {
  if (!SETTINGS.includes(setting)) throw new Error(`unknown setting: ${setting}`);
  const s = newWorld(seed >>> 0, {});
  s.lineages.find((l) => l.player).plan = null;   // the player's lineage has no policy; a save must not hold `undefined`
  return {
    v: 8,
    seed: seed >>> 0,
    setting,
    s,
    // Standing orders: they hold from turn to turn so a quiet turn is one tap.
    plan: { press: null, shed: null, turn: null, spread: null, ways: [], pick: null, watch: null, stance: null },
    // saves[e] is the world as era e opened. Kept only on the saved setting.
    saves: setting === 'saved' ? [structuredClone(s)] : [],
    tries: ERAS.map(() => 0),   // one count an era (five fixed zeros until 2026-11-28 broke retries past the Triassic)
    turns: 0,
    over: false,
    outcome: null,
    note: null,
  };
}
