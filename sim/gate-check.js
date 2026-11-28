// Proves the model before its numbers are believed:
//   1. the same seed and policy give a byte-identical end state, twice;
//   2. every run ends, moved its clock, and kept every number finite and no count below zero;
//   3. nothing declared is decoration: every policy part and every world switch
//      changes the end state on at least one seed in ten.
//   node sim/gate-check.js [seeds=40]
import { play, playSaved } from './play.js';
import { totalPop } from '../src/engine/model.js';
import { JAWS, COVERS, BARS, TRAITS, WAYS, MAX_WAYS, MOMENTS } from '../src/data/world.data.js';
import { POLICIES } from '../src/engine/policies.js';

const n = Number(process.argv[2] || 40);
const seeds = Array.from({ length: n }, (_, i) => 5 + i * 6151);
const snap = (s) => JSON.stringify(s);
let runs = 0;
for (const [name, policy] of Object.entries(POLICIES)) for (const seed of seeds) {
  const a = play(seed, { policy }), b = play(seed, { policy }); runs += 2;
  if (snap(a) !== snap(b)) throw new Error(`${name} seed ${seed}: two runs differ`);
  if (!a.ended || a.clock < 1 || a.log.length !== a.clock) throw new Error(`${name} seed ${seed}: did not end, or the clock did not move`);
  for (const l of a.lineages) {
    if (!Number.isFinite(totalPop(l)) || Object.values(l.pop).some((p) => p < 0)) throw new Error(`${name} seed ${seed}: a population is not a number or is below zero`);
    if (Object.values(l.traits).some((v) => !Number.isInteger(v) || v < 1 || v > 3)) throw new Error(`${name} seed ${seed}: a trait level is outside 1..3`);
    if (Object.keys(l.traits).filter((id) => JAWS[id]).length > 1) throw new Error(`${name} seed ${seed}: a lineage holds two mouths`);
    if (COVERS.filter((id) => l.traits[id]).length > 1) throw new Error(`${name} seed ${seed}: a lineage wears two coverings`);
    for (const id of Object.keys(l.traits)) if (TRAITS[id].under && !TRAITS[id].under.some((o) => l.traits[o])) throw new Error(`${name} seed ${seed}: ${id} with nothing over it`);
    if (l.player) for (const [[a, na], [b, nb]] of BARS) if ((l.traits[a] || 0) >= na && (l.traits[b] || 0) >= nb) throw new Error(`${name} seed ${seed}: holds both ${a} and ${b}, which close each other off`);
    if (Object.keys(l.ways).length > MAX_WAYS) throw new Error(`${name} seed ${seed}: more ways of living than a lineage may hold`);
  }
  if (a.outcome === 'through' && !(a.rank >= 1 && a.rank <= 8 && Number.isFinite(a.standing))) throw new Error(`${name} seed ${seed}: came through without a standing`);
  if (new Set(a.seen).size !== a.seen.length) throw new Error(`${name} seed ${seed}: a moment came twice`);
}
for (const seed of seeds.slice(0, 10)) { if (snap(playSaved(seed, { policy: POLICIES['mammal.plan'] })) !== snap(playSaved(seed, { policy: POLICIES['mammal.plan'] }))) throw new Error(`saved play, seed ${seed}: two runs differ`); runs += 2; }
console.log(`ok  deterministic, ended, clock moved, numbers sound: ${runs} runs`);

const basePolicy = POLICIES.careful;
const sig = (s) => snap(s.eraLog) + s.outcome + (s.standing ?? '');
const base = seeds.map((seed) => sig(play(seed, { policy: basePolicy })));
const parts = {
  'plan: none': { policy: { ...basePolicy, plan: 'none' } }, 'plan: random': { policy: { ...basePolicy, plan: 'random' } },
  'plan: special': { policy: { ...basePolicy, plan: 'special' } }, 'plan: wide': { policy: { ...basePolicy, plan: 'wide' } }, 'plan: tolerant': { policy: { ...basePolicy, plan: 'tolerant' } },
  'plan: greedy': { policy: { ...basePolicy, plan: 'greedy' } }, 'plan: recipe': { policy: { ...basePolicy, plan: 'recipe', road: 'bird' } },
  'road: turtle': { policy: { ...basePolicy, plan: 'recipe', road: 'turtle' } },
  'regions: 1': { policy: { ...basePolicy, regions: 1 } }, 'regions: 3': { policy: { ...basePolicy, regions: 3 } },
  'heed: off': { policy: { ...basePolicy, heed: false } }, 'brace: off': { policy: { ...basePolicy, brace: false } },
  ...Object.fromEntries(WAYS.map((w) => ['way: ' + w, { policy: { ...basePolicy, ways: [w], brace: false } }])),
  'ways: none': { policy: { ...basePolicy, ways: [], brace: false } },
  'moment: second road': { policy: { ...basePolicy, pick: 1 } }, 'moment: third road': { policy: { ...basePolicy, pick: 2 } }, 'no moments': { policy: basePolicy, noMoments: true },
  'warning lead 0': { policy: basePolicy, lead: 0 }, 'warning lead 8': { policy: basePolicy, lead: 8 },
  'no watching': { policy: basePolicy, noWatch: true }, 'road: mammal': { policy: { ...basePolicy, plan: 'recipe', road: 'mammal' } },
  'stances: off': { policy: { ...basePolicy, act: false } }, 'rivals passive': { policy: basePolicy, passiveRivals: true },
  'no rivals': { policy: basePolicy, noRivals: true }, 'no die-offs': { policy: basePolicy, noDieoff: true },
};
let inert = 0;
for (const [name, o] of Object.entries(parts)) {
  const k = seeds.filter((seed, i) => sig(play(seed, o)) !== base[i]).length;
  if (k < n / 10) { inert++; console.log(`INERT  ${name}: changes ${k} of ${n} seeds`); } else console.log(`ok  ${name.padEnd(20)} changes ${k} of ${n} seeds`);
}
// Every road at every moment must do something: an option that changes nothing is decoration.
for (const [id, m] of Object.entries(MOMENTS)) for (let i = 0; i < m.options.length; i++) if (!m.options[i].length) { inert++; console.log(`INERT  moment ${id}, road ${i + 1}: does nothing`); }
if (inert) { console.error(`${inert} inert part(s)`); process.exit(1); }
