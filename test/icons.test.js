// Every trait, way of living, stance and die-off has an icon (docs/FRAME-next.md section 3), and an
// icon is an 8 by 8 grid: a missing one would draw nothing beside its word, and no test would see it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { icon, traitIcon, dieoffIcon } from '../src/ui/icons.js';
import { TRAITS, WAYS, STANCES, DIEOFFS } from '../src/data/world.data.js';

test('everything a player chooses or meets has an icon', () => {
  for (const id of Object.keys(TRAITS)) assert.match(traitIcon(id), /<rect/, id);
  for (const w of WAYS) assert.match(icon(w), /<rect/, w);
  for (const st of STANCES) assert.match(icon(st === 'prey' ? 'hunt' : st), /<rect/, st);
  for (const k of Object.keys(DIEOFFS)) assert.match(dieoffIcon(k), /<rect/, k);
});
