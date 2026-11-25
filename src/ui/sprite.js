// The animal, drawn from its six slots (src/engine/parts.js) on a 32 by 20
// pixel grid, and the ground it stands on. Pure functions from parts to SVG
// text: the same parts always draw the same animal. Drawn at whole multiples
// and never smoothed (shape-rendering: crispEdges).

const SKINS = {
  wet:       { body: '#5f9a7a', dark: '#2f5a4a', belly: '#c4d8b0', limb: '#4a8066' },
  scaling:   { body: '#6f9c62', dark: '#365a34', belly: '#c8d49c', limb: '#5a8752' },
  scaled:    { body: '#7fa04a', dark: '#3d5226', belly: '#c9cf8a', limb: '#6f8f3e' },
  insulated: { body: '#8a6a4a', dark: '#4a3626', belly: '#e0cfb0', limb: '#6e5238' },
  armoured:  { body: '#6a7a4a', dark: '#36402a', belly: '#c9c9a0', limb: '#566640' },
};
const SIZE = { slight: [10, 3], sturdy: [12, 4], heavy: [13, 5], massive: [14, 6] };
const SKULL = { narrow: [5, 3], broad: [6, 3], domed: [6, 4], high: [6, 4] };

/** [x, y, w, h, colour] rectangles for one animal facing right, feet on row 17. */
export function animalRects(p) {
  const c = SKINS[p.skin] || SKINS.wet, out = [];
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
  // skull and jaw
  put(headX, headY, hw, hh, c.body);
  if (p.skull === 'high') put(headX + 1, headY - 1, 3, 1, c.body);
  const mid = headY + 1, under = headY + hh;
  if (p.jaw === 'jawInsects') { put(headX + hw, mid, 2, 1, c.body); put(headX + 1, under, hw - 1, 1, c.belly); }
  else if (p.jaw === 'jawFish') { put(headX + hw, mid, 4, 2, c.body); put(headX + 1, under, hw + 2, 1, c.belly); }
  else if (p.jaw === 'jawPlants') { put(headX + hw, mid, 1, 2, c.body); put(headX, under, hw, 2, c.belly); }
  else if (p.jaw === 'jawPrey') { put(headX + hw, mid, 2, 2, c.body); put(headX + 1, under, hw + 1, 1, c.belly); put(headX + hw - 1, under, 1, 1, '#f4f0e0'); put(headX + hw + 1, under, 1, 1, '#f4f0e0'); }
  else { put(headX + hw, mid, 1, 1, c.body); put(headX + 1, under, hw - 1, 1, c.belly); }
  put(headX + hw - 3, headY + 1, 1, 1, '#15170f');
  // skin
  const L = upright ? len - 2 : len;
  if (p.skin === 'armoured') for (let x = x0 + 1; x < x0 + L; x += 2) put(x, top - 1, 1, 1, c.dark);
  else if (p.skin === 'insulated') for (let x = x0 + 1; x < x0 + L - 1; x += 4) put(x, top, 2, 1, '#a88a66');
  else if (p.skin === 'wet') for (let x = x0 + 2; x < x0 + L; x += 4) put(x, top + (x % 3 === 0 ? 0 : 1), 1, 1, c.dark);
  else for (let x = x0 + 2; x < x0 + L; x += (p.skin === 'scaled' ? 3 : 4)) put(x, top, p.skin === 'scaled' ? 2 : 1, 1, c.dark);
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
  return { svg: `<svg viewBox="0 0 32 22" width="${32 * px}" height="${22 * px}" shape-rendering="crispEdges" role="img" aria-label="${label}">${rects.map(rect).join('')}${measure}</svg>`, unit };
}

// Ground and sky for each era: [x, y, w, h, palette index] on a 64 by 30 grid.
const SCENES = {
  shore:    [[0, 0, 64, 30, 0], [0, 0, 64, 9, 1], [0, 18, 64, 12, 3], [0, 18, 64, 1, 2], [0, 22, 26, 8, 2], [0, 22, 26, 1, 1], [40, 12, 1, 6, 2], [42, 10, 1, 8, 2], [44, 13, 1, 5, 2], [56, 11, 1, 7, 2], [58, 13, 1, 5, 2]],
  coal:     [[0, 0, 64, 30, 0], [0, 0, 64, 9, 1], [4, 2, 2, 20, 3], [1, 1, 8, 3, 2], [20, 0, 3, 22, 3], [16, 0, 11, 3, 2], [46, 2, 2, 20, 3], [43, 1, 8, 3, 2], [58, 4, 2, 18, 3], [55, 3, 8, 3, 2], [0, 22, 64, 8, 3], [0, 22, 64, 1, 2]],
  drying:   [[0, 0, 64, 30, 0], [0, 0, 64, 10, 1], [0, 14, 20, 8, 1], [30, 16, 34, 6, 1], [0, 22, 64, 8, 3], [0, 22, 64, 1, 2], [8, 17, 1, 5, 2], [9, 19, 2, 1, 2], [50, 18, 1, 4, 2], [48, 20, 2, 1, 2]],
  shadow:   [[0, 0, 64, 30, 0], [0, 0, 64, 8, 1], [44, 3, 5, 5, 2], [0, 22, 64, 8, 3], [0, 22, 64, 1, 2], [6, 10, 1, 12, 0], [3, 13, 3, 1, 0], [7, 16, 3, 1, 0], [56, 13, 1, 9, 0], [57, 16, 3, 1, 0]],
  triassic: [[0, 0, 64, 30, 0], [0, 0, 64, 8, 1], [48, 2, 6, 6, 2], [0, 15, 24, 7, 1], [34, 13, 30, 9, 1], [0, 22, 64, 8, 3], [0, 22, 64, 1, 2]],
};

// One animal placed in the scene: feet on the ground line (row 24), at `k` times the player's size.
function placed(p, x, k, fade) {
  return `<g transform="translate(${x} ${24 - 18 * k}) scale(${k})"${fade ? ` opacity="${fade}"` : ''}>${animalRects(p).map(rect).join('')}</g>`;
}

/**
 * The animal on its era's ground, for the Turn screen. Fills its container's width.
 * `others` are the rival animals that share ground with it: [{ parts, ratio }], ratio being their
 * length over the player's, so a rival twice as long is drawn twice as long.
 */
export function sceneSVG(eraId, palette, p, label, dim, others = []) {
  const bg = (SCENES[eraId] || SCENES.shore).map(([x, y, w, h, i]) => rect([x, y, w, h, palette[i]])).join('');
  const spots = [[40, 0.75], [0, 0.6]];
  const rivals = others.slice(0, 2).map((o, i) => placed(o.parts, spots[i][0] + (o.ratio > 1.4 ? -4 : 0), Math.max(0.45, Math.min(1.7, o.ratio)), 0.8)).join('');
  // Its own kind beside it: one for a herd beginning, two for a herd.
  const kin = [[8, 0.8], [27, 0.7]].slice(0, Math.min(2, p.herd || 0)).map(([x, k]) => placed(p, x, k, 0.9)).join('');
  return `<svg class="scene${dim ? ' dim' : ''}" viewBox="0 0 64 30" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges" role="img" aria-label="${label}">${bg}${rivals}${kin}${placed(p, 16, 1)}</svg>`;
}
