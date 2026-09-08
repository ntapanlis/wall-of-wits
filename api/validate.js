// Admin-only diagnostic: which included Sheet authors have no deployed
// image pair yet, and which Quotes rows carry an unresolvable author.
// Not linked from the public site. Requires ?token=<ADMIN_TOKEN>.

const { readSheet, buildRoster } = require('../lib/sheets');

module.exports = async (req, res) => {
  const expected = process.env.ADMIN_TOKEN;
  const given = req.query && req.query.token;
  if (!expected || given !== expected) {
    res.status(404).json({ error: 'not found' });
    return;
  }
  try {
    const { authorRows, quoteRows } = await readSheet();
    const { missingAssets, unknownQuoteAuthors } = buildRoster({ authorRows, quoteRows });
    res.status(200).json({ missingAssets, unknownQuoteAuthors, checkedAt: new Date().toISOString() });
  } catch (err) {
    res.status(502).json({ error: String((err && err.message) || err) });
  }
};
