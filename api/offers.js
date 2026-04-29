const { getSheets, colLetter, readActualHeaders } = require('./_sheets');

const OFFERS_HEADERS = [
  'offer_id', 'status', 'tour_id', 'mls', 'buyer1', 'buyer2',
  'contract_number', 'purchase_price', 'closing_date', 'closing_docs',
  'deposit_amount', 'deposit_date', 'deposit_time', 'deposit_method', 'trustee',
  'financing', 'inspection', 'buyer_sale', 'additional_condition',
  'additional_condition_text', 'condition_date', 'condition_time',
  'seller_condition', 'seller_condition_text', 'seller_condition_date', 'seller_condition_time',
  'term_title_insurance', 'title_insurance_max', 'term_cleaning', 'term_walkthrough',
  'additional_terms', 'has_expiry', 'expiry_date', 'expiry_time',
  'seller1', 'seller2', 'listing_broker', 'listing_agent', 'listing_agent_ph',
  'listing_agent_email', 'street_num', 'street', 'city', 'zipcode',
  'plan', 'block', 'lot', 'inclusions', 'exclusions',
  'dower', 'dower_date', 'dower_time',
  'pdf_drive_id', 'created_at', 'updated_at'
];

async function ensureOffersHeaders(sheets, SPREADSHEET_ID) {
  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Offers!A1:BC1',
    });
    if (!result.data.values || result.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Offers!A1',
        valueInputOption: 'RAW',
        requestBody: { values: [OFFERS_HEADERS] },
      });
    }
  } catch (err) {
    // Tab might not exist — create it
    if (err.message && err.message.includes('Unable to parse range')) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{ addSheet: { properties: { title: 'Offers' } } }],
        },
      });
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Offers!A1',
        valueInputOption: 'RAW',
        requestBody: { values: [OFFERS_HEADERS] },
      });
    } else {
      throw err;
    }
  }
}

module.exports = async function handler(req, res) {
  const { sheets, SPREADSHEET_ID } = getSheets();

  if (req.method === 'GET') {
    // Return all offers
    try {
      await ensureOffersHeaders(sheets, SPREADSHEET_ID);
      const result = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Offers!A:BC',
      });
      const rows = result.data.values || [];
      if (rows.length < 2) {
        return res.status(200).json({ offers: [] });
      }
      const headers = rows[0];
      const offers = rows.slice(1)
        .map((row, idx) => {
          const obj = { _rowIndex: idx + 2 }; // 1-indexed, +1 for header
          headers.forEach((h, i) => { obj[h] = row[i] || ''; });
          return obj;
        })
        // Filter out ghost rows (all fields empty except possibly created_at/updated_at)
        .filter(o => Object.entries(o).some(([k, v]) =>
          k !== '_rowIndex' && k !== 'created_at' && k !== 'updated_at' && v
        ));
      return res.status(200).json({ offers });
    } catch (err) {
      console.error('Error reading offers:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      await ensureOffersHeaders(sheets, SPREADSHEET_ID);
      const data = req.body;

      // Read actual sheet headers — when columns get added to OFFERS_HEADERS
      // later, the migration appends them at the end of the sheet, so the
      // sheet's order can drift from the constant's order. Writing in the
      // constant's order would scramble values across columns.
      const actual = await readActualHeaders(sheets, SPREADSHEET_ID, 'Offers!A1:BZ1');
      const useHeaders = actual.length > 0 ? actual : OFFERS_HEADERS;

      const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const row = useHeaders.map(h => {
        if (h === 'created_at') return data.created_at || now;
        if (h === 'updated_at') return now;
        return data[h] !== undefined ? String(data[h]) : '';
      });
      const lastCol = colLetter(useHeaders.length);

      if (data._rowIndex) {
        // Update existing row
        const rowNum = data._rowIndex;
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `Offers!A${rowNum}:${lastCol}${rowNum}`,
          valueInputOption: 'RAW',
          requestBody: { values: [row] },
        });
        return res.status(200).json({ success: true, action: 'updated', row: rowNum });
      } else {
        // Append new row
        await sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: `Offers!A:${lastCol}`,
          valueInputOption: 'RAW',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [row] },
        });
        return res.status(200).json({ success: true, action: 'created' });
      }
    } catch (err) {
      console.error('Error writing offer:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { _rowIndex } = req.body;
      if (!_rowIndex) {
        return res.status(400).json({ error: 'Missing _rowIndex' });
      }
      // Look up the Offers tab's internal sheetId (different from spreadsheetId)
      const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
      const offersSheet = meta.data.sheets.find(s => s.properties.title === 'Offers');
      if (!offersSheet) {
        return res.status(500).json({ error: 'Offers sheet not found' });
      }
      const sheetId = offersSheet.properties.sheetId;
      // Actually delete the row (_rowIndex is 1-indexed; API is 0-indexed)
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId,
                dimension: 'ROWS',
                startIndex: _rowIndex - 1,
                endIndex: _rowIndex,
              },
            },
          }],
        },
      });
      return res.status(200).json({ success: true, action: 'deleted' });
    } catch (err) {
      console.error('Error deleting offer:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
