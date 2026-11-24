// One run, turn by turn:  node sim/trace.js planner 7
import { play } from './play.js';
import { totalPop } from '../src/engine/model.js';
import { POLICIES } from '../src/engine/policies.js';
import { ERAS } from '../src/data/world.data.js';
const [name = 'planner', seed = 1] = process.argv.slice(2);
const s = play(Number(seed), { policy: POLICIES[name] });
let last = -1;
for (const h of s.log) { if (h.era !== last) { console.log(`\n${ERAS[h.era].name}`); last = h.era; } console.log(`  turn ${String(h.turn).padStart(2)}  pop ${h.pop.toFixed(1).padStart(7)}  regions ${h.regions}  upkeep ${h.upkeep.toFixed(2)}`); }
console.log(`\n${s.outcome}${s.cause ? ' (' + s.cause + ', ' + ERAS[s.diedIn].name + ')' : ''}`, JSON.stringify(s.eraLog.at(-1)?.traits || {}));
