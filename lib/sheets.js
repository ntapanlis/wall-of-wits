// Shared helpers for reading (and lightly writing) the "Wall of Wits" Google Sheet.
// Zero npm dependencies: JWT signing uses Node's built-in crypto.

const manifest = require('../authors-manifest.json');

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function slugify(name) {
  return String(name)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function getAccessToken(scope) {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  if (!email || !key) throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY');

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(JSON.stringify({
    iss: email,
    scope,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }));
  const signingInput = `${header}.${claim}`;
  const crypto = require('crypto');
  const signature = crypto.createSign('RSA-SHA256').update(signingInput).sign(key, 'base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const assertion = `${signingInput}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.access_token;
}

// Reads Authors!A2:D and Quotes!A2:C. Writes back any blank Author ID cells
// (col A) once, so a brand-new author gets a stable slug without the owner
// ever touching it. Requires the read-write scope.
async function readSheet() {
  const sheetId = process.env.SHEET_ID;
  if (!sheetId) throw new Error('Missing SHEET_ID');
  const token = await getAccessToken('https://www.googleapis.com/auth/spreadsheets');

  const url = `${SHEETS_API}/${sheetId}/values:batchGet?ranges=${encodeURIComponent('Authors!A2:D')}&ranges=${encodeURIComponent('Quotes!A2:C')}`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Sheets read failed: ${res.status} ${await res.text()}`);
  const { valueRanges } = await res.json();
  const authorRows = (valueRanges[0] && valueRanges[0].values) || [];
  const quoteRows = (valueRanges[1] && valueRanges[1].values) || [];

  await backfillMissingIds(sheetId, token, authorRows);

  return { authorRows, quoteRows };
}

// Any Authors row with a Name (col B) but a blank ID (col A) gets a slug
// written back into col A so it freezes and survives later renames.
async function backfillMissingIds(sheetId, token, authorRows) {
  const existingIds = new Set(authorRows.map((r) => (r[0] || '').trim()).filter(Boolean));
  const updates = [];
  authorRows.forEach((row, i) => {
    const id = (row[0] || '').trim();
    const name = (row[1] || '').trim();
    if (!id && name) {
      let slug = slugify(name) || `author-${i + 2}`;
      let candidate = slug;
      let n = 2;
      while (existingIds.has(candidate)) candidate = `${slug}-${n++}`;
      existingIds.add(candidate);
      row[0] = candidate;
      updates.push({ range: `Authors!A${i + 2}`, values: [[candidate]] });
    }
  });
  if (!updates.length) return;
  await fetch(`${SHEETS_API}/${sheetId}/values:batchUpdate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ valueInputOption: 'RAW', data: updates }),
  });
}

// Merges Sheet content with the static asset manifest into the shape the
// front end wants. Also reports authors that are included but have no
// deployed image pair, for the admin/validate endpoint.
function buildRoster({ authorRows, quoteRows }) {
  const quotesByAuthorId = {};
  const unknownQuoteAuthors = [];
  for (const row of quoteRows) {
    const label = (row[0] || '').trim();
    const text = (row[2] != null ? row[2] : row[1] || '').trim();
    if (!text) continue;
    const match = label.match(/\(([^)]+)\)\s*$/);
    const id = match ? match[1] : '';
    if (!id) { unknownQuoteAuthors.push(label); continue; }
    (quotesByAuthorId[id] = quotesByAuthorId[id] || []).push(text);
  }

  const authors = [];
  const missingAssets = [];
  for (const row of authorRows) {
    const id = (row[0] || '').trim();
    const name = (row[1] || '').trim();
    const plaque = (row[2] || '').trim();
    const included = /^true$/i.test((row[3] || '').trim());
    if (!id || !name) continue;
    const asset = manifest[id];
    if (!asset) {
      if (included) {
        missingAssets.push({
          id, name,
          expected: [`faces/${id}-open.png`, `faces/${id}-closed.png`],
        });
      }
      continue; // never render a broken image on the public wall
    }
    if (!included) continue;
    authors.push({
      id,
      name,
      display_name: plaque || name,
      closed_image: asset.closed_image,
      open_image: asset.open_image,
      offset_x: asset.offset_x,
      offset_y: asset.offset_y,
      kind: asset.kind,
      quotes: quotesByAuthorId[id] || [],
    });
  }

  return { authors, missingAssets, unknownQuoteAuthors };
}

module.exports = { readSheet, buildRoster, slugify };
