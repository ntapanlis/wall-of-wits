# Status

Live and finished, per the owner's actual preference (a plain static
GitHub Pages site, no server, matching how `imprimatur` is set up — not the
Vercel/service-account version originally sketched out).

- **Repo:** https://github.com/ntapanlis/wall-of-wits (public)
- **Live site:** https://ntapanlis.github.io/wall-of-wits/
- **Sheet:** the owner's own "Wall of Wits" Google Sheet, shared as
  "Anyone with the link: Viewer", read directly by the page every 30s

## What changed from the original plan

The first pass built a Vercel serverless function that read a *private*
Sheet using a service-account secret. The owner didn't want a hosting
account or CLI logins in the mix, so that was replaced with: the Sheet set
to link-viewable, and the page fetching its published CSV export directly
in the browser — zero secrets, zero server, same hosting model as
`imprimatur`. See `GOOGLE-SHEET-SETUP.md` for how it's wired and
`ADMIN-GUIDE.md` for everyday edits.

A second pass (per `claude-panel-update 2/CLAUDE-INSTRUCTIONS.md`) replaced
the floating cream quote card with an in-flow "opening wall panel": a
periwinkle-cement seam that splits the wall open beneath the selected
face's row, with reused ornamental corner/medallion SVGs, carved selection
rays (`arch-radiance.svg`) around the chosen arch, italic unmarked
quotations, and a single shared plaque font-size that shrinks uniformly
until every name fits.

## Verified live, on https://ntapanlis.github.io/wall-of-wits/

- All 61 authors load from the Sheet; 4/3/2 responsive columns render
  correctly; empty recesses fill the final row
- Click opens the panel in-flow directly after the clicked face's row
  (confirmed for a middle row, and for the last author in the shuffled
  order, i.e. the final row)
- Same-row switch, different-row switch, and three rapid successive
  clicks all resolve to exactly one panel with the correct final content —
  no duplicates, no stale text
- Escape and the Close button both close it
- Quotes render italic, justified with a left-aligned last line, in
  `#303442`, with no added quotation marks and no repeated author-name
  heading; the panel's only name reference is a non-visible
  `aria-label="Quotations by <name>"` on the region
- Periwinkle panel colors/borders match spec exactly (`#bfc4d5` background,
  `#9199b0`/`#dce0eb` edges), confirmed via computed styles
- The uniform plaque-font-shrink algorithm works: at a narrow width it
  shrank the shared size below its normal cap specifically to fit the
  longest names, rather than truncating or shrinking one name alone
- `aria-expanded`/`aria-controls`/accessible labels all correct;
  `request()`'s async queue reliably handles rapid clicks (most recent
  selection wins)
- The resize-repositioning *logic* itself (recomputing the selected
  face's row/height after a column-count change, without reshuffling or
  losing selection) was verified directly and is correct. The automatic
  trigger for it — a `ResizeObserver` on the wall — could not be exercised
  in this session's browser tooling: that tab's rendering pipeline wasn't
  actively compositing (confirmed independently — even a plain test
  element's `ResizeObserver` and a running CSS transition were both stuck,
  unrelated to this code), which is a property of this working session's
  tooling, not of a normal browser tab. `ResizeObserver` is standard,
  universally-supported behavior; worth a real resize check in an ordinary
  browser regardless, as final confirmation.

## Not yet verified

- A literal pixel screenshot of the open panel and the carved rays — the
  same non-compositing tab issue blocked `computer.screenshot` throughout
  this session. Everything it would show was instead confirmed via
  computed-style and DOM assertions (see above). Worth a quick visual
  glance at the live URL.
