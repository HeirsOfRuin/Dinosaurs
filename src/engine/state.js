// The save contract and its migrations.
//
// The save KEY is a contract: renaming it orphans every save on every device.
// The payload carries `v`; MIGRATIONS[v] upgrades version v to v + 1. Every
// version that ever shipped has a fixture in test/fixtures/ that must load and
// play on (test/save-contract.test.js).
//
// v1 was the scaffold's placeholder game (a 24-turn trading toy), which was
// on Pages for a day. A v1 save cannot become a lineage, so its migration
// starts a new lineage from the same seed and says so in `note`.
//
// v2 was the first real build: several jaws at once, a choice of food each
// turn, and four fixed winning bodies. v3 has one mouth, ways of living,
// moments and standing. A v2 lineage keeps its strongest jaw as its mouth and
// loses the others, and is told so; a v2 lineage that was alive at the end has
// come through, and is given its standing.
//
// v4 has coverings (scales, fur, feathers), a sail, pairs of traits that close
// each other off, and a trait that can be watched for. Warm blood now needs fur
// or feathers over it: a warm-blooded v3 lineage is given a hint of one (feathers
// if its legs are under its body, fur otherwise) and is told. A v3 body that
// holds both halves of a closed pair keeps both.

import { freshGame } from './game.js';
import { JAWS, TRAITS, STANCES, ERAS } from '../data/world.data.js';
import { regionsNow, ladder, resembles, bornHue, mouthOf } from './model.js';

export const SAVE_KEY = 'deep-time.save.v1'; // never rename
export const SHELF_KEY = 'deep-time.shelf.v1'; // lineages set aside by going back to an earlier era
export const SAVE_VERSION = 8;
export const CODE_PREFIX = 'DEEP1.';

/** MIGRATIONS[v](save) returns the save at version v + 1. Add one per version bump. */
export const MIGRATIONS = {
  1: (old) => ({ ...freshGame({ seed: old.seed, setting: 'saved' }), v: 2, plan: { press: null, shed: null, focus: null, spread: null }, note: 'A save from the first test build could not be carried over. A new lineage was begun in its place.' }),
  2: (old) => {
    const g = structuredClone(old);
    let lost = false;
    const world = (s) => {
      for (const l of s.lineages) {
        const jaws = Object.keys(l.traits).filter((id) => JAWS[id]).sort((a, b) => l.traits[b] - l.traits[a]);
        for (const id of jaws.slice(1)) { delete l.traits[id]; if (l.player) lost = true; }
        for (const k of Object.keys(l.prog || {})) if (JAWS[k.replace('shed.', '')] && !l.traits[k.replace('shed.', '')]) delete l.prog[k];
        delete l.focus; delete l.form; l.ways = {};
      }
      s.seen = []; s.mods = []; s.faces = {};
      delete s.form; delete s.formAt; delete s.bodyAt; delete s.faceShadow;
      s.rev = (s.rev || 0) + 1;
      s.regions = regionsNow(s);
      if (s.ended && s.outcome !== 'extinct') {
        const rows = ladder(s), at = rows.findIndex((r) => r.you);
        s.outcome = 'through'; s.standing = rows[at].score; s.rank = at + 1; s.like = resembles(s.lineages.find((l) => l.player).traits);
      }
      return s;
    };
    g.s = world(g.s);
    g.saves = (g.saves || []).map((x) => (x ? world(x) : x));
    g.plan = { press: g.plan?.press ?? null, shed: g.plan?.shed ?? null, spread: null, ways: [], pick: null };
    if (g.plan.press && !g.s.lineages.find((l) => l.player).traits[g.plan.press]) g.plan.press = null;
    if (g.over) g.outcome = g.s.outcome;
    g.v = 3;
    g.note = old.note ? old.note : `The rules have changed since this lineage was saved. A lineage now has one mouth${lost ? ': yours keeps its strongest jaw and has lost the others' : ''}, and the food it eats follows from it. Coming through the end of the Triassic is now the win, and how well is a place on a ladder.`;
    return g;
  },
};

MIGRATIONS[3] = (old) => {
  const g = structuredClone(old);
  let coat = null;
  const world = (s) => {
    for (const l of s.lineages) {
      if (l.traits.warm && !l.traits.fur && !l.traits.feathers) {
        const c = (l.traits.gait || 0) >= 2 ? 'feathers' : 'fur';
        delete l.traits.scales; l.traits[c] = 1;
        if (l.player) coat = c;
      }
    }
    s.rev = (s.rev || 0) + 1;
    return s;
  };
  g.s = world(g.s);
  g.saves = (g.saves || []).map((x) => (x ? world(x) : x));
  g.plan = { press: null, shed: null, turn: null, spread: null, ways: [], pick: null, ...g.plan, watch: null };
  g.v = 4;
  g.note = old.note ? old.note : `The rules have changed since this lineage was saved. Skin can now grow a covering: scales, fur or feathers, one at a time. Warm blood needs fur or feathers over it${coat ? `, so yours has been given a hint of ${coat}` : ''}. Some traits now close each other off, and the Body screen shows the whole tree: mark a trait there to watch for it.`;
  return g;
};

// v5 adds stances toward rivals (docs/FRAME-rivals.md) and four weapons. Nothing
// in a v4 save is lost: every lineage starts without a stance.
MIGRATIONS[4] = (old) => {
  const g = structuredClone(old);
  const world = (s) => { for (const l of s.lineages) l.stance = null; s.rev = (s.rev || 0) + 1; return s; };
  g.s = world(g.s);
  g.saves = (g.saves || []).map((x) => (x ? world(x) : x));
  g.plan = { ...g.plan, stance: null };
  g.v = 5;
  g.note = old.note ? old.note : 'The rules have changed since this lineage was saved. You can now act on the rivals you share ground with, from the new Rivals screen, and they can act on you: a hunter bigger than you will hunt you. Four weapons have been added to the tree.';
  return g;
};

// v6: colour can count (camouflage, display). Every lineage is given the colour it was born
// with in its era, which is the colour a v5 save drew; nothing else changes.
MIGRATIONS[5] = (old) => {
  const g = structuredClone(old);
  const world = (s) => { for (const l of s.lineages) if (l.hue == null) l.hue = bornHue(s, l); s.rev = (s.rev || 0) + 1; return s; };
  g.s = world(g.s);
  g.saves = (g.saves || []).map((x) => (x ? world(x) : x));
  g.v = 6;
  g.note = old.note ? old.note : 'The rules have changed since this lineage was saved. Two new traits, camouflage and display, make a lineage\'s colour count. Without them colour still changes nothing.';
  return g;
};

// v7 (2026-11-28, docs/FRAME-next.md): two stances, not four; each mouth refinement grows only on
// its own jaw. A stance that is gone is dropped, and a refinement on the wrong jaw is shed, with any
// pressure on it.
MIGRATIONS[6] = (old) => {
  const g = structuredClone(old);
  const fits = (t, id) => !TRAITS[id]?.mouths || TRAITS[id].mouths.includes(mouthOf(t));
  const world = (s) => {
    for (const l of s.lineages) {
      if (l.stance && !STANCES.includes(l.stance.act)) l.stance = null;
      for (const id of Object.keys(l.traits)) if (!TRAITS[id] || !fits(l.traits, id)) { delete l.traits[id]; if (l.prog) delete l.prog[id]; }
    }
    s.rev = (s.rev || 0) + 1; return s;
  };
  g.s = world(g.s);
  g.saves = (g.saves || []).map((x) => (x ? world(x) : x));
  g.plan = { ...g.plan, stance: g.plan?.stance && STANCES.includes(g.plan.stance.act) ? g.plan.stance : null };
  if (g.plan.press && !TRAITS[g.plan.press]) g.plan.press = null;
  g.v = 7;
  g.note = old.note ? old.note : 'The rules have changed since this lineage was saved. There are two stances toward a rival now, push and prey; a scavenger eats behind a bigger hunter without one. Each refinement of a mouth grows only on its own jaw, and one on the wrong jaw has been shed.';
  return g;
};

// v8 (2026-11-28, docs/FRAME-next.md section 4.1): the run goes on past the Triassic, through the
// Jurassic and the Cretaceous to the impact, and the ladder is the lineages that came through it. A run
// still going walks on into the Jurassic; one that has ended stays ended. The tries are padded to an era each.
MIGRATIONS[7] = (old) => {
  const g = structuredClone(old);
  g.v = 8;
  g.note = old.note ? old.note : (old.over ? 'The game now runs on past the Triassic to the end of the dinosaurs. This lineage ended before that, and is ranked among the lineages that came through the impact.' : 'The game now runs on past the Triassic, through the Jurassic and the Cretaceous, to the end of the dinosaurs. This lineage walks on.');
  return g;
};

export function migrate(save) {
  let s = save;
  if (!s || typeof s !== 'object' || !Number.isInteger(s.v)) throw new Error('not a save');
  if (s.v > SAVE_VERSION) throw new Error(`save is from a newer version (${s.v}) than this build (${SAVE_VERSION})`);
  while (s.v < SAVE_VERSION) {
    const step = MIGRATIONS[s.v];
    if (!step) throw new Error(`no migration from save version ${s.v}`);
    s = step(s);
  }
  // One count of tries an era, whatever the save was made with: some v8 saves were made with five.
  if (Array.isArray(s.tries) && s.tries.length < ERAS.length) s = { ...s, tries: [...s.tries, ...Array(ERAS.length - s.tries.length).fill(0)] };
  return s;
}

export const serialize = (state) => JSON.stringify(state);
export const deserialize = (text) => migrate(JSON.parse(text));

/** A save as text, to move between devices or between itch and the Pages copy. */
export function toCode(state) {
  const b64 = btoa(unescape(encodeURIComponent(serialize(state))));
  return CODE_PREFIX + b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function fromCode(code) {
  const text = String(code).trim();
  if (!text.startsWith(CODE_PREFIX.slice(0, -2))) throw new Error('That is not a save code for this game.');
  const body = text.slice(text.indexOf('.') + 1).replace(/-/g, '+').replace(/_/g, '/');
  return deserialize(decodeURIComponent(escape(atob(body))));
}
