// Public endpoint the wall polls. Merges the live Google Sheet with the
// repo's static asset manifest. Serves last-known-good content on any
// read failure instead of ever handing back an empty wall by accident.

const { readSheet, buildRoster } = require('../lib/sheets');
// authors.json is the last-deployed snapshot: real content, checked into
// the repo, used only as an emergency fallback if the Sheet has never
// once been reachable since this instance started.
const seed = require('../authors.json');

const CACHE_MS = 60 * 1000;
let cache = { data: null, generatedAt: 0, expiresAt: 0 };

function seedRoster() {
  return {
    authors: seed.map((a) => ({
      id: a.id,
      name: a.name,
      display_name: a.display_name || a.name,
      closed_image: a.closed_image,
      open_image: a.open_image,
      offset_x: a.offset_x,
      offset_y: a.offset_y,
      kind: a.kind,
      quotes: a.quotes,
    })),
    missingAssets: [],
    unknownQuoteAuthors: [],
  };
}

module.exports = async (req, res) => {
  const now = Date.now();
  if (cache.data && now < cache.expiresAt) {
    res.setHeader('Cache-Control', 'public, max-age=30, s-maxage=60, stale-while-revalidate=300');
    res.status(200).json({ authors: cache.data.authors, generatedAt: cache.generatedAt, stale: false });
    return;
  }

  try {
    const { authorRows, quoteRows } = await readSheet();
    const roster = buildRoster({ authorRows, quoteRows });
    cache = { data: roster, generatedAt: now, expiresAt: now + CACHE_MS };
    res.setHeader('Cache-Control', 'public, max-age=30, s-maxage=60, stale-while-revalidate=300');
    res.status(200).json({ authors: roster.authors, generatedAt: now, stale: false });
  } catch (err) {
    console.error('Wall of Wits: Sheet read failed', err);
    if (cache.data) {
      res.setHeader('Cache-Control', 'no-store');
      res.status(200).json({ authors: cache.data.authors, generatedAt: cache.generatedAt, stale: true });
      return;
    }
    // No warm cache yet (cold start) — fall back to the bundled seed
    // snapshot rather than an empty wall, and say so plainly.
    const fallback = seedRoster();
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ authors: fallback.authors, generatedAt: 0, stale: true });
  }
};
