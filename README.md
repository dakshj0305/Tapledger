# Vellum v11 — Local-first Personal Finance Studio

**Brand:** Vellum  
**Tagline:** Every rupee, in perspective.  
**Runtime:** Static HTML, CSS and JavaScript. No build step, npm install, React runtime or third-party component package is required.

Vellum is a local-first personal finance PWA for recording income, expenses and transfers; managing accounts, budgets and savings goals; and viewing explainable spending patterns. It is designed for INR and Indian number formatting.

## Run locally on Windows

1. Extract this folder to a normal directory, for example `C:\\Vellum`.
2. Double-click `RUN-LOCAL-WINDOWS.bat`.
3. Keep the black terminal window open while using the app.
4. Visit `http://localhost:8000/` in Chrome or Edge.
5. Stop the local server with `Ctrl+C` in the terminal.

The script uses Python's built-in static HTTP server (`py` or `python`). Opening `index.html` directly with `file://` is not recommended because service workers and some browser storage features require a secure context. `localhost` is treated as a secure development origin by modern browsers.

## Deploy to the existing GitHub Pages site

The established repository/site URL is intended to remain `dakshj0305/Tapledger` / `https://dakshj0305.github.io/Tapledger/`.

1. Open the existing Vellum site in the same browser profile.
2. In Data & privacy, use **Backup JSON** and keep the downloaded file outside the repository.
3. Extract this ZIP.
4. Open the existing `dakshj0305/Tapledger` repository.
5. Upload the **contents** of the `vellum-finance-v11` folder to the repository root. Do not upload the containing folder as a nested directory.
6. Replace the existing app files and commit to `main`.
7. Wait for the latest GitHub Pages workflow to complete successfully.
8. Open the existing site and hard-refresh with `Ctrl+Shift+R`.
9. If an older service worker is still controlling the page, use DevTools → Application → Service Workers → unregister the old worker, then reload. Do not clear IndexedDB or all site data just to refresh the UI.

The base URL and NFC action query parameters remain unchanged. Existing physical NFC cards should not need rewriting if they already point to this same site URL with a supported action query.

## Integrated visual interactions

- **GlyphPortal-inspired wordmark:** the VELLUM letters enter with a staggered reveal and respond to pointer movement with a damped spring. The supplied wrapper referenced a `GlyphPortal` implementation that was not included; Vellum implements the observable wordmark direction natively, not the unavailable component's internal scroll/annotation behavior.
- **GlassWorkspace-inspired material:** the real Vellum cash-flow surface supports Quiet, Forest and Deep presets plus blur, tint blend, saturation and edge controls. Settings are stored locally in IndexedDB under `glass-material-v1`; they do not change financial records.
- **KineticGrid-inspired portal:** a Canvas 2D grid uses edge pinning, pointer displacement, exponentially smoothed movement, decaying radial ripples and a damped-spring letter response. It is decorative and not required to use the app. It respects `prefers-reduced-motion`, pauses when the page is hidden and stops its animation loop when the pointer and springs have settled.

The effect is a physics-inspired visual simulation. It is not a physical measurement, financial forecast or claim of exact fluid dynamics.

## Compatibility kept

- IndexedDB database: `tapledger-db`.
- IndexedDB schema version: `3` (unchanged).
- Existing stores and migration behavior retained.
- NFC expense shortcut: `?a=1`.
- NFC income shortcut: `?i=1`.
- Legacy expense shortcut: `?add=1`.
- Vellum, Cairn and TapLedger JSON restore compatibility retained.
- Existing voice-consent, data-export and delete-all flows retained.
- Glass appearance is stored in the existing `settings` store; no schema upgrade is made.

## Local storage and privacy summary

- Financial records are stored in IndexedDB in the browser profile for this site.
- The service worker caches only the static same-origin app shell in Cache Storage.
- The app source does not set or read cookies, localStorage or sessionStorage.
- No analytics, advertising, remote images, web fonts, external scripts, social widgets or third-party component libraries are included.
- The app's service worker uses `fetch` only for same-origin app-shell requests. It does not upload ledger records.
- Optional voice entry uses the browser's SpeechRecognition API after explicit user opt-in. The browser/vendor speech service may process microphone audio or recognized speech outside this device. Voice is optional; manual and NFC entry do not require it.
- Clipboard access is only used after the user selects a copy-shortcut action, and copies the Vellum NFC URL.

See `privacy.html`, `terms.html` and `cookies.html`. These are drafts and must be reviewed by a lawyer qualified in Indian law before publishing. Complete publisher/contact/effective-date placeholders before publishing legal pages.

## Files

- `index.html`, `style.css`, `app.js` — static app.
- `sw.js` — service worker and app-shell cache `vellum-platform-v11`.
- `manifest.webmanifest` — PWA metadata.
- `privacy.html`, `terms.html`, `cookies.html`, `legal.css` — legal drafts.
- `icons/` — locally packaged Vellum app icons and mark.
- `BRAND.md` — visual identity.
- `COMPONENT-INTEGRATION.md` — source-to-app integration notes.
- `INTEGRATION-NOTES.md` — architecture and implementation boundaries.
- `QA-REPORT.md` — checks performed and items still requiring device/live testing.
- `RELEASE.md` — release summary.

## Important use notes

- Account balances are calculated from opening balances and records entered by the user; Vellum is not connected to a bank and does not verify balances.
- Goal contributions update goal progress only; the UI explains that they do not create a bank transfer.
- Recurring-merchant and spending observations are heuristic, descriptive prompts. Review them rather than treating them as confirmed subscriptions or financial advice.
- Export backups periodically. Clearing browser site data can erase local records.
