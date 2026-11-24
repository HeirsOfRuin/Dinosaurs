// The kill gate's tables:  node prototypes/killgate/gate.js [runs=1000]
// Every arm plays the same seeds. Rates carry ±1 SE; a gap between two rows
// counts when it exceeds the floor printed under each table.
import { play, playSaved } from './model.js';
import { POLICIES, ROADS } from './policies.js';
import { ERAS, ENDINGS } from './data.js';
import { seRate, noiseFloor } from '../../sim/stats.js';

const n = Number(process.argv[2] || 1000);
const seeds = Array.from({ length: n }, (_, i) => 11 + i * 7919);
const rate = (k, m = n) => (m ? `${(100 * k / m).toFixed(1)}±${seRate(k / m, m).toFixed(1)}` : '-').padStart(10);
const mean = (xs) => (xs.length ? (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(0) : '-').padStart(6);
const floor = (p = 0.5) => `Floor: two rows differ when the gap exceeds ${noiseFloor(p, n).toFixed(1)} points (${n} runs each).`;
let stalled = 0, total = 0;
const guard = (rs) => { for (const s of rs) { total++; if (!s.ended || s.clock < 1) stalled++; } return rs; };
const runAll = (opts) => guard(seeds.map((seed) => play(seed, opts)));
const won = (rs) => rs.filter((s) => s.outcome === 'win').length;
const pastDying = (rs) => rs.filter((s) => s.eraLog.length > 3).length;
const roads = Object.keys(ROADS);

console.log(`\n1. One life: how far each policy gets, ${n} seeds`);
console.log('policy          ' + ['past Shore', 'past Coal', 'past Dry', 'past Dying', 'alive end', 'WIN'].map((h) => h.padStart(10)).join(' '));
const base = {};
for (const [name, policy] of Object.entries(POLICIES)) {
  const rs = base[name] = runAll({ policy });
  const past = (e) => rs.filter((s) => s.eraLog.length > e).length;
  console.log(name.padEnd(16) + [past(0), past(1), past(2), past(3), rs.filter((s) => s.outcome !== 'extinct').length, won(rs)].map((k) => rate(k)).join(' '));
}
console.log(floor());

console.log('\n2. The four endings: a list followed blind against the same road walked with eyes open (one life)');
console.log('ending          ' + ['list WIN', 'plan WIN', 'gap'].map((h) => h.padStart(10)).join(' ') + '   won as (plan)');
for (const r of roads) {
  const a = won(base[r + '.list']), b = won(base[r + '.plan']);
  const as = Object.keys(ENDINGS).map((e) => [e, base[r + '.plan'].filter((s) => s.outcome === 'win' && s.form === e).length]).filter((x) => x[1]).map(([e, k]) => `${e} ${k}`).join(', ');
  console.log(r.padEnd(16) + rate(a) + ' ' + rate(b) + ' ' + ((100 * (b - a) / n).toFixed(1) + ' pts').padStart(10) + '   ' + as);
}
console.log(floor(0.15));

console.log('\n3. Each era on its own: survival of those who arrived, and mean numbers at mid-era');
console.log('policy          ' + ERAS.map((e) => e.id.padStart(10) + '   pop').join(' '));
for (const [name, rs] of Object.entries(base)) {
  console.log(name.padEnd(16) + ERAS.map((_, e) => {
    const in_ = rs.filter((s) => (e === 0) || s.eraLog.length >= e), out = in_.filter((s) => s.eraLog.length > e);
    const mid = Math.floor(ERAS[e].turns / 2), pops = in_.map((s) => s.log.find((h) => h.era === e && h.turn === mid)).filter(Boolean).map((h) => h.pop);
    return rate(out.length, in_.length) + mean(pops);
  }).join(' '));
}
console.log('A dash means nobody arrived. Rates over few arrivals have wide errors, shown.');

console.log('\n4. How lineages end (share of all runs)');
console.log('policy          ' + ['starved', 'die-off', 'unfit', 'no form', 'win'].map((h) => h.padStart(10)).join(' '));
for (const [name, rs] of Object.entries(base)) console.log(name.padEnd(16) + ['starved', 'dieoff', 'unfit'].map((c) => rate(rs.filter((s) => s.cause === c).length)).join(' ') + ' ' + rate(rs.filter((s) => s.outcome === 'survived').length) + ' ' + rate(won(rs)));

console.log('\n5. Warning: turns ahead the die-off and its refuges are named (the four plan policies pooled)');
console.log('lead            ' + ['past Dying', 'WIN'].map((h) => h.padStart(10)).join(' '));
for (const lead of [0, 1, 3, 5, 8]) { const rs = roads.flatMap((r) => runAll({ policy: POLICIES[r + '.plan'], lead })); console.log(String(lead).padEnd(16) + rate(pastDying(rs), rs.length) + ' ' + rate(won(rs), rs.length)); }
console.log(`Floor: about ${noiseFloor(0.15, 4 * n).toFixed(1)} points (${4 * n} runs each).`);

console.log('\n6. Range: regions held, same road and the same eyes (the four plan policies pooled)');
console.log('regions         ' + ['past Dying', 'WIN'].map((h) => h.padStart(10)).join(' ') + '  pop mid-Coal  mid-Dry  turns to the body');
for (const regions of [1, 2, 3]) {
  const rs = roads.flatMap((r) => runAll({ policy: { ...POLICIES[r + '.plan'], regions, fixedRange: true } }));
  const pop = (e) => mean(rs.map((s) => s.log.find((h) => h.era === e && h.turn === Math.floor(ERAS[e].turns / 2))).filter(Boolean).map((h) => h.pop));
  console.log(String(regions).padEnd(16) + rate(pastDying(rs), rs.length) + ' ' + rate(won(rs), rs.length) + '        ' + pop(1) + '   ' + pop(2) + '   ' + mean(rs.filter((s) => s.bodyAt != null).map((s) => s.bodyAt)));
}
console.log(`Floor: about ${noiseFloor(0.15, 4 * n).toFixed(1)} points (${4 * n} runs each).`);

console.log('\n7. Parts: the plan policies with one thing taken away (pooled)');
console.log('arm             ' + ['past Dying', 'WIN'].map((h) => h.padStart(10)).join(' '));
for (const [label, f] of [['as designed', (p) => ({ policy: p })], ['no rivals', (p) => ({ policy: p, noRivals: true })], ['no die-offs', (p) => ({ policy: p, noDieoff: true })], ['no diet choice', (p) => ({ policy: { ...p, diet: false } })], ['never leaves', (p) => ({ policy: { ...p, stay: true } })], ['warning unheeded', (p) => ({ policy: { ...p, heed: false } })]]) {
  const rs = roads.flatMap((r) => runAll(f(POLICIES[r + '.plan']))); console.log(label.padEnd(16) + rate(pastDying(rs), rs.length) + ' ' + rate(won(rs), rs.length));
}

console.log('\n8. A save at every era: the era rolled again after a loss (new die-off)');
console.log('policy          ' + ['WIN 2 tries', 'WIN 5 tries'].map((h) => h.padStart(12)).join(' ') + '  mean tries (of 5)  saves that lost 5 of 5, by era');
for (const name of roads.map((r) => r + '.plan')) {
  const two = seeds.map((seed) => playSaved(seed, { policy: POLICIES[name] }, 2)), rs = seeds.map((seed) => playSaved(seed, { policy: POLICIES[name] }, 5));
  guard(two.filter((s) => s.outcome !== 'extinct')); guard(rs.filter((s) => s.outcome !== 'extinct'));
  const stuck = ERAS.map((_, e) => rs.filter((s) => s.outcome === 'extinct' && s.retries[e] >= 5).length);
  console.log(name.padEnd(16) + '  ' + rate(won(two)) + '   ' + rate(won(rs)) + '  ' + (rs.reduce((a, s) => a + s.retries.reduce((x, y) => x + y, 0), 0) / n).toFixed(2).padStart(15) + '    ' + stuck.map((k, e) => `${ERAS[e].id} ${(100 * k / n).toFixed(1)}%`).join(', '));
}
console.log(floor());

if (stalled) { console.error(`\n${stalled} run(s) did not end or did not move the clock`); process.exit(1); }
console.log(`\n${total} runs ended and moved their clocks.`);
