// The gate on several cores: node sim/gate-par.js [runs=1000]
// Each group of tables runs in its own process (sim/gate.js with GATE_TABLES), and the tables are
// printed in the gate's own order. Every run is seeded, so the tables are the same as one process
// prints; only the time differs. (The serial gate took about an hour and a half at 1,000 seeds and
// would not fit the machine's two-hour limit once the run grew to the end of the Cretaceous.)
import { spawn } from 'node:child_process';

const n = process.argv[2] || '1000';
// Grouped by about equal work; tables that share runs (1 to 5, 11; 12 and 14) stay together.
const GROUPS = [['1', '2', '3', '4', '5', '11', '6'], ['9a', '7', '8'], ['9b', '10'], ['13', '14', '12']];
const ORDER = ['1', '2', '3', '4', '5', '6', '7', '8', '9a', '9b', '10', '11', '13', '14', '12'];

const run = (tables) => new Promise((done) => {
  const child = spawn(process.execPath, [new URL('./gate.js', import.meta.url).pathname, n], { env: { ...process.env, GATE_TABLES: tables.join(',') } });
  let out = '', err = '';
  child.stdout.on('data', (d) => { out += d; });
  child.stderr.on('data', (d) => { err += d; });
  child.on('close', (code) => done({ code, out, err }));
});

const results = await Promise.all(GROUPS.map(run));
const part = {};
let total = 0, stalled = 0, failed = false;
for (const r of results) {
  if (r.code !== 0 && !/@@RUNS/.test(r.out)) { failed = true; console.error(r.err); }
  for (const chunk of r.out.split(/^@@/m).slice(1)) {
    const nl = chunk.indexOf('\n'), key = chunk.slice(0, nl).trim(), text = chunk.slice(nl + 1);
    if (key.startsWith('RUNS')) { const [, t, st] = key.split(' '); total += Number(t); stalled += Number(st); } else part[key] = text;
  }
}
for (const k of ORDER) process.stdout.write(part[k] ?? `\n(table ${k} missing)\n`);
if (failed || stalled) { console.error(`\n${stalled} run(s) did not end or did not move the clock`); process.exit(1); }
console.log(`\n${total} runs ended and moved their clocks (runs shared between tables are played once a process, so some are counted more than once).`);
