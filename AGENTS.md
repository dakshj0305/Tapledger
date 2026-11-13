# VOLTURA V27.0 project instructions

VOLTURA is a static, local-first personal-finance app. Keep it small, direct and easy to use. Do not add a new framework or expand the feature set without an explicit request.

## Product scope
The everyday interface has four destinations:
- Overview
- Transactions
- Accounts
- Budgets

The primary action is Add transaction. Keep the entry path short: type, amount, category, date, account, optional merchant/note, save. Do not add tours, AI/coach copy, fake insights, decorative pricing, feature carousels or promotional hero sections.

## Data safety
- Preserve IndexedDB database name `tapledger-db` and schema version 3 unless a migration is necessary and fully tested.
- Preserve existing stores, keys, indexes, migration markers and backup compatibility.
- Continue importing older backups tagged `TapLedger`, `Cairn` and `Vellum`; write new exports as `Voltura`.
- Do not delete, reset, rename or silently migrate user data.
- Use integer paise for monetary arithmetic; validate amounts to ₹10 crore and two decimal places.
- Keep CSV export and JSON backup/restore available in Data & privacy.

## Quick entry
- Preserve `?a=1` for expense and `?i=1` for income quick-entry URLs.
- Focus the amount field when safe; do not interfere with assistive technology or mobile keyboards.
- Keep optional merchant/note fields secondary to amount, type, category and account.
- Do not request microphone access. Voice entry is not part of V27.

## Design and accessibility
- Use a calm, compact, task-first interface with clear labels, readable contrast and consistent spacing.
- Avoid decorative 3D, parallax, pinned scroll sections, looping animations, gradients, blur and glass effects.
- GSAP 3.15.1 and ScrollTrigger may be used only for subtle, non-essential motion. The app must work fully without them.
- Respect `prefers-reduced-motion` and keep all content visible when motion is disabled.

## Deployment
- Static site; Netlify publish directory is `.` and no build command is required.
- Keep scripts, styles, fonts and GSAP self-hosted. Do not add remote runtime dependencies.
- The service worker cache list and version must be updated whenever runtime assets change.

## Verification
Run:
- `node build-css.cjs`
- `node --test build-css.test.cjs finance-core.test.cjs restore-transaction.test.cjs simple-app.test.cjs`
- `node --check` on every runtime JavaScript file.