# VOLTURA V22.0 contrast report

Calculated from the CSS hex values in `voltura-visual-overhaul.css` using WCAG relative luminance. These are token/surface pair calculations, not a complete computed-style audit of every rendered state.

| Pair | Foreground / background | Contrast | WCAG AA normal text |
|---|---|---:|---|
| Dark body text | `#F5F7F1` / `#0B1110` | 17.66:1 | Pass |
| Dark muted body text | `#C0CBC1` / `#0B1110` | 11.39:1 | Pass |
| Dark panel body text | `#F4F7F0` / `#17231C` | 15.00:1 | Pass |
| Dark panel secondary text | `#C2CEC3` / `#17231C` | 9.98:1 | Pass |
| Lime hero foreground | `#172116` / `#D9F477` | 13.56:1 | Pass |
| Light body text | `#17251C` / `#F3F5EF` | 14.51:1 | Pass |
| Light muted text | `#43564A` / `#FFFFFF` | 7.87:1 | Pass |
| Insight surface text | `#17251B` / `#E5F0DC` | 13.54:1 | Pass |
| Primary action foreground | `#172116` / `#D9F477` | 13.56:1 | Pass |

## Limitations

- This report evaluates selected declared color pairs only.
- CSS inheritance, hover/disabled states, user-selected forced colors, charts, icons and rendered compositing need browser inspection.
- The lime hero intentionally uses dark text; the goal feature intentionally uses pale text over forest.
