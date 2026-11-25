// sim/adapter.js connects this game to the game-measure kit (sim/run.js).
// The kit files are not edited per game; this one is. These runs go through the
// game's own verbs (advance, setPlan, retry). The gate (sim/gate.js) drives the
// rules directly and is the place balance is measured.

import { newGame } from '../src/engine/turn.js';
import { POLICIES, playGame } from './bot.js';

export const axes = { policy: POLICIES, setting: ['oneLife', 'saved'] };
export const defaults = { policy: 'careful', setting: 'oneLife' };

export function play(seed, opts = {}) {
  const setting = opts.setting || 'oneLife';
  return playGame(newGame({ seed, setting }), opts.policy || 'careful', { retries: setting === 'saved' ? 2 : 0 });
}

export function progress(g) {
  const missing = [];
  if (!g.over) missing.push('never ended');
  if (g.turns < 3) missing.push(`only ${g.turns} turns played`);
  if (g.s.log.length !== g.s.clock) missing.push('the world clock and its log disagree');
  return missing;
}

export function metrics(g) {
  return {
    through: g.outcome === 'through',
    topThree: g.outcome === 'through' && g.s.rank <= 3,
    turns: g.turns,
    erasPassed: g.s.eraLog.length,
    retries: g.tries.reduce((a, b) => a + b, 0),
  };
}

export function digest(g) {
  return JSON.stringify([g.outcome, g.turns, g.s.standing ?? null, g.s.eraLog]);
}

export function trace(g) {
  return g.s.log.map((h) => `era ${h.era + 1} turn ${String(h.turn + 1).padStart(2)}  numbers ${h.pop.toFixed(1).padStart(7)}  regions ${h.regions}  upkeep ${h.upkeep.toFixed(2)}`).join('\n') + `\n${g.outcome}`;
}
