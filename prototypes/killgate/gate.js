// The kill gate's tables:  node prototypes/killgate/gate.js [runs=1000]
// Every policy plays the same seeds. Rates carry ±1 SE; a gap between two rows
// counts when it exceeds the floor printed under each table.
import { play, playSaved } from './model.js';
import { POLICIES } from './policies.js';
import { ERAS } from './data.js';
import { seRate, noiseFloor } from '../../sim/stats.js';

const n = Number(process.argv[2] || 1000);
const seeds = Array.from({ length: n }, (_, i) => 11 + i * 7919);
const rate = (k, m = n) => (m ? `${(100 * k / m).toFixed(1)}±${seRate(k / m, m).toFixed(1)}` : '-').padStart(10);
const mean = (xs) => (xs.length ? (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(0) : '-').padStart(6);
const reached = (s, e) => s.eraLog.length >= e || (s.era >= e && s.diedIn !== null && s.diedIn >= e) || s.outcome !== 'extinct';
const floor = (p = 0.5) => `Floor: two rows differ when the gap exceeds ${noiseFloor(p, n).toFixed(1)} points (${n} runs each).`;
const runAll = (opts) => seeds.map((seed) => play(seed, opts));
let stalled = 0;
const guard = (rs) => { for (const s of rs) if (!s.ended || s.clock < 1) stalled++; return rs; };

console.log(`\n1. One life (the hard setting): how far each policy gets, ${n} seeds`);
console.log('policy       ' + ['past Shore', 'past Coal', 'past Dry', 'past Dying', 'alive end', 'dinosaur', 'WIN'].map((h) => h.padStart(10)).join(' '));
const base = {};
for (const [name, policy] of Object.entries(POLICIES)) {
  const rs = base[name] = guard(runAll({ policy }));
  const past = (e) => rs.filter((s) => s.eraLog.length > e).length;
  console.log(name.padEnd(13) + [past(0), past(1), past(2), past(3), rs.filter((s) => s.outcome !== 'extinct').length, rs.filter((s) => s.dinoAt != null).length, rs.filter((s) => s.outcome === 'win').length].map((k) => rate(k)).join(' '));
}
console.log(floor());

console.log('\n2. Each era on its own: survival of those who arrived, and mean numbers at mid-era');
console.log('policy       ' + ERAS.map((e) => e.id.padStart(10) + '   pop').join(' '));
for (const [name, rs] of Object.entries(base)) {
  console.log(name.padEnd(13) + ERAS.map((_, e) => {
    const in_ = rs.filter((s) => (e === 0) || s.eraLog.length >= e), out = in_.filter((s) => s.eraLog.length > e);
    const mid = Math.floor(ERAS[e].turns / 2), pops = in_.map((s) => s.log.find((h) => h.era === e && h.turn === mid)).filter(Boolean).map((h) => h.pop);
    return rate(out.length, in_.length) + mean(pops);
  }).join(' '));
}
console.log('A dash means nobody arrived. Rates over few arrivals have wide errors, shown.');

console.log('\n3. Where and how lineages end (share of all runs)');
console.log('policy       ' + ['starved', 'die-off', 'unfit', 'not dino', 'win'].map((h) => h.padStart(10)).join(' '));
for (const [name, rs] of Object.entries(base)) console.log(name.padEnd(13) + ['starved', 'dieoff', 'unfit'].map((c) => rate(rs.filter((s) => s.cause === c).length)).join(' ') + ' ' + rate(rs.filter((s) => s.outcome === 'survived').length) + ' ' + rate(rs.filter((s) => s.outcome === 'win').length));

console.log('\n4. Warning: how many turns ahead the die-off is named (planner)');
console.log('lead         ' + ['past Dying', 'WIN'].map((h) => h.padStart(10)).join(' '));
for (const lead of [0, 1, 3, 5, 8]) { const rs = guard(runAll({ policy: POLICIES.planner, lead })); console.log(String(lead).padEnd(13) + rate(rs.filter((s) => s.eraLog.length > 3).length) + ' ' + rate(rs.filter((s) => s.outcome === 'win').length)); }
console.log(floor());

console.log('\n5. Range: regions held, same body plan (recipe, no warning heeded)');
console.log('regions      ' + ['past Dying', 'alive end', 'WIN'].map((h) => h.padStart(10)).join(' ') + '  pop mid-Coal  mid-Dry  turns to dinosaur body');
for (const regions of [1, 2, 3]) {
  const rs = guard(runAll({ policy: { plan: 'recipe', regions } }));
  const pop = (e) => mean(rs.map((s) => s.log.find((h) => h.era === e && h.turn === Math.floor(ERAS[e].turns / 2))).filter(Boolean).map((h) => h.pop));
  console.log(String(regions).padEnd(13) + rate(rs.filter((s) => s.eraLog.length > 3).length) + ' ' + rate(rs.filter((s) => s.outcome !== 'extinct').length) + ' ' + rate(rs.filter((s) => s.outcome === 'win').length) + '        ' + pop(1) + '   ' + pop(2) + '   ' + mean(rs.filter((s) => s.bodyAt != null).map((s) => s.bodyAt)));
}
console.log(floor());

console.log('\n6. Switches: the world with one thing removed (planner)');
console.log('world        ' + ['past Dying', 'WIN'].map((h) => h.padStart(10)).join(' '));
for (const [label, o] of [['as designed', {}], ['no rivals', { noRivals: true }], ['no die-offs', { noDieoff: true }]]) { const rs = guard(runAll({ policy: POLICIES.planner, ...o })); console.log(label.padEnd(13) + rate(rs.filter((s) => s.eraLog.length > 3).length) + ' ' + rate(rs.filter((s) => s.outcome === 'win').length)); }

console.log('\n7. A save at every era (the easy setting): up to 5 tries an era, the era rolled again each time');
console.log('policy       ' + ['WIN', 'alive end'].map((h) => h.padStart(10)).join(' ') + '  mean tries used  stuck saves by era (5 losses of 5)');
for (const name of ['specialist', 'generalist', 'opportunist', 'recipe', 'planner']) {
  const rs = seeds.map((seed) => playSaved(seed, { policy: POLICIES[name] }));
  const stuck = ERAS.map((_, e) => rs.filter((s) => s.outcome === 'extinct' && s.retries[e] >= 5).length);
  console.log(name.padEnd(13) + rate(rs.filter((s) => s.outcome === 'win').length) + ' ' + rate(rs.filter((s) => s.outcome !== 'extinct').length) + '  ' + (rs.reduce((a, s) => a + s.retries.reduce((x, y) => x + y, 0), 0) / n).toFixed(2).padStart(15) + '  ' + stuck.map((k, e) => `${ERAS[e].id} ${(100 * k / n).toFixed(1)}%`).join(', '));
}
console.log(floor());

if (stalled) { console.error(`\n${stalled} run(s) did not end or did not move the clock`); process.exit(1); }
console.log(`\nEvery run ended and moved its clock.`);
