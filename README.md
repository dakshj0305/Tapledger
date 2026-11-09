# VOLTURA

Static, local-first personal finance workspace.

## Publish on GitHub Pages
Upload the contents of this folder to the existing `dakshj0305.github.io/Tapledger` repository and publish from the repository root. This release is configured for `https://dakshj0305.github.io/Tapledger/` (no custom domain).

## NFC quick expense
Write this URL as an NFC URI record: `https://dakshj0305.github.io/Tapledger/?a=1`

In NFC Tools: Write → Add a record → URL/URI → paste URL → Write. If the tag is detected as `NdefFormatable` only, format it as NDEF first (NFC Tools → Other → Format memory, if offered), then write the URI. Never choose Lock/Make read-only.

The MIFARE Ultralight EV1 has 48 bytes of user memory. The URI is 43 UTF-8 bytes as text and is typically stored more compactly as an NDEF URI record; if the writer reports insufficient space, use a shorter HTTPS redirect URL or a higher-capacity NTAG215/216 tag.

Scan with the phone unlocked. The browser opens VOLTURA; `?a=1` opens quick expense capture. Saving adds an ordinary expense to the same local ledger. NFC does not bypass the phone lock screen or store transaction data.

## Data
Transactions are stored locally in the browser. Export a JSON backup periodically. Browser storage is origin-specific.
