# VOLTURA V22 — Feature inventory and implementation status

This release is a presentation-layer refinement of the uploaded V21 source. Existing application behaviour is retained; no new financial engine or bank integrations are claimed.

## Existing capabilities found in the source

- Local-first IndexedDB persistence and legacy-data migration.
- Overview with monthly income, expenses, net cash flow, cash-flow chart, budget snapshot, category breakdown, recent activity and goal/insight modules.
- Ledger with income, expense and transfer types, search, filters, sorting, edit and delete.
- Accounts with opening balances, calculated balances and account editing/deletion.
- Category budgets with create/edit/delete and spend progress.
- Savings goals with target tracking and contributions.
- Financial intelligence using local rule-based recurring-payment pattern detection.
- NFC-friendly expense and income URL shortcuts (`?a=1`, `?i=1`).
- Quick expense capture, category shortcuts, last-used account preference where supported, optional merchant/notes/date-time, save confirmation, Undo and Add another.
- Optional voice-assisted prefill with explicit consent controls.
- CSV export, JSON backup/restore, current-month clearing and delete-all controls.
- Theme and vibration preferences.
- PWA manifest, service worker and update notice flow.
- Privacy, terms and cookies pages.

## Important scope distinctions

- The source's “Automations” screen provides URL shortcuts and links into existing quick-entry/pattern-review capabilities. It is not a general-purpose scheduled automation engine.
- Recurring payment detection is rule-based local pattern detection, not bank-feed or AI-powered verification.
- The app does not connect to banks or fetch live balances.
- Voice availability depends on browser and operating-system speech-recognition support.
- NFC tag programming and actual device/browser launch behaviour require physical-device verification.

## V22 changes

- Added `voltura-field-notes.css` after the existing visual layers.
- Strengthened the mineral/botanical light palette, editorial typography, navigation, page hierarchy, panel/card treatment, charts and mobile composition.
- Preserved existing `app.js` byte-for-byte from V21.
- Preserved database and business logic by making presentation-only changes.
- Bumped the service-worker cache to V22 and added the new stylesheet to precache.

## Verification status

- Source integrity and asset references: checked by archive inspection.
- JavaScript syntax: to be checked in the build environment.
- Actual browser rendering, interactive workflows, offline installation, and mobile-device behaviour: not verified in this environment.
