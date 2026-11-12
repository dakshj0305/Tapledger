# VOLTURA — Personal finance, made clear.

**Current source release: V25.1** · 13 November 2026

VOLTURA is a local-first personal-finance Progressive Web App (PWA) for recording income, expenses and transfers; reviewing accounts, budgets and savings goals; and understanding cash flow. The application is intentionally built with static HTML, CSS and vanilla JavaScript. It requires no framework build step and has no analytics, advertising, remote fonts or third-party runtime dependencies.

## Current release

V25.1 hardens the Kinetic Relic release: a high-contrast midnight instrument language, oversized display typography, luminous orbital geometry, pointer-responsive depth and procedural canvas rendering.

- The supplied Stitch references for Overview, Accounts, Transactions Ledger, Budgets, the financial-intelligence design direction and the VOLTURA monogram are retained under `design-reference/stitch/`.
- The live app has a first-pass shared visual layer: forest-green/chartreuse branding, editorial headings, clearer surface pairings, responsive wrapping and selective glass. Forms, transaction rows and dense data panels stay opaque for legibility.
- The supplied “Smarter Growth” video is used as a motion reference: calm staggered reveals and restrained editorial pacing, not a literal marketing-page copy.
- Liquid-metal-style pointer lighting and click feedback are implemented with local CSS/JavaScript. The supplied React/WebGL button is documented but is not installed as a React component.
- Scroll chapter navigation and reveal effects use native scrolling, IntersectionObserver and CSS fallbacks. The supplied full-screen React ScrollTrigger component is not installed; pinned full-screen scrolling is deliberately not used in the finance UI.
- V24.0 adds restrained 3D pointer tilt, specular highlight tracking, richer card elevation, atmospheric depth and a luminous scroll-progress accent. These effects are local CSS/JavaScript, disabled for reduced-motion and touch-first layouts, and never use WebGL.
- Motion remains progressive enhancement; no remote animation runtime is loaded.
- All finance logic, routes, backup compatibility and the existing IndexedDB identity/schema are preserved.

See `RELEASE-REPORT-V25.1.md`, `RELEASE-REPORT-V22.2.md`, `AUDIT-REPORT.md`, `QA-REPORT.md`, `CHANGELOG-V22.2.md` and the integration notes for detail and limitations.

## Run locally

Use a local HTTP server (recommended) rather than opening `index.html` as a `file://` URL:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000/`. On Windows, `RUN-LOCAL-WINDOWS.bat` starts a local server when Python is installed. NFC and installed-PWA URL handling require an HTTPS origin and device testing.

## GitHub Pages target

The configured project-site target documented by the source is:

`https://dakshj0305.github.io/Tapledger/`

Keep the project files (including `index.html`, `sw.js`, `manifest.webmanifest`, stylesheets, scripts and `icons/`) at the repository root. Preserve relative `./` asset paths and the quick-entry routes `?a=1`, `?i=1` and `?add=1`. `.nojekyll` is included. See `GITHUB-UPLOAD-GUIDE.md` before publishing.

The ZIP is an upload-ready **source folder**, not an archive that GitHub automatically expands into a repository. Extract it first. For an existing GitHub repository, clone that repository and copy the extracted files into the clone so its existing `.git` history is retained. Do not replace the repository's history with the optional reconstructed bundle supplied separately.

## NFC quick expense

1. Publish the project at the HTTPS GitHub Pages path above.
2. Open VOLTURA → Automations and copy the generated expense URL ending in `?a=1`.
3. In an NFC writing app, write the complete URL as a URL/URI record to a compatible, writable NFC tag. Do not permanently lock the tag during testing.
4. Tap the tag with the phone unlocked. Android/browser/PWA link capture varies by device and installation state and must be tested on the target hardware.
5. The page opens the quick expense sheet. Enter and save the transaction; it is stored in the same `transactions` store used by the dashboard and ledger.

The tag stores only a URL shortcut, not transaction data. It cannot bypass the lock screen or browser security. A previous tag in the supplied project history failed even when writing a simple test record; this package makes no claim that every NFC tag is writable.

## Offline and storage behavior

The service worker caches the app after a successful online visit and successful cache installation. A first-ever visit with no network cannot load an uncached app. IndexedDB is origin-specific and remains local to the browser profile.

**Data compatibility is intentionally frozen:** database name `tapledger-db`, IndexedDB version `3`, the existing object stores/key paths/indexes and record shapes are retained. Financial amounts continue to use integer paise. New JSON exports are tagged `Voltura`; restore accepts the legacy `Voltura`, `Vellum`, `Cairn` and `TapLedger` tags. Restore is additive: existing primary keys win, incoming duplicates are skipped, and imports are applied in one transaction. No existing user database was opened or modified during this source-package audit.

Before moving to a different origin or domain, export a JSON backup from the old origin and restore it on the new origin. Do not use `voltura.finance` until domain ownership and DNS configuration have been confirmed.

## Privacy, security and legal notes

No application analytics, ads, external scripts, remote fonts or app cookies are included. Optional browser speech recognition may send audio/speech data to a browser or vendor service after the user opts in. Review `privacy.html`, `terms.html` and `cookies.html`; these are draft pages, not legal advice or a completed Indian-law review.

GitHub Pages does not let this repository define every HTTP response security header. The entry page contains a meta CSP, but meta CSP is not a substitute for server response headers in all cases. This package is not a security certification. Review the VOLTURA name against relevant trademark registers before a public launch.

## Automated verification

No build-time npm dependencies are required. With Node.js 18 or newer, run:

```sh
for f in *.js; do node --check "$f" || exit 1; done
node --test *.test.cjs
sha256sum -c SHA256SUMS.txt
```

The automated suite checks finance helpers, data-safe restore behavior, static integrity, PWA/offline asset references, release metadata and package checksums. Passing source tests does not replace real-browser, assistive-technology, device, security or legal review. The latest executed results and items not tested are recorded in `QA-REPORT.md`.
