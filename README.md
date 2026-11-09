# TapLedger v3 — Personal Finance Studio

**Direction:** hybrid editorial light + cinematic dark. Warm ivory working surface, deep forest-green navigation and hero panels, terracotta accents, champagne details, Cormorant Garamond display type, Manrope UI typography and IBM Plex Mono financial labels.

TapLedger v3 is a local-first personal finance web app designed for GitHub Pages and Android NFC quick capture.

## What's included

- Overview: monthly income, expenses, net cash flow, six/twelve-month cash-flow comparison, expense mix, budgets, recent activity and savings-goal snapshot.
- Ledger: add, edit, delete, search, filter and sort income, expenses and transfers.
- Budgets: overall and per-category monthly guardrails with progress and overspend indication.
- Savings goals: target amount, amount already saved, target date, progress and contribution logging.
- Intelligence: savings rate, daily spending pace, month-on-month pace comparison, category observations, budget pace, simple monthly projection and likely recurring-merchant detection.
- Automations: NFC URLs for quick expense (`?a=1`) and quick income (`?i=1`), browser voice-entry prefill where Web Speech API is supported, plus merchant-based category suggestions.
- Data controls: CSV export, JSON backup/restore and confirmed deletion of all local app data.
- PWA manifest and service worker for installability and offline app-shell caching.

## Upgrade from your current TapLedger website

Your published site is `https://dakshj0305.github.io/Tapledger/`.

1. **Back up first.** Open the current TapLedger site, use its JSON backup/export option and save the file somewhere safe.
2. Download and extract this v3 ZIP on your Windows computer.
3. Open the existing GitHub repository `dakshj0305/Tapledger`.
4. Upload the contents of the extracted `tapledger-platform-v3` folder to the repository root. Replace `index.html`, `app.js`, `style.css`, `manifest.webmanifest`, `sw.js` and the `icons` folder with the new versions.
5. Commit the changes to the `main` branch.
6. Open the repository's **Actions** tab and confirm the latest GitHub Pages deployment succeeds.
7. Visit `https://dakshj0305.github.io/Tapledger/` and force-refresh with `Ctrl + Shift + R`.

**Keep the same repository, origin, URL path and browser profile.** The app keeps the existing IndexedDB database name `tapledger-db`; on first launch it creates the new ledger stores and migrates old `expenses` and `monthlyBudgetPaise` data. It deliberately does not delete the old v1 store during migration.

Do not clear browser site data as a cache-refresh step; that can delete the locally stored financial records. Use a hard refresh first. Keep the JSON backup as your safety copy.

## NFC setup

After v3 is live, use NFC Tools → Write → Add a record → URL/URI.

- Quick expense: `https://dakshj0305.github.io/Tapledger/?a=1`
- Quick income: `https://dakshj0305.github.io/Tapledger/?i=1`

The MIFARE Ultralight EV1 has 48 bytes of user memory. NDEF URI prefix compression reduces the stored URL payload, and the short expense URL may fit, but the final byte count depends on NDEF record/TLV overhead and current tag formatting. Let NFC Tools confirm the write and then scan the tag again to verify. Do not permanently lock the tag. If it reports insufficient memory, use a shorter redirect URL on a domain you control or add a compatible larger NFC tag.

## Data model

Transactions are stored as integer paise to avoid floating-point money arithmetic. Transaction types are `income`, `expense` and `transfer`. Transfers are visible in the ledger but are excluded from income, expenses and net cash-flow calculations. Savings-goal contributions are goal-progress records, not actual bank transfers; record the corresponding movement in the ledger when needed.

## Privacy and limitations

- Transactions, budgets and goals remain in the current browser's IndexedDB. There is no bank connection, cloud sync or TapLedger account.
- Clearing browser site data can erase records. Export JSON backups regularly.
- Voice capture uses the browser's Web Speech API where available; speech handling and availability depend on the browser and operating system and may involve their speech service.
- Recurring-payment detection is a transparent heuristic: it flags a merchant appearing in at least two distinct months with amounts within roughly 15%. It is a review prompt, not a confirmed subscription detector.
- Spending insights are deterministic descriptions of recorded history, not financial advice or guaranteed predictions.
- The monthly pace projection extends the current daily average; it does not model seasonality or future events.

## Technology

Vanilla HTML, CSS and JavaScript; IndexedDB; inline SVG icons and CSS charts; PWA manifest; service worker. No analytics tracker, bank API or external chart library. Google Fonts are optional; local serif/sans/monospace fallbacks are defined.
