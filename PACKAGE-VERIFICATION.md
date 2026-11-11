# VOLTURA package verification

## Scope

Copied the current source-root project files and `icons/` into this folder. Updated only this copy to match documented Palette A in explicit light, explicit dark, and system-dark modes; aligned browser/manifest theme colors; advanced service-worker cache key to v19.5. Retained the V-cut editorial composition and mobile-first quick-entry screens.

## Data and compatibility

No persistence or transaction code changed. `app.js` and `quick-boot.js` are byte-for-byte unchanged copies. IndexedDB remains `tapledger-db`, version 3; no migration or financial-data access occurred. Integer-paise arithmetic, legacy backup tags (`TapLedger`, `Cairn`, `Vellum`), new `Voltura` exports, `?a=1`, `?i=1`, and relative manifest routes remain in unchanged code/configuration.

## Package exclusions

Excluded the standalone `voltura-preview/`, backups, screenshots, data, tool/agent folders, skill lock file, secrets, caches, `node_modules`, and Git metadata. There was no source-root `CNAME` to copy. No external URLs or network requests were added.

## Verification

- PASS: Node syntax checks for `app.js`, `quick-boot.js`, and `sw.js`.
- PASS: `manifest.webmanifest` parses as JSON; `./` scope/start URL and `./?a=1`, `./?i=1` shortcuts confirmed.
- PASS: static checks for NFC route handlers, DB name/version, backup tags, paise field, history replacement, local asset references, and service-worker stylesheet precache/cache version.
- PASS: CSS brace balance and Palette A light/dark/system-dark token checks.
- PASS: 28 package files; ZIP contains all 28 entries, keeps project files at archive root with only `icons/` nested, and all entries decompress to their recorded sizes.
- PASS: SHA-256 matched all 23 original top-level source files against the before-copy values. Original root files remain unchanged.

Browser-rendered visuals, end-to-end form workflows, browser accessibility, physical NFC, offline relaunch, legal review, and deployment/live-site behavior are **UNVERIFIED**. No commit, push, merge, or deployment was made.
## V20 implementation package verification — 2026-11-11

This separate copy now contains the implemented application features, `finance-core.js`, and two dependency-free Node test files. The archive is rebuilt from the package contents, with application source files and both test scripts at archive root; only `icons/` is nested. No backup folders, credentials/secrets, browser profile/cache, screenshots, `.git`, or `node_modules` are included. The 23 original root source-file SHA-256 values are compared with the recorded pre-copy hashes in the final package review; they remain outside the archive.

Node syntax and static/finance helper tests pass. Actual browser rendering and end-to-end persistence/backup interactions remain untested because no UI automation surface was available and Firefox headless could not launch its tab process. See `QA-REPORT.md` for the per-check status.

