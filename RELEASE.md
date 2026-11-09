# VOLTURA v14 release notes

## Brand and visual system
- Rebranded the visible product to VOLTURA across the app, legal pages, install metadata and package docs.
- Added a custom Voltura orbit mark, matching SVG favicon and PWA icon set.
- Introduced the Volt Orbit motif: one path and one moving waypoint across logo, hero, navigation, section markers and progress states.
- Reworked the visual system around matte graphite/mineral surfaces, electric-lime anodized accents, satin-steel detail, teal income and coral expenses.
- Tightened typography and rectangular surfaces for a loud, flat editorial dashboard.

## Product integrity
- Kept the IndexedDB database name `tapledger-db` and schema version `3`; prior local records remain in the same browser database.
- Kept existing NFC query shortcuts (`?a=1`, `?i=1`, `?add=1`).
- New JSON backup identity is `Voltura`; restore remains compatible with older `Vellum`, `Cairn` and `TapLedger` backups.
- Export filenames now use the `voltura-*` prefix.
- Service-worker cache version is now `voltura-platform-v14`.

## Runtime
- Still a static app; no build chain or remote dependency added.
- Added the Voltura SVG mark and refreshed PWA icons.
- Added mobile-specific layout tuning and reduced-motion handling for the rebranded hero.
