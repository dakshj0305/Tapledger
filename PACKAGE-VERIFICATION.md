# VOLTURA package verification — 2026-11-12

## Package

The release archive contains the complete static application at `Tapledger-main/`, with canonical PWA assets in `icons/`, root-level source files, and dependency-free Node test files. It excludes duplicate unreferenced root icon copies, `node_modules`, browser caches, user data, credentials, and Git metadata.

## Verification performed

- All root JavaScript files pass `node --check`.
- All 18 Node tests pass across finance-core, project integrity, and release-audit suites.
- All local `src` and `href` references in the HTML pages resolve.
- All service-worker precache paths exist in the package.
- PWA manifest parses and all declared icons exist; the VOLTURA mark and all four PNG app icons were refreshed.
- `SHA256SUMS.txt` matches every listed file in the final project tree. The checksum manifest intentionally does not hash itself.
- ZIP integrity check reports no compressed-data errors.
- IndexedDB remains `tapledger-db`, schema version 3; no migration or user-data modification was performed.

## Not verified

Browser-rendered behavior (including the visual repair layer), browser console/network traces, complete IndexedDB workflows, service-worker offline relaunch/update, device NFC behavior, accessibility audits, full visual responsive QA, Lighthouse/performance measurements, deployment headers, and legal compliance remain unverified. Chromium headless did not complete in the available environment, so no browser-pass claim is made. See `AUDIT-REPORT.md`.
