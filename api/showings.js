const { getSheets } = require('./_sheets');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sheets, SPREADSHEET_ID } = getSheets();

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Showings!A:T',
    });

    const rows = result.data.values || [];
    if (rows.length < 2) {
      return res.status(200).json({ tours: [] });
    }

    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i] || ''; });
      return obj;
    });

    // Group by tour_id
    const tourMap = {};
    data.forEach(row => {
      const tid = row.tour_id;
      if (!tourMap[tid]) {
        tourMap[tid] = {
          tour_id: tid,
          buyer_name: row.buyer_name,
          showing_date: row.showing_date,
          properties: [],
        };
      }
      tourMap[tid].properties.push(row);
    });

    // Sort tours by date descending (most recent first)
    const tours = Object.values(tourMap).sort((a, b) =>
      b.showing_date.localeCompare(a.showing_date)
    );

    return res.status(200).json({ tours });
  } catch (err) {
    console.error('Error reading showings:', err);
    return res.status(500).json({ error: err.message });
  }
};
