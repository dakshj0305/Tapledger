# VOLTURA v16 QA report

## Static checks
- JavaScript syntax checked with Node.
- HTML pages parsed; duplicate IDs checked.
- CSS parsed with a brace-balance check.
- PWA manifest and service-worker cache references checked against package files.
- ZIP integrity checked after packaging.
- IndexedDB database name and schema intentionally remain `tapledger-db` / version 3.

## NFC expense flow contract
- URL `?a=1` and legacy `?add=1` route to the quick expense dialog after database load.
- Dialog autofocuses the amount field; date defaults to today.
- Last category/account are restored from local settings; merchant text can suggest a category until the user manually chooses one.
- Save validates amount/date/account, writes a regular expense transaction with `source: "nfc"`, reloads transactions, and calls the same `renderAll()` used by the dashboard.
- Duplicate submits are guarded while saving.

## Browser testing limitation
Automated live browser interaction testing was not available in the prior run due to the environment's Chromium navigation restriction. Verify on the target phone after HTTPS deployment: scan tag with screen unlocked, enter amount, save, then confirm the transaction appears in the main ledger and overview. Test offline launch after first successful load.
