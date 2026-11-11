# VOLTURA preview v2 (standalone, NOT v19)
Uses its own IndexedDB `voltura-preview-db`; it never touches `tapledger-db`. Do not copy these files over v19. Serve the folder over localhost/HTTPS (`npx serve`) and test /?a=1 and /?i=1.
Included: dark-first theme (light via system setting), quick-add sheet with undo, weekly bars + table alternative, 7-day comparison line, unusual-spend note (>150% of prior same-category mean, needs 5 prior), JSON backup, draft privacy/terms.
Not included: accounts, transfers, budgets, goals, restore/CSV, bottom nav/desktop rail, vibration toggle, first-run screen, PNG icons, self-hosted font. Not tested in a browser or on NFC.
