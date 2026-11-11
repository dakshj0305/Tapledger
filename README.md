# VOLTURA — Personal finance, made clear

VOLTURA is a static, local-first personal finance PWA for recording income, expenses and transfers, reviewing budgets and goals, and analysing the ledger later. Financial records are stored in IndexedDB in the current browser profile.

## Run locally

Use `RUN-LOCAL-WINDOWS.bat` on Windows or serve this folder with any static HTTP server. Use HTTPS when testing NFC URL cards on a phone. Opening `index.html` directly as a `file://` URL is not a supported production setup.

## NFC quick expense

1. Publish to the GitHub Pages project path: `https://dakshj0305.github.io/Tapledger/`.
2. Open VOLTURA → Automations and copy the generated expense URL. It should end in `?a=1`.
3. In NFC Tools, choose Write → Add a record → URL/URI, paste the complete URL and write it to a known-writable NFC Forum Type 2 tag. Do not permanently lock the tag.
4. With the phone unlocked, tap the tag. Android opens the URL in the default browser unless an installed PWA captures that URL scope; installed-PWA link capture depends on OS/browser configuration and is **UNVERIFIED** on the target Galaxy S23 FE until physically tested.
5. The page opens the quick expense sheet immediately. Enter amount, choose a category, optionally adjust the account/merchant/date/time/note, and save. You can undo for about five seconds, add another, or view the dashboard.
6. The transaction is written to the same `transactions` store used by the dashboard and ledger.

The tag contains only a URL shortcut, not transaction data. It cannot display a UI over a locked phone or bypass the browser. The tag's write success must be verified separately: the previously scanned MF0ICU1 tag failed even when writing `TEST`; this release does not claim that card is writable.

**Recommended NFC expense URL:** `https://dakshj0305.github.io/Tapledger/?a=1`

## Offline limits

A service worker can cache the app after the first successful online visit and cache installation. A first-ever open with no network cannot load a site that has never been cached. No offline first-run guarantee is made.

## Data compatibility

IndexedDB remains named `tapledger-db`, schema version 3. This is deliberately retained for compatibility with TapLedger/Vellum/Cairn-era records; renaming the internal database would make the existing local data appear to disappear. New JSON exports are tagged `Voltura`; imports continue to accept `Voltura`, `Vellum`, `Cairn` and `TapLedger` formats. No IndexedDB schema upgrade is introduced by this release. The JSON export's `schemaVersion` is a backup-format label, not the IndexedDB version.

Browser storage is origin-specific. Moving from the project Pages origin to a custom domain requires exporting a JSON backup on the old origin and restoring it on the new origin. Do not use `voltura.finance` until you have registered and configured it.

## Privacy and security notes

No analytics, ads, external scripts, remote fonts or application cookies are included by this source package. GitHub Pages still receives ordinary hosting requests and may process request logs under its own terms. Optional Web Speech recognition may send microphone audio or speech data to a browser/vendor service after you opt in. See `privacy.html`, `terms.html` and `cookies.html`; these are drafts and require review by a lawyer qualified in Indian law. Distribution in the EU, UK or US would require jurisdiction-specific review of privacy, consumer, children’s data and other applicable requirements; this note is not a complete jurisdictional analysis.

GitHub Pages does not let this repository set all HTTP response security headers (for example, HSTS, X-Content-Type-Options, Referrer-Policy or a response-header CSP). The app uses a CSP meta policy, but meta CSP cannot replace server response headers in every respect. This is a source-level configuration note, not a security certification.

## Trademark and naming

“Voltura” may already be used by other businesses. Search the Indian Trade Marks Registry / IP India and relevant international registers before public launch. This source package does not establish that the name is available.

## Current application features

- Dashboard totals for the current month: recorded income, expenses, net movement, savings rate and tracked account position. Values are derived only from this browser's saved ledger and account opening balances.
- Category-colored spending breakdown, searchable/filterable transaction ledger, monthly budgets with 80% and 100% states, and local rule-based coach cards.
- Merchant suggestions use local merchant history first and name patterns second; a suggestion is never applied until you confirm it.
- Unusual expense notices require at least five earlier same-category expenses in the preceding 12 months and an amount strictly above 150% of their average.
- Weekly spending and printable monthly reports, category totals, prior-year comparison when both periods have recorded expenses, and CSV downloads.
- Expense forms include date/time, account, payment method, merchant and receipt note. The extra payment-method field is optional; existing transaction records remain readable.

All calculations are based on records you enter. Voltura has no cloud AI, bank connection, analytics or external data service. Local suggestions and insights are descriptive prompts, not financial advice.

## Data and local storage

The application continues to use IndexedDB `tapledger-db`, schema version 3, with its existing stores and indexes. New payment method information is an optional transaction property; older backups and records can omit it. Export new backups as `Voltura`; restore still accepts `Voltura`, `Vellum`, `Cairn` and `TapLedger`. Backups merge records into the current database; they do not clear it. Keep an exported backup before changing browser profiles or domains.

