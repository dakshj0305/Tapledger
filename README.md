# VOLTURA preview v3 (standalone; NOT your v19 project)
Own database `voltura-preview-db`; never touches `tapledger-db`. Do not copy over v19. Backups from this app restore only into this app.
## Run
Serve the folder over localhost or HTTPS (`npx serve`). Open /, /?a=1 (expense), /?i=1 (income).
## Screens
Home (month totals, budget bar, weekly bars, 7-day comparison, recent), Ledger (search, filter, delete), More (budget, vibration, JSON backup/restore, CSV, delete all, how to use), bottom bar on phones, side rail on desktop.
## Not included / not verified
Edit-in-place, accounts, transfers, goals, voice, import of v19/TapLedger backups, month-end report. Not tested in a browser or with a real NFC tag. Privacy/Terms are drafts for lawyer review.
