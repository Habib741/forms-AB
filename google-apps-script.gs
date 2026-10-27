function doPost(event) {
  const payload = JSON.parse(event.postData.contents);
  const phone = String(payload.phone || "").trim();
  const message = String(payload.message || "").trim();

  if (!message || phone.length > 40) {
    return jsonResponse({ ok: false });
  }

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet =
    spreadsheet.getSheetByName("Réponses") || spreadsheet.insertSheet("Réponses");

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Date", "Numéro de téléphone", "Message"]);
  }

  sheet.appendRow([new Date(), `'${phone}`, `'${message}`]);

  return jsonResponse({ ok: true });
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
