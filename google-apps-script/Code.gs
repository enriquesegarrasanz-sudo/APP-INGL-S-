/**
 * Sparring English OS — Google Apps Script Backend
 *
 * Este script convierte una Google Sheet en la base de datos de la app.
 * Se despliega como Web App y la app React lo llama para leer/escribir datos.
 *
 * SETUP:
 * 1. Abre Google Sheets y crea una hoja nueva llamada "Sparring English OS"
 * 2. Ve a Extensiones > Apps Script
 * 3. Pega este código completo
 * 4. Haz clic en Implementar > Nueva implementación
 * 5. Tipo: Aplicación web
 * 6. Ejecutar como: Yo
 * 7. Quién tiene acceso: Cualquier persona
 * 8. Copia la URL generada
 * 9. Pégala en tu .env.local como VITE_GOOGLE_SCRIPT_URL
 */

const SHEET_NAMES = {
  expressions: 'expressions',
  scripts: 'scripts',
  reviews: 'reviews',
  meta: 'meta'
};

function doGet(e) {
  const action = e?.parameter?.action || 'load';

  try {
    if (action === 'load') {
      const data = loadAllData();
      return jsonResponse(data);
    }

    if (action === 'ping') {
      return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() });
    }

    return jsonResponse({ error: 'Unknown action' }, 400);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action || 'save';

    if (action === 'save') {
      saveAllData(body.data);
      return jsonResponse({ status: 'saved', timestamp: new Date().toISOString() });
    }

    return jsonResponse({ error: 'Unknown action' }, 400);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

// ── Data operations ──

function loadAllData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  return {
    expressions: loadSheet(ss, SHEET_NAMES.expressions),
    scripts: loadSheet(ss, SHEET_NAMES.scripts),
    reviews: loadSheet(ss, SHEET_NAMES.reviews),
  };
}

function saveAllData(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (data.expressions) {
    saveSheet(ss, SHEET_NAMES.expressions, data.expressions);
  }
  if (data.scripts) {
    saveSheet(ss, SHEET_NAMES.scripts, data.scripts);
  }
  if (data.reviews) {
    saveSheet(ss, SHEET_NAMES.reviews, data.reviews);
  }

  // Update meta
  let metaSheet = ss.getSheetByName(SHEET_NAMES.meta);
  if (!metaSheet) {
    metaSheet = ss.insertSheet(SHEET_NAMES.meta);
  }
  metaSheet.clear();
  metaSheet.getRange(1, 1, 1, 2).setValues([['last_sync', new Date().toISOString()]]);
}

function loadSheet(ss, name) {
  const sheet = ss.getSheetByName(name);
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  if (data.length === 0) return [];

  // First row is the header "json_data", second row onward is the JSON
  if (data.length < 2) return [];

  try {
    return JSON.parse(data[1][0]);
  } catch {
    return [];
  }
}

function saveSheet(ss, name, data) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }

  sheet.clear();
  sheet.getRange(1, 1).setValue('json_data');
  sheet.getRange(2, 1).setValue(JSON.stringify(data));

  // Auto-resize
  sheet.autoResizeColumn(1);
}

// ── Helpers ──

function jsonResponse(data, code) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Initial setup helper ──

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  Object.values(SHEET_NAMES).forEach(name => {
    if (!ss.getSheetByName(name)) {
      const sheet = ss.insertSheet(name);
      sheet.getRange(1, 1).setValue('json_data');
      sheet.getRange(2, 1).setValue('[]');
    }
  });

  Logger.log('Sheets created: ' + Object.values(SHEET_NAMES).join(', '));
}
