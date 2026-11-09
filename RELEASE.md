# VOLTURA v16 release

VOLTURA v16 refines the product into a bold, flat, high-contrast matte interface with a single orbit-and-waypoint identity motif. The existing local-first ledger and IndexedDB schema are preserved.

## NFC expense capture

Program the NFC card with the exact expense URL shown under Automations (`?a=1`). A scan opens the quick expense dialog. Amount is required; category and payment account are selected in the dialog; merchant and note are optional; date defaults to today. Saving writes a normal `transactions` record with `source: "nfc"`, refreshes the dashboard and ledger, and remembers the last category/account on this device.

The URL shortcut requires the published site to be available over HTTPS (or localhost for testing), NFC Tools to write a URI/NDEF record, and the phone to open the URL in a browser. It does not invoke Web NFC in the page and cannot force a popup while the browser is closed or the phone is locked.

## Data compatibility

Database remains `tapledger-db`, schema version 3. No database migration is introduced. Back up before deployment as standard practice.

## v17 custom domain preparation
- Prepared for `https://voltura.finance/` with root `CNAME`, canonical URL metadata and root PWA scope/start URL.
- Added GitHub Pages DNS and deployment instructions.
- NFC shortcut remains generated from the current host, so after deployment it will generate `https://voltura.finance/?a=1`.
- No GitHub repository settings or registrar DNS records were changed by this local package build; those require account access.
