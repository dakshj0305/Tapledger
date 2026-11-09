# Vellum v7 — Release contents

This is the complete static-hosting release. Upload the contents of this directory to the root of the existing GitHub Pages repository.

## Files
- `index.html` — application structure and dialogs
- `style.css` — responsive visual system and layout
- `app.js` — IndexedDB, ledger, accounts, budgets, goals, insights, NFC shortcuts, import/export
- `sw.js` — versioned offline app-shell cache (`vellum-platform-v7`)
- `manifest.webmanifest` — installable PWA metadata
- `icons/` — application icons and mark
- `README.md` — installation, data model, migration and limitations
- `BRAND.md` — identity and design tokens
- `QA-REPORT.md` — test coverage and remaining device checks

## Compatibility
Database: `tapledger-db`, schema version 3. Existing TapLedger/Vellum local data is retained through the migration logic. Keep the existing GitHub Pages origin and path. Export a JSON backup before upgrading.
