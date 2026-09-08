#!/usr/bin/env node
// Local sanity check: does every authors-manifest.json entry have both
// PNGs actually present in faces/? Run after pulling new artwork, before
// relying on the Sheet's Included checkbox for a brand-new author.

const fs = require('fs');
const path = require('path');

const manifest = require('../authors-manifest.json');
const facesDir = path.join(__dirname, '..', 'faces');

let missing = 0;
for (const [id, asset] of Object.entries(manifest)) {
  for (const key of ['open_image', 'closed_image']) {
    const rel = asset[key];
    const abs = path.join(__dirname, '..', rel);
    if (!fs.existsSync(abs)) {
      missing++;
      console.log(`MISSING  ${id}: expected ${rel}`);
    }
  }
}

if (missing === 0) {
  console.log(`OK — all ${Object.keys(manifest).length} manifest entries have both images present.`);
  process.exit(0);
} else {
  console.log(`${missing} missing file(s).`);
  process.exit(1);
}
