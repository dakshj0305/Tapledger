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


## 2026 interaction refresh

The presentation layer now includes a higher-contrast dark palette, restrained translucent surfaces, responsive pointer ambience, a scroll progress indicator, reveal-on-scroll transitions, and passive wheel/trackpad gesture sensing. These are progressive enhancements; native scrolling and all finance flows remain usable without them. Motion respects `prefers-reduced-motion`.

The refresh deliberately adds no remote runtime, font, analytics, or API. GSAP is not bundled in this source package; the motion layer uses native browser APIs to preserve the offline-first and no-third-party-script constraints. If GSAP is later approved, vendor a reviewed local build and update the CSP/service-worker allowlist rather than loading it from a CDN.

## Automated verification

This project has no build-time npm dependencies. With Node.js 18 or newer, run the dependency-free source and finance tests from the project directory:

```sh
for f in *.js; do node --check "$f" || exit 1; done
node --test finance-core.test.cjs project-integrity.test.cjs release-audit.test.cjs
sha256sum -c SHA256SUMS.txt
```

See `AUDIT-REPORT.md` for the latest audit scope, results, corrections and remaining manual QA requirements. Passing source tests does not replace real-browser, device, accessibility or legal review.
