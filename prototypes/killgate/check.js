// Proves the model before its numbers are believed:
//   1. the same seed and policy give a byte-identical end state, twice;
//   2. every run ends, moved its clock, and kept every number finite and no count below zero;
//   3. nothing declared is decoration: every policy part and every world switch
//      changes the end state on at least one seed in ten.
//   node prototypes/killgate/check.js [seeds=40]
import { play, playSaved, totalPop, fits } from './model.js';
import { ENDINGS } from './data.js';
import { POLICIES } from './policies.js';

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
  }
  if (a.outcome === 'win' && !(a.form && fits(a.lineages[0].traits, ENDINGS[a.form]))) throw new Error(`${name} seed ${seed}: won without the body of its ending`);
}
for (const seed of seeds.slice(0, 10)) { if (snap(playSaved(seed, { policy: POLICIES['mammal.plan'] })) !== snap(playSaved(seed, { policy: POLICIES['mammal.plan'] }))) throw new Error(`saved play, seed ${seed}: two runs differ`); runs += 2; }
console.log(`ok  deterministic, ended, clock moved, numbers sound: ${runs} runs`);

const basePolicy = POLICIES['dinosaur.plan'];
const base = seeds.map((seed) => snap(play(seed, { policy: basePolicy }).eraLog) + play(seed, { policy: basePolicy }).outcome);
const parts = {
  'plan: none': { policy: { ...basePolicy, plan: 'none' } }, 'plan: random': { policy: { ...basePolicy, plan: 'random' } },
  'plan: special': { policy: { ...basePolicy, plan: 'special' } }, 'plan: tolerant': { policy: { ...basePolicy, plan: 'tolerant' } },
  'plan: greedy': { policy: { ...basePolicy, plan: 'greedy' } },
  'regions: 1': { policy: { ...basePolicy, regions: 1 } }, 'regions: 3': { policy: { ...basePolicy, regions: 3 } },
  'heed: off': { policy: { ...basePolicy, heed: false } }, 'diet: off': { policy: { ...basePolicy, diet: false } }, 'never leaves': { policy: { ...basePolicy, stay: true } },
  'road: crocodile': { policy: { ...basePolicy, road: 'crocodile' } }, 'road: mammal': { policy: { ...basePolicy, road: 'mammal' } }, 'road: amphibian': { policy: { ...basePolicy, road: 'amphibian' } },
  'warning lead 0': { policy: basePolicy, lead: 0 }, 'warning lead 8': { policy: basePolicy, lead: 8 },
  'no rivals': { policy: basePolicy, noRivals: true }, 'no die-offs': { policy: basePolicy, noDieoff: true },
};
let inert = 0;
for (const [name, o] of Object.entries(parts)) {
  const k = seeds.filter((seed, i) => { const s = play(seed, o); return snap(s.eraLog) + s.outcome !== base[i]; }).length;
  if (k < n / 10) { inert++; console.log(`INERT  ${name}: changes ${k} of ${n} seeds`); } else console.log(`ok  ${name.padEnd(16)} changes ${k} of ${n} seeds`);
}
if (inert) { console.error(`${inert} inert part(s)`); process.exit(1); }
