# The "Wall of Wits" Google Sheet

The site reads its roster and quotations straight from a Google Sheet — no
server, no secrets. This is already set up; this file documents how, for
reference or if it ever needs rebuilding.

## Structure

**Authors** tab — `Name | Plaque name | Included`
- **Name** — the author's full name. This is what determines the expected
  image filenames (see below), so once artwork exists for someone, don't
  change their Name — use Plaque name instead for how it's displayed.
- **Plaque name** — optional. What the wall's plaque shows instead of Name
  (handy for long names). Leave blank to just show Name.
- **Included** — checkbox. Unticked or deleted rows drop that author from
  the live wall.

**Quotes** tab — `Author | Quotation`
- **Author** — must match an Authors-tab Name exactly.
- **Quotation** — the quote text.

## How it's linked to artwork

Each author's Name is turned into a filename slug (lowercase, spaces and
punctuation replaced with hyphens, e.g. "W. H. Auden" → `w-h-auden`) and
matched against `authors-manifest.js`, which maps that slug to
`faces/<slug>-open.png` / `faces/<slug>-closed.png` and their centering
offsets. If an included author has no matching entry, they're silently
left off the public wall (check the browser console for a warning naming
the exact expected filenames).

## Sharing

The Sheet is set to **Anyone with the link: Viewer** — viewable by anyone
who has the exact link, but editable only by the owner. It's never linked
from the site itself or indexed anywhere.

## Adding a brand-new author

1. New row on Authors: type their Name, tick Included.
2. Add the two PNGs (`faces/<slug>-open.png`, `faces/<slug>-closed.png`,
   1024×1024, transparent) and an entry in `authors-manifest.js` with their
   centering offsets — this is the one step that needs a small commit, not
   just a Sheet edit. See `README.md`.
3. Add their quotes on the Quotes tab.

## Refresh delay

The page re-reads the Sheet every 30 seconds. A change typically appears
within that window, with no redeploy.
