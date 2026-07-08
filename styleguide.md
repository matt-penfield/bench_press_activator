# Style Guide — Slalom Bench Press Design System

Reference sourced from the [Hackathon Hub](https://bench-press.static.slalom.com/hackathon.html) production app.

## Colors

### Brand Primary
- **Slalom Blue:** `#0C62FB`
- **Dark Blue:** `#002FAF`
- **Cyan:** `#1BE1F2`
- **Coral:** `#FF4D5F`
- **Purple:** `#C7B9FF`
- **Chartreuse:** `#DEFF4D`

### Accent Lights (backgrounds / highlights)
- **Blue Light:** `#E8F0FF`
- **Cyan Light:** `#D1F9FC`
- **Coral Light:** `#FFDBDF`
- **Purple Light:** `#F4F1FF`
- **Chartreuse Light:** `#F8FFDB`

### Neutrals (Slate scale)
- **Slate 900 (text):** `#0F172A`
- **Slate 700:** `#334155`
- **Slate 600:** `#475569`
- **Slate 500:** `#64748B`
- **Slate 400:** `#94A3B8`
- **Slate 200 (borders):** `#E2E8F0`
- **Slate 100:** `#F1F5F9`
- **Slate 50:** `#F8FAFC`

### Surfaces
- **App background:** `#F4F4F6`
- **Soft surface:** `#F8F9FC`
- **White:** `#FFFFFF`

### Legacy (mapped to new values)
- **Light Gray:** `#E6E6E6`
- **Dark Gray:** `#666666`
- **Black:** `#000000`

## Typography

### Font Stack
- **Sans (primary):** `"Nunito Sans", system-ui, -apple-system, sans-serif`
- **Serif (accent/emphasis):** `"Lora", Georgia, serif`
- **Mono (data/code):** `"DM Mono", "SF Mono", Menlo, monospace`

### Usage
- **Headings:** Nunito Sans, Bold (700) or Extra Bold (800)
- **Body:** Nunito Sans, Regular (400), 16px base, line-height 1.5
- **Eyebrow labels:** Nunito Sans, Extra Bold (800), 11px, 2.5px letter-spacing, uppercase, Slalom Blue
- **Serif emphasis:** Lora italic (400), Slalom Blue — used for key phrases in headings
- **Tabular numbers:** `font-variant-numeric: tabular-nums` for data columns

### Google Fonts Import
```
https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Mono:wght@400;500&display=swap
```

## Spacing

- Base unit: `8px`
- Component padding: `16px`, `24px`, `32px`
- Section gaps: `32px–48px`

## Border Radius — "The Slalom Cut"

Asymmetric top-right radius only, giving a distinctive angular shape:

- **Cards / containers:** `0 24px 0 0`
- **Buttons:** `0 12px 0 0`
- **Badges / pills:** `0 8px 0 0`
- **Inputs:** `0 6px 0 0`

## Shadows

- **XS:** `0 1px 2px rgba(0,0,0,.04)`
- **SM:** `0 2px 6px rgba(0,0,0,.05)`
- **MD:** `0 8px 20px rgba(0,0,0,.06)`
- **LG:** `0 16px 36px rgba(0,0,0,.08)`
- **Hover:** `0 12px 36px rgba(0,0,0,.09)`

## Motion & Easing

- **Ease out:** `cubic-bezier(.22,1,.36,1)` — smooth deceleration for reveals
- **Spring:** `cubic-bezier(.34,1.56,.64,1)` — slight overshoot for interactions

### Keyframes
- `fadeUp` — 14px translateY entrance
- `pop` — scale 0.92 → 1 with opacity
- `slideIn` — 40px translateX entrance
- `pulse` — cyan glow ring for live indicators

## Tone & Voice

- Clear, confident, human
- Action-oriented, not jargon-heavy
- Inclusive and empowering

## UI Principles

- Clean, spacious layouts with generous whitespace
- Asymmetric "Slalom cut" radius as brand signature
- Dark slate (`#0F172A`) for text, not pure black
- Accent color used sparingly — eyebrows, serif emphasis, badges
- Data-forward: let content lead, minimize chrome
- Antialiased text (`-webkit-font-smoothing: antialiased`)

---

*Source: Extracted from bench-press.static.slalom.com/hackathon.html (July 2026)*
