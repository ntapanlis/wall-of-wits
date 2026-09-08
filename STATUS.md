# Status against AGENT-HANDOFF.md's delivery checklist

## Done

1. **Repository content.** `git init` + one commit (145 files: the starter
   wall, all 122 face PNGs, the recess tile, and the new live-content layer)
   in this folder. Not yet pushed to GitHub — see Blocker A.
2. **Live Sheet integration, built but not yet connected.**
   `authors-manifest.json` (static asset metadata, split out from the seed
   data), `lib/sheets.js` + `api/authors.js` + `api/validate.js` (serverless
   read layer: JWT-authenticates as a service account, reads the `Authors`
   and `Quotes` tabs, merges with the manifest, caches for 60s, falls back to
   last-known-good content — or the bundled seed — on any failure), and the
   front end in `index.html` now polls `/api/authors` every 30s and
   reconciles without reshuffling or clearing the wall. See
   `GOOGLE-SHEET-SETUP.md` for the exact tab layout and `sheet-seed/*.csv`
   for the ready-to-paste 61 authors / 79 quotes.
3. **Docs.** `README.md`, `ADMIN-GUIDE.md` (owner's everyday-editing guide),
   `GOOGLE-SHEET-SETUP.md` (one-time setup), `.env.example` (required
   secrets), `scripts/validate-assets.js` (local asset-pair check).
4. **Code review.** Read through carefully for correctness (brace/paren
   balance, data flow, the ID-behind-a-rename design). Vercel has no local
   Node runtime here to execute against, and the two sandboxed browser
   previews available in this session couldn't load it as a served page (one
   renders local files as static, non-executing snapshots; the other's
   process launcher hit a sandbox permission error unrelated to this code) —
   so this hasn't been exercised end-to-end in a live browser. Worth a quick
   look once it's actually deployed.

## Blocked — needs you

**Blocker A — GitHub.** `gh` isn't authenticated in this environment (I
downloaded the CLI directly since Homebrew's build path was broken by an
outdated Xcode Command Line Tools install, but auth itself needs your
interactive login). Please run, in your own terminal:

```bash
gh auth login
```

Then tell me, and I'll create the private `wall-of-wits` repo and push this
commit — or, if you'd rather do it yourself: create a private repo named
`wall-of-wits` and I'll give you the exact push commands.

**Blocker B — the Google Sheet.** I have no standing Google access in this
environment, and the "Claude in Chrome" extension (which could drive your
own logged-in browser) isn't connected in this session either. Two ways
forward:

- Install/sign in to the Claude in Chrome extension
  (https://chromewebstore.google.com/detail/fcoeoabgfenejglbffodgkkbkcdhcgfn)
  and I can create and populate the Sheet directly in your account.
- Or follow `GOOGLE-SHEET-SETUP.md` yourself (about 10 minutes): create the
  Sheet, paste in the two seed CSVs, create a Google Cloud service account,
  share the Sheet with it, and hand me (or plug directly into your hosting
  platform) the three secrets it documents.

**Blocker C — deployment.** No hosting/serverless platform is connected
here. I've written `api/authors.js` as a plain Vercel-style serverless
function (works on Vercel with zero config once the repo is pushed) — if
you'd rather use Netlify, Cloudflare Pages, or something else, say so, since
the function's request/response shape may need a small adapter.

## Not yet done (depends on the above)

- Push to GitHub and share its URL.
- Create/seed the Sheet and share its editable link.
- Connect a deploy and share the live URL.
- The verification pass (add/edit/delete a quote, include/exclude an author,
  rename without losing quotes) against the *live* deployed site — the
  checklist in `GOOGLE-SHEET-SETUP.md` is ready to run once B and C are in
  place.
