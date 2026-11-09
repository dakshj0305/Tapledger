# VOLTURA — Money in Motion

A local-first personal finance workspace. The app runs as a static website/PWA and stores ledger data in IndexedDB on the current browser/device.

## Run locally
Use `RUN-LOCAL-WINDOWS.bat` on Windows, or serve this folder with any static HTTP server. Use HTTPS when testing NFC URL cards on a phone. Opening `index.html` directly as a `file://` URL is not a supported production setup.

## NFC quick expense
1. Publish the app to HTTPS and open Automations.
2. Copy the Expense URL shown there (`?a=1`).
3. In NFC Tools, choose Write → Add a record → URL/URI, paste the URL and write it to the card. Do not permanently lock the tag.
4. With the phone unlocked, scan the card. The browser opens VOLTURA and the quick expense window appears.
5. Enter the amount, confirm category/account, optionally enter merchant/note, and tap Save expense.
6. The record is saved to the same local ledger used by Overview and Ledger.

The card stores a URL shortcut, not the transaction itself. A browser must open the URL; the page cannot display a dialog over a locked phone or closed browser without OS/browser cooperation. The data is local to the browser/device unless the user exports a backup.

## Data compatibility
IndexedDB remains `tapledger-db` schema version 3 to preserve existing TapLedger/Vellum/Voltura records in the same browser origin. Keep backups before replacing a deployed release.

## Custom domain: voltura.finance
This release includes a root `CNAME`, root-scoped PWA manifest, canonical metadata and a step-by-step DNS/GitHub Pages guide in `CUSTOM-DOMAIN-SETUP.md`. Configure the custom domain in the repository's Settings → Pages and at your domain registrar before updating the NFC card. Browser storage is origin-specific: export a JSON backup from the old GitHub Pages origin and restore it on `https://voltura.finance/`.
