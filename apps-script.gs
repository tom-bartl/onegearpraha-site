// Google Apps Script for One Gear Praha registration flow
// Deploy as Web App: Execute as Me, access = Anyone.
// Set your spreadsheet and Revolut link values before deploy.

const SHEET_ID = "12wNQ5gwWv6KdwHUB0ZY9i3GjtC7shIxnReC4qeN3wV4";
const SHEET_TAB = "Registrations";
const SITE_RETURN_URL = "https://onegearpraha.cc/";
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzAtmZJHuWmfsh2eduIGEqKdWG7JN_tGuYV68EjNvYl6GAcBVQl9eFq5UtH7726PaNe/exec";
const REVOLUT_PAYMENT_LINK = "https://checkout.revolut.com/pay/a7ac8074-52d7-4912-9b69-f5564df607e4";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    validateConfig();

    const data = normalizeIncomingData(e);

    const registrationId = createRegistrationId();
    const createdAt = new Date().toISOString();

    const row = [
      registrationId,
      createdAt,
      data.eventCode || "",
      data.eventName || "",
      data.fullName || "",
      data.email || "",
      data.phone || "",
      data.category || "",
      data.bikeSetup || "",
      data.emergencyContact || "",
      data.notes || "",
      data.feeCzk || "",
      data.currency || "",
      data.consent ? "yes" : "no",
      "pending",
    ];

    const sheet = getSheet();
    ensureHeader(sheet);
    sheet.appendRow(row);

    const revolutUrl = buildRevolutUrl({
      registrationId,
      fullName: data.fullName || "rider",
      amount: data.feeCzk || "200",
      currency: data.currency || "CZK",
    });

    return buildRedirectHtml(revolutUrl, "Redirecting to Revolut payment...");
  } catch (error) {
    Logger.log(error);
    const failUrl = SITE_RETURN_URL + "?payment=cancel";
    return buildRedirectHtml(failUrl, "Registration error. Returning to site...");
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const action = ((e && e.parameter && e.parameter.action) || "").toString();
  const reference = ((e && e.parameter && e.parameter.reference) || "").toString();

  if (action === "payment-success" && reference) {
    markPaymentStatus(reference, "paid");
    return buildRedirectHtml(SITE_RETURN_URL + "?payment=success&reference=" + encodeURIComponent(reference), "Payment confirmed. Returning to site...");
  }

  if (action === "payment-cancel" && reference) {
    markPaymentStatus(reference, "cancelled");
    return buildRedirectHtml(SITE_RETURN_URL + "?payment=cancel&reference=" + encodeURIComponent(reference), "Payment cancelled. Returning to site...");
  }

  return HtmlService.createHtmlOutput(
    [
      "<html><head><meta charset='utf-8'><title>One Gear Praha Registration</title></head><body>",
      "<p>Registration endpoint is live.</p>",
      "<p>Use the HTML form on the website to submit registrations.</p>",
      "</body></html>",
    ].join("")
  );
}

function validateConfig() {
  if (SHEET_ID === "PASTE_GOOGLE_SHEET_ID" || !SHEET_ID) {
    throw new Error("Missing SHEET_ID configuration.");
  }

  if (WEB_APP_URL === "PASTE_WEB_APP_URL" || !WEB_APP_URL) {
    throw new Error("Missing WEB_APP_URL configuration.");
  }

  if (REVOLUT_PAYMENT_LINK === "PASTE_REVOLUT_PAYMENT_LINK" || !REVOLUT_PAYMENT_LINK) {
    throw new Error("Missing REVOLUT_PAYMENT_LINK configuration.");
  }

  if (!SITE_RETURN_URL) {
    throw new Error("Missing SITE_RETURN_URL configuration.");
  }
}

function normalizeIncomingData(e) {
  const parameterData = (e && e.parameter) || {};
  const postData = (e && e.postData && e.postData.contents) || "";

  if (!postData) {
    return parameterData;
  }

  if (parameterData.fullName) {
    return parameterData;
  }

  try {
    const jsonData = JSON.parse(postData);
    return jsonData || parameterData;
  } catch (error) {
    return parameterData;
  }
}

function getSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_TAB) || ss.insertSheet(SHEET_TAB);
  sheet.setFrozenRows(1);
  return sheet;
}

function ensureHeader(sheet) {
  if (sheet.getLastRow() > 0) return;

  sheet.appendRow([
    "registrationId",
    "createdAt",
    "eventCode",
    "eventName",
    "fullName",
    "email",
    "phone",
    "category",
    "bikeSetup",
    "emergencyContact",
    "notes",
    "feeCzk",
    "currency",
    "consent",
    "paymentStatus",
  ]);
}

function buildRedirectHtml(url, message) {
  return HtmlService.createHtmlOutput(
    '<html><head><meta http-equiv="refresh" content="0;url=' + sanitizeUrl(url) + '"></head><body>' +
      sanitizeHtml(message) +
      "</body></html>"
  );
}

function createRegistrationId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 999)
    .toString()
    .padStart(3, "0");
  return "OGP-" + stamp + "-" + random;
}

function buildRevolutUrl(registration) {
  const url = new URL(REVOLUT_PAYMENT_LINK);

  if (!url.searchParams.get("amount")) {
    url.searchParams.set("amount", String(registration.amount));
  }

  if (!url.searchParams.get("currency")) {
    url.searchParams.set("currency", registration.currency);
  }

  url.searchParams.set("reference", registration.registrationId);
  url.searchParams.set("name", registration.fullName);

  if (!url.searchParams.get("success_url")) {
    url.searchParams.set("success_url", WEB_APP_URL + "?action=payment-success&reference=" + encodeURIComponent(registration.registrationId));
  }

  if (!url.searchParams.get("cancel_url")) {
    url.searchParams.set("cancel_url", WEB_APP_URL + "?action=payment-cancel&reference=" + encodeURIComponent(registration.registrationId));
  }

  return url.toString();
}

function markPaymentStatus(registrationId, paymentStatus) {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    if (String(values[rowIndex][0]) === String(registrationId)) {
      sheet.getRange(rowIndex + 1, 15).setValue(paymentStatus);
      return true;
    }
  }

  return false;
}

function sanitizeUrl(url) {
  return String(url).replace(/"/g, "%22");
}

function sanitizeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
