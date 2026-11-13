# VOLTURA — Personal finance, made clear.

**Current source release: V26.0** · 13 November 2026

VOLTURA is a local-first personal-finance Progressive Web App (PWA) for recording income, expenses and transfers; reviewing accounts, budgets and savings goals; and understanding cash flow. It uses static HTML, CSS and vanilla JavaScript. It has no analytics, advertising, remote fonts or third-party runtime dependencies.

## Current release

V26.0 brings the Observatory, Kinetic Relic, Stitch and Atelier design directions together as one coherent product: editorial financial hierarchy, matte mineral surfaces, deep-pine navigation, chartreuse action accent, restrained coral indexing, selective 3D/Canvas detail and consistent light/dark appearance.

- `voltura.css` is the only stylesheet loaded at runtime. Rebuild it from the maintained local CSS layers with `node build-css.cjs`.
- NFC/URL quick-entry routes `?a=1`, `?i=1` and `?add=1` open the focused entry dialog before dashboard rendering. Save remains disabled until local storage and handlers are ready.
- Existing finance workflows, integer-paise arithmetic, IndexedDB V3 and legacy backup compatibility are preserved.
- Motion is progressive, local and reduced-motion aware. GSAP is not bundled in this release; no remote CDN is used.
- The Stitch references remain under `design-reference/stitch/` for traceability.

See `RELEASE-REPORT-V26.0.md`, `CHANGELOG-V26.0.md` and `QA-REPORT-V26.0.md` for exact scope and verification boundaries.

## Run locally

Use a local HTTP server rather than opening `index.html` as a `file://` URL:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000/`. On Windows, `RUN-LOCAL-WINDOWS.bat` starts a local server when Python is installed. NFC and installed-PWA URL handling require HTTPS and target-device testing.

## GitHub Pages target

The documented project-site target is:

`https://dakshj0305.github.io/Tapledger/`

Keep project files at the repository root and preserve relative `./` paths. The quick-entry routes are `?a=1`, `?i=1` and `?add=1`. `.nojekyll` is included. See `GITHUB-UPLOAD-GUIDE.md` before publishing.

The release ZIP is an upload-ready source folder, not an archive GitHub automatically expands. Extract it first. For an existing GitHub repository, copy the extracted files into the existing clone to retain its original `.git` history. Do not replace original GitHub history with the reconstructed bundle supplied separately.

## NFC quick expense

1. Publish at the HTTPS GitHub Pages path above.
2. Open VOLTURA → Automations and copy the generated expense URL ending in `?a=1`.
3. Write the full URL as a URL/URI record to a compatible, writable NFC tag. Do not permanently lock the tag during testing.
4. Tap the tag with the phone unlocked. Android/browser/PWA link capture varies by device and installation state and must be tested on the target hardware.
5. The focused entry surface opens. Enter and save the transaction; it is stored in the same `transactions` store used by the dashboard and ledger.

The tag stores a URL shortcut, not transaction data. It cannot bypass the lock screen or browser security. A previous tag in the supplied project history failed even when writing a simple test record; this package does not claim every NFC tag is writable.

## Offline and storage behavior

The service worker caches the app after a successful online visit and successful cache installation. A first-ever visit with no network cannot load an uncached app. IndexedDB is origin-specific and remains local to the browser profile.

**Data compatibility is intentionally frozen:** database name `tapledger-db`, IndexedDB version `3`, existing stores/key paths/indexes and record shapes. Financial amounts remain integer paise. New JSON exports are tagged `Voltura`; restore accepts `Voltura`, `Vellum`, `Cairn` and `TapLedger`. Restore is additive: existing primary keys win, incoming duplicates are skipped and imports are applied in one transaction. This source-package work did not open or modify an existing user database.

Before moving to a different origin/domain, export a JSON backup from the old origin and restore it on the new origin. Do not use `voltura.finance` until domain ownership and DNS configuration are confirmed.

## Privacy, security and legal notes

No app analytics, ads, external scripts, remote fonts or app cookies are included. Optional browser speech recognition may send audio/speech data to a browser or vendor service after the user opts in. Review `privacy.html`, `terms.html` and `cookies.html`; these are drafts, not legal advice or a completed Indian-law review.

GitHub Pages does not let this repository define every HTTP response security header. The entry page contains a meta CSP, but meta CSP is not a substitute for server response headers in all cases. This package is not a security certification. Review the VOLTURA name against relevant trademark registers before a public launch.

## Automated verification

With Node.js 18 or newer:

```sh
node build-css.cjs
for f in *.js *.cjs; do node --check "$f" || exit 1; done
node --test *.test.cjs
sha256sum -c SHA256SUMS.txt
```

Automated tests cover finance helpers, quick-boot routing, data-safe restore behavior, static integrity, PWA/offline assets, CSS build reproducibility and package checksums. Passing tests do not replace real-browser, assistive-technology, physical-device, security or legal review. See `QA-REPORT-V26.0.md` for the executed results and unverified items.
