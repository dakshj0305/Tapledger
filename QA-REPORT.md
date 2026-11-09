# VOLTURA v17 QA report

- Package prepared for custom apex domain `voltura.finance`.
- Root CNAME file present.
- PWA manifest start_url and scope set to `/` for the apex-domain root deployment.
- Canonical URL and Open Graph URL set to `https://voltura.finance/`.
- NFC URL generation remains relative to the live origin and therefore resolves to `https://voltura.finance/?a=1` after deployment.
- IndexedDB database remains `tapledger-db`, schema version 3. Note: browser storage is origin-specific; JSON export/import is required to move records from the GitHub Pages origin.
- DNS, GitHub Pages custom-domain verification, HTTPS certificate issuance and live deployment require the user's registrar and GitHub account; they are not claimed as completed here.
