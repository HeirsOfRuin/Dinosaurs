// The screens. Reads the engine's view and computes nothing itself.
//
// Patterns every screen keeps (game-building rules):
//  - Empty and locked states say why and what would change them (rule 6).
//  - The game saves after every turn and every order; a save code moves a
//    lineage between devices or between the itch copy and the installed copy.
//  - A throw never leaves a dead button: busy is released in finally, and the
//    error screen offers the save.

import { newGame, advance, setPlan, meet, retry, view } from '../engine/turn.js';
import { SAVE_KEY, SHELF_KEY, serialize, deserialize, toCode, fromCode } from '../engine/state.js';
import { STORAGE_OK, lsGet, lsSet } from './storage.js';
import { registerSW, installPrompt } from './sw-register.js';
import { animalSVG, sceneSVG } from './sprite.js';
import { icon, traitIcon, dieoffIcon } from './icons.js';
import { TITLE, TRAIT_TEXT, TREE_TEXT, STEP_NAMES, FOOD_TEXT, REGION_TEXT, STANCE_TEXT, DIEOFF_TEXT, LINEAGE_TEXT, RANK_TEXT, THROUGH_TEXT, STANDING_TEXT, WAY_TEXT, MOMENT_TEXT, SIZE_TEXT, LOOK_TEXT, OTHER_ENDINGS, SETTING_TEXT, PART_TEXT, NOTES } from '../data/text.data.js';

const SHELF_MAX = 6;
const app = document.getElementById('app');
let state = null;
let tab = 'play';
let modal = null;
let busy = false;
let banner = null;
let install = null;
let choosing = false;
let lastNote = null, lastDelta = 0, flashNext = false, shownPop = null;
let shownMa = null;   // the date the calendar last showed, so it can be seen to move

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const n0 = (x) => Math.round(x).toLocaleString('en-GB');
const n2 = (x) => x.toFixed(2);
const signed = (x) => (Math.abs(x) < 50 ? 'no change in food' : x > 0 ? `feeds ${n0(x)} more` : `feeds ${n0(-x)} fewer`);
const ma = (x) => x.toFixed(1);
const metres = (m) => (m < 1 ? `${Math.round(m * 100)} cm` : `${m} m`);
const plural = (n, one, many) => (Math.round(n) === 1 ? one : many);
const list = (xs) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} or ${xs[xs.length - 1]}`);

function save() { if (state) lsSet(SAVE_KEY, serialize(state)); }
function load() {
  const raw = lsGet(SAVE_KEY);
  if (!raw) return null;
  try { return deserialize(raw); } catch (e) { banner = `The saved lineage could not be read (${e.message}).`; return null; }
}
function shelf() {
  try { const x = JSON.parse(lsGet(SHELF_KEY) || '[]'); return Array.isArray(x) ? x : []; } catch { return []; }
}
function setShelf(x) { lsSet(SHELF_KEY, JSON.stringify(x)); }
function shelfLabel(g) {
  const v = view(g);
  return `${v.era.name}, turn ${v.era.turn}: ${n0(v.pop)} alive${v.over ? ' (ended)' : ''}`;
}

// ---- title -------------------------------------------------------------------

function title() {
  const saved = load();
  const settings = ['saved', 'oneLife'].map((id) => `
    <button data-act="start-${id === 'saved' ? 'saved' : 'one'}"><strong>${SETTING_TEXT[id].name}</strong><small>${SETTING_TEXT[id].line}</small></button>`).join('');
  app.innerHTML = `
    <main class="title">
      <h1>${TITLE}</h1>
      <p class="lede">Steer a lineage from a Devonian shore to the first dinosaurs.</p>
      ${STORAGE_OK ? '' : '<p class="warn">This browser is refusing to store anything for this page, so progress will not be kept. Open the game in its own tab, or copy a save code from the menu before you leave.</p>'}
      ${banner ? `<p class="warn">${esc(banner)}</p>` : ''}
      ${choosing ? `<h2>How should it be kept?</h2><div class="stack">${settings}<button data-act="cancel-new">Back</button></div>` : `
      <div class="stack">
        ${saved ? `<button class="primary" data-act="continue"><strong>Continue</strong><small>${esc(shelfLabel(saved))}</small></button>` : ''}
        <button ${saved ? '' : 'class="primary"'} data-act="new">New lineage</button>
        <button data-act="load-code">Load a save code</button>
        ${install ? '<button data-act="install">Install on this device</button>' : ''}
      </div>
      ${saved ? '<p class="hint">A new lineage replaces the one above. Copy its save code from the menu first if you want to keep it.</p>' : ''}`}
    </main>`;
}

// ---- the frame ----------------------------------------------------------------

function render() {
  if (!state) return title();
  const v = view(state);
  const tabs = [['play', 'Turn'], ['body', 'Body'], ['rivals', 'Rivals'], ['menu', 'Menu']];
  app.innerHTML = `
    <header class="hud">
      <div class="hud-top"><h1>${esc(v.era.name)}</h1><span class="turn">Turn ${v.era.turn} of ${v.era.turns}</span></div>
      <div class="eras" aria-hidden="true">${v.eras.map((e) => `<i style="flex:${e.turns}"><b style="width:${Math.round(e.frac * 100)}%"></b></i>`).join('')}</div>
      <div class="hud-sub"><span class="ma"><b id="ma" data-to="${ma(v.era.ma)}">${ma(shownMa ?? v.era.ma)}</b> million years ago</span><span>${ma(v.era.perTurn)} million years a turn</span></div>
    </header>
    ${banner ? `<p class="banner">${esc(banner)} <button data-act="dismiss">OK</button></p>` : ''}
    <main class="panel">${tab === 'play' ? playTab(v) : tab === 'body' ? bodyTab(v) : tab === 'rivals' ? rivalsTab(v) : menuTab(v)}</main>
    <nav class="tabs">${tabs.map(([id, label]) => `<button data-tab="${id}" class="${tab === id ? 'on' : ''}">${label}</button>`).join('')}</nav>
    ${modal ? `<div class="scrim"><div class="sheet">${modal}</div></div>` : ''}`;
  runCalendar(v.era.ma);
  runAlive(v.over ? null : v.pop);
}

// The numbers count to where they now stand, so a turn's gain or loss is seen.
function runAlive(to) {
  const el = document.getElementById('alive'), from = shownPop ?? to;
  shownPop = to;
  if (!el || to == null || Math.abs(from - to) < 1 || matchMedia('(prefers-reduced-motion: reduce)').matches) { if (el && to != null) el.textContent = n0(to); return; }
  const t0 = performance.now(), ms = 600;
  const tick = (now) => {
    const k = Math.min(1, (now - t0) / ms), node = document.getElementById('alive');
    if (!node || node.dataset.to !== String(Math.round(to))) return;
    node.textContent = n0(from + (to - from) * k);
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// The date counts down to where it now stands, so the years are seen to pass.
function runCalendar(to) {
  const el = document.getElementById('ma'), from = shownMa ?? to;
  shownMa = to;
  if (!el || Math.abs(from - to) < 0.05) { if (el) el.textContent = ma(to); return; }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = ma(to); return; }
  const t0 = performance.now(), ms = 700;
  const tick = (now) => {
    const k = Math.min(1, (now - t0) / ms), node = document.getElementById('ma');
    if (!node || node.dataset.to !== ma(to)) return;
    node.textContent = ma(from + (to - from) * k);
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const animalLabel = (v) => `Your animal: ${PART_TEXT.trunk[v.parts.trunk]} body, limbs ${PART_TEXT.limbs[v.parts.limbs]}, ${PART_TEXT.skin[v.parts.skin]} skin`;
const eating = (v) => (v.mouth ? PART_TEXT.jaw[v.mouth] : 'no settled mouth');
const others = (v) => v.rivals.filter((r) => r.near).map((r) => ({ parts: r.parts, ratio: r.length / v.length, heads: r.pop, toYou: r.toYou }));
// What the picture shows besides the animals: how many there are, the die-off's weather, a trait just grown.
const sceneOpts = (v) => {
  const flash = flashNext; flashNext = false;
  return { heads: v.pop, flash, weather: v.dieoff ? { kind: v.dieoff.kind, full: true } : v.warning?.named ? { kind: v.warning.kinds[0], full: false } : null };
};

function fitWord(r) {
  if (r.fit >= 0.85) return 'liveable';
  const why = [r.tooDry && 'too dry', r.tooCold && 'too cold', r.tooHot && 'too hot'].filter(Boolean);
  return `${r.fit < 0.15 ? '' : 'hard: '}${why.join(', ') || 'poor ground'}`;
}

// ---- the turn -----------------------------------------------------------------

// What is coming, and what it would leave: the reckoning behind the alarm line.
function omenText(v) {
  if (v.dieoff) return `<p class="omen now"><strong>${esc(cap(DIEOFF_TEXT[v.dieoff.kind].name))}.</strong> ${DIEOFF_TEXT[v.dieoff.kind].did} ${v.dieoff.left} ${plural(v.dieoff.left, 'turn', 'turns')} of it left.</p>`;
  if (!v.warning) return '';
  return v.warning.named
    ? `<p class="omen"><strong>${esc(cap(DIEOFF_TEXT[v.warning.kinds[0]].name))}, ${v.warning.turns} ${plural(v.warning.turns, 'turn', 'turns')} out.</strong> ${DIEOFF_TEXT[v.warning.kinds[0]].sign} The regions show what it will spare.</p>`
    : `<p class="omen"><strong>Something is coming, ${v.warning.turns} turns out.</strong> It may be ${list(v.warning.kinds.map((k) => DIEOFF_TEXT[k].name))}; it is not yet clear which.</p>`;
}
function outlookText(v) {
  const f = v.forecast;
  if (!f) return '';
  const helpLine = (h) => (h.kind === 'offer' ? `${TRAIT_TEXT[h.id].name.toLowerCase()}, kept from what is offered this turn` : h.kind === 'way' ? `${WAY_TEXT[h.id].name.toLowerCase()}${h.swaps ? ' (in place of one of your two)' : ''}` : h.kind === 'trait' ? `${TRAIT_TEXT[h.id].name.toLowerCase()} grown a step, ${h.turns} ${plural(h.turns, 'turn', 'turns')} of pressure` : `settlers sent to the ${REGION_TEXT[h.id].toLowerCase()}`) + `: about ${n0(h.left)}`;
  return `<div class="outlook"><strong>As you are, about ${f.left >= 50 ? n0(f.left) : 'none'} of your ${n0(f.now)} would be left at the end of it.</strong>
      ${f.helps.length ? `What would leave more:<ul>${f.helps.map((h) => `<li>${esc(helpLine(h))}</li>`).join('')}</ul>` : f.left < 50 ? ' Nothing within reach changes that. It may still fall otherwise than it looks.' : ' Nothing within reach would leave many more.'}
      <span class="dim">A reckoning from how things stand now, not a promise.</span></div>`;
}


function playTab(v) {
  if (v.over) return endTab(v);
  // One alarm line at most: the die-off that is here, or the one that is coming. Tap for the reckoning.
  const alarm = v.dieoff
    ? `<button class="alarm now" data-act="slot:warn">${dieoffIcon(v.dieoff.kind)}<strong>${esc(cap(DIEOFF_TEXT[v.dieoff.kind].name))}</strong><span>${v.dieoff.left} ${plural(v.dieoff.left, 'turn', 'turns')} left</span></button>`
    : v.warning ? `<button class="alarm" data-act="slot:warn">${v.warning.named ? dieoffIcon(v.warning.kinds[0]) : icon('waste')}<strong>${v.warning.named ? esc(cap(DIEOFF_TEXT[v.warning.kinds[0]].name)) : 'Something is coming'}</strong><span>${v.warning.turns} ${plural(v.warning.turns, 'turn', 'turns')} out</span></button>` : '';

  if (v.moment && v.moment.picked == null) {
    const m = MOMENT_TEXT[v.moment.id];
    return `
    <div class="stage">${sceneSVG(v.era.id, v.era.palette, v.parts, animalLabel(v), false, others(v), sceneOpts(v))}
      <div class="strip"><span><strong>${n0(v.pop)}</strong> alive</span><span class="dim">${eating(v)}</span><span class="dim">${metres(v.length)} long</span></div>
    </div>
    <div class="moment"><h2>${esc(m.title)}</h2><p>${esc(m.text)}</p>
      <div class="stack">${m.roads.map((r, i) => `<button data-act="meet:${i}">${esc(r)}</button>`).join('')}</div>
      <p class="hint">Something like this comes every few turns. Each comes once; none of the three is the wrong answer.</p>
    </div>`;
  }
  // The turn at a glance (docs/FRAME-next.md section 2): the picture, one alarm, three slots for the
  // standing orders, the offers as cards and the regions. Every explanation is a tap away, so the screen
  // stays under its word budget (tools/smoke.mjs counts it).
  const offers = v.offers.length ? v.offers.map((o) => `
    <div class="card">
      <button class="cname" data-act="trait:${o.id}">${traitIcon(o.id)}<strong>${esc(TRAIT_TEXT[o.id].name)}</strong>${o.watched ? '<em class="tag">watched</em>' : ''}</button>
      <span class="marks">${mark(o.feeds / Math.max(1, v.pop), 'food')}${mark(o.safer * 4, 'safe')}<span class="mk cost" title="upkeep">+${n2(o.cost)}</span></span>
      <button class="primary" data-action="keep:${o.id}">Keep</button>
    </div>`).join('') : '';
  const tiles = v.regions.map((r) => `
    <button class="tile${r.mine ? ' mine' : ''}${r.fit < 0.15 && !r.mine ? ' shut' : r.fit < 0.85 ? ' hard' : ''}${r.outlook ? ` ${r.outlook === 'spared' ? 'spared' : 'hit'}` : ''}${r.spread.queued ? ' going' : ''}" data-act="region:${r.id}">
      <span class="rname">${REGION_TEXT[r.id]}</span>
      <span class="nums">${r.mine ? `<b>${n0(r.mine)}</b>` : ''}${r.rivals >= 1 ? `<i class="rv">${icon('rival')}${n0(r.rivals)}</i>` : ''}</span>
    </button>`).join('');
  return `
    <div class="stage">${sceneSVG(v.era.id, v.era.palette, v.parts, animalLabel(v), !!v.dieoff, others(v), sceneOpts(v))}
      <div class="strip"><span><strong id="alive" data-to="${Math.round(v.pop)}">${n0(shownPop ?? v.pop)}</strong> alive</span>${lastNote ? `<button class="delta ${lastDelta >= 0 ? 'up' : 'down'}" data-act="note">${lastDelta >= 0 ? '▲' : '▼'} ${n0(Math.abs(lastDelta))}</button>` : ''}<span class="dim">${metres(v.length)}</span></div>
    </div>
    ${alarm}
    <div class="orders">${slots(v)}</div>
    ${offers ? `<div class="cards">${offers}</div>` : ''}
    <button class="next" data-action="next">${v.offers.length ? 'Keep none, next turn' : 'Next turn'}</button>
    <div class="tiles">${tiles}</div>`;
}

// One mark on an offer: up, down or level, for food or for safety. `x` is the change as a share.
function mark(x, kind) {
  const dir = x > 0.02 ? 'up' : x < -0.02 ? 'down' : 'level';
  return `<span class="mk ${kind} ${dir}" title="${kind === 'food' ? 'food' : 'fewer caught'}">${icon(kind)}${dir === 'up' ? '▲' : dir === 'down' ? '▼' : '–'}</span>`;
}

// The three standing orders: what grows, how you live, what you do about rivals. A slot is marked
// when it wants a look; the mark never says what to do. (The author, 2026-11-28: "it can be easy to
// forget the rivals, ways of living, and body pressures all the time".)
function slots(v) {
  const p = v.pressure, living = v.ways.filter((w) => w.on), acting = v.rivals.filter((r) => r.toYou);
  const growLook = !p, liveLook = !!(v.warning?.named && !living.some((w) => w.id === 'fat')), rivalLook = acting.length > 0 && !v.stance;
  const st = v.stance ? STANCE_TEXT[v.stance.act].short : 'none';
  const grow = p ? `${traitIcon(p.id)}${esc(TRAIT_TEXT[p.id].name)}<span class="bar"><b style="width:${p.kind === 'shed' ? 100 : Math.round(100 * (p.of - p.left) / p.of)}%"></b></span>` : 'nothing';
  return `
    <button class="order${growLook ? ' look' : ''}" data-act="slot:grow"><span class="sl">${icon('grow')}Growing</span><span class="sv">${grow}</span></button>
    <button class="order${liveLook ? ' look' : ''}" data-act="slot:live"><span class="sl">Living</span><span class="sv">${living.length ? living.map((w) => `<span class="wi">${icon(w.id)}${WAY_TEXT[w.id].short}</span>`).join('') : 'nothing'}</span></button>
    <button class="order${rivalLook ? ' look' : ''}" data-act="slot:rivals"><span class="sl">${icon('rival')}Rivals</span><span class="sv">${acting.length && !v.stance ? `${icon(acting.some((r) => r.toYou === 'prey') ? 'hunt' : 'push')}${acting.some((r) => r.toYou === 'prey') ? 'hunted' : 'pushed'}` : v.stance ? `${icon(v.stance.act === 'prey' ? 'hunt' : 'push')}${st}` : st}</span></button>`;
}

function slotSheet(id) {
  const v = view(state), p = v.pressure;
  if (id === 'grow') {
    const now = p ? `<p>${p.kind === 'shed' ? 'Letting go of' : p.kind === 'turn' ? (p.cover ? 'Turning the covering to' : 'Turning the mouth to') : 'Pressure on'} <strong>${esc(TRAIT_TEXT[p.id].name.toLowerCase())}</strong>${p.kind === 'press' ? `, to ${STEP_NAMES[p.to]}` : ''}: ${p.left} ${plural(p.left, 'turn', 'turns')} left.</p>` : '<p><strong>Nothing is growing.</strong> Put a trait you hold under pressure, and it grows a step.</p>';
    const w = v.watch ? `<p>Watching for ${esc(TRAIT_TEXT[v.watch.id].name.toLowerCase())}: ${v.watch.offered ? 'it is on offer now.' : v.watch.open ? (v.watch.turns ? `it will be offered within ${v.watch.turns} ${plural(v.watch.turns, 'turn', 'turns')}.` : 'it will be offered next turn.') : `it cannot turn up yet. ${esc(v.watch.why)}`}</p>` : '<p class="hint">What is offered is chance. Mark a trait in the tree to watch for it.</p>';
    return `<h2>Growing</h2>${now}${w}<button class="primary" data-tab="body">The body and the tree</button><button data-act="close">Close</button>`;
  }
  if (id === 'live') {
    const living = v.ways.filter((w) => w.on);
    const rows = living.map((w) => `<p><strong>${icon(w.id)}${WAY_TEXT[w.id].name}</strong>${w.settling ? ' (taking hold)' : ''}. ${WAY_TEXT[w.id].gives} ${WAY_TEXT[w.id].costs}</p>`).join('') || '<p><strong>No way of living chosen.</strong></p>';
    const warn = v.warning?.named ? `<p class="omen">${esc(cap(DIEOFF_TEXT[v.warning.kinds[0]].name))} is coming. Laying down fat slows the fall when food fails.</p>` : '';
    return `<h2>Living</h2>${rows}${v.fatSlows ? '<p class="hint">The fat is slowing your climb back: the ground would feed many more than there are.</p>' : ''}${warn}<p class="hint">Up to ${v.maxWays} at once. A new one takes a few turns to take hold.</p><button class="primary" data-tab="body">Choose on the Body screen</button><button data-act="close">Close</button>`;
  }
  if (id === 'rivals') {
    const acting = v.rivals.filter((r) => r.toYou).map((r) => { const n = r.lastTurn.filter((e) => e.by === r.id).reduce((a, e) => a + e.n, 0); return `<p class="omen"><strong>${r.toYou === 'prey' ? 'Hunted' : 'Pushed'}</strong> by the animal most like the ${esc(LINEAGE_TEXT[r.like].name.toLowerCase())}${n >= 50 ? `: ${n0(n)} taken last turn` : ''}.</p>`; }).join('');
    const near = v.rivals.filter((r) => r.near).map((r) => `<p>Beside you: ${n0(r.pop)} of an animal ${metres(r.length)} long, most like the ${esc(LINEAGE_TEXT[r.like].name.toLowerCase())}.</p>`).join('');
    const st = v.stance ? (() => { const r = v.rivals.find((x) => x.id === v.stance.id); return `<p>${STANCE_TEXT[v.stance.act].doing} the animal most like the ${esc(LINEAGE_TEXT[r.like].name.toLowerCase())}.</p>`; })() : '<p>No stance taken.</p>';
    return `<h2>Rivals</h2>${acting}${near}${st}<button class="primary" data-tab="rivals">The Rivals screen</button><button data-act="close">Close</button>`;
  }
  if (id === 'warn') return `<h2>What is coming</h2>${omenText(v)}${outlookText(v)}<button data-act="close">Close</button>`;
  return '';
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const mid = (name) => name.replace(/^The /, 'the ');   // an era's name inside a sentence

function regionSheet(id) {
  const v = view(state), r = v.regions.find((x) => x.id === id), sp = r.spread;
  const foods = Object.entries(r.food).filter(([, n]) => n >= 1).map(([f, n]) => `${FOOD_TEXT[f]} ${n0(n)}`).join(', ');
  let act;
  if (r.mine) act = `<p>You live here: ${n0(r.mine)} now, and the ground would feed ${n0(r.feeds)}.</p>`;
  else if (sp.queued) act = `<p>Settlers leave this turn.</p><button data-act="unspread">Call them back</button>`;
  else if (sp.ok) act = `<p>Sending settlers takes ${n0(sp.sends)} from your largest region. About ${n0(sp.arrive)} arrive, and the ground would feed ${n0(sp.feeds)} of you as things stand. Each region held beyond the first slows every trait.</p><button class="primary" data-act="spread:${id}">Send settlers this turn</button>`;
  else act = `<p class="empty">${esc(sp.why)}${sp.arrive != null ? ' More of you, or faster limbs, would change that.' : ''}</p>`;
  return `<h2>${REGION_TEXT[id]}</h2>
    <p>${cap(fitWord(r))} for your body. Food here: ${foods || 'almost none'}. ${r.rivals >= 1 ? `Rivals: ${n0(r.rivals)}.` : 'No rivals.'}${r.outlook ? ` The die-off will leave it <strong>${r.outlook}</strong>.` : ''}</p>
    ${act}
    <button data-act="close">Close</button>`;
}

function turnNote(rec) {
  const bits = [];
  if (rec.met) bits.push(`${MOMENT_TEXT[rec.met.id].title}: ${MOMENT_TEXT[rec.met.id].roads[rec.met.road].split('.')[0]}.`);
  if (rec.kept) bits.push(`Kept: ${TRAIT_TEXT[rec.kept].name.toLowerCase()}.`);
  if (rec.turned) bits.push(`The mouth has turned: ${TRAIT_TEXT[rec.turned.to].name.toLowerCase()} now.`);
  if (rec.recovered) bits.push(`The covering has turned: ${TRAIT_TEXT[rec.recovered.to].name.toLowerCase()} now.`);
  for (const id of rec.gained) bits.push(`${TRAIT_TEXT[id].name} is now ${STEP_NAMES[view(state).traits.find((t) => t.id === id)?.level || 1]}.`);
  for (const id of rec.lost) bits.push(`${TRAIT_TEXT[id].name} has faded a step.`);
  for (const id of rec.settled) bits.push(`Settlers reached the ${REGION_TEXT[id].toLowerCase()}.`);
  for (const id of rec.emptied) bits.push(`None of you are left in the ${REGION_TEXT[id].toLowerCase()}.`);
  for (const d of rec.rivals?.driven || []) bits.push(d.who === 'you' ? `Driven out of the ${REGION_TEXT[d.r].toLowerCase()}; some reached the ${REGION_TEXT[d.to].toLowerCase()}.` : `A rival was driven out of the ${REGION_TEXT[d.r].toLowerCase()}.`);
  const d = rec.popAfter - rec.popBefore;
  // Why they moved, when it is worth saying: the turn's own account of bred, starved and caught.
  const m = rec.moved, why = [];
  if (m) {
    if (m.bred >= 50) why.push(`${n0(m.bred)} bred`);
    if (m.starved >= 50) why.push(`hunger took ${n0(m.starved)}`);
    if (m.caught >= 50) why.push(`hunters took ${n0(m.caught)}`);
    if (m.rivals >= 50) why.push(`rivals took ${n0(m.rivals)}`);
    if (m.heavy >= 50) why.push(`being big cost ${n0(m.heavy)}`);
    if (m.lost >= 50) why.push(`the last ${n0(m.lost)} somewhere died out`);
  }
  bits.push((Math.abs(d) < 50 ? 'Numbers held' : d > 0 ? `Numbers up ${n0(d)}` : `Numbers down ${n0(-d)}`) + (why.length ? `: ${why.join(', ')}.` : '.'));
  return bits.map(esc).join(' ');
}

function eraSheet(rec) {
  const e = rec.eraEnded, v = view(state), d = DIEOFF_TEXT[e.kind];
  const ids = [...new Set([...Object.keys(e.onset), ...Object.keys(e.after)])];
  const rows = ids.map((id) => `<tr><td>${REGION_TEXT[id]}</td><td class="num">${n0(e.onset[id] || 0)} to ${e.after[id] >= 50 ? n0(e.after[id]) : 'none'}</td></tr>`).join('');
  const next = e.next != null
    ? `<p><strong>Of those left, ${n0(e.carried)} find their way into ${esc(mid(v.era.name))}.</strong> ${esc(v.era.intro)}</p>${v.setting === 'saved' ? `<p class="hint">Saved: the start of ${esc(mid(v.era.name))}. Your saves for the earlier eras are kept.</p>` : ''}`
    : '';
  return `<h2>${esc(cap(d.name))}</h2><p>${d.did}</p><table class="ledger">${rows}</table>${next}<button class="primary" data-act="close">${e.next != null ? 'Walk on' : 'See what became of them'}</button>`;
}

// ---- the end ------------------------------------------------------------------

function ladderRows(v) {
  return v.ladder.map((r) => `<tr class="${r.you ? 'you' : ''}"><td>${cap(RANK_TEXT[r.rank - 1])}</td><td>${r.you ? '<strong>Your lineage</strong>' : esc(LINEAGE_TEXT[r.id].name)}</td><td class="num">${n0(r.score)}</td></tr>`).join('');
}

function standingLines(v) {
  const st = v.standing;
  return `<p class="hint">${STANDING_TEXT.prospects} <strong>${n0(st.prospects)}</strong>.<br>${STANDING_TEXT.secure} Counts for <strong>${Math.round(st.secure * 100)}%</strong>.<br>${STANDING_TEXT.spread} Counts for <strong>${Math.round(st.spread * 100)}%</strong>.</p>`;
}

function endTab(v) {
  const through = v.outcome === 'through', st = v.standing, like = LINEAGE_TEXT[st.like];
  const head = through ? `Through, ${RANK_TEXT[st.rank - 1]} of ${st.of}` : 'The line ends';
  const text = through ? THROUGH_TEXT[st.rank - 1] : OTHER_ENDINGS[v.cause] || OTHER_ENDINGS.starved;
  const again = v.setting === 'saved' && v.saves.length
    ? `<h2>Begin an era again</h2><p class="hint">Each try rolls a new die-off. The body you carried in is the body you start with.</p><div class="stack">${[...v.saves].reverse().map((s) => `<button data-act="retry:${s.era}"><strong>The start of ${esc(mid(s.name))}</strong><small>${s.tries ? `begun ${s.tries + 1} times` : 'begun once'}</small></button>`).join('')}</div>`
    : !through ? '<p class="hint">This lineage had one life. A new one begins at the Shore.</p>' : '';
  const won = through ? `
    <h2>The ladder</h2>
    <table class="ledger ladder">${ladderRows(v)}</table>
    ${standingLines(v)}
    <h2>What it most resembles</h2>
    <p><strong>${esc(like.name)}.</strong> ${esc(like.line)} ${esc(like.after)}</p>
    <p class="hint">One that lived: ${esc(like.example)}</p>` : '';
  return `<div class="stage">${sceneSVG(v.era.id, v.era.palette, v.parts, animalLabel(v), !through, others(v))}</div>
    <h2 class="big">${esc(head)}</h2>
    <p>${esc(text)}</p>
    <p class="dim">${esc(v.era.name)}, ${ma(v.era.ma)} million years ago. ${v.pop >= 50 ? n0(v.pop) : 'None'} alive at the end, after ${v.clock.turn} ${plural(v.clock.turn, 'turn', 'turns')} of ${v.clock.of}.</p>
    ${won}${again}
    <div class="stack last"><button ${again ? '' : 'class="primary"'} data-act="new">New lineage</button></div>`;
}

// Colour: free, unless camouflage or display makes it count; then how well it matches each ground.
const HUE_NAMES = [[150, 'sea green'], [95, 'olive'], [45, 'ochre'], [22, 'rust'], [205, 'slate blue'], [330, 'dusk rose'], [70, 'moss'], [180, 'teal']];
const hueName = (deg) => HUE_NAMES.reduce((a, x) => (Math.min(Math.abs(x[0] - deg), 360 - Math.abs(x[0] - deg)) < Math.min(Math.abs(a[0] - deg), 360 - Math.abs(a[0] - deg)) ? x : a))[1];
const matchWord = (m) => (m >= 0.75 ? 'matches' : m >= 0.4 ? 'half matches' : 'stands out');
function colourLine(v) {
  const c = v.colour, name = c.hue != null ? hueName(c.hue) : LOOK_TEXT.hue[v.parts.look.hue], pat = LOOK_TEXT.pattern[v.parts.look.pattern];
  if (!c.counts) return `In this era it is ${name}, ${pat}. Colour changes nothing unless the lineage has camouflage or display.`;
  const where = c.grounds.filter((g) => g.mine).map((g) => `the ${REGION_TEXT[g.id].toLowerCase()} (${matchWord(g.match)})`);
  return `It is ${name}, ${pat}, and its colour counts: ${c.by === 'camouflage' ? 'it hides where it matches the ground, and turns toward the ground you mostly live on' : 'it shows where it stands out, and turns away from the ground you live on'}. Against your ground: ${list(where).replace(' or ', ' and ')}.`;
}

// ---- the rivals ---------------------------------------------------------------

function rivalsTab(v) {
  const stanceLine = v.stance ? (() => { const r = v.rivals.find((x) => x.id === v.stance.id); return `${STANCE_TEXT[v.stance.act].doing} the animal most like the ${esc(LINEAGE_TEXT[r.like].name.toLowerCase())}.`; })() : 'No stance taken toward either rival. One at a time; it holds until changed.';
  const cards = v.rivals.map((r) => {
    const eats = r.mouth ? FOOD_TEXT[r.best] : 'little';
    const trend = r.trend == null || Math.abs(r.trend) < 50 ? 'holding steady' : r.trend > 0 ? `up ${n0(r.trend)} last turn` : `down ${n0(-r.trend)} last turn`;
    const where = r.ground.length ? `Shares the ${list(r.ground.map((id) => REGION_TEXT[id].toLowerCase())).replace(' or ', ' and ')} with you.` : `Lives in the ${list(r.home.map((id) => REGION_TEXT[id].toLowerCase())).replace(' or ', ' and ')}; none of your ground.`;
    const doing = r.toYou ? `<p class="omen"><strong>${r.toYou === 'prey' ? 'It is hunting you' : 'It is pushing you'}</strong> where you share ground.${r.lastTurn.filter((e) => e.by === r.id).length ? ` Last turn it took ${n0(r.lastTurn.filter((e) => e.by === r.id).reduce((a, e) => a + e.n, 0))}.` : ''}</p>` : '';
    const opts = r.stances.map((x) => {
      if (!x.ok) return `<p class="empty"><strong>${STANCE_TEXT[x.act].name}.</strong> ${esc(x.why)}</p>`;
      const what = x.act === 'push'
        ? x.push.map((p) => `${REGION_TEXT[p.r]}: you would have ${Math.round(100 * p.share)}% of the strength${p.out === 'them' ? ', enough to drive them out' : ''}; about ${n0(p.cost)} of you lost a turn`).join('. ') + '.'
        : x.act === 'prey' ? `About ${n0(x.takes)} of them taken a turn; ${signed(x.feeds)}.`
          : `${cap(signed(x.feeds))} as things stand.`;
      return x.on
        ? `<button class="way on" data-act="stance:none:${r.id}"><strong>${icon(x.act === 'prey' ? 'hunt' : 'push')}${STANCE_TEXT[x.act].name}</strong><small>${esc(what)}</small><small class="state">Doing this now. Tap to stop.</small></button>`
        : `<button class="way" data-act="stance:${x.act}:${r.id}"><strong>${icon(x.act === 'prey' ? 'hunt' : 'push')}${STANCE_TEXT[x.act].name}</strong><small>${STANCE_TEXT[x.act].does}</small><small class="state">${esc(what)}</small></button>`;
    }).join('');
    return `<div class="rival">
      <h2 class="branch">Most like the ${esc(LINEAGE_TEXT[r.like].name.toLowerCase())}</h2>
      <p>${metres(r.length)} long, ${n0(r.pop)} of them, ${trend}. Eats ${eats} best. ${where}</p>
      ${doing}
      <div class="ways">${opts}</div>
    </div>`;
  }).join('');
  return `<h2>Rivals</h2><p class="hint">${stanceLine}</p>${cards || '<p class="empty">No rivals are left in this era.</p>'}`;
}

// ---- the body -----------------------------------------------------------------

function bodyTab(v) {
  const slots = ['skull', 'jaw', 'trunk', 'limbs', 'tail', 'skin'].map((k) => `<div class="slot"><span class="dim">${cap(k)}</span>${PART_TEXT[k][v.parts[k]]}${k === 'limbs' && v.parts.claws ? ', digging claws' : ''}${k === 'trunk' && v.parts.sail ? ', a sail on the back' : ''}</div>`).join('');
  const pips = (n, growing) => `<span class="pips">${[1, 2, 3].map((i) => `<i class="${i <= n ? 'on' : growing && i === n + 1 ? 'grow' : ''}"></i>`).join('')}</span>`;
  const heldRow = (t) => `
    <button class="trait${t.pressing ? ' on' : ''}${t.shedding ? ' fade' : ''}" data-act="trait:${t.id}">
      <span>${traitIcon(t.id)}${esc(TRAIT_TEXT[t.id].name)}${t.isMouth ? ' <em class="tag">mouth</em>' : t.isCover ? ' <em class="tag">covering</em>' : ''}</span>
      <span class="dim">${t.pressing ? 'under pressure' : t.shedding ? 'letting go' : t.turns && t.turns.some((o) => o.turning) ? 'turning' : STEP_NAMES[t.level]}</span>${pips(t.level, t.pressing)}
    </button>`;
  // A trait not held: open to turn up, resting on something, or closed off. Tapping says which, and lets it be watched for.
  const nodeRow = (n) => `
    <button class="trait node ${n.state}${n.watching ? ' watch' : ''}" data-act="node:${n.id}">
      <span>${traitIcon(n.id)}${esc(TRAIT_TEXT[n.id].name)}${n.watching ? ' <em class="tag">watching</em>' : ''}</span>
      <span class="dim">${n.state === 'open' ? 'can turn up' : n.state === 'needs' ? 'not yet' : 'closed off'}</span>${pips(0, false)}
    </button>`;
  const tree = v.tree.map((br) => `
    <h2 class="branch">${esc(TREE_TEXT[br.id].name)}</h2>
    <p class="hint">${esc(TREE_TEXT[br.id].line)}</p>
    <div class="traits">${br.traits.map((n) => (n.state === 'held' ? heldRow(v.traits.find((t) => t.id === n.id)) : nodeRow(n))).join('')}</div>`).join('');
  const ways = v.ways.map((w) => `
    <button class="way${w.on ? ' on' : ''}" data-act="way:${w.id}" ${w.full || v.over ? 'disabled' : ''}>
      <strong>${icon(w.id)}${WAY_TEXT[w.id].name}</strong>
      <small>${WAY_TEXT[w.id].gives} ${WAY_TEXT[w.id].costs}</small>
      <small class="state">${w.on ? (w.settling ? `Taking hold: ${w.settling} more ${plural(w.settling, 'turn', 'turns')} before it does anything. Tap to give it up.` : 'This is how you live. Tap to give it up.') : w.full ? `A lineage lives ${v.maxWays} ways at most. Give one up first.` : `Tap to take it up. It takes hold after ${v.waySettle} turns. As things stand: ${signed(w.feeds)}.`}</small>
    </button>`).join('');
  const st = v.standing, like = LINEAGE_TEXT[st.like], pic = animalSVG(v.parts, 9, animalLabel(v), v.length);
  return `
    <div class="stage plain">${pic.svg}</div>
    <p class="hint">About ${metres(v.length)}, ${SIZE_TEXT[[0.4, 0.9, 2, 4].indexOf(v.length)] || ''}. The bar is ${metres(pic.unit)}. ${colourLine(v)}</p>
    <div class="slots">${slots}</div>
    <h2>What this mouth makes of each food</h2>
    <div class="eats">${Object.entries(v.eats).filter(([, e]) => e > 0.05).sort((a, b) => b[1] - a[1]).map(([f, e]) => `<span class="eat"><i style="width:${Math.round(Math.min(1, e) * 100)}%"></i><em>${FOOD_TEXT[f] || f}</em></span>`).join('')}</div>
    <p class="hint">Upkeep ${n2(v.upkeep)} food a head. ${v.regionsHeld > 1 ? `Holding ${v.regionsHeld} regions, a trait grows at ${Math.round(v.speed * 100)}% of full speed.` : `A trait grows at ${Math.round(v.speed * 100)}% of full speed.`}</p>
    <h2>The tree</h2>
    <p class="hint">Tap a trait to grow it, or to watch for it. ${v.watch ? `Watching for <strong>${esc(TRAIT_TEXT[v.watch.id].name.toLowerCase())}</strong>.` : ''}</p>
    ${tree}
    <h2>How you live</h2>
    <p class="hint">Ways of living are chosen, not grown. Up to ${v.maxWays} at once.</p>
    <div class="ways">${ways}</div>
    <h2>Where you would stand</h2>
    <button class="row" data-act="ladder"><span>If it ended now: <strong>${RANK_TEXT[st.rank - 1]} of ${st.of}</strong></span><span class="dim">standing ${n0(st.score)}</span></button>
    <p class="hint">Most like the ${esc(like.name.toLowerCase())}.</p>`;
}

function ladderSheet() {
  const v = view(state);
  return `<h2>The ladder</h2><p>Seven lineages that came through the impact, and yours as it stands now. All eight are scored the same way.</p>
    <table class="ledger ladder">${ladderRows(v)}</table>${standingLines(v)}
    ${v.ladder.filter((r) => !r.you).map((r) => `<p class="hint"><strong>${esc(LINEAGE_TEXT[r.id].name)}.</strong> ${esc(LINEAGE_TEXT[r.id].line)} ${esc(LINEAGE_TEXT[r.id].example)}</p>`).join('')}
    <button data-act="close">Close</button>`;
}

function traitSheet(id) {
  const v = view(state), t = v.traits.find((x) => x.id === id), tx = TRAIT_TEXT[id];
  const press = t.pressing
    ? '<p>Under pressure now.</p><button data-act="press:none">Take the pressure off</button>'
    : t.canPress
      ? `<p>To ${STEP_NAMES[t.level + 1]}: ${t.pressTurns} ${plural(t.pressTurns, 'turn', 'turns')} of pressure, upkeep +${n2(t.cost / t.level)}, and it ${signed(t.pressFeeds)} as things stand. Only one trait is under pressure at a time.</p><button class="primary" data-act="press:${id}">Put the pressure here</button>`
      : `<p class="empty">Cannot grow further now. ${esc(t.pressWhy)}</p>`;
  const shed = t.shedding
    ? '<button data-act="shed:none">Keep it after all</button>'
    : t.canShed
      ? `<button data-act="shed:${id}">Let it fade a step <small>${signed(t.shedFeeds)}; takes the place of pressure</small></button>`
      : `<p class="empty">Cannot be let go. ${esc(t.shedWhy)}</p>`;
  const turn = t.turns ? `<h2>Turn the ${t.isCover ? 'covering' : 'mouth'}</h2><p class="hint">The ${t.isCover ? 'covering' : 'mouth'} you have goes on working until the new one is ready. The new one arrives a step lower. It takes the place of pressure.</p>${t.turns.map((o) => (!o.ok ? `<p class="empty">To ${esc(TRAIT_TEXT[o.to].name.toLowerCase())}: ${esc(o.why)}</p>` : o.turning
    ? `<button data-act="turn:none"><strong>Turning to ${esc(TRAIT_TEXT[o.to].name.toLowerCase())}</strong><small>${o.turns} ${plural(o.turns, 'turn', 'turns')} left. Tap to stop.</small></button>`
    : `<button data-act="turn:${o.to}">To ${esc(TRAIT_TEXT[o.to].name.toLowerCase())}<small>${o.turns} turns; arrives ${STEP_NAMES[o.level]}; then ${signed(o.feeds)} as things stand.${o.loses.length ? ` Loses ${list(o.loses.map((x) => TRAIT_TEXT[x].name.toLowerCase())).replace(' or ', ' and ')}, which ${t.isCover ? 'this covering cannot keep warm' : 'this mouth cannot use'}.` : ''}</small></button>`)).join('')}` : '';
  return `<h2>${esc(tx.name)}</h2><p>${esc(tx.does)}</p><p class="dim">${cap(STEP_NAMES[t.level])}. Costs ${n2(t.cost)} food a head, every turn it is held.</p>${v.over ? '' : press + (t.isMouth ? turn : t.isCover ? turn + shed : shed)}<button data-act="close">Close</button>`;
}

function nodeSheet(id) {
  const v = view(state), n = v.tree.flatMap((b) => b.traits).find((x) => x.id === id), tx = TRAIT_TEXT[id];
  const where = n.state === 'open'
    ? `<p>Not held. It can turn up as a mutation${n.feeds != null ? `, and a hint of it ${signed(n.feeds)} as things stand` : ''}.</p>`
    : `<p class="empty">${n.state === 'needs' ? 'Not yet.' : 'Closed off.'} ${esc(n.why)}</p>`;
  const watch = v.over || n.state === 'closed' ? ''
    : n.watching ? '<p>Being watched for.</p><button data-act="watch:none">Stop watching for it</button>'
      : `<button class="primary" data-act="watch:${id}">Watch for this<small>${n.state === 'open' ? `It will be among what a generation offers within ${v.watchTurns} turns.` : 'It will be offered once it can be grown.'} One trait is watched for at a time.</small></button>`;
  return `<h2>${esc(tx.name)}</h2><p>${esc(tx.does)}</p><p class="dim">A hint of it costs ${n2(n.cost)} food a head, every turn it is held.</p>${where}${watch}<button data-act="close">Close</button>`;
}

// ---- the menu -----------------------------------------------------------------

function menuTab(v) {
  const kept = shelf();
  const back = v.setting === 'saved' && !v.over && v.saves.length
    ? `<h2>Go back</h2><p class="hint">Going back sets this lineage aside, where it can be picked up again, and begins the era anew with a new die-off.</p><div class="stack">${[...v.saves].reverse().map((s) => `<button data-act="back:${s.era}">The start of ${esc(mid(s.name))}</button>`).join('')}</div>`
    : v.setting === 'oneLife' ? '<h2>Go back</h2><p class="empty">This lineage has one life: there are no saves to go back to. A lineage begun with a save at every era keeps one.</p>' : '';
  const aside = kept.length
    ? `<h2>Lineages set aside</h2><div class="stack">${kept.map((k, i) => `<div class="kept"><button data-act="shelf:${i}">${esc(k.label)}</button><button data-act="shelf-del:${i}" aria-label="Delete this lineage">Delete</button></div>`).join('')}</div>`
    : '';
  return `<h2>${SETTING_TEXT[v.setting].name}</h2><p class="hint">${SETTING_TEXT[v.setting].line}</p>
    ${back}${aside}
    <h2>Keep and move</h2>
    <div class="stack">
      <button data-act="export">Copy a save code</button>
      <button data-act="load-code">Load a save code</button>
      <button data-act="quit">Back to the title</button>
    </div>
    <p class="hint">Saves live in this browser on this device. A save code moves a lineage anywhere.</p>
    <h2>The calendar</h2><p class="hint">${ma(v.era.since)} million years have passed since the Shore. In ${esc(mid(v.era.name))} each turn is about ${ma(v.era.perTurn)} million years.</p>
    <h2>Notes</h2>${NOTES.map((n) => `<p class="hint">${esc(n)}</p>`).join('')}`;
}

function fail(err) {
  console.error(err);
  modal = `<h2>Something went wrong</h2>
    <p>${esc(err?.message || err)}</p>
    <p>Your lineage was saved before this. Copy this code somewhere safe, then reload:</p>
    <textarea readonly rows="4">${state ? esc(toCode(state)) : ''}</textarea>
    <button class="primary" data-act="close">Close</button>`;
  render();
}

function start(setting) {
  state = newGame({ seed: (Math.random() * 2 ** 31) >>> 0, setting });
  tab = 'play'; modal = null; choosing = false; lastNote = null; banner = null; save();
  const v = view(state);
  modal = `<h2>${esc(v.era.name)}</h2><p>${esc(v.era.intro)}</p><p>You are ${n0(v.pop)} small animals at the water's edge, each about ${metres(v.length)} long. Each turn a generation offers three changes: keep one, or none. Put pressure on a trait to grow it, and choose how you live, on the Body screen. The era will end badly; the signs come first. Whoever is alive at the end of the fifth era has come through.</p><button class="primary" data-act="close">Begin</button>`;
}

function turn(keep) {
  const { state: next, record } = advance(state, { keep });
  state = next; save();
  lastNote = turnNote(record); lastDelta = record.popAfter - record.popBefore; flashNext = record.gained.length > 0;
  const sheets = [];
  if (record.dieoffBegan) sheets.push(`<h2>${esc(cap(DIEOFF_TEXT[record.dieoffBegan].name))}</h2><p>${DIEOFF_TEXT[record.dieoffBegan].did} It will run to the end of the era. What you have built is what you have.</p><button class="primary" data-act="close">Go on</button>`);
  if (record.eraEnded) sheets.push(eraSheet(record));
  if (state.note) { banner = state.note; }
  pending = sheets; modal = pending.shift() || null;
}
let pending = [];

app.addEventListener('click', (e) => {
  const t = e.target.closest('[data-act],[data-tab],[data-action]');
  if (!t || busy) return;
  busy = true;
  try {
    if (t.dataset.tab) { tab = t.dataset.tab; modal = null; }
    else if (t.dataset.action) {
      const [, id] = t.dataset.action.split(':');
      turn(id || null);
    } else {
      const [act, arg] = t.dataset.act.split(':');
      if (act === 'new') { state = null; choosing = true; modal = null; }
      else if (act === 'cancel-new') { choosing = false; }
      else if (act === 'start-saved') start('saved');
      else if (act === 'start-one') start('oneLife');
      else if (act === 'continue') { state = load(); tab = 'play'; lastNote = null; if (state?.note) { banner = state.note; state = { ...state, note: null }; save(); } }
      else if (act === 'close') { modal = pending.shift() || null; }
      else if (act === 'dismiss') { banner = null; if (state?.note) { state = { ...state, note: null }; save(); } }
      else if (act === 'quit') { state = null; modal = null; choosing = false; }
      else if (act === 'install') { install?.(); }
      else if (act === 'region') { modal = regionSheet(arg); }
      else if (act === 'slot') { modal = slotSheet(arg); }
      else if (act === 'note') { modal = `<h2>Last turn</h2><p>${lastNote}</p><button data-act="close">Close</button>`; }
      else if (act === 'spread') { state = setPlan(state, { spread: arg }); save(); modal = null; }
      else if (act === 'unspread') { state = setPlan(state, { spread: null }); save(); modal = null; }
      else if (act === 'meet') { state = meet(state, Number(arg)); save(); }
      else if (act === 'way') {
        const now = view(state).ways.filter((w) => w.on).map((w) => w.id);
        state = setPlan(state, { ways: now.includes(arg) ? now.filter((w) => w !== arg) : [...now, arg] }); save();
      }
      else if (act === 'ladder') { modal = ladderSheet(); }
      else if (act === 'trait') { modal = traitSheet(arg); }
      else if (act === 'node') { modal = nodeSheet(arg); }
      else if (act === 'stance') { const [, a, id] = t.dataset.act.split(':'); state = setPlan(state, { stance: a === 'none' ? null : { id, act: a } }); save(); }
      else if (act === 'watch') { state = setPlan(state, { watch: arg === 'none' ? null : arg }); save(); modal = null; }
      else if (act === 'press') { state = setPlan(state, { press: arg === 'none' ? null : arg }); save(); modal = null; }
      else if (act === 'shed') { state = setPlan(state, { shed: arg === 'none' ? null : arg }); save(); modal = null; }
      else if (act === 'turn') { state = setPlan(state, { turn: arg === 'none' ? null : arg }); save(); modal = null; }
      else if (act === 'retry') { state = retry(state, Number(arg)); save(); tab = 'play'; lastNote = null; modal = null; }
      else if (act === 'back') {
        const kept = shelf();
        modal = kept.length >= SHELF_MAX
          ? `<h2>No room to set this lineage aside</h2><p>${SHELF_MAX} lineages are already set aside. Delete one from the menu, or copy this one's save code, then go back.</p><button data-act="close">Close</button>`
          : `<h2>Go back to the start of ${esc(mid(view(state).saves.find((s) => s.era === Number(arg)).name))}?</h2><p>This lineage is set aside as it stands and can be picked up again from the menu. The era begins anew, with a new die-off.</p><button class="primary" data-act="back-go:${arg}">Go back</button><button data-act="close">Stay</button>`;
      }
      else if (act === 'back-go') { setShelf([{ label: shelfLabel(state), save: serialize(state) }, ...shelf()]); state = retry(state, Number(arg)); save(); tab = 'play'; lastNote = null; modal = null; }
      else if (act === 'shelf') {
        const kept = shelf(), pick = kept[Number(arg)];
        const other = deserialize(pick.save);
        kept.splice(Number(arg), 1, { label: shelfLabel(state), save: serialize(state) });
        setShelf(kept); state = other; save(); tab = 'play'; lastNote = null; modal = null;
      }
      else if (act === 'shelf-del') { const kept = shelf(); kept.splice(Number(arg), 1); setShelf(kept); }
      else if (act === 'export') { modal = `<h2>Save code</h2><textarea readonly rows="5">${esc(toCode(state))}</textarea><button class="primary" data-act="close">Done</button>`; }
      else if (act === 'load-code') {
        const code = prompt('Paste a save code');
        if (code) { try { state = fromCode(code); save(); tab = 'play'; modal = null; lastNote = null; choosing = false; } catch (err) { banner = err.message; } }
      }
    }
    render();
    if (t.dataset.tab || t.dataset.action) scrollTo(0, 0);
  } catch (err) { fail(err); } finally { busy = false; }
});

addEventListener('error', (e) => fail(e.error || e.message));
addEventListener('unhandledrejection', (e) => fail(e.reason));

installPrompt((go) => { install = go; if (!state) title(); });
render();
registerSW({ onUpdate: (reload) => { banner = 'A new version is ready.'; modal = null; render(); app.querySelector('.banner')?.insertAdjacentHTML('beforeend', ' <button data-act="reload-now">Reload</button>'); app.querySelector('[data-act="reload-now"]')?.addEventListener('click', reload); } });

// For tools/smoke.mjs and tools/check-bundle.mjs: read-only access to the game.
globalThis.__game = { get state() { return state; } };

