# VOLTURA reconstruction report — V22.2 checkpoint

Date: 2026-11-11

## Scope

This checkpoint is derived from the supplied V22.1 release copy in a new isolated working directory. The supplied archives and baseline directory were not edited. No live browser profile, IndexedDB database, Git remote, GitHub Pages deployment, or NFC tag was accessed.

## Source lineage reviewed

The intake contains successive TapLedger, Cairn, Vellum and Voltura archives from early TapLedger project packages through V22.1, plus V18.1 OpenCode/GitHub Pages packages, V20/V21/V22 releases, screenshots, field notes, integration notes, AGENTS.md and a 234 MB dated backup archive.

The 19 backup archive contains 14,278 entries, including multiple nested project snapshots and a bundled `design-taste-frontend` skill. It was listed and selectively inspected without executing its scripts. Its Stop hook invokes Node to run `scripts/gate.mjs`; the gate launches subprocesses, manages temporary browser profiles and may remove generated profile/output directories. Other skill scripts launch browsers, make localhost requests, and write/delete screenshot and report files. The skill's `start.mjs` can generate Google Fonts links. It was not run because its side effects and external font behaviour are not appropriate to this local-first, no-external-font project without further approval.

## Reconstructed behaviours

- JSON restore now plans additions against existing primary keys before writing.
- Existing transaction, budget, goal and account keys are preserved; conflicting imported keys are skipped and reported.
- Duplicate keys within one backup are accepted only once.
- Account-name conflicts are case-insensitive, and imported transaction account references are normalized to the existing account's canonical spelling.
- Budget restore checks both ID and category to avoid replacing a different budget or creating duplicate category budgets.
- Legacy migration no longer rewrites a matching current transaction.
- Startup account discovery no longer mutates legacy transaction account classifications.
- Writes for all accepted records remain grouped in one IndexedDB read-write transaction.

## Compatibility invariants

- Database: `tapledger-db`.
- IndexedDB version: `3`.
- Existing stores, key paths and indexes retained.
- Existing migration marker name retained.
- Backup import tags retained: `Voltura`, `Vellum`, `Cairn`, `TapLedger`.
- GitHub Pages project path remains relative to `/Tapledger/`.
- NFC quick routes remain `?a=1`, `?i=1`, with legacy `?add=1` support.
- No new dependency or external service added.

## Files changed

- `app.js` — add-only restore planning; no rewrite of existing matching legacy transactions.
- `finance-core.js` — pure additive-record planner.
- `sw.js` — cache version `voltura-platform-v22.2`.
- `tests/finance-core.test.cjs` — planner collision tests.
- `tests/project-integrity.test.cjs` — source integration and compatibility assertions.
- `tests/restore-fault-injection.test.cjs` — controlled in-memory destructive-overwrite reproduction and regression tests.
- `QA-REPORT.md`, `RELEASE.md`, `README.md` — checkpoint notes.

## Verification

- `node --check app.js` — PASS.
- `node --check finance-core.js` — PASS.
- `node --check sw.js` — PASS.
- `node --test tests/*.test.cjs` — 22 tests passed.
- Source-level schema, manifest, asset, route, CSS and service-worker checks included.

## Not verified

- Real browser IndexedDB transaction commit/abort and restore UI workflow.
- Full backup export/import round-trip with fabricated IndexedDB data.
- Chrome/Edge/Samsung Internet rendering or screenshots.
- Galaxy S23 FE NFC URL capture, tag writeability, TalkBack or keyboard audit.
- Offline first-install, Lighthouse/performance, Git history and deployment.

No commit, push, deployment, domain configuration, destructive database operation or live NFC write was performed.
- PASS: isolated local HTTP server returned HTTP 200 for `/`, `/?a=1`, `/?i=1`, and the core HTML/JS/CSS/manifest/service-worker assets.
