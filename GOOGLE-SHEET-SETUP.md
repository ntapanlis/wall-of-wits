# Setting up the "Wall of Wits" Google Sheet

This is the one-time setup for the live content source. `sheet-seed/authors-seed.csv`
and `sheet-seed/quotes-seed.csv` hold the 61 authors and 79 quotations, ready to
paste in.

## 1. Create the Sheet

1. Create a new Google Sheet named **Wall of Wits** in the owner's Google account.
2. Rename the first tab to `Authors`, add a second tab named `Quotes`.

## 2. Authors tab

Row 1 (header): `Author ID | Name | Plaque name | Included`

- **Column A — Author ID.** Hidden or protected helper column. Leave it blank
  for a brand-new author — the site's backend fills in a stable lowercase
  hyphenated slug automatically on its next refresh (within ~90 seconds of the
  Name being saved). Once set, never edit it by hand.
- **Column B — Name.** The author's full name, shown in the quotation panel.
- **Column C — Plaque name.** Optional. What the wall's plaque displays
  (defaults to Name if blank). Use this to shorten long names, e.g. `Arthur
  Balfour` instead of `Arthur Balfour, Earl of Balfour`.
- **Column D — Included.** Checkbox (Insert > Checkbox). Unticked or deleted
  rows drop that author from the live wall.

Paste `sheet-seed/authors-seed.csv` starting at A2 (Data > Paste special >
Values only, or File > Import > Insert new sheet then copy the range across).
All 61 rows import with `Included` already TRUE and their real IDs already
filled in (nothing for the backfill step to do on the seed data).

Add a helper column, say **F — Dropdown label** (can be hidden), with the
formula (fill down): `=B2&" ("&A2&")"` — this is the source list the Quotes
tab's dropdown reads from, so quotes stay linked to the same author even after
a rename (see below).

## 3. Quotes tab

Row 1 (header): `Author | Author ID (auto) | Quotation`

- **Column A — Author.** Data validation dropdown (Data > Data validation >
  Dropdown from a range) sourced from `Authors!F2:F` (the "Name (id)" helper
  column above). Pick the author for this quote.
- **Column B — Author ID (auto).** Hidden helper, formula (fill down):
  `=IFERROR(REGEXEXTRACT(A2,"\(([^)]+)\)$"),"")`. This is only a visual check —
  the backend extracts the same ID directly from column A itself, so a
  quote's link to its author survives a later rename even though the old row's
  dropdown label keeps showing the pre-rename name until someone reselects it.
- **Column C — Quotation.** The quote text. Clear it to delete a quote; edit
  it to replace the live text.

Paste `sheet-seed/quotes-seed.csv` starting at A2. It already contains the
"Name (id)" label in column A and the plain ID in column B for reference —
after pasting, re-apply the dropdown validation to column A going forward so
*new* rows use it (existing pasted rows are already correct).

## 4. Share it with the service account

Create a Google Cloud service account (APIs & Services > Credentials > Create
service account), enable the **Google Sheets API** for that project, and
download its JSON key. Then, in the Sheet, click **Share** and invite the
service account's email (looks like
`wall-of-wits@your-project.iam.gserviceaccount.com`) as an **Editor** — Editor,
not Viewer, because the backend needs to write the auto-generated Author ID
back into column A for brand-new authors.

The Sheet itself stays private — it is never shared publicly, only with that
one service account and whoever the owner invites by hand.

## 5. Wire up the secrets

From the downloaded JSON key and the Sheet's URL
(`https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit`), set these in the
hosting platform's environment variables (see `.env.example`):

- `GOOGLE_SERVICE_ACCOUNT_EMAIL` — the `client_email` field
- `GOOGLE_PRIVATE_KEY` — the `private_key` field, quotes and all
- `SHEET_ID` — the ID from the URL
- `ADMIN_TOKEN` — any long random string, for `/api/validate`

## 6. Verify

Once deployed with those secrets set:

1. Add a temporary quote to an existing author, wait ~90 seconds, refresh the
   site, confirm it appears.
2. Edit that quote's text, confirm the change lands.
3. Delete it, confirm it disappears.
4. Untick `Included` on a temporary test author row, confirm they vanish from
   the wall (and any open quote panel for them closes).
5. Rename an existing author (column B) and confirm their existing quotes are
   still attached (`/api/validate?token=...` should show no
   `unknownQuoteAuthors` for them).
6. Remove the temporary test data afterward.
