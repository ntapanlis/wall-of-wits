# Wall of Wits — website agent brief

Create a new GitHub repository named `wall-of-wits` for this project. Use a private repository unless the owner requests public visibility. If that name already belongs to another project, do not overwrite it. The repository has NOT been created by this asset-preparation task.

Use the supplied working static prototype as the starting point. The owner will upload the assets to GitHub after you create the folders. Keep ALL portrait and cross PNGs in ONE repository-root folder called `faces`. Create `faces/.gitkeep` if the folder is initially empty. Do not create a folder for each person. Keep `recess-brutalist.png` at the repository root. Preserve the filenames and relative URLs in `authors.json`.

## Appearance and behaviour

- Project/browser title: Wall of Wits. No visible page title, header, navigation, introduction, instructions or footer. On initial load the wall and its plaques are the only visible content.
- Raw-concrete brutalist arched recesses use the supplied reusable tile. Plaques sit on the flat wall beneath each arch, with live engraved-style ALL CAPS text. Balance long names across two centred lines. Keep the full author name in the quotation panel; use display_name for the plaque when provided.
- Four faces per row on wide screens, three on medium screens, two on mobile. Starter breakpoints: four above 1100px, three from 701–1100px, two at 700px and below. The wall spans the available page width.
- Shuffle the AUTHORS once on every page load with Fisher–Yates. Do not shuffle quotations, create duplicate authors, or reshuffle when resizing or opening a quote panel.
- Fill the final row with empty recesses. Recalculate the empty count when the responsive column count changes. Adding enough authors should automatically form another row.
- Faces rest with eyes closed. Hover, keyboard focus or selection switches to the matching open-eye image. Click/tap reveals all quotations for that author. Keep the selected face awake while its panel is open. Close and Escape dismiss the panel; retain accessible keyboard controls.
- The Bible entry uses `faces/bible-closed.png` (plain cross) and `faces/bible-open.png` (shining cross), with the same state-switch behaviour.
- Quote content is hidden initially. The prototype uses a compact, scrollable panel over the bottom of the wall so selecting a face anywhere on a long page reveals its quotes immediately.

## Files and placement — preserve these details

All 122 PNGs in `faces/` are 1024×1024 with genuine transparency: 60 people × two states plus two cross states. Examples: `william-shakespeare-open.png`, `william-shakespeare-closed.png`. The PNGs contain no labels or recesses; layer them over the tile.

The prototype positions the square image holder at left 20.1%, top 14.2%, width 60%, height 60% of each square tile. This centres it on the recess interior at (50.1%, 44.2%) of the tile, rather than the centre of the entire tile including its plaque.

IMPORTANT: Apply each author's `offset_x` and `offset_y` to BOTH image states using CSS `transform: translate(offset_x%, offset_y%)` on the image. Those percentages are relative to the image's own dimensions. They correct unequal transparent padding and use the visible head outline as the anchor. Do not discard them or independently centre the two states. Goethe in particular needs the supplied horizontal correction. For the cross, both states use the solid plain cross as their shared anchor.

`centering-check.json` records the measured visible bounds and offsets. Faint isolated alpha specks are excluded from the placement measurement. The offsets work at every responsive tile size.

## Google Sheet — required live content source

Create a new Google Sheet named **Wall of Wits** in the owner's connected Google account and provide its editable link. This is a required part of the implementation, not an optional future feature. Populate it from the supplied catalog: 61 author entries and 79 quotations. If Google authorization is unavailable, complete the repository and integration first, then tell the owner exactly which connection is needed to create the Sheet. Do not claim that a Sheet exists until it has actually been created.

Use two simple tabs:

- **Authors**: Name, Plaque name (optional), Included (checkbox). Keep a stable Author ID and optional asset mapping in hidden/protected helper columns so the owner does not need to manage technical values. Populate all current authors as included. Use lowercase bible as the stored Bible author name and display BIBLE on its plaque.
- **Quotes**: Author (dropdown from Authors), Quotation. Use stable author IDs behind the dropdown so renaming an author does not disconnect their existing quotations. Any helper IDs should be generated automatically and stored once, not recalculated from a mutable name.

The owner must be able to add an author, rename them, include/exclude them, and add, edit or delete individual quotations directly in this Sheet. Deleting an author row or unticking Included removes that author from the live wall. Deleting or clearing a quotation row removes that quotation; editing it replaces the live text. An included author with no quotations may show a simple empty quote-panel state. Do not recreate deleted rows from the seed data.

The website must read BOTH its author roster and quotations from this Sheet. `authors.json`, `authors-data.js` and `quotations.xlsx` are initial seed/example data, not the continuing production source of truth. Keep asset filenames and centring metadata in a repository manifest keyed by stable author ID; merge this asset metadata with the Sheet content. Do not fall back to the original hard-coded author list when the Sheet intentionally returns zero included authors.

Implement a server-side or serverless read integration appropriate to the site's hosting setup, with Google credentials in server secrets. The editable Sheet can remain private. Refresh the content with a short cache of at most 60 seconds, and refresh an already-open page's content on a comparable interval. Document the actual refresh delay. Preserve the current shuffled order of existing authors during background refreshes and resize; shuffle anew only on a full page load. Close or update an open quotation panel if its author or quotation has been removed. On a temporary read failure, retain the last successful content rather than replacing it with an empty wall; distinguish a failed request from a successful empty result.

For a new author, automatically propose a stable lowercase hyphenated asset ID once and expect `faces/<id>-open.png` and `faces/<id>-closed.png`. The owner uploads both PNGs to the single faces folder in GitHub, then adds the author/quotes in Sheets. Existing-author quote edits require no new artwork, commit or manual rebuild. Once a new asset pair has been deployed and its author is included in the Sheet, the author should appear automatically. Validate missing image pairs and report their exact expected filenames in the administrative workflow; keep broken image elements off the public wall. Document the asset-upload/deployment delay separately from the Sheet refresh delay.

Preserve each existing author's `offset_x` and `offset_y`. For new pairs, use aligned 1024px transparent canvases and calculate shared placement offsets when padding is uneven. Adding/removing authors must recalculate the final row's empty recesses.

Verify the integration by adding a temporary quotation, changing its text, deleting it, and including/excluding a temporary author; confirm each change reaches the site, then remove the temporary data. Test a name change without losing the author's quotes. Give the owner the Sheet URL and a short guide to these everyday edits.

The supplied quote wording and attributions have not been fact-checked in this artwork task. Preserve the table unless the owner asks for an editorial pass.

## Repository and delivery checklist

1. Create the new `wall-of-wits` GitHub repository and tell the owner its URL.
2. Commit the starter code/data and create the single `faces` upload folder. Explain that the owner should upload the contents of the package's `faces/` folder there and the recess tile to the repository root. If you can already access the supplied package, commit those files directly instead of making the owner upload them again.
3. Create and seed the Google Sheet, connect live reads, verify add/edit/delete and author inclusion changes, and give the owner its editable URL.
4. Run the site and verify wide, medium and mobile layouts, no initial header, random author order across reloads, correct empty recess counts, long plaques, eye/cross state swaps and quotation panels.
5. Check Goethe and several asymmetric hairstyles visually at each size. Preserve paired image alignment.
6. Integrate with the owner's website/deployment setup, and provide the normal preview/deployment link through that workflow.

The supplied starter is dependency-free HTML/CSS/JavaScript and works by opening index.html. A framework is optional, not required. Asset creation used the built-in image generator plus authorized background removal; the prompt record is included for future consistency.

## Latest portrait correction

Use the included corrected `faces/j-edgar-hoover-closed.png`. The edit is restricted to two eyelid regions; alpha, eyebrows and every pixel outside those regions are identical to the open image. Do not replace it with the earlier Wall of Faces export or regenerate it from older raw portraits.
