// ============================================================
// AMAR ENTERPRISES — Google Apps Script Backend
// Paste this entire file into your Apps Script editor
// ============================================================

// ⚠️ STEP 1: Replace this with your actual Google Sheet ID
// Sheet ID is the long string in your Sheet URL:
// https://docs.google.com/spreadsheets/d/ >>> THIS PART <<< /edit
const SHEET_ID = '1w6jjTfSmhqjoi49EMRWXymrCFfqQkEBwsurL5B4UXpo';

// Sheet tab name (default is "Sheet1" — change if yours is different)
const SHEET_NAME = 'Sheet1';

// ============================================================
// doPost — handles form submissions from the website
// ============================================================
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Open the sheet
    const sheet = SpreadsheetApp
      .openById(SHEET_ID)
      .getSheetByName(SHEET_NAME);

    // If this is the first ever submission, write the header row
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Name',
        'Phone',
        'Service',
        'Scrap Type',
        'Capacity',
        'Location',
        'Message',
        'Source'
      ]);

      // Style the header row
      const headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setBackground('#0B0B0B');
      headerRange.setFontColor('#F2B705');
      headerRange.setFontWeight('bold');
      headerRange.setFontSize(11);
    }

    // Append the form data as a new row
    sheet.appendRow([
      data.timestamp  || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      data.name       || '',
      data.phone      || '',
      data.service    || '',
      data.scrapType  || '',
      data.capacity   || '',
      data.location   || '',
      data.message    || '',
      data.source     || 'Website'
    ]);

    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, 9);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Data saved.' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log error and return failure response
    console.error('Error saving form data:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
// doGet — health check (visit the web app URL in browser)
// ============================================================
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Amar Enterprises script is live.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// testSubmit — run this manually from the editor to verify
// ============================================================
function testSubmit() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        timestamp : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        name      : 'Test User',
        phone     : '9999999999',
        service   : 'Scrap Pickup',
        scrapType : 'MS (Mild Steel)',
        capacity  : '',
        location  : 'Gurugram',
        message   : 'This is a test submission.',
        source    : 'Website'
      })
    }
  };
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}