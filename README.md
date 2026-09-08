# Wall of Wits

A brutalist wall of arched recesses, each holding a quotation author's face.
Hover or focus opens their eyes; click splits the wall open beneath that
row, revealing a recessed periwinkle-cement panel with their quotes —
carved rays mark the selected face; clicking again, another face, Close,
or Escape closes it.

Live at **https://ntapanlis.github.io/wall-of-wits/**. No visible header,
random author order per reload, 4/3/2 responsive columns, empty recesses
fill out the final row.

## Live content

The roster and quotations come from a Google Sheet the page reads directly
in the browser — no server, no build step, no secrets, just plain
GitHub Pages, the same as the rest of this site. It's polled every 30
seconds, so an edit there typically shows up within that window. See
`GOOGLE-SHEET-SETUP.md` for how the Sheet is structured and `ADMIN-GUIDE.md`
for everyday edits.

If the Sheet is briefly unreachable, the site keeps showing the last content
it successfully loaded rather than going blank.

## Repository layout

- `index.html` — the whole front end (markup, styles, script)
- `faces/` — all 122 portrait/cross PNGs, one flat folder, no per-person
  subfolders
- `recess-brutalist.png` — the reusable arch tile, repository root
- `arch-radiance.svg` — the carved-ray overlay shown around the selected arch
- `quiet-cement.svg` — the periwinkle cement texture tiled behind the open panel
- `authors-manifest.js` / `authors-manifest.json` — static per-author asset
  metadata (image paths, centering offsets); the `.js` copy is what the page
  actually loads, the `.json` copy is what `scripts/validate-assets.js` reads
- `authors.json` / `authors-data.js` — the original seed snapshot, used for
  the very first paint before the Sheet has loaded
- `sheet-seed/` — CSV data used to originally populate the Google Sheet
- `scripts/validate-assets.js` — local check that every manifest entry has
  both PNGs actually present in `faces/` (run with `node scripts/validate-assets.js`)

## Adding a new author

Uploading the two new PNGs to `faces/` and ticking `Included` in the Sheet
isn't quite enough on its own — the centering offsets for a new face need to
be computed once and added to `authors-manifest.js` (and, for consistency,
`authors-manifest.json`) the same way the existing 61 were done. Ask
whoever maintains this repo to do that alongside the artwork commit; after
that, everyday quote edits need no further commits. See `ADMIN-GUIDE.md` for
the full workflow.
