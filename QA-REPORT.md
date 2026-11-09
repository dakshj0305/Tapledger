# Vellum v7 — Engineering QA report

## Checks run in this build environment

- `node --check app.js` — passed.
- HTML parsed successfully; 134 unique IDs; no duplicate IDs.
- Static JavaScript DOM ID references were checked; the only non-static IDs are first-entry buttons intentionally rendered dynamically.
- Browser interaction simulation in headless Chromium with a deterministic IndexedDB test double — passed without application JavaScript errors.
- Legacy TapLedger database migration simulated from DB version 2 — old expenses and monthly budget migrated; legacy expenses placed in a historical-only account, excluded from net-position totals.
- Income, expense, account creation, asset transfer, liability purchase/payment, transaction edit/delete, budget creation, goal creation/contribution, over-contribution rejection, invalid date rejection, invalid precision rejection, backup restore, CSV export, JSON backup, NFC URL generation and data deletion flows exercised.
- Service-worker cache key is versioned and cleanup is scoped to older `vellum-platform-*` caches so unrelated same-origin caches are not intentionally deleted.

## Not verified in this environment

- Live GitHub Pages deployment and browser cache behavior on the user's real browser.
- Physical MIFARE Ultralight EV1 NDEF write/read, Android NFC launch behavior and tag capacity.
- Voice capture on the user's Android/browser and actual notification/microphone permission dialogs.
- Real IndexedDB behavior across all Android WebView/Chrome versions; automated interaction used a deterministic test double because the browser runner blocks local-origin navigation.

## Known product limits (not hidden defects)

- This is local-first: no bank feeds, automatic bank balance verification, cloud sync or multi-device sync.
- Voice capture depends on the browser's Web Speech API and may use a browser/provider speech service.
- Recurring-payment review is heuristic, not confirmed subscription detection.
- Savings-goal contributions update goal progress only; record the corresponding transfer separately if you want account balances to reflect it.
- Financial insights are descriptive rules and pace estimates, not professional financial advice or guaranteed forecasts.

A zero-defect guarantee is not technically possible. Test the deployed build on the target Windows and Android devices before relying on it for important financial records. Keep periodic JSON backups.
