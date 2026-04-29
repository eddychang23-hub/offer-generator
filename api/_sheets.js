const { google } = require('googleapis');

const SPREADSHEET_ID = '11OIoj677pULt7Q6B5V7JCVlCmDzeQn9pB_JkBMauNLY';

function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return { sheets: google.sheets({ version: 'v4', auth }), SPREADSHEET_ID };
}

// 1 → 'A', 26 → 'Z', 27 → 'AA', 28 → 'AB', etc. Used to size the write
// range to the actual column count when sheets grow past 26 columns.
function colLetter(n) {
  let s = '';
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

// Read the actual header row from the sheet so writes use the real column
// order. Critical when migrations append new columns at the end — the
// code constant's order will diverge from the sheet's, and writing in
// constant order would scramble values across columns.
async function readActualHeaders(sheets, spreadsheetId, headerRange) {
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId, range: headerRange,
  });
  return (result.data.values && result.data.values[0]) || [];
}

module.exports = { getSheets, colLetter, readActualHeaders };
