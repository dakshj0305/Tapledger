# VOLTURA V22.0 visual QA checklist

## Source checks
- [x] Existing project preserved; no template/framework rewrite.
- [x] All local CSS/JS references exist.
- [x] Service-worker precache contains the V22 stylesheet.
- [x] Responsive rules cover desktop, tablet and mobile breakpoints.
- [x] Reduced-motion, reduced-transparency and forced-colors rules remain present.
- [x] Mobile More sheet includes Budgets and Savings Goals.
- [ ] Rendered browser review at 320, 360, 412, 768, 1024, 1280, 1440, 1920 and 2560px.
- [ ] Real 200% zoom and keyboard-only browser pass.
- [ ] Physical Galaxy S23 FE / NFC / Android keyboard pass.

## Functional regression
- [x] Existing source tests pass.
- [x] IndexedDB schema tests pass unchanged.
- [x] Additive restore regression tests pass.
- [ ] Persistent browser IndexedDB restore test.
- [ ] Full quick-entry / undo / NFC flow in a real browser.

## Manual review
1. Open Overview with no records and inspect every empty state.
2. Add fabricated income and expenses, then inspect populated charts, category legend and recent activity.
3. Switch Dark, Light and System appearance.
4. Resize across the widths listed above and check horizontal overflow/clipped copy.
5. Open More on mobile and verify Budgets, Goals, Accounts, Intelligence, Reports, Automations and Settings.
6. Open quick expense/income from the URL shortcuts and verify the sheet remains readable with the Android keyboard visible.
