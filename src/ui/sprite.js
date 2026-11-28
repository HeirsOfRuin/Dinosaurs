// The animal, drawn from its six slots (src/engine/parts.js) on a 32 by 20
// pixel grid, and the ground it stands on. Pure functions from parts to SVG
// text: the same parts always draw the same animal. Drawn at whole multiples
// and never smoothed (shape-rendering: crispEdges).

// Colouring: a hue from the lineage's look, shaded by what its skin is. [hue, saturation, lightness].
const HUE = [[150, 28, 48], [95, 36, 45], [45, 46, 47], [22, 48, 46], [205, 24, 50], [330, 20, 50], [70, 32, 40], [180, 30, 42]];
const SHADE = { wet: [0, 8, 4], tight: [0, 0, 0], scaled: [0, 6, -3], furred: [0, -8, -4], feathered: [0, 4, 2], armoured: [0, -14, -9] };
const hsl = (h, s, l) => `hsl(${Math.round(h)} ${Math.max(4, Math.min(90, Math.round(s)))}% ${Math.max(8, Math.min(92, Math.round(l)))}%)`;
function colours(p) {
  const [hb, s0, l0] = HUE[(p.look?.hue ?? 0) % HUE.length], [dh, ds, dl] = SHADE[p.skin] || SHADE.wet;
  const h0 = p.look?.deg ?? hb;   // a colour that has turned (camouflage, display) is drawn as it now is
  const h = p.skin === 'furred' ? (h0 + 28 * 2) / 3 : h0 + dh, s = s0 + ds, l = l0 + dl;   // fur pulls every hue toward brown
  return { body: hsl(h, s, l), dark: hsl(h, s + 4, l - 22), belly: hsl(h + 10, s - 12, l + 30), limb: hsl(h, s, l - 8), pale: hsl(h + 10, s - 10, l + 16) };
}
const SIZE = { slight: [10, 3], sturdy: [12, 4], heavy: [13, 5], massive: [14, 6] };
const SKULL = { narrow: [5, 3], broad: [6, 3], domed: [6, 4], high: [6, 4] };

/** [x, y, w, h, colour] rectangles for one animal facing right, feet on row 17. */
export function animalRects(p) {
  const c = colours(p), out = [], look = p.look || { pattern: 1, ridge: 0, tip: 0 };
  const put = (x, y, w, h, col) => { if (w > 0 && h > 0) out.push([x, y, w, h, col]); };
  const [len, hgt] = SIZE[p.trunk] || SIZE.slight;
  const [hw, hh] = SKULL[p.skull] || SKULL.narrow;
  const upright = p.limbs === 'upright';
  let x0, top, x1, headX, headY;

  if (upright) {
    const L = len - 2; x0 = 10; top = 12 - hgt; x1 = x0 + L;
    put(x0 + L - 5, top + hgt - 1, 2, 17 - (top + hgt - 1), c.dark); put(x0 + L - 5, 17, 3, 1, c.dark);          // far leg
    put(x0 - 9, top + 2, 4, 1, c.body); put(x0 - 6, top + 1, 6, 2, c.body);                                       // balancing tail
    put(x0, top, L, hgt, c.body); put(x0 + 1, top + hgt, L - 2, 1, c.belly);
    put(x1 - 1, top - 3, 3, 4, c.body);                                                                           // neck
    headX = x1; headY = top - 4 - (hh - 3);
    put(x0 + 2, top + hgt - 1, 4, 3, c.body); put(x0 + 3, top + hgt + 2, 2, 17 - (top + hgt + 2), c.body); put(x0 + 3, 17, 4, 1, c.body);  // near leg
    put(x1 - 1, top + hgt - 1, 1, 3, c.limb); put(x1, top + hgt + 1, 1, 1, c.limb);                               // arm
    if (p.claws) put(x1 + 1, top + hgt + 1, 1, 1, '#f4f0e0');
  } else {
    const leg = p.limbs === 'raised' ? 3 : p.limbs === 'sprawlStrong' ? 2 : 1;
    x0 = 8; top = 17 - leg - hgt; x1 = x0 + len;
    if (p.tail === 'fin') { put(x0 - 7, top + 1, 4, 1, c.body); put(x0 - 8, top + 2, 7, Math.max(1, hgt - 2), c.body); put(x0 - 2, top + 1, 3, Math.max(1, hgt - 1), c.body); }
    else { put(x0 - 8, top + 2, 4, 1, c.limb); put(x0 - 5, top + 1, 6, 2, c.body); }
    put(x0, top, len, hgt, c.body); put(x0 + 1, top + hgt, len - 2, 1, c.belly);
    headX = x1; headY = top - (hh - 3) - (p.limbs === 'raised' ? 1 : 0);
    for (const lx of [x0 + 1, x1 - 3]) { put(lx, top + hgt, 2, leg, c.limb); put(lx - (p.limbs === 'raised' ? 0 : 1), 17, 3, 1, c.limb); if (p.claws) put(lx + 2, 17, 1, 1, '#f4f0e0'); }
  }
  // A long neck raises the head: two pixels a step, the neck drawn under it.
  if (p.neck) { headY -= 2 * p.neck; put(headX - 1, headY + hh - 1, 2, 2 * p.neck + 1, c.body); }
  // skull and jaw
  put(headX, headY, hw, hh, c.body);
  if (p.skull === 'high') put(headX + 1, headY - 1, 3, 1, c.body);
  const mid = headY + 1, under = headY + hh;
  if (p.jaw === 'jawInsects') { put(headX + hw, mid, 2, 1, c.body); put(headX + 1, under, hw - 1, 1, c.belly); }
  else if (p.jaw === 'jawFish') { put(headX + hw, mid, 4, 2, c.body); put(headX + 1, under, hw + 2, 1, c.belly); }
  else if (p.jaw === 'jawPlants') { put(headX + hw, mid, 1, 2, c.body); put(headX, under, hw, 2, c.belly); }
  else if (p.jaw === 'jawPrey') { put(headX + hw, mid, 2, 2, c.body); put(headX + 1, under, hw + 1, 1, c.belly); put(headX + hw - 1, under, 1, 1, '#f4f0e0'); put(headX + hw + 1, under, 1, 1, '#f4f0e0'); }
  else { put(headX + hw, mid, 1, 1, c.body); put(headX + 1, under, hw - 1, 1, c.belly); }
  // What the mouth has grown into: an omnivore's mixed teeth, a cracking beak, a scavenger's hook.
  const tip = headX + hw + (p.jaw === 'jawFish' ? 3 : p.jaw === 'jawInsects' || p.jaw === 'jawPrey' ? 1 : 0);
  if (p.teeth?.mixed) put(headX + 2, under, 1, 1, '#f4f0e0');
  if (p.teeth?.beak) put(tip, mid, 1, 2, c.dark);
  if (p.teeth?.hook) put(tip, mid + 2, 1, 1, c.dark);
  // The eye: a night animal's is larger.
  put(headX + hw - 3, headY + 1, 1, p.night ? 2 : 1, '#15170f');
  if (p.night) put(headX + hw - 4, headY + 1, 1, 1, '#f4f0e0');
  const L = upright ? len - 2 : len;
  // The lineage's own pattern, on the trunk.
  if (look.pattern === 1) for (let x = x0 + 2; x < x0 + L - 1; x += 3) put(x, top + ((x * 7) % Math.max(1, hgt - 1)), 1, 1, c.dark);
  else if (look.pattern === 2) for (let x = x0 + 2; x < x0 + L - 1; x += 3) put(x, top, 1, Math.max(1, hgt - 1), c.dark);
  else if (look.pattern === 3) for (let x = x0 + 2; x < x0 + L - 2; x += 5) put(x, top, 2, hgt, c.pale);
  else if (look.pattern === 4) put(x0 + 1, top, L - 2, 1, c.dark);
  // Small features of the outline that are this lineage's own.
  if (look.ridge === 1) for (let x = x0 + 2; x < x0 + L - 1; x += 2) put(x, top - 1, 1, 1, c.limb);
  else if (look.ridge === 2) put(headX - 1, headY - 1, 2, 2, c.limb);
  else if (look.ridge === 3) put(x0 + Math.floor(L / 3), top - 2, Math.ceil(L / 3), 2, c.limb);
  if (look.tip === 1) put(x0 - 9, top + 2, 2, 1, c.dark); else if (look.tip === 2) put(x0 - 9, top + 1, 2, 3, c.pale);
  // Armour: scutes, then plates, then a shell over the back.
  if (p.armour === 1) for (let x = x0 + 1; x < x0 + L; x += 2) put(x, top - 1, 1, 1, c.dark);
  else if (p.armour === 2) put(x0 + 1, top - 1, L - 2, 1, c.dark);
  else if (p.armour >= 3) { put(x0, top - 1, L, 1, c.dark); put(x0 + 2, top - 2, L - 4, 1, c.dark); put(x0, top, 1, hgt, c.dark); put(x0 + L - 1, top, 1, hgt, c.dark); }
  // A sail on the back: spines with skin between, taller as it grows. Drawn before the coverings so they sit on it.
  if (p.sail) {
    const sx = x0 + Math.floor(L / 4), sw = Math.max(3, Math.ceil(L / 2)), sh = 1 + p.sail;
    put(sx, top - sh, sw, sh, c.pale); put(sx + 1, top - sh - 1, sw - 2, 1, c.pale);
    for (let x = sx; x < sx + sw; x += 2) put(x, top - sh - (x > sx && x < sx + sw - 1 ? 1 : 0), 1, sh + 1, c.limb);
  }
  // The covering. Fur: tufts, then a coat standing off the back and the tail.
  if (p.cover === 'fur') {
    if (p.coat === 1) for (let x = x0 + 1; x < x0 + L - 1; x += 4) put(x, top, 2, 1, c.pale);
    else { if (p.armour < 2 && !p.sail) for (let x = x0; x < x0 + L; x += 2) put(x, top - (p.armour ? 2 : 1), 1, 1, c.pale); for (let x = x0 - 5; x < x0; x += 2) put(x, top + (upright ? 0 : 0), 1, 1, c.pale); }
    if (p.coat >= 3) for (let x = x0 + 1; x < x0 + L - 1; x += 2) put(x, top + hgt, 1, 1, c.pale);
  // Feathers: a crest, then quills along the arm and the tail, then a fan at the tail's end.
  } else if (p.cover === 'feathers') {
    put(headX, headY - 1, 2, 1, c.pale); put(headX - 1, headY, 1, 1, c.pale);
    if (p.coat >= 2) { for (let x = x0 - 6; x < x0 - 1; x += 2) put(x, top + (upright ? 0 : 0), 1, 1, c.pale); for (let x = x0 + 2; x < x0 + L - 2; x += 3) put(x, top + hgt - 1, 2, 1, c.pale); }
    if (p.coat >= 3) { put(x0 - 10, top, 2, 1, c.pale); put(x0 - 10, top + 3, 2, 1, c.pale); put(headX, headY - 2, 1, 1, c.pale); }
  // Scales: rows of darker plates low on the flank, closer set as they thicken.
  } else if (p.cover === 'scales') {
    const gap = p.coat >= 3 ? 2 : p.coat === 2 ? 3 : 4;
    for (let x = x0 + 1; x < x0 + L - 1; x += gap) put(x, top + hgt - 1, 1, 1, c.dark);
    if (p.coat >= 2) for (let x = x0 - 5; x < x0; x += gap) put(x, top + 2, 1, 1, c.dark);
  }
  // Wings: folded along the back, a row of flight feathers at the step's length, pale tips at the end.
  if (p.wings) {
    put(x0 + 2, top - 1, L - 3, 1, c.dark);
    if (p.wings >= 2) put(x0 + 3, top - 2, L - 5, 1, c.dark);
    if (p.wings >= 3) { put(x0 + 5, top - 3, Math.max(1, L - 8), 1, c.dark); put(x0 - 1, top - 1, 3, 1, c.pale); }
  }
  // Flippers: paddles where the feet were.
  if (p.flippers) for (const fx of upright ? [x0 + 2, x0 + 6] : [x0, x1 - 4]) put(fx, 16, 4, 2, c.limb);
  // Weapons. Hooked claws: a pale point at each foot, longer as they grow.
  if (p.talons) for (const fx of upright ? [x0 + 6, x0 + 7] : [x0 + 2, x1 - 1]) put(fx, 17 - (p.talons >= 2 ? 1 : 0), 1, 1 + (p.talons >= 2 ? 1 : 0), '#f4f0e0');
  // Horns: a nub, then a horn, then a long one, off the top of the skull.
  if (p.horns) { put(headX + 1, headY - 1, 1, 1, '#e8dcc0'); if (p.horns >= 2) put(headX, headY - 2, 1, 1, '#e8dcc0'); if (p.horns >= 3) put(headX - 1, headY - 3, 1, 1, '#e8dcc0'); }
  // A clubbed tail: a knob of bone at its end, heavier by step.
  if (p.club) { const tx = upright ? x0 - 10 : x0 - 9, ty = upright ? top + 1 : top + 1; put(tx, ty, 2 + (p.club >= 2 ? 1 : 0), 2 + (p.club >= 3 ? 1 : 0), c.dark); }
  // Display: a frill behind the head, in a bright contrast. Camouflage: blotches that break up the outline.
  if (p.frill) { const fc = hsl(h0 + 180, 70, 58); put(headX - 1, headY - 1 - Math.min(2, p.frill - 1), 2, hh + Math.min(2, p.frill - 1), fc); }
  if (p.mottle) for (let x = x0 + 1; x < x0 + L - 1; x += 3) put(x, top + 1 + (x % 2), 2, 1, c.limb);
  // Fangs: two pale points below the jaw.
  if (p.fangs) { put(headX + hw - 1, headY + hh, 1, 2, '#f4f0e0'); }
  // Fat laid down: a deeper belly.
  if (p.fat) put(x0 + 2, top + hgt + 1, L - 4, 1, c.belly);
  return out;
}

const rect = ([x, y, w, h, col]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}"/>`;

/** The animal alone with a measure under it, for the Body screen. `px` is one pixel on screen; `metres` its length. */
export function animalSVG(p, px, label, metres) {
  const rects = animalRects(p);
  const x0 = Math.min(...rects.map((r) => r[0])), x1 = Math.max(...rects.map((r) => r[0] + r[2]));
  // A bar of a round length, drawn to the animal's own scale: a metre for a big animal, ten centimetres for a small one.
  const unit = metres >= 2 ? 1 : metres >= 0.8 ? 0.5 : 0.1, bar = Math.max(1, Math.round((x1 - x0) * unit / metres));
  const measure = metres ? `<rect x="${x0}" y="20" width="${bar}" height="1" fill="#e9e6d6"/><rect x="${x0}" y="19" width="1" height="2" fill="#e9e6d6"/><rect x="${x0 + bar - 1}" y="19" width="1" height="2" fill="#e9e6d6"/>` : '';
  const y0 = Math.min(0, ...rects.map((r) => r[1]));   // a long neck can raise the head above the frame
  return { svg: `<svg viewBox="0 ${y0} 32 ${22 - y0}" width="${32 * px}" height="${(22 - y0) * px}" shape-rendering="crispEdges" role="img" aria-label="${label}">${rects.map(rect).join('')}${measure}</svg>`, unit };
}

// Ground and sky for each era: [x, y, w, h, palette index] on a 64 by 30 grid.
const SCENES = {
  shore:    [[0, 0, 64, 30, 0], [0, 0, 64, 9, 1], [0, 18, 64, 12, 3], [0, 18, 64, 1, 2], [0, 22, 26, 8, 2], [0, 22, 26, 1, 1], [40, 12, 1, 6, 2], [42, 10, 1, 8, 2], [44, 13, 1, 5, 2], [56, 11, 1, 7, 2], [58, 13, 1, 5, 2]],
  coal:     [[0, 0, 64, 30, 0], [0, 0, 64, 9, 1], [4, 2, 2, 20, 3], [1, 1, 8, 3, 2], [20, 0, 3, 22, 3], [16, 0, 11, 3, 2], [46, 2, 2, 20, 3], [43, 1, 8, 3, 2], [58, 4, 2, 18, 3], [55, 3, 8, 3, 2], [0, 22, 64, 8, 3], [0, 22, 64, 1, 2]],
  drying:   [[0, 0, 64, 30, 0], [0, 0, 64, 10, 1], [0, 14, 20, 8, 1], [30, 16, 34, 6, 1], [0, 22, 64, 8, 3], [0, 22, 64, 1, 2], [8, 17, 1, 5, 2], [9, 19, 2, 1, 2], [50, 18, 1, 4, 2], [48, 20, 2, 1, 2]],
  shadow:   [[0, 0, 64, 30, 0], [0, 0, 64, 8, 1], [44, 3, 5, 5, 2], [0, 22, 64, 8, 3], [0, 22, 64, 1, 2], [6, 10, 1, 12, 0], [3, 13, 3, 1, 0], [7, 16, 3, 1, 0], [56, 13, 1, 9, 0], [57, 16, 3, 1, 0]],
  jurassic: [[0, 0, 64, 30, 0], [0, 0, 64, 8, 1], [6, 4, 2, 18, 3], [3, 3, 8, 4, 2], [30, 6, 2, 16, 3], [27, 5, 8, 4, 2], [52, 2, 3, 20, 3], [48, 1, 11, 5, 2], [0, 22, 64, 8, 3], [0, 22, 64, 1, 2], [14, 19, 4, 3, 2], [40, 20, 5, 2, 2]],
  flowers:  [[0, 0, 64, 30, 0], [0, 0, 64, 9, 1], [0, 22, 64, 8, 3], [0, 22, 64, 1, 2], [8, 14, 2, 8, 3], [5, 12, 8, 3, 2], [50, 15, 2, 7, 3], [47, 13, 8, 3, 2], [20, 20, 1, 2, 1], [24, 19, 1, 3, 1], [36, 20, 1, 2, 1], [42, 19, 1, 3, 1]],
  giants:   [[0, 0, 64, 30, 0], [0, 0, 64, 8, 1], [44, 2, 4, 4, 2], [0, 16, 30, 6, 1], [36, 14, 28, 8, 1], [0, 22, 64, 8, 3], [0, 22, 64, 1, 2], [10, 10, 2, 12, 3], [7, 8, 8, 3, 2]],
  triassic: [[0, 0, 64, 30, 0], [0, 0, 64, 8, 1], [48, 2, 6, 6, 2], [0, 15, 24, 7, 1], [34, 13, 30, 9, 1], [0, 22, 64, 8, 3], [0, 22, 64, 1, 2]],
};

// One animal placed in the scene: feet on the ground line (row 24, raised by `dy` for one further
// back), at `k` times the player's size, facing left when `flip`.
function placed(p, x, k, fade, flip = false, dy = 0, cls = '') {
  const w = 32 * k, at = flip ? `translate(${x + w} ${24 - dy - 18 * k}) scale(${-k} ${k})` : `translate(${x} ${24 - dy - 18 * k}) scale(${k})`;
  const g = `<g transform="${at}"${fade ? ` opacity="${fade}"` : ''}>${animalRects(p).map(rect).join('')}</g>`;
  return cls ? `<g class="${cls}">${g}</g>` : g;   // a class animates the wrapper, so it never overrides the placing
}

// How many of an animal are drawn for its numbers in heads: one for a few hundred, five for tens of thousands.
const drawnFor = (heads) => (heads >= 30000 ? 5 : heads >= 10000 ? 4 : heads >= 3000 ? 3 : heads >= 800 ? 2 : 1);

// Weather for a die-off: snow, shimmer, dust or ash, falling or drifting in a fixed pattern (no chance:
// the same turn draws the same picture). Light while it is only coming; full once it is here.
const WEATHER = { cold: 'snow', greatCold: 'snow', heat: 'heat', greatHot: 'heat', drought: 'dust', greatDry: 'dust', collapse: 'ash', greatWaste: 'ash', heavy: 'dust', deadSeas: 'heat', impactWinter: 'snow', impactFire: 'heat', deccan: 'ash' };
const SPECK = { snow: '#eef3f6', heat: '#f6d27a', dust: '#c9a46a', ash: '#9a958c' };
function weatherSVG(w) {
  if (!w) return '';
  const kind = WEATHER[w.kind] || 'ash', n = w.full ? 36 : 12, col = SPECK[kind];
  let dots = '';
  for (let i = 0; i < n; i++) {
    const x = (i * 37 + 11) % 64, y = ((i * 23 + 5) % 36) - 10;
    dots += kind === 'heat' ? `<rect x="${x}" y="${(i * 7) % 20}" width="3" height="1" fill="${col}" opacity=".35"/>` : `<rect x="${x}" y="${y}" width="1" height="1" fill="${col}"/>`;
  }
  // Two copies, one above the other, so the fall can loop without a seam.
  return `<g class="wx wx-${kind}${w.full ? ' full' : ''}" aria-hidden="true"><g class="f">${dots}<g transform="translate(0 -36)">${dots}</g></g></g>`;
}

/**
 * The animal on its era's ground, for the Turn screen. Fills its container's width.
 * `others` are the rival animals that share ground with it: [{ parts, ratio, heads, toYou }], ratio
 * being their length over the player's, so a rival twice as long is drawn twice as long; one acting on
 * the player is turned toward it. `opts`: the player's numbers in heads (more are drawn for more), the
 * weather ({ kind, full }), and `flash` when a trait has just grown.
 */
export function sceneSVG(eraId, palette, p, label, dim, others = [], opts = {}) {
  const bg = [[0, -10, 64, 10, 1], ...(SCENES[eraId] || SCENES.shore)].map(([x, y, w, h, i]) => rect([x, y, w, h, palette[i]])).join('');
  // Rivals stand behind and to the side, fainter, so they are not taken for the player's own animal.
  // The one on the right faces away unless it is acting on you; the one on the left faces you only then.
  const spots = [[44, 0.75, false], [-6, 0.6, true]];
  const rivals = others.slice(0, 2).map((o, i) => {
    const [x, fade, left] = spots[i], k = Math.max(0.45, Math.min(1.7, o.ratio)), toward = !!o.toYou;
    const flip = left ? !toward : toward, many = drawnFor(o.heads || 0) - 1;
    const back = Array.from({ length: Math.min(2, many) }, (_, j) => placed(o.parts, x + (left ? -5 : 5) * (j + 1), k * 0.7, fade * 0.6, flip, 3 + j)).join('');
    return back + placed(o.parts, x + (o.ratio > 1.4 ? -6 : 0), k, fade, flip, 0, toward ? 'rival acting' : 'rival');
  }).join('');
  // Its own kind: more of them drawn for more numbers, further back and smaller; with a herd, close beside it.
  const many = drawnFor(opts.heads || 0) - 1;
  const crowd = [[30, 0.6, 4], [4, 0.55, 5], [36, 0.5, 6], [10, 0.45, 7]].slice(0, many).map(([x, k, dy]) => placed(p, x, k, 0.7, false, dy)).join('');
  const kin = [[8, 0.8], [27, 0.7]].slice(0, Math.min(2, p.herd || 0)).map(([x, k]) => placed(p, x, k, 0.9)).join('')
    + (p.young ? placed(p, 33, 0.4, 1) + placed(p, 39, 0.35, 1) : '');   // young at heel, where they are tended
  const me = `<g class="me${opts.flash ? ' flash' : ''}">${placed(p, 16, 1)}</g>`;
  return `<svg class="scene${dim ? ' dim' : ''}" viewBox="0 -10 64 40" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges" role="img" aria-label="${label}">${bg}${crowd}${rivals}${kin}${me}${weatherSVG(opts.weather)}</svg>`;
}
