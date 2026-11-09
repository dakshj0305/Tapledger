# VOLTURA v14 — QA report

## Release scope
This release changes the product identity, interface theme, motif, install icons and service-worker cache generation. It preserves the existing local data model and core record-keeping logic.

## Checks performed
- `node --check app.js` — passed.
- `node --check sw.js` — passed.
- Python HTML parser — all four HTML pages parsed without parser exceptions.
- Static HTML audit — 175 IDs in `index.html`, no duplicate IDs, no missing `label[for]` targets.
- CSS parser (`tinycss2`) — no parse errors in `style.css` or `legal.css`.
- Manifest — valid JSON; all listed PWA icon files exist.
- Service-worker shell — all declared app-shell files exist.
- Local references — all relative HTML assets resolve within the package.
- Data compatibility contract — `DB_NAME='tapledger-db'`, `DB_VERSION=3`; no database rename or schema migration.
- NFC query shortcuts — expense `?a=1`, income `?i=1`, and legacy `?add=1` handling remain in the app.
- Backup compatibility — new backups identify as `Voltura`; restore still accepts `Vellum`, `Cairn` and `TapLedger` exports.
- PWA icons — custom VOLTURA artwork exported at 192px and 512px, including maskable variants.
- Browser automation — attempted; blocked by the environment administrator policy described below.
- ZIP integrity — verified on the final release archive with `unzip -t`.

## Browser test limitation
A Playwright browser run was attempted, but the installed Chromium environment has an administrator URL blocklist of `*`, which blocks both localhost HTTP and local-file navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. This is an environment policy, not an application runtime error. As a result, automated in-browser interaction tests (adding records, visual viewport checks and service-worker activation) could not be completed in this environment. The local app should still be opened in a normal Chrome/Edge profile before publishing.

## Manual smoke test before deployment
1. Open the app on `http://localhost:8000/` or its HTTPS GitHub Pages URL.
2. Confirm the VOLTURA logo, hero wordmark, Volt Orbit endpoint, new icons and matte graphite/mineral palette render correctly at desktop and mobile widths.
3. In Data & settings, create a JSON backup before testing any changes to existing local records.
4. Add an income entry and an expense entry. Confirm the ledger, net cash flow, accounts and charts update.
5. Add an account, budget and savings goal, then verify each appears in its section after a reload.
6. Export CSV and JSON; check that filenames use `voltura-*` and the JSON app field is `Voltura`.
7. Restore a copy of a known legacy Vellum/TapLedger backup in a test browser profile and verify that records import.
8. Test `?a=1`, `?i=1` and `?add=1` on a compatible mobile device.
9. Confirm `prefers-reduced-motion` disables ambient hero animation.
10. Load once online, then test offline reopening after service-worker installation.

## Not claimed
The app has not been deployed to GitHub Pages from this package. Live-host behavior, HTTPS deployment, NFC hardware behavior and actual browser interaction on the target phone remain to be checked by the project owner.
