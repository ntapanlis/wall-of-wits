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

## Verified

- Sheet is reachable without login and both tabs parse correctly (checked
  via `curl` against the CSV export URLs)
- All 61 authors present and included, 79 quotes present, the one custom
  plaque name (Arthur Balfour) came through correctly
- `index.html`'s live-fetch/reconcile logic reviewed line by line (CSV
  parser, slug-matching against `authors-manifest.js`, shuffle/reconcile
  behavior on refresh)

## Not yet verified

- Actually loading the deployed page in a browser and confirming the wall
  renders, hover/click/panel behavior works, and the Sheet data shows up
  live. Both sandboxed browsers available in this working session hit
  environment-specific snags trying to preview it (one only renders local
  files as static non-executing snapshots; the other's process launcher
  denied a permission unrelated to this code) — worth a real look at
  https://ntapanlis.github.io/wall-of-wits/ once Pages finishes its first
  build.
