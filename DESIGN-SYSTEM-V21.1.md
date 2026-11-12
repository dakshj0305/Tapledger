# VOLTURA Design System — V21.1.1.1

Build identifier: `VOLTURA-21.1.1-20261112`

## Design intent

VOLTURA is an editorial, dark-first personal-finance workspace: precise, calm, tactile and private. The visual language is based on a deep ink/forest foundation, restrained citrus-lime actions, confident typography and clear numeric hierarchy. It deliberately avoids the generic white-admin-template look.

## Core palette

| Token | Dark | Light | Intended use |
|---|---|---|---|
| `--v-bg` | `#0B1211` | `#F2F4EE` | App canvas |
| `--v-surface` | `#15211D` | `#FBFCF8` | Cards and primary surfaces |
| `--v-surface-2` | `#1B2B25` | `#F1F5ED` | Raised/secondary surfaces |
| `--v-ink` | `#F1F5EB` | `#17251D` | Main text |
| `--v-muted` | `#A2B1A6` | `#53645A` | Supporting text |
| `--v-faint` | `#73877A` | `#5D6E62` | Small labels; still ≥4.5:1 on canvas |
| `--v-lime` | `#D7F36A` | `#B9DC50` | Primary action accent |
| `--v-green` | `#8BD5AA` | `#216B4C` | Income/positive data |
| `--v-red` | `#FF9B91` | `#A83E37` | Expense/negative data |
| `--v-amber` | `#F0C879` | `#80540C` | Warnings |

## Typography and numbers

- System UI sans-serif stack; no remote fonts.
- Tabular numerals for money and percentage values.
- Large balance figures use a tighter, heavier hierarchy than labels.
- Monospaced type is reserved for metadata, dates and small technical labels.

## Surfaces and glass budget

- Solid surfaces are the default for cards and long lists.
- Dashboard glass is limited to the sidebar/navigation surface, sticky chapter rail and monthly cash-flow hero (no more than three visible layers).
- Blur target: 10px, within the requested 8–12px range.
- Quick-entry sheet, text inputs and long transaction lists remain opaque.
- Reduced-transparency and forced-colors modes remove blur and restore solid system surfaces.
- No decorative noise or ambient glow was added.

## Layout

- Desktop: persistent left workspace navigation and a centered, readable content region.
- Dashboard: masthead/reporting period, net cash-flow hero, tracked-position/savings row, cash-flow and budget comparison, category mix and recent transactions, then local insight and savings goal.
- Mobile: single-column content and a bottom dock with Overview, Ledger, Add, Intelligence and More. Secondary destinations remain available in More.
- Quick Add stays accessible from the top action and the central mobile dock action.

## Interaction and motion

- Existing native CSS/JS motion remains dependency-free.
- No new GSAP dependency, WebGL, React migration or pinned scroll scene.
- Reduced-motion preferences are respected.
- Mobile dock adapts when the visual viewport indicates the software keyboard is open.
- The quick-entry sheet is excluded from glass and decorative motion.

## Accessibility intent

- Semantic controls and existing dialog focus management retained.
- Focus rings remain visible and use a dedicated focus token.
- Income and expense use both colour and signs/labels.
- Cash-flow chart retains its accessible data table alternative.
- Contrast token pairs are documented in `CONTRAST-REPORT-V21.1.md`.

## Implementation

The design is implemented in `voltura-visual-system.css`, loaded after the existing styles. The final cascade bridge intentionally overrides only the old global flat-mode declarations on the components included in the current design direction. Existing legacy CSS files are retained; no file was deleted.


### V21.1.1 accessibility fallback note

The final cascade explicitly uses `@supports not (backdrop-filter:blur(1px))` for solid surfaces in unsupported browsers. Reduced-transparency mode keeps the navigation rail dark with light text and switches the chapter rail to a solid theme surface. Forced-colors rules are placed last so system colors win over subsequent presentation tokens.
