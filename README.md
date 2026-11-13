# VOLTURA — Personal finance, made simple.

**Current source release: V27.1** · 13 November 2026

VOLTURA is a small, local-first personal finance app. It helps you record income, expenses and transfers, see your account balances, set monthly budgets and review recent transactions.

## Keep it simple
- Four everyday destinations: Overview, Transactions, Accounts and Budgets.
- One clear Add transaction action.
- Short entry form: amount, type, category, date, account and optional merchant/note.
- Search and filter the transaction list.
- Export CSV, back up JSON and restore JSON from Data & privacy.
- No sign-up, bank connection, ads or external runtime services.

## Privacy and data
Transactions and related records stay in this browser using IndexedDB. The app does not connect to banks. Browser data can be cleared by device/browser settings, so use Backup JSON periodically. A backup from one origin must be restored after moving to another domain.

## Motion
GSAP 3.15.1 and ScrollTrigger are locally hosted. They add a short dashboard entrance, one-time section reveals, restrained view transitions and a budget-progress reveal. Motion is disabled when the device requests reduced motion; all content and interactions remain available without GSAP.

## Netlify
This is a static site. No build command is required; publish directory is `.`. Deploy the extracted project root containing `index.html`.

## Quick-entry links
- `/?a=1` opens a focused expense form.
- `/?i=1` opens a focused income form.

## Local checks
- `node build-css.cjs`
- `node --test build-css.test.cjs finance-core.test.cjs restore-transaction.test.cjs simple-app.test.cjs`
- `node --check app.js` (and the other runtime JavaScript files)

The V27.1 visual refresh uses a matte ink-and-volt-lime palette, clearer type hierarchy and a two-column desktop overview that collapses cleanly on mobile. No remote runtime assets are required.\n\nThis app is a personal record-keeping tool, not a bank feed or professional financial advice service.