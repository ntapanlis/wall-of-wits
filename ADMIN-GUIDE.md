# Wall of Wits — everyday editing guide

The live wall reads from the **Wall of Wits** Google Sheet (link supplied
separately). Changes there reach the public site within about 30 seconds —
no commit, no rebuild, no redeploy.

## Quotes tab

- **Add a quote:** new row — Author (must match a name on the Authors tab
  exactly), Quotation.
- **Edit a quote:** change the text directly.
- **Delete a quote:** delete the row.

## Authors tab

- **Hide an author without deleting their data:** untick `Included`.
- **Remove an author entirely:** delete their row (and, if you like, their
  now-orphaned quote rows — they just won't match anyone).
- **Change how their name is displayed:** edit `Plaque name` (leave blank to
  just show their full Name).
- **Don't rename the `Name` column** for someone who already has artwork —
  that's what the site uses to find their face images. If you need to fix a
  typo in their name, ask whoever maintains the repo, since the images may
  need renaming too.
- **Add a brand-new author:**
  1. New row, type their Name exactly, tick `Included`.
  2. Ask whoever prepares the artwork to add
     `faces/<their-slug>-open.png` and `faces/<their-slug>-closed.png`
     (1024×1024, transparent) plus a small entry in `authors-manifest.js`
     — this is the one step that needs a commit, not just a Sheet edit.
  3. Add their quotes on the Quotes tab.
  4. If they don't show up after a minute, open the site and check the
     browser console (right-click → Inspect → Console) for a warning
     naming the exact filenames it's expecting.

## What updates instantly vs. what needs a developer

| Change | Needs |
|---|---|
| Add/edit/delete a quote | Just the Sheet |
| Include/exclude an author, change their plaque name | Just the Sheet |
| Add a brand-new author (new face) | Sheet + a small artwork commit |
| Change the wall's layout, columns, or styling | A developer |
