# Wall of Wits — everyday editing guide

The live wall reads from the **Wall of Wits** Google Sheet (link supplied
separately). Changes there reach the public site within about 90 seconds —
no commit, no rebuild, no redeploy.

## Quotes tab

- **Add a quote:** new row, pick the author from the dropdown in column A,
  type the quote in column C.
- **Edit a quote:** change the text in column C directly.
- **Delete a quote:** delete the row (or just clear column C).

## Authors tab

- **Hide an author without deleting their data:** untick `Included`.
- **Remove an author entirely:** delete their row. (Their quotes rows become
  orphaned — delete those too, or leave them; they simply won't match anyone.)
- **Rename an author:** edit column B (Name) and/or column C (Plaque name).
  Existing quotes stay attached to them.
- **Add a brand-new author:**
  1. New row, type their Name. Leave `Author ID` (column A) blank — it fills
     in automatically within ~90 seconds.
  2. Once it appears, ask whoever prepares the artwork to generate and add
     `faces/<that-id>-open.png` and `faces/<that-id>-closed.png` (1024×1024,
     transparent) to the repository's single `faces` folder, and commit the
     small asset-metadata update that goes with new artwork. This is the one
     step that isn't a plain Sheet edit — new artwork always needs a commit.
  3. Tick `Included`.
  4. Add their quotes on the Quotes tab as above.
  5. If the wall doesn't show them after a couple of minutes, check
     `/api/validate?token=<ADMIN_TOKEN>` (ask the developer for the token) —
     it lists any included author still missing an image pair, with the
     exact filenames it's expecting.

## What updates instantly vs. what needs a developer

| Change | Needs |
|---|---|
| Add/edit/delete a quote | Just the Sheet |
| Include/exclude/rename an author | Just the Sheet |
| Add a brand-new author (new face) | Sheet + a small artwork commit |
| Change the wall's layout, columns, or styling | A developer |
