# V27.1 product decisions

## Main path
1. Open Overview.
2. Tap Add transaction.
3. Choose Expense or Income.
4. Enter amount, category, date and account.
5. Save. The overview and Transactions list update.

## Everyday navigation
- Overview
- Transactions
- Accounts
- Budgets
- Data & privacy (settings)

## Intentionally not promoted
Savings goals, local pattern detection, reports, automations/NFC management, voice entry, decorative animation, coach-style language and long editorial content are not part of the primary experience. Legacy data stores are preserved for compatibility; the simplification does not silently erase user data.

## Motion budget
GSAP and ScrollTrigger provide a short dashboard entrance, one-time budget/recent-activity reveals, restrained navigation transitions and a budget progress reveal. No looping motion, parallax, pinned sections, scroll hijacking or animated counters. Reduced-motion preference disables the enhancement. All content remains visible if GSAP is unavailable.

## Data safety
- Existing IndexedDB database name, version and stores are unchanged.
- Export CSV for a spreadsheet.
- Backup JSON before clearing browser data or changing the published domain.
- Restore JSON on the new domain; browser storage is origin-specific.