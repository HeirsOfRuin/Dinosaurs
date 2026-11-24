// Whole games played by a policy, for the gate and the tests. The rules are
// src/engine/model.js; nothing here changes them.
import { newGame, step, rerollEra } from '../src/engine/model.js';
import { decide } from '../src/engine/policies.js';

export function play(seed, opts = {}) {
  const s = newGame(seed, opts);
  for (let guard = 0; !s.ended && guard < 1000; guard++) step(s, decide);
  return s;
}

// Easy setting: a save at the start of every era. A loss goes back to that save
// and the era is rolled again (new attempt, new die-off). Returns the end state
// with s.retries per era. The bot does not learn between tries, so this measures
// luck only; a person would also change their play.
export function playSaved(seed, opts = {}, maxRetries = 5) {
  // A replayed era rolls a new die-off (the author, 2026-11-24: a replay is not a memory test).
  let s = newGame(seed, opts), save = structuredClone(s);
  const retries = [0, 0, 0, 0, 0];
  for (let guard = 0; guard < 5000; guard++) {
    const era = s.era;
    step(s, decide);
    if (s.ended && s.outcome === 'extinct') {
      const at = save.era;
      if (retries[at] >= maxRetries) break;
      retries[at] += 1;
      s = rerollEra(structuredClone(save), retries[at]);
      continue;
    }
    if (s.ended) break;
    if (s.era !== era) save = structuredClone(s);
  }
  s.retries = retries;
  return s;
}
