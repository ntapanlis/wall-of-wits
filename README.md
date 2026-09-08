# Wall of Wits

A brutalist wall of arched recesses, each holding a quotation author's face.
Hover or focus opens their eyes; click reveals their quotes. See
`STATUS.md` for exactly what's finished versus what's still pending, and
`AGENT-HANDOFF.md` for the original brief this was built from.

Open `index.html` (or the deployed URL) to view the wall. No visible header,
random author order per reload, 4/3/2 responsive columns, empty recesses
fill out the final row.

## Live content

The roster and quotations come from a Google Sheet, read server-side through
`api/authors.js` (a small serverless function, zero npm dependencies) and
polled by the page every 30 seconds. Sheet reads are cached for up to 60
seconds server-side, so an edit typically appears within ~90 seconds with no
redeploy. See `GOOGLE-SHEET-SETUP.md` for how the Sheet is structured and
`ADMIN-GUIDE.md` for everyday edits.

If the Sheet is briefly unreachable, the site keeps showing the last content
it successfully loaded rather than going blank.

## Repository layout

- `index.html` — the whole front end (markup, styles, script)
- `faces/` — all 122 portrait/cross PNGs, one flat folder, no per-person
  subfolders
- `recess-brutalist.png` — the reusable arch tile, repository root
- `authors-manifest.json` — static per-author asset metadata (image paths,
  centering offsets) — the thing that changes only when new artwork is added
- `authors.json` / `authors-data.js` — the original seed snapshot; also
  doubles as the emergency fallback if the Sheet has never once been
  reachable since a serverless instance started
- `lib/sheets.js`, `api/authors.js`, `api/validate.js` — the live-Sheet read
  layer
- `sheet-seed/` — CSV seed data for populating the Google Sheet
- `scripts/validate-assets.js` — local check that every manifest entry has
  both PNGs actually present in `faces/`

## Adding a new author

Uploading the two new PNGs to `faces/` and ticking `Included` in the Sheet
isn't quite enough on its own — the centering offsets for a new face need to
be computed once and added to `authors-manifest.json` (measuring the visible
head against the recess interior the same way the existing 61 were done).
Ask whoever maintains this repo to do that alongside the artwork commit;
after that, everyday quote edits need no further commits. See
`ADMIN-GUIDE.md` for the full workflow.
