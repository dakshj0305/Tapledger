# VOLTURA — Personal finance, made clear.

**Current source release: V26.1.1** · 13 November 2026

VOLTURA is a local-first personal-finance Progressive Web App (PWA) for recording income, expenses and transfers; reviewing accounts, budgets and savings goals; and understanding cash flow. It uses static HTML, CSS and vanilla JavaScript. It has no analytics, advertising, remote fonts or remote runtime dependencies.

## Current release: V26.1.1

V26.1.1 carries the V26.0 unified product design forward and adds a locally hosted GSAP 3.15.1 motion enhancement. The native application remains usable without the animation layer; no CDN is required.

- `voltura.css` is the single runtime stylesheet. Rebuild it from maintained local CSS layers with `node build-css.cjs`.
- GSAP and ScrollTrigger are served from `vendor/gsap/`; `gsap-motion.js` progressively enhances page transitions and scroll-linked details.
- Motion respects the reduced-motion preference. Native scrolling and non-GSAP behavior remain the fallback.
- NFC/URL quick-entry routes `?a=1`, `?i=1` and `?add=1` open the focused entry dialog before normal dashboard boot. Save remains disabled until local storage and handlers are ready.
- Existing finance workflows, integer-paise arithmetic, IndexedDB V3 and legacy backup compatibility are intended to remain unchanged.
- The Stitch references remain under `design-reference/stitch/` for traceability.

See `RELEASE-REPORT-V26.1.1.md` and `QA-REPORT-V26.1.1.md` for the current release scope and verification boundaries. Older V26.0 reports are historical and do not describe the V26.1.1 motion integration.

## Run locally

Use a local HTTP server rather than opening `index.html` as a `file://` URL:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000/`. On Windows, `RUN-LOCAL-WINDOWS.bat` starts a local server when Python is installed. NFC and installed-PWA URL handling require HTTPS and target-device testing.

## GitHub Pages target

The project-site target is:

`https://dakshj0305.github.io/Tapledger/`

Keep project files at the repository root and preserve relative `./` paths. The quick-entry routes are `?a=1`, `?i=1` and `?add=1`. `.nojekyll` is included.

The expected GitHub Pages configuration is **Deploy from a branch → main → /(root)**. This setting is managed in repository Settings → Pages, not by files in this repository. Confirm the latest deployment in the Actions/Pages deployment history after pushing.

For an existing clone, copy extracted release files into the existing clone so its `.git` history is retained. Do not replace original GitHub history with a reconstructed bundle.

## NFC quick expense

1. Publish at the HTTPS GitHub Pages path above.
2. Open VOLTURA → Automations and copy the generated expense URL ending in `?a=1`.
3. Write the full URL as a URL/URI record to a compatible, writable NFC tag. Do not permanently lock the tag during testing.
4. Tap the tag with the phone unlocked. Android/browser/PWA link capture varies by device and installation state and must be tested on the target hardware.
5. The focused entry surface opens. Enter and save the transaction; it is stored in the same `transactions` store used by the dashboard and ledger.

The tag stores a URL shortcut, not transaction data. It cannot bypass the lock screen or browser security.

## Offline and storage behavior

The service worker caches the app after a successful online visit and successful cache installation. A first-ever visit with no network cannot load an uncached app. IndexedDB is origin-specific and remains local to the browser profile.

**Data compatibility is intentionally frozen:** database name `tapledger-db`, IndexedDB version `3`, existing stores/key paths/indexes and record shapes. Financial amounts remain integer paise. JSON restore accepts the supported legacy backup tags and is additive. Before moving to a different origin/domain, export a JSON backup from the old origin and restore it on the new origin.

## Privacy, security and legal notes

No app analytics, ads, remote fonts or remote runtime scripts are included. GSAP and ScrollTrigger are locally hosted vendor files; retain their accompanying third-party notice. Optional browser speech recognition may send audio/speech data to a browser or vendor service after the user opts in. Review `privacy.html`, `terms.html` and `cookies.html`; these are drafts, not legal advice or a completed Indian-law review.

GitHub Pages does not let this repository define every HTTP response security header. The entry page contains a meta CSP, but meta CSP is not a substitute for server response headers in all cases. This package is not a security certification.

## Automated verification

With Node.js 18 or newer:

```sh
node build-css.cjs
for f in *.js *.cjs; do node --check "$f" || exit 1; done
node --test *.test.cjs
sha256sum -c SHA256SUMS.txt
```

These commands must be run against the exact checked-out commit being released. Automated tests do not replace real-browser, assistive-technology, physical-device, security or legal review. See `QA-REPORT-V26.1.1.md` for what has and has not been verified.
