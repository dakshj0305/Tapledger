# TapLedger — NFC Expense Logger

TapLedger is a small, offline-first Progressive Web App (PWA) for quickly recording purchases. A rewritable NFC tag stores a URL. Tapping it with an Android phone opens the TapLedger quick-entry form. Expense records are stored locally in the browser's IndexedDB database.

## What is included

- NFC-friendly quick-add URL (`?add=1&source=nfc`)
- Optional category/merchant presets in the URL
- Local monthly total and transaction count
- Monthly spending budget progress
- Seven-day spending chart and category breakdown
- Recent expense list, category filter, and delete
- CSV export and JSON backup/restore
- PWA installability and service-worker shell cache for offline use after the first successful visit
- No login, analytics, backend, or third-party API

## Architecture

```text
Rewritable NFC tag (NDEF URL)
        |
        v
Android NFC dispatch -> Chrome / installed web app
        |
        v
TapLedger quick-add route (?add=1&source=nfc)
        |
        v
Expense form -> validation -> IndexedDB (on this device)
        |
        +--> Dashboard totals / weekly chart / category totals
        +--> CSV export / JSON backup
```

The NFC tag is only a trigger. It does not contain expense records or sensitive information. The browser stores records on the device. Clearing Chrome site data, using a different browser/profile, or moving to another phone can make the local records unavailable unless you first export a JSON backup.

## Run locally

A secure context (HTTPS or localhost) is required for full PWA/service-worker behaviour. From this directory, run a local server, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in Chrome on a desktop for layout testing. To test NFC on Android, deploy it to an HTTPS host first.

## Deploy with GitHub Pages

1. Create a GitHub repository named `tapledger`.
2. Upload the contents of this folder (the `index.html` file should be at the repository root).
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, then save.
5. Wait for GitHub Pages to publish the site. The URL will look like `https://YOUR-USERNAME.github.io/tapledger/`.
6. Open that URL in Chrome on Android while online. Add it to the home screen / install it from Chrome's menu if offered. Open it once so the service worker can cache the app shell.

If you use a different host or repository path, use that exact published URL when programming the NFC tag. Keep HTTPS enabled.

## Identify and program the NFC tag

1. Install **NFC Tools** and, optionally, **NXP TagInfo** on Android.
2. Enable NFC in Android Settings.
3. In NFC Tools, choose **Read** and scan the card. Check its technology/type and whether it exposes writable NDEF memory.
4. Do not overwrite bank cards, transit cards, office badges, hotel keys, or any card whose function you need. Use a separate rewritable NFC tag if the card type or purpose is unclear.
5. After deploying the site, copy its full HTTPS URL. In NFC Tools choose **Write → Add a record → URL/URI** and write:

   `https://YOUR-USERNAME.github.io/tapledger/?add=1&source=nfc`

6. Tap **Write**, then hold the rewritable tag against the NFC antenna area of the phone.
7. Scan the tag again or tap it with the phone to verify that the quick-entry form opens.

For a preset tag, use a URL such as:

- Food: `...?add=1&source=nfc&category=Food`
- Transport: `...?add=1&source=nfc&category=Transport`
- Shopping: `...?add=1&source=nfc&category=Shopping`

You can optionally add a merchant preset, URL-encoded, e.g. `&merchant=Corner%20Cafe`. Do not put passwords, account numbers, medical data, or other secrets in an NFC URL.

## Daily use

1. Tap the NFC tag with the phone. Android may need the screen awake/unlocked; exact behaviour varies by device and browser.
2. TapLedger opens a quick-entry form. Enter the amount, confirm the category/date, and optionally add merchant/note.
3. Save. The dashboard updates immediately.
4. Set a monthly budget from the dashboard.
5. Export CSV for spreadsheet analysis. Use JSON backup before clearing browser data or migrating devices.

## Important limits

- The app defaults to INR (₹). To use another currency, change `CURRENCY` in `app.js` and the labels/backup metadata consistently before recording real data.
- Data is local to the browser profile on the device. There is no cloud sync or automatic cross-device backup.
- The NFC tag stores a URL and is not an authentication token. Anyone who scans or reads the tag can see that URL.
- Tapping the tag normally opens the HTTPS page in Chrome. Whether Android launches an installed PWA as a standalone window depends on the device/browser's link handling; the web page still works in Chrome.
- Offline opening works only after the app shell has been loaded online at least once and the service worker has successfully installed.
- This starter does not connect to bank accounts or automatically detect purchases. You enter the amount yourself.

## Next development steps

1. Add category-specific budgets and month navigation.
2. Add receipt photo attachment with local compression and storage limits.
3. Add optional CSV import and duplicate detection.
4. Add passphrase-encrypted backup files (the current JSON backup is plain text).
5. Add optional cloud sync only after choosing an account/authentication model and privacy policy.
6. If you later want NFC tags to launch a native Android activity directly, build a native Android wrapper and configure verified Android App Links for your own domain.
