/**
 * Neera Raj landing-page lead receiver.
 *
 * Paste this entire file into Extensions > Apps Script from the Google Sheet,
 * then deploy it as a Web app.
 */

const SPREADSHEET_ID = '1k31fFO4Zx2vd5m2S4VVekMdYu-cPKTZk_MCt5klnDok';
const SHEET_NAME = 'Leads';

const HEADERS = [
  'Timestamp',
  'Full Name',
  'WhatsApp Number',
  'Email',
  'Wedding Date',
  'Wedding City / Destination',
  'Service',
  'Bridal Vision / Message',
  'Lead Source',
  'Campaign',
  'Ad Set',
  'Ad',
  'Page URL',
  'Status'
];

function doGet() {
  return jsonResponse_({
    ok: true,
    service: 'Neera Raj lead receiver'
  });
}

function doPost(event) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const payload = parsePayload_(event);
    validatePayload_(payload);

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateLeadSheet_(spreadsheet);

    sheet.appendRow([
      new Date(),
      safeCell_(payload.fullName),
      safeCell_(payload.phone),
      safeCell_(payload.email),
      safeCell_(payload.weddingDate),
      safeCell_(payload.weddingVenue),
      safeCell_(payload.service),
      safeCell_(payload.message),
      safeCell_(payload.leadSource || 'Landing Page'),
      safeCell_(payload.campaign),
      safeCell_(payload.adSet),
      safeCell_(payload.ad),
      safeCell_(payload.pageUrl),
      'New'
    ]);

    return jsonResponse_({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse_({
      ok: false,
      error: error.message || 'Unable to save lead'
    });
  } finally {
    lock.releaseLock();
  }
}

function parsePayload_(event) {
  if (!event) return {};

  if (event.postData && event.postData.contents) {
    try {
      return JSON.parse(event.postData.contents);
    } catch (error) {
      // Fall through to URL-encoded parameters.
    }
  }

  return event.parameter || {};
}

function validatePayload_(payload) {
  const required = ['fullName', 'phone', 'weddingDate', 'weddingVenue'];
  const missing = required.filter(function (key) {
    return !String(payload[key] || '').trim();
  });

  if (missing.length) {
    throw new Error('Missing required fields: ' + missing.join(', '));
  }
}

function getOrCreateLeadSheet_(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#5b3349')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function safeCell_(value) {
  const text = String(value || '').trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

