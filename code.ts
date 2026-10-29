/**
 * Google Apps Script backend for Thanuujan & Priyanka's wedding invitation.
 *
 * Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1T_ULyW5M2r_AajoCElneq8gvtDwQpgVmCRCsMc6sX4o/edit
 *
 * The "RSVP" and "Wishes" sheets (with formatted header rows) are created
 * automatically on the first submission, or immediately by running setup().
 *
 * Deploy: Deploy > New deployment > Web app
 *   Execute as: Me
 *   Who has access: Anyone
 */

var SPREADSHEET_ID = '1T_ULyW5M2r_AajoCElneq8gvtDwQpgVmCRCsMc6sX4o';

var SHEETS = {
  RSVP: {
    name: 'RSVP',
    headers: ['Timestamp', 'Full Name', 'Phone', 'Attendance', 'Number of Guests', 'Dietary Notes'],
    widths: [170, 220, 150, 230, 140, 320],
    color: '#7B1E3A',
  },
  WISHES: {
    name: 'Wishes',
    headers: ['Timestamp', 'Name', 'Message'],
    widths: [170, 220, 520],
    color: '#0F5132',
  },
};

/** Run once from the Apps Script editor to create both sheets and grant permissions. */
function setup() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  getOrCreateSheet_(ss, SHEETS.RSVP);
  getOrCreateSheet_(ss, SHEETS.WISHES);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var data = parsePayload_(e);
    var config = resolveSheet_(data.sheet);
    if (!config) {
      return jsonResponse_({ ok: false, error: 'Invalid sheet. Use "RSVP" or "Wishes".' });
    }

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = getOrCreateSheet_(ss, config);
    var row;

    if (config === SHEETS.RSVP) {
      if (!clean_(data.name)) {
        return jsonResponse_({ ok: false, error: 'Name is required.' });
      }
      row = [
        new Date(),
        clean_(data.name),
        clean_(data.phone),
        clean_(data.attendance),
        clean_(data.guests),
        clean_(data.dietary),
      ];
    } else {
      if (!clean_(data.name) || !clean_(data.message)) {
        return jsonResponse_({ ok: false, error: 'Name and message are required.' });
      }
      row = [new Date(), clean_(data.name), clean_(data.message)];
    }

    sheet.appendRow(row);
    return jsonResponse_({ ok: true, row: sheet.getLastRow() });
  } catch (error) {
    return jsonResponse_({ ok: false, error: String(error && error.message ? error.message : error) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * GET ?sheet=Wishes  -> latest wishes (newest first) for the guestbook.
 * GET (no params)    -> health check.
 */
function doGet(e) {
  var params = (e && e.parameter) || {};

  if (resolveSheet_(params.sheet) === SHEETS.WISHES) {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = getOrCreateSheet_(ss, SHEETS.WISHES);
    var lastRow = sheet.getLastRow();
    var wishes = [];

    if (lastRow > 1) {
      var values = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
      for (var i = values.length - 1; i >= 0 && wishes.length < 100; i--) {
        if (!values[i][1] || !values[i][2]) continue;
        wishes.push({
          timestamp: values[i][0] instanceof Date ? values[i][0].toISOString() : String(values[i][0]),
          name: String(values[i][1]),
          message: String(values[i][2]),
        });
      }
    }

    return jsonResponse_({ ok: true, wishes: wishes });
  }

  return jsonResponse_({ ok: true, message: 'Wedding invitation endpoint is running.' });
}

function resolveSheet_(value) {
  var key = String(value || '').trim().toUpperCase();
  if (key === 'RSVP') return SHEETS.RSVP;
  if (key === 'WISHES' || key === 'WISH') return SHEETS.WISHES;
  return null;
}

function getOrCreateSheet_(ss, config) {
  var sheet = ss.getSheetByName(config.name) || ss.insertSheet(config.name);

  if (sheet.getLastRow() === 0) {
    var header = sheet.getRange(1, 1, 1, config.headers.length);
    header
      .setValues([config.headers])
      .setFontWeight('bold')
      .setFontColor('#FFFFFF')
      .setBackground(config.color)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
    sheet.setRowHeight(1, 32);
    sheet.setFrozenRows(1);
    for (var i = 0; i < config.widths.length; i++) {
      sheet.setColumnWidth(i + 1, config.widths[i]);
    }
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
    sheet.getRange(2, 1, sheet.getMaxRows() - 1, config.headers.length).setWrap(true).setVerticalAlignment('top');
  }

  return sheet;
}

function parsePayload_(e) {
  var params = (e && e.parameter) || {};
  if (Object.keys(params).length > 0) return params;

  var contents = e && e.postData && e.postData.contents;
  if (!contents) return {};

  try {
    return JSON.parse(contents);
  } catch (_err) {
    return {};
  }
}

// Trims input and neutralises leading =, +, -, @ so guest text can't run as a formula.
function clean_(value) {
  var text = String(value == null ? '' : value).trim().slice(0, 2000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
