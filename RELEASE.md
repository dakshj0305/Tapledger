# VOLTURA release — GitHub Pages

- Deployment target: `https://dakshj0305.github.io/Tapledger/`
- NFC expense shortcut: `https://dakshj0305.github.io/Tapledger/?a=1`
- Quick expense saves a normal `transactions` record with `source: "nfc"` and refreshes the same ledger/dashboard.
- IndexedDB database remains `tapledger-db`, schema version 3.
- This archive is configured for the existing GitHub Pages subpath; no `CNAME` or custom-domain DNS is required.

NFC hardware note: screenshot identifies MIFARE Ultralight EV1, 48-byte user memory, NfcA/MifareUltralight/NdefFormatable. If detected only as NdefFormatable, format as NDEF before writing. If the tag refuses even a tiny NDEF record after formatting, it may be write-protected or faulty. Do not lock it.
