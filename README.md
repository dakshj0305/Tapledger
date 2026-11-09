# Vellum v7 — Personal Finance Studio

**Tagline:** Every rupee, in perspective.

Vellum is a local-first personal finance workspace. This release adds a tracked-account balance model and hardens data handling while retaining the existing `tapledger-db` database and NFC URL pattern.

## Modules
- Overview: current-month income, expenses, net cash flow, 6/12-month chart, expense category mix, overall/category budgets, recent entries and a goal snapshot.
- Ledger: income, expenses and transfers; add, edit, delete, search, filter and sort. “Clear this month” removes current-month activity only after confirmation; budgets and savings goals remain intact.
- Accounts: cash/bank/wallet assets and credit/loan liabilities. Balances are derived from opening balances and ledger movements. Legacy pre-account transactions are grouped into an “Imported history” account and excluded from live net-position calculations because their starting balances are unknown. Transfers move value between tracked accounts and do not count as income or expense.
- Budgets: overall and category monthly limits.
- Savings goals: targets, saved-so-far, target dates and manual progress contributions. Contributions are goal progress only; they do not move money between accounts.
- Intelligence: savings rate, daily spend pace, same-period prior-month comparison, simple month-end pace estimate, category observations and heuristic repeat-merchant review.
- Automations: NFC expense URL `?a=1`, NFC income URL `?i=1`, optional browser speech-to-form prefill, merchant category suggestions and repeat-merchant review.
- Data: CSV export, JSON backup/restore, confirmed local data deletion.
- PWA: app-shell caching for offline use after first successful load.

## Important data model
- Monetary values are integer paise internally; individual inputs are capped at ₹10 crore to keep values within the app’s safe integer range. Input parsing avoids floating-point conversion drift and displays up to two fractional rupees when present.
- Transfers are excluded from income, expenses and net cash flow. They affect the source and destination account balances.
- Asset account balance = opening balance + income − expenses + transfers in − transfers out.
- Liability balance (amount owed) = opening amount owed − credits/refunds − payments + card purchases.
- Net tracked position = sum of asset balances − sum of liability balances.
- Opening balances must be entered by the user. Default accounts start at zero; this app does not fetch real bank balances.
- Savings goal contributions are not bank transfers and are not included in cash-flow calculations.

## Upgrade your existing GitHub Pages site
Your existing repository is `dakshj0305/Tapledger`; preserve the repository URL and path so the existing card URL and browser database continue to work.

1. Open the current Vellum site in the same browser profile and download a JSON backup.
2. Extract this ZIP on Windows.
3. Upload the **contents** of the `vellum-finance-v7` folder to the root of `dakshj0305/Tapledger`, replacing the prior app files. Keep the `icons/` folder.
4. Commit to `main`; wait for the GitHub Pages deployment action to succeed.
5. Open `https://dakshj0305.github.io/Tapledger/` and hard-refresh with `Ctrl+Shift+R`. The service worker cache key is bumped to v7.
6. Check that existing transactions remain. Keep the JSON backup; do not clear browser site data.

## Migration and compatibility
- Uses IndexedDB database `tapledger-db`; upgrades to DB version 3 and creates an `accounts` store without deleting `expenses` or `settings`.
- Migrates legacy TapLedger expenses and `monthlyBudgetPaise` settings once, using the `migration-v3-complete` marker and stable legacy IDs. When a v5-era expense record is still present in the old `expenses` store, its matching ledger entry is reclassified as historical without changing its amount/date/category. Deleted ledger entries are not recreated after migration has completed.
- Preserves current transaction records, budgets and goals from the v3/v4/v5 database schema.
- JSON import accepts backups tagged `TapLedger`, `Cairn` or `Vellum`, including legacy `{expenses, monthlyBudgetPaise}` backups and newer `{transactions, budgets, goals, accounts}` backups. Imports are validated before writing.
- Restore is a merge by record ID/name, not a destructive replace.

## NFC card
The existing expense shortcut remains `https://dakshj0305.github.io/Tapledger/?a=1`; income shortcut is the same URL with `?i=1`. The card only stores a URL, not financial records. MIFARE Ultralight EV1 has 48 bytes of user memory; actual NDEF fit depends on URI compression and record overhead. Let NFC Tools confirm the write and read it back. Do not lock the tag.

## Privacy and limitations
- Records stay in IndexedDB in the current browser profile. There is no login, bank connection, server-side storage or cross-device sync.
- Clearing browser site data can erase records; export backups regularly.
- Voice entry uses Web Speech API if supported; it only pre-fills a form and requires user review. Browser speech services may process audio externally.
- Repeat-merchant detection is a heuristic, not confirmed subscription detection.
- Month-end estimates extrapolate the current daily average and are not predictions. Spending observations are prompts, not financial advice.
- The app shell is available offline after successful initial caching, but first-time NFC opening requires the website to be reachable. The service worker only removes older Vellum cache versions; it does not delete unrelated caches on the same GitHub Pages origin.

## Quality checks
The supplied project is intended for static hosting via GitHub Pages. Test actual Android NFC writes and live GitHub Pages behavior on your hardware. This package does not claim a zero-defect guarantee.
