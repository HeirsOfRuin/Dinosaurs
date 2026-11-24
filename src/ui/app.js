// The screens. Reads the engine's view and computes nothing itself.
//
// Patterns every screen keeps (game-building rules):
//  - Empty and locked states say why and what would change them (rule 6).
//  - The game saves after every turn and every order; a save code moves a
//    lineage between devices or between the itch copy and the installed copy.
//  - A throw never leaves a dead button: busy is released in finally, and the
//    error screen offers the save.

import { newGame, advance, setPlan, retry, view } from '../engine/turn.js';
import { SAVE_KEY, SHELF_KEY, serialize, deserialize, toCode, fromCode } from '../engine/state.js';
import { STORAGE_OK, lsGet, lsSet } from './storage.js';
import { registerSW, installPrompt } from './sw-register.js';
import { animalSVG, sceneSVG } from './sprite.js';
import { TITLE, TRAIT_TEXT, STEP_NAMES, FOOD_TEXT, REGION_TEXT, DIEOFF_TEXT, ENDING_TEXT, OTHER_ENDINGS, SETTING_TEXT, PART_TEXT, NOTES } from '../data/text.data.js';

const SHELF_MAX = 6;
const app = document.getElementById('app');
let state = null;
let tab = 'play';
let modal = null;
let busy = false;
let banner = null;
let install = null;
let choosing = false;
let lastNote = null;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const n0 = (x) => String(Math.round(x));
const n2 = (x) => x.toFixed(2);
const signed = (x) => (Math.abs(x) < 0.5 ? 'no change in food' : x > 0 ? `feeds ${n0(x)} more` : `feeds ${n0(-x)} fewer`);
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
  const tabs = [['play', 'Turn'], ['body', 'Body'], ['menu', 'Menu']];
  app.innerHTML = `
    <header class="hud">
      <div class="hud-top"><h1>${esc(v.era.name)}</h1><span class="ma">${v.era.ma} million years ago</span></div>
      <div class="eras" aria-hidden="true">${v.eras.map((e) => `<i style="flex:${e.turns}"><b style="width:${Math.round(e.frac * 100)}%"></b></i>`).join('')}</div>
      <div class="hud-sub"><span class="turn">Turn ${v.era.turn} of ${v.era.turns}</span><span>Era ${v.era.index + 1} of ${v.eras.length} · ${SETTING_TEXT[v.setting].name.toLowerCase()}</span></div>
    </header>
    ${banner ? `<p class="banner">${esc(banner)} <button data-act="dismiss">OK</button></p>` : ''}
    <main class="panel">${tab === 'play' ? playTab(v) : tab === 'body' ? bodyTab(v) : menuTab(v)}</main>
    <nav class="tabs">${tabs.map(([id, label]) => `<button data-tab="${id}" class="${tab === id ? 'on' : ''}">${label}</button>`).join('')}</nav>
    ${modal ? `<div class="scrim"><div class="sheet">${modal}</div></div>` : ''}`;
}

const animalLabel = (v) => `Your animal: ${PART_TEXT.trunk[v.parts.trunk]} body, limbs ${PART_TEXT.limbs[v.parts.limbs]}, ${PART_TEXT.skin[v.parts.skin]} skin`;
const eating = (v) => (v.focus ? `eating mostly ${FOOD_TEXT[v.focus]}` : 'eating anything');

function fitWord(r) {
  if (r.fit >= 0.85) return 'liveable';
  const why = [r.tooDry && 'too dry', r.tooCold && 'too cold', r.tooHot && 'too hot'].filter(Boolean);
  return `${r.fit < 0.15 ? '' : 'hard: '}${why.join(', ') || 'poor ground'}`;
}

// ---- the turn -----------------------------------------------------------------

function playTab(v) {
  if (v.over) return endTab(v);
  const regions = v.regions.map((r) => `
    <button class="region${r.mine ? ' mine' : ''}${r.fit < 0.15 && !r.mine ? ' shut' : ''}" data-act="region:${r.id}">
      <span class="rname">${REGION_TEXT[r.id]}</span>
      <span>${r.mine ? `<strong>you ${n0(r.mine)}</strong>` : fitWord(r)}</span>
      <span class="dim">${r.rivals >= 1 ? `rivals ${n0(r.rivals)}` : 'no rivals'}</span>
      ${r.outlook ? `<span class="out ${r.outlook === 'spared' ? 'good' : 'bad'}">${r.outlook}</span>` : ''}
      ${r.spread.queued ? '<span class="out good">settlers going</span>' : ''}
    </button>`).join('');

  let omen = '';
  if (v.dieoff) omen = `<div class="omen now"><strong>${esc(cap(DIEOFF_TEXT[v.dieoff.kind].name))}.</strong> ${DIEOFF_TEXT[v.dieoff.kind].did} ${v.dieoff.left} ${plural(v.dieoff.left, 'turn', 'turns')} of it left.</div>`;
  else if (v.warning) omen = v.warning.named
    ? `<div class="omen"><strong>${esc(cap(DIEOFF_TEXT[v.warning.kinds[0]].name))}, ${v.warning.turns} ${plural(v.warning.turns, 'turn', 'turns')} out.</strong> ${DIEOFF_TEXT[v.warning.kinds[0]].sign} The regions show what it will spare.</div>`
    : `<div class="omen"><strong>Something is coming, ${v.warning.turns} turns out.</strong> It may be ${list(v.warning.kinds.map((k) => DIEOFF_TEXT[k].name))}; it is not yet clear which.</div>`;

  const p = v.pressure;
  const pressure = p
    ? `<button class="row" data-tab="body"><span>${p.kind === 'shed' ? 'Letting go of' : 'Pressure on'} <strong>${esc(TRAIT_TEXT[p.id].name.toLowerCase())}</strong></span><span class="dim">${p.kind === 'shed' ? '' : `to ${STEP_NAMES[p.to]} · `}${p.left} ${plural(p.left, 'turn', 'turns')} left</span>${p.kind === 'press' ? `<span class="bar"><b style="width:${Math.round(100 * (p.of - p.left) / p.of)}%"></b></span>` : ''}</button>`
    : '<button class="row empty" data-tab="body"><span><strong>Nothing is under pressure.</strong></span><span class="dim">No trait is growing. Choose one on the Body screen.</span></button>';

  const foods = v.foods.map((f) => `<button class="chip${f.on ? ' on' : ''}" data-act="focus:${f.id || 'mixed'}">${f.id ? FOOD_TEXT[f.id] : 'anything'}<small>${n0(f.feeds)}</small></button>`).join('');

  const offers = v.offers.length ? v.offers.map((o) => `
    <div class="offer">
      <div><strong>${esc(TRAIT_TEXT[o.id].name)}</strong><small>${esc(TRAIT_TEXT[o.id].does)} Upkeep +${n2(o.cost)}; ${signed(o.feeds)} now.${o.closes.length ? ` Closes the road to the ${list(o.closes.map((e) => ENDING_TEXT[e].name.toLowerCase()))}.` : ''}</small></div>
      <button class="primary" data-action="keep:${o.id}">Keep</button>
    </div>`).join('') : '<p class="empty">No new mutation this generation: everything this body could begin, it has begun.</p>';

  return `
    <div class="stage">${sceneSVG(v.era.id, v.era.palette, v.parts, animalLabel(v), !!v.dieoff)}
      <div class="strip"><span><strong>${n0(v.pop)}</strong> alive</span><span class="dim">${eating(v)}</span><span class="dim">upkeep ${n2(v.upkeep)}</span></div>
    </div>
    ${lastNote ? `<p class="note">${lastNote}</p>` : ''}
    ${omen}
    ${pressure}
    <h2>This generation offers</h2>
    ${offers}
    <button class="next" data-action="next">${v.offers.length ? 'Keep none, next turn' : 'Next turn'}</button>
    <h2>Where you live</h2>
    <div class="regions">${regions}</div>
    <h2>Eat mostly <span class="plainh">(numbers it would feed)</span></h2>
    <div class="foodrow">${foods}</div>`;
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
  if (rec.kept) bits.push(`Kept: ${TRAIT_TEXT[rec.kept].name.toLowerCase()}.`);
  for (const id of rec.gained) bits.push(`${TRAIT_TEXT[id].name} is now ${STEP_NAMES[view(state).traits.find((t) => t.id === id)?.level || 1]}.`);
  for (const id of rec.lost) bits.push(`${TRAIT_TEXT[id].name} has faded a step.`);
  for (const id of rec.settled) bits.push(`Settlers reached the ${REGION_TEXT[id].toLowerCase()}.`);
  for (const id of rec.emptied) bits.push(`None of you are left in the ${REGION_TEXT[id].toLowerCase()}.`);
  const d = rec.popAfter - rec.popBefore;
  bits.push(Math.abs(d) < 0.5 ? 'Numbers held.' : d > 0 ? `Numbers up ${n0(d)}.` : `Numbers down ${n0(-d)}.`);
  return bits.map(esc).join(' ');
}

function eraSheet(rec) {
  const e = rec.eraEnded, v = view(state), d = DIEOFF_TEXT[e.kind];
  const ids = [...new Set([...Object.keys(e.onset), ...Object.keys(e.after)])];
  const rows = ids.map((id) => `<tr><td>${REGION_TEXT[id]}</td><td class="num">${n0(e.onset[id] || 0)} to ${e.after[id] >= 1 ? n0(e.after[id]) : 'none'}</td></tr>`).join('');
  const next = e.next != null
    ? `<p><strong>Of those left, ${n0(e.carried)} find their way into ${esc(mid(v.era.name))}.</strong> ${esc(v.era.intro)}</p>${v.setting === 'saved' ? `<p class="hint">Saved: the start of ${esc(mid(v.era.name))}. Your saves for the earlier eras are kept.</p>` : ''}`
    : '';
  return `<h2>${esc(cap(d.name))}</h2><p>${d.did}</p><table class="ledger">${rows}</table>${next}<button class="primary" data-act="close">${e.next != null ? 'Walk on' : 'See what became of them'}</button>`;
}

// ---- the end ------------------------------------------------------------------

function endTab(v) {
  const won = v.outcome === 'win';
  const head = won ? ENDING_TEXT[v.form].name : v.outcome === 'survived' ? 'Still here' : 'The line ends';
  const text = won ? ENDING_TEXT[v.form].won : v.outcome === 'survived' ? OTHER_ENDINGS.survived : OTHER_ENDINGS[v.cause] || OTHER_ENDINGS.starved;
  const again = v.setting === 'saved' && v.saves.length
    ? `<h2>Begin an era again</h2><p class="hint">Each try rolls a new die-off. The body you carried in is the body you start with.</p><div class="stack">${[...v.saves].reverse().map((s) => `<button data-act="retry:${s.era}"><strong>The start of ${esc(mid(s.name))}</strong><small>${s.tries ? `tried ${s.tries + 1} ${plural(s.tries + 1, 'time', 'times')}` : 'tried once'}</small></button>`).join('')}</div>`
    : v.outcome === 'extinct' ? '<p class="hint">This lineage had one life. A new one begins at the Shore.</p>' : '';
  return `<div class="stage">${sceneSVG(v.era.id, v.era.palette, v.parts, animalLabel(v), !won)}</div>
    <h2 class="big">${esc(head)}</h2>
    <p>${esc(text)}</p>
    <p class="dim">${esc(v.era.name)}, ${v.era.ma} million years ago. ${v.pop >= 1 ? n0(v.pop) : 'None'} alive at the end, after ${v.clock.turn} ${plural(v.clock.turn, 'turn', 'turns')} of ${v.clock.of}.</p>
    ${again}
    <div class="stack last"><button ${again && v.setting === 'saved' ? '' : 'class="primary"'} data-act="new">New lineage</button></div>`;
}

// ---- the body -----------------------------------------------------------------

function bodyTab(v) {
  const slots = ['skull', 'jaw', 'trunk', 'limbs', 'tail', 'skin'].map((k) => `<div class="slot"><span class="dim">${cap(k)}</span>${PART_TEXT[k][v.parts[k]]}${k === 'limbs' && v.parts.claws ? ', digging claws' : ''}</div>`).join('');
  const pips = (n, growing) => `<span class="pips">${[1, 2, 3].map((i) => `<i class="${i <= n ? 'on' : growing && i === n + 1 ? 'grow' : ''}"></i>`).join('')}</span>`;
  const traits = v.traits.map((t) => `
    <button class="trait${t.pressing ? ' on' : ''}${t.shedding ? ' fade' : ''}" data-act="trait:${t.id}">
      <span>${esc(TRAIT_TEXT[t.id].name)}</span>
      <span class="dim">${t.pressing ? 'under pressure' : t.shedding ? 'letting go' : STEP_NAMES[t.level]}</span>${pips(t.level, t.pressing)}
    </button>`).join('');
  const roads = v.roads.map((r) => `
    <div class="road${r.is ? ' on' : ''}${r.closedBy ? ' shut' : ''}">
      <strong>${ENDING_TEXT[r.id].name}</strong>
      <small>${r.is ? 'This is what you are.' : r.closedBy ? `Closed while you keep ${TRAIT_TEXT[r.closedBy].name.toLowerCase()}.` : r.fits ? 'The body is ready.' : `${r.have} of ${r.need} steps`}</small>
    </div>`).join('');
  return `
    <div class="stage plain">${animalSVG(v.parts, 9, animalLabel(v))}</div>
    <div class="slots">${slots}</div>
    <p class="hint">Upkeep ${n2(v.upkeep)} food a head. ${v.regionsHeld > 1 ? `Holding ${v.regionsHeld} regions, a trait grows at ${Math.round(v.speed * 100)}% of full speed.` : 'Holding one region, traits grow at full speed.'}</p>
    <h2>Traits held</h2>
    <div class="traits">${traits}</div>
    <h2>What this body could become</h2>
    <p class="hint">${v.form ? 'The crossing is made. It cannot be undone.' : `A lineage crosses into the first of these its body fits, from turn ${v.formFromTurn + 1} of the Triassic. Only these four count as a win.`}</p>
    <div class="roads">${roads}</div>`;
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
  return `<h2>${esc(tx.name)}</h2><p>${esc(tx.does)}</p><p class="dim">${cap(STEP_NAMES[t.level])}. Costs ${n2(t.cost)} food a head, every turn it is held.</p>${v.over ? '' : press + shed}<button data-act="close">Close</button>`;
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
  modal = `<h2>${esc(v.era.name)}</h2><p>${esc(v.era.intro)}</p><p>You are ${n0(v.pop)} small animals at the water's edge. Each turn a generation offers three changes: keep one, or none. Put pressure on a trait to grow it. The era will end badly; the signs come first.</p><button class="primary" data-act="close">Begin</button>`;
}

function turn(keep) {
  const { state: next, record } = advance(state, { keep });
  state = next; save();
  lastNote = turnNote(record);
  const sheets = [];
  if (record.dieoffBegan) sheets.push(`<h2>${esc(cap(DIEOFF_TEXT[record.dieoffBegan].name))}</h2><p>${DIEOFF_TEXT[record.dieoffBegan].did} It will run to the end of the era. What you have built is what you have.</p><button class="primary" data-act="close">Go on</button>`);
  if (record.crossed) sheets.push(`<h2>${ENDING_TEXT[record.crossed].name}</h2><p>The body has become something with a name. ${ENDING_TEXT[record.crossed].line} Bring it through the end of the Triassic and it is a win.</p><button class="primary" data-act="close">Go on</button>`);
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
      else if (act === 'spread') { state = setPlan(state, { spread: arg }); save(); modal = null; }
      else if (act === 'unspread') { state = setPlan(state, { spread: null }); save(); modal = null; }
      else if (act === 'focus') { state = setPlan(state, { focus: arg === 'mixed' ? null : arg }); save(); }
      else if (act === 'trait') { modal = traitSheet(arg); }
      else if (act === 'press') { state = setPlan(state, { press: arg === 'none' ? null : arg }); save(); modal = null; }
      else if (act === 'shed') { state = setPlan(state, { shed: arg === 'none' ? null : arg }); save(); modal = null; }
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

