# VOLTURA v14 — Money in motion

**Brand:** VOLTURA  
**Tagline:** Money in motion.  
**Runtime:** Static HTML, CSS and JavaScript. No build step, npm install, React runtime or third-party component package is required.

VOLTURA is a local-first personal finance PWA for recording income, expenses and transfers; managing accounts, budgets and savings goals; and viewing spending patterns. It is designed for INR and Indian number formatting. Your transactions, accounts, budgets and goals stay in this browser's IndexedDB storage; VOLTURA does not connect to banks or initiate payments.

## Run locally on Windows

1. Extract this folder to a normal directory, for example `C:\Voltura`.
2. Double-click `RUN-LOCAL-WINDOWS.bat`.
3. Keep the terminal window open while using the app.
4. Visit `http://localhost:8000/` in Chrome or Edge.
5. Stop the server with `Ctrl+C`.

Opening `index.html` directly with `file://` is not recommended because service workers and some browser storage features require a secure context. `localhost` is treated as a secure development origin by modern browsers.

## Deploy to the existing GitHub Pages project

The established GitHub Pages URL is `https://dakshj0305.github.io/Tapledger/`. The public URL/repository slug is intentionally not changed in this package; changing a GitHub Pages project slug would be a separate hosting migration.

1. Open the currently deployed app in the same browser profile.
2. In **Data & settings**, choose **Backup JSON** and store the file outside the repository.
3. Extract this ZIP.
4. Open the existing `dakshj0305/Tapledger` repository.
5. Upload the **contents** of the `voltura-finance-v14` folder to the repository root (not the enclosing folder).
6. Replace the existing app files and commit to `main`.
7. Wait for the GitHub Pages workflow to complete, then open the URL and hard-refresh (`Ctrl+Shift+R`).
8. If an old service worker remains, unregister it in DevTools → Application → Service Workers and reload. Do not clear IndexedDB just to refresh the UI.

## Preserved behaviour and compatibility

- IndexedDB database: `tapledger-db` (kept intentionally to retain existing local data).
- IndexedDB schema version: `3` (no schema migration needed).
- NFC expense shortcut: `?a=1`.
- NFC income shortcut: `?i=1`.
- Legacy expense shortcut: `?add=1`.
- JSON import supports VOLTURA plus legacy Vellum, Cairn and TapLedger backups.
- CSV and JSON exports are named `voltura-*` and new JSON backups identify the app as `Voltura`.
- Existing voice consent, export, restore and delete-all flows remain.
- New service-worker cache: `voltura-platform-v14`; it cleans old Vellum/VOLTURA app-shell caches during activation but does not clear IndexedDB.

## Main features

- Income, expense and transfer entries.
- Account balances from opening balances and entries recorded in the app.
- Monthly and category budgets with progress states.
- Savings goals and goal contributions.
- Cash-flow charts, category breakdowns and recent ledger activity.
- Search, sorting, CSV export and JSON backup/restore.
- NFC URL shortcuts for quick entry.
- Optional voice entry only after explicit user consent.
- Responsive layout, keyboard focus states and reduced-motion support.

## Important limitations

VOLTURA is a manual record-keeping tool, not a bank, payment processor, tax adviser or investment adviser. It does not fetch balances or verify transactions. Accuracy depends on the records entered. Browser storage can be removed by clearing site data or losing the browser profile; export backups regularly. Voice recognition may use an external browser/vendor service when enabled.

## QA

See `QA-REPORT.md` for the release checks performed on this package. The report distinguishes code-level/browser interaction tests from hosting checks that require deployment to the GitHub Pages project.
