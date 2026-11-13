# VOLTURA V26.0 — Source Audit & Hardening Addendum
**Audit date:** 2026-11-13  
**Audited package:** `VOLTURA-V26.0-UNIFIED.zip`  
**Resulting artifact:** `VOLTURA-V26.0-HARDENED-20261113.zip`

## Scope
Reviewed the shipped vanilla HTML/CSS/JavaScript PWA, finance helpers, IndexedDB access layer, restore transaction, service-worker strategy, manifest, local asset graph, test suite, and the two user-supplied React component examples.

The source package is not a React/shadcn/Tailwind/TypeScript project. It is a static vanilla PWA. The React TSX components were not copied into production because doing so without a framework/build pipeline would produce non-runnable source and introduce remote/WebGL dependencies contrary to the local-first architecture.

## Defects fixed in this pass

1. **Unsafe budget threshold arithmetic:** `usedPaise * 100` and `limitPaise * 80` could exceed JavaScript's safe integer range. Threshold comparison now uses `BigInt` after validating both inputs as non-negative/safe integers.
2. **Invalid budget inputs:** negative, fractional, unsafe, or invalid limits now produce the explicit `unset` state instead of a misleading warning/within state.
3. **Impossible calendar dates in unusual-spend analysis:** regex-only date validation accepted impossible dates such as February 30. The analyzer now validates the actual calendar date and computes the 12-month cutoff with leap-day-safe month/day clamping.
4. **Invalid weekly report period:** invalid month inputs now return an empty result rather than constructing a nonsensical date range.
5. **Invalid weekly report records:** malformed dates and unsafe/negative amounts are excluded from report totals.
6. **Weekly sum overflow:** if a weekly total exceeds `Number.MAX_SAFE_INTEGER`, the helper throws an explicit `RangeError` rather than returning a silently imprecise financial total.
7. **IndexedDB availability:** database initialization now explicitly rejects with a descriptive error if IndexedDB is unavailable, instead of failing with an opaque reference error.
8. **Atomic batch-write failure handling:** batch writes now validate their operation list and abort an already-open IndexedDB transaction if scheduling any operation throws synchronously. This prevents previously queued operations from accidentally committing after a partial scheduling failure. Error/abort completion is guarded against duplicate settlement.

## Regression coverage added
Four new finance-helper tests cover:
- safe-integer budget threshold boundaries;
- invalid month/date/amount handling in weekly reports;
- explicit failure on aggregate overflow;
- impossible dates in unusual-expense detection.

## Verification performed
- `node --test *.test.cjs`: **52 passed, 0 failed**.
- `node --check` on all eight root JavaScript files: **8 passed**.
- `node build-css.cjs`: completed successfully; the dedicated CSS build regression test passed.
- Focused release-audit, project-integrity, restore-transaction and CSS-build tests: **36 passed, 0 failed**.
- SHA-256 manifest regenerated and checked by the release-packaging test.
- ZIP CRC/integrity verified after packaging.

## Not certified / still requires browser or device access
- Full application runtime using a real browser origin and persistent IndexedDB.
- Failure injection for quota exhaustion, blocked upgrades, browser storage eviction, and transaction abort on physical browsers.
- Service-worker install/update/offline relaunch on Chrome, Safari and Firefox.
- Android/iOS installation, virtual keyboard/visual viewport, NFC tag dispatch/read/write.
- Keyboard-only and screen-reader manual review; axe scan; deployed Lighthouse performance.
- Hosting headers, CSP behavior on actual deployment, HTTPS install and GitHub Pages path behavior.

The current environment has previously blocked local browser navigation and cannot perform physical NFC/device testing. No claims are made that these checks passed.

## Preservation
- IndexedDB database name/version and object stores unchanged.
- No user financial records, account records or browser database were opened or altered.
- Integer-paise representation retained.
- JSON restore remains additive and transactional.
- Existing NFC quick routes and local-only PWA architecture retained.
- No CDN, external script, external font or remote runtime added.
- No GitHub push or deployment performed.

## React component integration decision
The supplied `FullScreenScrollFX` and `LiquidMetalButton` TSX components are not integrated directly. Their source-level issues and incompatibilities are documented separately in the user-facing triage. The full-screen pinned ScrollTrigger scene is not suitable for the current native-scroll financial dashboard. Any future GSAP work should use the official local package, native scrolling, `gsap.matchMedia()` cleanup and reduced-motion conditions.
