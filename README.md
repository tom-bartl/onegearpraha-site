# One Gear Praha site

Static invite + registration site for GitHub Pages.

Registration flow:

1. User submits form on GitHub Pages.
2. Form posts to Google Apps Script Web App.
3. Apps Script saves registration to Google Sheet.
4. Apps Script redirects user to Revolut payment link.
5. User returns to the site on `?payment=success` or `?payment=cancel`.

## Files

- `index.html`: invite page and registration form
- `styles.css`: site styles
- `script.js`: visual enhancements and payment status messaging only
- `apps-script.gs`: Google Apps Script backend sample

## Setup the backend (Google Apps Script)

1. Create a Google Sheet, copy its ID from URL.
2. Go to script.google.com and create a new Apps Script project.
3. Paste contents of `apps-script.gs` into project editor.
4. Fill these constants:
	- `SHEET_ID`
	- `SHEET_TAB`
	- `SITE_RETURN_URL`
	- `REVOLUT_PAYMENT_LINK`
5. Deploy as Web App:
	- Execute as: Me
	- Who has access: Anyone
6. Copy Web App URL.

Important:

- `SHEET_ID` must be the spreadsheet ID from the Google Sheet URL.
- `WEB_APP_URL` should match the deployed Apps Script Web App URL.
- `REVOLUT_PAYMENT_LINK` should be your actual Revolut payment URL.
- The Apps Script app saves each registration before it redirects to payment.
- The script writes a row with `paymentStatus = pending` and then marks it `paid` when Revolut returns to the callback URL.
- If Revolut does not preserve the `reference` query parameter in the return URL for your account, use a webhook or manual reconciliation instead.

## Wire the form to Apps Script

Edit `index.html` form action:

```html
action="PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEBAPP_URL_HERE"
```

Replace with your deployed Web App URL.

If you change the form action later, the site can still work as long as the URL points to the deployed Apps Script web app.

## Deploy on GitHub Pages

1. Push repo to GitHub.
2. Repository Settings -> Pages.
3. Source: Deploy from branch.
4. Branch: `main`, folder: `/root`.
5. Save.

If using custom domain, keep `CNAME` in repo root and configure DNS records.

## Important notes

- GitHub Pages supports browser JavaScript normally.
- This setup does not require JS for core registration submit/redirect logic.
- Do not put API secrets in frontend files.
- Payment confirmation is handled by the Revolut return callback in this setup; the sheet status changes from `pending` to `paid` when the callback fires.
- If your Revolut configuration does not return the reference reliably, the next step is a webhook or manual reconciliation column in the sheet.
