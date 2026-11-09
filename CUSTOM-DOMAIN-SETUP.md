# VOLTURA custom domain: voltura.finance

This release is prepared for the apex domain `https://voltura.finance/` on GitHub Pages.

## 1. Add the domain at GitHub

1. Open the GitHub repository that currently publishes VOLTURA (the old Pages project was `dakshj0305.github.io/Tapledger`).
2. Go to **Settings → Pages → Custom domain**.
3. Enter `voltura.finance` and save.
4. Keep the repository's Pages source/build settings unchanged. GitHub should create/update the repository's `CNAME` file; this release includes the matching `CNAME` file too.
5. After DNS has propagated and GitHub verifies the domain, enable **Enforce HTTPS** in the same Pages settings.

You must have control of the domain's registrar/DNS account. The domain registration itself is not included in this project.

## 2. Set DNS at your domain registrar

For an apex/root domain (`voltura.finance`), remove conflicting parking/forwarding A or AAAA records and add these GitHub Pages records:

| Type | Host/Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `dakshj0305.github.io` |

If the registrar does not support AAAA records, configure the four A records first. Do not point the `www` CNAME at the old project path; CNAME targets are hostnames, not URLs. The apex domain is the canonical address for this release.

DNS can take time to propagate. GitHub Pages domain verification and certificate provisioning may take additional time; do not assume HTTPS is ready until GitHub shows it as available.

## 3. Deploy this release

Upload the contents of this folder to the same GitHub repository/branch/folder configured in **Settings → Pages**, commit, and wait for the Pages deployment to finish. Keep `CNAME` at the published site root. Do not upload the containing `voltura-finance-v17` folder as an extra nested directory.

## 4. Test before changing the NFC card

1. Open `https://voltura.finance/` and confirm the secure lock icon.
2. Open `https://voltura.finance/?a=1`; the quick expense window should open.
3. Open Automations in VOLTURA; its Expense URL should now display `https://voltura.finance/?a=1` automatically because it is generated from the current site address.
4. Test adding a small expense and confirm it appears in the ledger.
5. Only after that, rewrite the NFC card with `https://voltura.finance/?a=1`.

## 5. Data and origin note

The app remains local-first and the IndexedDB database name/schema remain `tapledger-db` / version 3. However, browser storage is origin-specific: `https://voltura.finance` is a different origin from `https://dakshj0305.github.io`. Existing local records will not automatically appear on the new domain. Before switching, export a JSON backup from the old site; after the new domain is live, use the app's Restore function to import it. Keep the old site available until you have verified the import and your NFC flow.

## Official reference

GitHub Pages custom-domain and DNS instructions: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
