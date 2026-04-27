// /api/buyers — CRUD for buyer records (Buyers tab in the Google Sheet).
//
// GET    /api/buyers              → list all buyers
// GET    /api/buyers?id=B-abc123  → fetch one buyer
// GET    /api/buyers?find=...     → lookup by email or preferred_name + last_name
// POST   /api/buyers              → create new buyer (auto-generates buyer_id)
// PATCH  /api/buyers              → update buyer (requires buyer_id in body)
// DELETE /api/buyers              → delete row (requires buyer_id in body)
//
// The Buyers tab is auto-created on first call, same pattern as offers.js.
// buyer_id is auto-generated as `B-{6 hex chars}` so buyers can be referenced
// stably even if the row index shifts.

const { getSheets } = require('./_sheets');

const BUYERS_HEADERS = [
  'buyer_id',
  'preferred_name',
  'last_name',
  'legal_name',
  'email',
  'dob',
  'occupation',
  'street_num',
  'street',
  'city',
  'state',
  'zipcode',
  'id_document_type',
  'id_number',
  'id_issuing_jurisdiction',
  'id_expiry_date',
  'agreement_number',
  'status',            // Showings Only | BRA Signed | Offer Written | Pending | Firm | Closed
  'bra_signed_date',
  'crg_signed_date',
  'linked_tour_ids',
  // Buyer-engagement fields — one BRA per buyer per 6-month engagement,
  // reused across every offer in that period. Set on the buyer row the
  // first time an offer is written with BRA checked; subsequent offers
  // pre-fill from these values.
  'engagement_date',                  // labeled "Signing date" in the UI
  'agreement_start_date',
  'agreement_expiry_date',
  'search_criteria_property_type',
  'search_criteria_market_area',
  'created_at',
  'updated_at',
];

// A:AB — 28 columns (AB is the 28th letter)
const BUYERS_RANGE_FULL = 'Buyers!A:AB';
const BUYERS_RANGE_HEADERS = 'Buyers!A1:AB1';

async function ensureBuyersTab(sheets, SPREADSHEET_ID) {
  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: BUYERS_RANGE_HEADERS,
    });
    const existing = (result.data.values && result.data.values[0]) || [];
    if (existing.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Buyers!A1',
        valueInputOption: 'RAW',
        requestBody: { values: [BUYERS_HEADERS] },
      });
    } else {
      // Append any new columns the code knows about that aren't in the
      // sheet yet — keeps the header row forward-compatible without
      // forcing a manual edit when we add a column to the schema.
      const missing = BUYERS_HEADERS.filter(h => !existing.includes(h));
      if (missing.length > 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: 'Buyers!A1',
          valueInputOption: 'RAW',
          requestBody: { values: [[...existing, ...missing]] },
        });
      }
    }
  } catch (err) {
    if (err.message && err.message.includes('Unable to parse range')) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{ addSheet: { properties: { title: 'Buyers' } } }],
        },
      });
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Buyers!A1',
        valueInputOption: 'RAW',
        requestBody: { values: [BUYERS_HEADERS] },
      });
    } else {
      throw err;
    }
  }
}

function newBuyerId() {
  // 6 hex chars = ~16M values. Plenty for a solo agent's lifetime.
  const r = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
  return `B-${r}`;
}

function rowToObject(row, headers, rowIndex) {
  const obj = { _rowIndex: rowIndex };
  headers.forEach((h, i) => { obj[h] = row[i] || ''; });
  return obj;
}

async function listBuyers(sheets, SPREADSHEET_ID) {
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: BUYERS_RANGE_FULL,
  });
  const rows = result.data.values || [];
  if (rows.length < 2) return { headers: BUYERS_HEADERS, buyers: [] };
  const headers = rows[0];
  const buyers = rows.slice(1)
    .map((row, idx) => rowToObject(row, headers, idx + 2))
    .filter(b => b.buyer_id); // skip blank rows
  return { headers, buyers };
}

module.exports = async function handler(req, res) {
  const { sheets, SPREADSHEET_ID } = getSheets();

  try {
    await ensureBuyersTab(sheets, SPREADSHEET_ID);

    if (req.method === 'GET') {
      const { id, find } = req.query || {};
      const { buyers } = await listBuyers(sheets, SPREADSHEET_ID);

      if (id) {
        const b = buyers.find(x => x.buyer_id === id);
        return res.status(200).json({ buyer: b || null });
      }

      if (find) {
        // Fuzzy lookup by email OR preferred_name (case-insensitive contains)
        const q = String(find).trim().toLowerCase();
        const matches = buyers.filter(b => {
          return (b.email && b.email.toLowerCase() === q) ||
                 (b.preferred_name && b.preferred_name.toLowerCase().includes(q)) ||
                 (b.last_name && b.last_name.toLowerCase().includes(q)) ||
                 (b.legal_name && b.legal_name.toLowerCase().includes(q));
        });
        return res.status(200).json({ buyers: matches });
      }

      return res.status(200).json({ buyers });
    }

    if (req.method === 'POST') {
      const data = req.body || {};
      const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const buyer_id = data.buyer_id || newBuyerId();

      const row = BUYERS_HEADERS.map(h => {
        if (h === 'buyer_id') return buyer_id;
        if (h === 'created_at') return data.created_at || now;
        if (h === 'updated_at') return now;
        return data[h] !== undefined ? String(data[h]) : '';
      });

      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: BUYERS_RANGE_FULL,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [row] },
      });
      return res.status(200).json({ success: true, buyer_id });
    }

    if (req.method === 'PATCH') {
      const data = req.body || {};
      if (!data.buyer_id) {
        return res.status(400).json({ error: 'buyer_id is required' });
      }
      const { buyers } = await listBuyers(sheets, SPREADSHEET_ID);
      const existing = buyers.find(b => b.buyer_id === data.buyer_id);
      if (!existing) {
        return res.status(404).json({ error: 'buyer not found' });
      }
      const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const merged = { ...existing, ...data, updated_at: now };
      const rowNum = existing._rowIndex;
      const row = BUYERS_HEADERS.map(h => merged[h] !== undefined ? String(merged[h]) : '');
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Buyers!A${rowNum}:AB${rowNum}`,
        valueInputOption: 'RAW',
        requestBody: { values: [row] },
      });
      return res.status(200).json({ success: true, buyer_id: data.buyer_id });
    }

    if (req.method === 'DELETE') {
      const { buyer_id } = req.body || {};
      if (!buyer_id) return res.status(400).json({ error: 'buyer_id is required' });
      const { buyers } = await listBuyers(sheets, SPREADSHEET_ID);
      const target = buyers.find(b => b.buyer_id === buyer_id);
      if (!target) return res.status(404).json({ error: 'buyer not found' });

      // Look up the Buyers sheetId for the actual delete
      const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
      const buyersSheet = meta.data.sheets.find(s => s.properties.title === 'Buyers');
      if (!buyersSheet) return res.status(500).json({ error: 'Buyers tab missing' });

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: buyersSheet.properties.sheetId,
                dimension: 'ROWS',
                startIndex: target._rowIndex - 1,
                endIndex: target._rowIndex,
              },
            },
          }],
        },
      });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Error in /api/buyers:', err);
    return res.status(500).json({ error: err.message });
  }
};
