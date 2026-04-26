// /api/paperwork — bridge between the dashboard Generate buttons and the
// desktop paperwork_processor. The dashboard POSTs a generation request,
// this writes a row to the Paperwork tab, and paperwork_processor.py picks
// it up on its next poll.
//
// GET    /api/paperwork                           → list all paperwork rows
// GET    /api/paperwork?id=P-abc123               → fetch one row
// GET    /api/paperwork?buyer_id=B-xxx            → all paperwork for a buyer
// POST   /api/paperwork  { form_key, buyer_id, offer_id? }   → request a generation
// PATCH  /api/paperwork  { paperwork_id, ...fields }         → update (used by processor)
//
// Auto-creates the Paperwork tab on first call.

const { getSheets } = require('./_sheets');

const PAPERWORK_HEADERS = [
  'paperwork_id',
  'form_key',          // e.g. 'buyer_representation_agreement'
  'buyer_id',          // FK to Buyers tab — null for offer-only forms
  'offer_id',          // FK to Offers tab — null for buyer-only forms
  'status',            // requested → processing → complete | error
  'drive_file_id',     // populated when complete
  'drive_link',        // populated when complete
  'error_message',     // populated when error
  'created_at',
  'updated_at',
];

const RANGE_FULL = 'Paperwork!A:J';
const RANGE_HEADERS = 'Paperwork!A1:J1';

async function ensureTab(sheets, SPREADSHEET_ID) {
  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID, range: RANGE_HEADERS,
    });
    if (!result.data.values || result.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Paperwork!A1',
        valueInputOption: 'RAW',
        requestBody: { values: [PAPERWORK_HEADERS] },
      });
    }
  } catch (err) {
    if (err.message && err.message.includes('Unable to parse range')) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: { requests: [{ addSheet: { properties: { title: 'Paperwork' } } }] },
      });
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Paperwork!A1',
        valueInputOption: 'RAW',
        requestBody: { values: [PAPERWORK_HEADERS] },
      });
    } else {
      throw err;
    }
  }
}

function newId() {
  const r = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
  return `P-${r}`;
}

function rowToObject(row, headers, rowIndex) {
  const obj = { _rowIndex: rowIndex };
  headers.forEach((h, i) => { obj[h] = row[i] || ''; });
  return obj;
}

async function listAll(sheets, SPREADSHEET_ID) {
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID, range: RANGE_FULL,
  });
  const rows = result.data.values || [];
  if (rows.length < 2) return { headers: PAPERWORK_HEADERS, items: [] };
  const headers = rows[0];
  const items = rows.slice(1)
    .map((row, idx) => rowToObject(row, headers, idx + 2))
    .filter(p => p.paperwork_id);
  return { headers, items };
}

module.exports = async function handler(req, res) {
  const { sheets, SPREADSHEET_ID } = getSheets();

  try {
    await ensureTab(sheets, SPREADSHEET_ID);

    if (req.method === 'GET') {
      const { id, buyer_id } = req.query || {};
      const { items } = await listAll(sheets, SPREADSHEET_ID);
      if (id) return res.status(200).json({ paperwork: items.find(p => p.paperwork_id === id) || null });
      if (buyer_id) return res.status(200).json({ paperwork: items.filter(p => p.buyer_id === buyer_id) });
      return res.status(200).json({ paperwork: items });
    }

    if (req.method === 'POST') {
      const { form_key, buyer_id, offer_id } = req.body || {};
      if (!form_key) return res.status(400).json({ error: 'form_key is required' });

      const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const paperwork_id = newId();
      const row = PAPERWORK_HEADERS.map(h => {
        if (h === 'paperwork_id') return paperwork_id;
        if (h === 'form_key')     return form_key;
        if (h === 'buyer_id')     return buyer_id || '';
        if (h === 'offer_id')     return offer_id || '';
        if (h === 'status')       return 'requested';
        if (h === 'created_at')   return now;
        if (h === 'updated_at')   return now;
        return '';
      });

      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE_FULL,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [row] },
      });
      return res.status(200).json({ success: true, paperwork_id });
    }

    if (req.method === 'PATCH') {
      const data = req.body || {};
      if (!data.paperwork_id) return res.status(400).json({ error: 'paperwork_id is required' });
      const { items } = await listAll(sheets, SPREADSHEET_ID);
      const existing = items.find(p => p.paperwork_id === data.paperwork_id);
      if (!existing) return res.status(404).json({ error: 'paperwork row not found' });

      const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const merged = { ...existing, ...data, updated_at: now };
      const rowNum = existing._rowIndex;
      const row = PAPERWORK_HEADERS.map(h => merged[h] !== undefined ? String(merged[h]) : '');
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Paperwork!A${rowNum}:J${rowNum}`,
        valueInputOption: 'RAW',
        requestBody: { values: [row] },
      });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Error in /api/paperwork:', err);
    return res.status(500).json({ error: err.message });
  }
};
