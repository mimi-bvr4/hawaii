const { google } = require('googleapis');

const TABS = ['Trip', 'Flights', 'Lodging', 'Reservations', 'Schedule', 'Contacts & Links'];
let cache = null, cacheAt = 0;
const TTL = 60 * 1000;

function client() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not set');
  if (!process.env.SHEET_ID) throw new Error('SHEET_ID is not set');
  const creds = JSON.parse(raw);
  const auth = new google.auth.JWT(creds.client_email, null, creds.private_key,
    ['https://www.googleapis.com/auth/spreadsheets.readonly']);
  return google.sheets({ version: 'v4', auth });
}

// Sheet contract: row 1 = decorative title banner, row 2 = column headers, row 3+ = data.
function rowsToObjects(values) {
  if (!values || values.length < 2) return [];
  const headers = values[1].map(h => String(h || '').trim());
  return values.slice(2)
    .filter(r => r.some(c => String(c || '').trim() !== ''))
    .map(r => {
      const o = {};
      headers.forEach((h, i) => { if (h) o[h] = r[i] != null ? String(r[i]) : ''; });
      return o;
    });
}

async function getAllTabs() {
  if (cache && Date.now() - cacheAt < TTL) return cache;
  const sheets = client();
  const resp = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: process.env.SHEET_ID,
    ranges: TABS,
  });
  const out = {};
  (resp.data.valueRanges || []).forEach((vr, i) => {
    const key = TABS[i].toLowerCase().replace(/[^a-z]+/g, '_').replace(/^_|_$/g, '');
    out[key] = rowsToObjects(vr.values);
  });
  cache = out; cacheAt = Date.now();
  return out;
}

module.exports = { getAllTabs };
