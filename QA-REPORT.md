# VOLTURA QA report — current package audit

See `AUDIT-REPORT.md` for the scope, corrections, and explicit unverified areas.

## Automated checks

Run from this directory:

```sh
node --check app.js
node --check finance-core.js
node --check quick-boot.js
node --check motion-ui.js
node --check scroll-story.js
node --check liquid-metal.js
node --check sw.js
node --test finance-core.test.cjs project-integrity.test.cjs release-audit.test.cjs
sha256sum -c SHA256SUMS.txt
```

The two original test suites and the added release-audit suite are dependency-free and run with Node's built-in test runner.

## Data safety

The app continues to use IndexedDB `tapledger-db`, schema version 3. This audit did not open, migrate, clear, or modify any user database. No database migration is part of this package.

## Manual QA still required

- Browser-rendered desktop and mobile layout, interaction, and console errors.
- Entry create/edit/delete, transfer, undo, budgets, goals, accounts, import/restore/export, and legacy backup compatibility.
- PWA install, service-worker update, and offline relaunch.
- Keyboard, screen reader, forced-colors, reduced-motion, zoom, and complete rendered contrast checks.
- NFC tag read/write and Android URL handling on target hardware.

These are unverified, not passed.
