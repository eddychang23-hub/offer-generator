const { google } = require('googleapis');

const SPREADSHEET_ID = '11OIoj677pULt7Q6B5V7JCVlCmDzeQn9pB_JkBMauNLY';

function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return { sheets: google.sheets({ version: 'v4', auth }), SPREADSHEET_ID };
}

module.exports = { getSheets };
