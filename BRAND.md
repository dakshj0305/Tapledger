# VOLTURA brand system v18.1

**Positioning:** A local-first personal finance workspace designed around quick capture and calm review.

## Tagline options

1. **Turn every rupee into clarity.** — chosen; describes the complete loop from quick recording to later review without promising financial outcomes.
2. **See where money moves.** — plain-language and descriptive, but less distinct.
3. **Tap. Track. Understand.** — action-led and short, but less specific to personal finance.

## Identity mark

The original VOLTURA mark is a single solid, angular V built as an inline SVG path in `index.html` and as `icons/voltura-mark.svg`. It uses one colour, no gradients or external assets, and the same geometry is used in the raster PWA icons. It is intended to remain legible at 16 px, 48 px and 512 px; verify those sizes on light and dark backgrounds before public launch.

## Visual direction: loud, flat, matte with controlled shine

- Flat means solid colour planes: no gradients, glassmorphism, blur, noise or glow.
- Matte means large surfaces have no soft shadows.
- Controlled shine is a single crisp, hard-edged highlight/facet on the primary action or identity mark.
- Loud means a saturated volt-lime action colour, large amount type and clear hierarchy.
- Income and expense remain distinguished by signs and labels, not colour alone.

## Palette and contrast

| Role | Light | Dark | Intended use |
|---|---|---|---|
| Background | `#F3F4EC` | `#10171D` | Main canvas |
| Surface | `#FFFFFF` | `#1D2831` | Cards and forms |
| Raised surface | `#FAFBF6` | `#253540` | Inputs and secondary panels |
| Text | `#10171D` | `#F3F4EC` | Primary text |
| Muted text | `#4D5964` | `#C0CCD5` | Supporting text |
| Primary | `#D9FF36` | `#D9FF36` | Main action |
| On primary | `#10171D` | `#10171D` | Text on volt lime |
| Accent / focus | `#005FCC` | `#8EC8FF` | Links and focus ring |
| Positive | `#006B4F` | `#72D2AE` | Income and positive status |
| Negative | `#B42318` | `#FF8C80` | Expense and error |
| Warning | `#865800` | `#F0C36B` | Warning status |
| Border | `#66727A` | `#71828D` | Control boundaries |

Computed WCAG contrast ratios for the primary pairings (relative-luminance calculation): light text/background 16.31:1; light muted/background 6.48:1; light positive/background 5.90:1; light negative/background 5.94:1; light warning/background 5.56:1; light focus/background 5.40:1; light border/background 4.46:1; dark text/background 16.31:1; dark muted/background 11.05:1; dark positive/background 9.93:1; dark negative/background 8.01:1; dark warning/background 10.95:1; dark focus/background 10.20:1; dark border/background 4.54:1; dark border/surface 3.77:1; dark border/raised surface 3.18:1; on-primary/text on volt-lime 15.75:1. These are token-pair calculations; not a substitute for measuring every rendered state in a browser.

## Typography and layout

Use system sans-serif fonts; no remote fonts or CDN calls. Figures use tabular numerals. Mobile inputs are at least 16 px to avoid browser zoom. Mobile touch controls are at least 44×44 px. Safe-area insets are respected by the quick sheet.

## Motion and haptics

Use short transform/opacity transitions only. `prefers-reduced-motion` disables non-essential motion and defaults vibration feedback off. Vibration uses `navigator.vibrate()` only after a user action and never replaces visible or `aria-live` feedback. Browser/device support varies; Android Chrome support must be confirmed on hardware, and iOS Safari does not expose the same vibration API.

## Data compatibility

Keep IndexedDB as `tapledger-db`, version 3. This internal name is retained intentionally so existing local data remains reachable. New downloadable backups identify as `Voltura`; restore continues to accept legacy `TapLedger`, `Cairn` and `Vellum` tags.

## Naming clearance

“Voltura” may already be used by other businesses. A trademark search through IP India and relevant international registers is required before public launch. Availability is not claimed.
