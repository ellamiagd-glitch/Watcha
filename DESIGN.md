# WhosView — Design System

A content-first, dark, premium aesthetic for a social watching app
(Spotify-style presence + Letterboxd-style lists). Derived with the UI/UX
Pro Max ruleset. Keep every new screen consistent with this.

## Principles
- **Content first.** Posters and people are the UI. Chrome stays quiet.
- **Black, white, blue, red.** Near-black canvas, white type, blue brand, red
  for live presence. A faint blue glow top-right, red glow lower-left.
- **Presence feels alive** — "watching now" uses a pulsing red dot (an on-air
  REC light), never colour alone.

## Color tokens (see `tailwind.config.ts`)
| Token | Value | Use |
|-------|-------|-----|
| `ink` | `#050507` | app background base (black) |
| `panel` | `#0d0e14` | cards / surfaces |
| `panel2` | `#151824` | raised surfaces, inputs |
| `line` / `line2` | white @ 8% / 15% | borders, dividers |
| `txt` | `#F4F5F7` | primary text / white (≥ 4.5:1 on panels) |
| `muted` | `#9aa0ad` | secondary text (≥ 3:1) |
| `brand` | `#2f6bff` | blue — primary actions, active nav, logo |
| `live` | `#ff3b4e` | red — live / "on air" presence |

Color is never the only signal — presence pairs red with a pulsing dot and
the word "Watching"; services pair their brand colour with a text label.

## Type
- **Inter** for UI/body. **Space Grotesk** (`font-display`) for headings + wordmark.
- Base 16px, line-height 1.5. Scale: 12 / 14 / 16 / 18 / 24 / 32.
- Weight carries hierarchy: 600–700 headings, 500 labels, 400 body.

## Spacing & layout
- 4/8px rhythm. Section spacing tiers 16 / 24 / 32 / 48.
- Desktop: fixed left sidebar + centred content (max-w-6xl).
- Mobile (< 1024px): sidebar becomes a bottom nav (≤ 5 items).
- `min-h-dvh`, no horizontal scroll, safe-area padding on the bottom nav.

## Components
- `card`, `chip`, `btn-primary`, `btn-ghost`, `nav-item(-active)` — see `globals.css`.
- Icons: **inline SVG only** (`components/icon.tsx`), 1.75 stroke, never emoji.
- Posters & avatars: generated duotone art keyed off the title/name
  (`lib/ui.ts`). Rights-clean and never broken; real artwork swaps in later.

## Interaction & a11y
- Touch targets ≥ 44px. Visible focus rings (brand @ 2px).
- Transitions 150–300ms, transform/opacity only; honour `prefers-reduced-motion`.
- Active nav location always highlighted; nav placement identical on every page.
