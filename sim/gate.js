// The gate's tables:  node sim/gate.js [runs=1000]
// Every arm plays the same seeds. Rates carry ±1 SE; a gap between two rows
// counts when it exceeds the floor printed under each table.
// A lineage that is alive after the last die-off has come THROUGH; that is the
// win. Its standing places it on a ladder with the lineages in the data table.
import { play, playSaved } from './play.js';
import { standing } from '../src/engine/model.js';
import { POLICIES, ROADS } from '../src/engine/policies.js';
import { ERAS, LINEAGES, WAYS } from '../src/data/world.data.js';
import { seRate, noiseFloor } from './stats.js';

const n = Number(process.argv[2] || 1000);
const seeds = Array.from({ length: n }, (_, i) => 11 + i * 7919);
const rate = (k, m = n) => (m ? `${(100 * k / m).toFixed(1)}±${seRate(k / m, m).toFixed(1)}` : '-').padStart(10);
const mean = (xs) => (xs.length ? (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(0) : '-').padStart(6);
const floor = (m = n, p = 0.3) => `Floor: two rows differ when the gap exceeds ${noiseFloor(p, m).toFixed(1)} points (${m} runs each).`;
let stalled = 0, total = 0;
const guard = (rs) => { for (const s of rs) { total++; if (!s.ended || s.clock < 1) stalled++; } return rs; };
const runAll = (opts) => guard(seeds.map((seed) => play(seed, opts)));
const thr = (rs) => rs.filter((s) => s.outcome === 'through').length;
const top3 = (rs) => rs.filter((s) => s.outcome === 'through' && s.rank <= 3).length;
const CAREFUL = ['careful', ...ROADS.map((r) => r + '.plan')];
const pooled = (f) => CAREFUL.flatMap((name) => runAll(f(POLICIES[name])));
const midPop = (rs, e) => mean(rs.map((s) => s.log.find((h) => h.era === e && h.turn === Math.floor(ERAS[e].turns / 2))).filter(Boolean).map((h) => h.pop));

console.log(`\n1. One life: how far each policy gets, ${n} seeds`);
console.log('policy          ' + ['past Shore', 'past Coal', 'past Dry', 'past Dying', 'THROUGH', 'top three'].map((h) => h.padStart(10)).join(' ') + '   median standing');
const base = {};
for (const [name, policy] of Object.entries(POLICIES)) {
  const rs = base[name] = runAll({ policy });
  const past = (e) => rs.filter((s) => s.eraLog.length > e).length;
  const sc = rs.filter((s) => s.outcome === 'through').map((s) => s.standing).sort((a, b) => a - b);
  console.log(name.padEnd(16) + [past(0), past(1), past(2), past(3), thr(rs), top3(rs)].map((k) => rate(k)).join(' ') + '   ' + String(sc[sc.length >> 1] ?? '-').padStart(6));
}
console.log(floor());

console.log('\n2. The ladder: each lineage in the table, scored by the function that scores the player');
for (const [id, L] of Object.entries(LINEAGES).sort((a, b) => standing(b[1]).score - standing(a[1]).score)) { const x = standing(L); console.log(`${id.padEnd(12)} standing ${String(x.score).padStart(5)}   prospects ${x.prospects.toFixed(0).padStart(5)}  secure ${x.secure.toFixed(2)}  spread ${x.spread.toFixed(2)}`); }
const allCareful = CAREFUL.flatMap((name) => base[name]);
const through = allCareful.filter((s) => s.outcome === 'through');
console.log(`Careful play (${CAREFUL.length} policies pooled, ${allCareful.length} runs): through ${rate(through.length, allCareful.length).trim()}%, top three ${rate(top3(allCareful), allCareful.length).trim()}%`);
console.log('Where those who came through stand, first to eighth: ' + [1, 2, 3, 4, 5, 6, 7, 8].map((r) => `${(100 * through.filter((s) => s.rank === r).length / through.length).toFixed(0)}%`).join(' / '));
const likes = {}; for (const s of through) likes[s.like] = (likes[s.like] || 0) + 1;
console.log('What they most resemble: ' + Object.entries(likes).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${(100 * v / through.length).toFixed(0)}%`).join(', '));

console.log('\n3. A body followed blind against the same body with eyes open');
console.log('lineage         ' + ['list THRU', 'plan THRU', 'list top3', 'plan top3'].map((h) => h.padStart(10)).join(' '));
for (const r of ROADS) console.log(r.padEnd(16) + [thr(base[r + '.list']), thr(base[r + '.plan']), top3(base[r + '.list']), top3(base[r + '.plan'])].map((k) => rate(k)).join(' '));
console.log(floor());

console.log('\n4. Each era on its own: careful survival of those who arrived');
console.log('policy          ' + ERAS.map((e) => e.id.padStart(10)).join(' '));
for (const name of CAREFUL) console.log(name.padEnd(16) + ERAS.map((_, e) => { const a = base[name].filter((s) => e === 0 || s.eraLog.length >= e); return rate(a.filter((s) => s.eraLog.length > e).length, a.length); }).join(' '));

console.log('\n5. Through, by the face of the Great Dying, of those who met it (careful play pooled)');
for (const f of ERAS[3].dieoffs) { const m = allCareful.filter((s) => s.faces && s.faces[3] === f && s.eraLog.length >= 3); console.log(f.padEnd(16) + rate(thr(m), m.length) + `   (${m.length} runs)`); }

console.log('\n6. Ways of living: the careful policy holding one way, none, or its own two');
console.log('ways            ' + ['THROUGH', 'top three'].map((h) => h.padStart(10)).join(' ') + '  numbers mid-Coal  mid-Shadow');
for (const [label, p] of [['none', { ways: [], brace: false }], ...WAYS.map((w) => [w, { ways: [w], brace: false }]), ['as designed', {}]]) { const rs = runAll({ policy: { ...POLICIES.careful, ...p } }); console.log(label.padEnd(16) + rate(thr(rs)) + ' ' + rate(top3(rs)) + '            ' + midPop(rs, 1) + '      ' + midPop(rs, 3)); }
console.log(floor());

console.log('\n7. One mouth: deep against wide, at one region');
console.log('The deep mouth masters its jaw. The wide mouth takes its jaw to step 2 and grows an omnivore\'s teeth.');
console.log('mouth           ' + 'numbers at mid-era: ' + ERAS.map((e) => e.id.slice(0, 6).padStart(7)).join('') + '   survival of those arriving: ' + ERAS.map((e) => e.id.slice(0, 6).padStart(7)).join(''));
for (const [label, policy] of [['deep', { plan: 'special', regions: 1 }], ['wide', { plan: 'wide', regions: 1 }], ['eater', { plan: 'greedy', regions: 1 }], ['tolerant', { plan: 'tolerant', regions: 1 }]]) {
  const rs = runAll({ policy });
  console.log(label.padEnd(16) + '                    ' + ERAS.map((_, e) => midPop(rs, e).padStart(7)).join('') + '                               ' + ERAS.map((_, e) => { const a = rs.filter((s) => e === 0 || s.eraLog.length >= e); return (a.length ? (100 * a.filter((s) => s.eraLog.length > e).length / a.length).toFixed(0) + '%' : '-').padStart(7); }).join(''));
}

console.log('\n8. Moments: the careful policy always taking the first, second or third road');
console.log('road            ' + ['THROUGH', 'top three'].map((h) => h.padStart(10)).join(' '));
for (const [label, o] of [['first', { policy: { ...POLICIES.careful, pick: 0 } }], ['second', { policy: { ...POLICIES.careful, pick: 1 } }], ['third', { policy: { ...POLICIES.careful, pick: 2 } }], ['no moments', { policy: POLICIES.careful, noMoments: true }]]) { const rs = runAll(o); console.log(label.padEnd(16) + rate(thr(rs)) + ' ' + rate(top3(rs))); }
console.log(floor());

console.log('\n9. Warning, range and what the world is made of (careful play pooled)');
console.log('arm             ' + ['THROUGH', 'top three'].map((h) => h.padStart(10)).join(' '));
const m7 = CAREFUL.length * n;
for (const [label, f] of [['as designed', (p) => ({ policy: p })], ['warning 0 turns', (p) => ({ policy: p, lead: 0 })], ['warning 3 turns', (p) => ({ policy: p, lead: 3 })], ['warning 8 turns', (p) => ({ policy: p, lead: 8 })], ['warning unheeded', (p) => ({ policy: { ...p, heed: false, brace: false } })], ['1 region', (p) => ({ policy: { ...p, regions: 1, fixedRange: true } })], ['2 regions', (p) => ({ policy: { ...p, regions: 2, fixedRange: true } })], ['3 regions', (p) => ({ policy: { ...p, regions: 3, fixedRange: true } })], ['no rivals', (p) => ({ policy: p, noRivals: true })], ['no die-offs', (p) => ({ policy: p, noDieoff: true })]]) {
  const rs = pooled(f); console.log(label.padEnd(16) + rate(thr(rs), rs.length) + ' ' + rate(top3(rs), rs.length));
}
console.log(floor(m7));

console.log('\n10. A save at every era: the era rolled again after a loss (new die-off), up to 3 tries an era');
console.log('policy          ' + ['THROUGH', 'top three'].map((h) => h.padStart(10)).join(' ') + '  mean retries');
for (const name of CAREFUL) { const rs = guard(seeds.map((seed) => playSaved(seed, { policy: POLICIES[name] }, 2)).filter((s) => s.outcome !== 'extinct' || true)); console.log(name.padEnd(16) + rate(thr(rs)) + ' ' + rate(top3(rs)) + '  ' + (rs.reduce((a, s) => a + s.retries.reduce((x, y) => x + y, 0), 0) / n).toFixed(2).padStart(10)); }
console.log(floor());

if (stalled) { console.error(`\n${stalled} run(s) did not end or did not move the clock`); process.exit(1); }
console.log(`\n${total} runs ended and moved their clocks.`);
