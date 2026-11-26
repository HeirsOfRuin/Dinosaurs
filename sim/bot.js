// The reference player, playing through the same verbs as a person: view,
// setPlan and advance. It asks the measured policies (src/engine/policies.js)
// what to do, on a copy of the world with its policy attached, then gives the
// answer to the game as orders. An order the game refuses is a bug, and throws.
//
// What it never does: use the 'random' plan, or go back to an earlier era's
// save by choice. On the saved setting it retries the era it died in, up to
// `retries`.

import { advance, retry } from '../src/engine/turn.js';
import { offersFor, warning } from '../src/engine/model.js';
import { decide as policyDecide, POLICIES as ALL } from '../src/engine/policies.js';

export const POLICIES = Object.keys(ALL).filter((k) => k !== 'drifter');

export function decide(game, policy = 'careful') {
  const s = structuredClone(game.s), you = s.lineages.find((l) => l.player);
  you.plan = ALL[policy];
  const d = policyDecide(s, you, offersFor(s, you), warning(s));
  const plan = { spread: d.spread ?? null, ways: d.ways || [], pick: d.pick ?? 0, watch: d.watch ?? null };
  if (d.turn) plan.turn = d.turn; else if (d.shed) plan.shed = d.shed; else { plan.shed = null; plan.turn = null; plan.press = d.press ?? null; }
  return { keep: d.keep ?? null, plan };
}

export function playGame(game, policy, { retries = 0 } = {}) {
  let g = game;
  for (let guard = 0; guard < 5000; guard++) {
    if (g.over) {
      const era = g.s.diedIn;
      if (g.outcome !== 'extinct' || g.setting !== 'saved' || g.tries[era] >= retries) break;
      g = retry(g, era);
      continue;
    }
    g = advance(g, decide(g, policy)).state;
  }
  return g;
}
