# VOLTURA QA report

- Release configured for the existing GitHub Pages URL `https://dakshj0305.github.io/Tapledger/`.
- Removed custom-domain CNAME and updated canonical/Open Graph URLs.
- PWA manifest start URL and scope set to `/Tapledger/`.
- NFC shortcut is generated from the current page origin/path and uses `?a=1` for quick expense.
- Quick expense uses the existing local transaction store and labels records `source: "nfc"`.
- IndexedDB database/schema preserved: `tapledger-db`, version 3.
- Source-level package inspection only; no live deployment, physical NFC write, or real-phone scan is claimed as tested.
