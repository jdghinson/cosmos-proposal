# SearchBar image & color picker panels — design

**Date:** 2026-05-17
**Status:** Approved (design + Approach B + Paper-chrome decision)
**Paper source:** https://app.paper.design/file/01KRKQCX86TJJX44NS389AZXWX/1-0 (frames `261-0` image panel, `276-0` color panel, `26C-0`/`27T-0` active-bar states; `1ZP-0` is the existing search dropdown for reference)

## Goal

Make the two existing, currently-inert buttons in `components/cosmos/SearchBar.tsx` —
"Visual search" (image) and "Color search" (cosmos dots) — open dropdown panels
using the **same open/close interaction as focusing the search input**: the panel
appears below the bar, the bar widens to 601px, and it dismisses on
outside-click / Escape. Panels are **presentational only** (no real upload, no
draggable color handle, no wired search), matching the fidelity of the existing
search dropdown.

## Fidelity decision (approved)

Presentational only. Static visuals; reuse the existing dismissal/focus mechanics.
No file upload, no drag-and-drop, no draggable SV/hue handles, "Search" button is
inert.

## Interaction model

Replace the boolean `open` state in `SearchBar` with a single union:

```ts
type Panel = "search" | "image" | "color" | null;
const [panel, setPanel] = useState<Panel>(null);
```

- Input `onFocus` → `setPanel("search")` (was `setOpen(true)`).
- Visual-search button `onClick` → `setPanel(p => p === "image" ? null : "image")`.
- Color-search button `onClick` → `setPanel(p => p === "color" ? null : "color")`.
- The three panels are mutually exclusive (a single state guarantees this).
- Existing click-outside `mousedown` handler and Escape handler → `setPanel(null)`
  (replace `setOpen(false)`). No new listeners; the existing `ref`/effect is reused
  verbatim except for the setter.
- `!scope` gate is preserved: in `scope` mode the buttons remain decorative (current
  behavior) and no panel opens. Panels render only when `panel === X && !scope`.
- Bar width: the existing expansion condition `open && !scope ? "w-[601px]" : "w-[480px]"`
  becomes `panel !== null && !scope ? "w-[601px]" : "w-[480px]"`. Paper shows both
  pickers at 601px, so any open panel widens the bar.
- Each panel is positioned exactly like the current search dropdown:
  `absolute left-0 right-0 top-[calc(100%+8px)] z-50`.

## Bar (trigger buttons)

While its panel is open, a button shows a **persistent** active state equal to its
current hover token: `bg-surface2 text-fg` (the visual-search button already has
`hover:bg-surface2 hover:text-fg`; the color button has `hover:bg-surface2`). This
matches the highlighted circle behind the icon in Paper frames `26C-0` / `27T-0`.
Implement by appending the active classes when `panel === "image"` /
`panel === "color"`.

## Component structure (Approach B)

Two new presentational components, one per file, following the app's
one-component-per-file convention (`TopNav` composes `NavMenu`,
`CreateDropdown`, `CollectionsButton`, …):

- `components/cosmos/ImageSearchPanel.tsx` — exports `ImageSearchPanel`, no props
  (or an optional `thumbs?: string[]`), pure render.
- `components/cosmos/ColorSearchPanel.tsx` — exports `ColorSearchPanel`, no props,
  pure render.

`SearchBar` keeps all open/close orchestration and its existing inline search
dropdown **unchanged**, and renders:

```tsx
{panel === "search" && !scope && (/* existing search dropdown, unchanged */)}
{panel === "image"  && !scope && <ImageSearchPanel />}
{panel === "color"  && !scope && <ColorSearchPanel />}
```

Each new panel component renders the positioned wrapper itself
(`absolute left-0 right-0 top-[calc(100%+8px)] z-50 …`) so `SearchBar` stays a thin
orchestrator. Thumbnails for the image panel reuse the existing mock image pool
(e.g. `recentlyViewed` from `@/lib/mock-data`) instead of Paper asset URLs.

## Panel chrome (approved Paper-over-existing decision)

Both new panels use the Paper chrome, which equals the existing `NavMenu` panel
chrome (NOT the heavier search-dropdown chrome):

```
rounded-3xl  bg-surface  p-2  ring-[0.5px] ring-border  shadow-[0_1px_8px_rgba(0,0,0,0.05)]
```

Token mapping confirmed against `tailwind.config.ts`:

| Paper value            | Token / class                         |
| ---------------------- | ------------------------------------- |
| `#212020`              | `bg-surface`                          |
| `#F7F5F31F`            | `ring-border` (border = rgba(247,245,243,0.12)) |
| `#918F8F`              | `text-fg-muted` / muted stroke        |
| `#141414`              | `bg-bg`                               |
| `#FFFFFF`              | `text-fg` / `bg-white`                |
| `text-sm/4.5`          | `text-[14px] leading-[18px]`          |
| `letter-spacing -0.28px` | `tracking-[-0.28px]`                |

## Image panel (`261-0`) — spec

- Outer: chrome above, `w-full` (inherits bar container width), height **316px**
  (Paper `h-79`; explicit fixed height unlike the content-driven search dropdown).
- Inner region: `relative rounded-2xl`, full-bleed inside the `p-2`.
- Dashed border: an absolutely-positioned inline `<svg>` with a `<rect>`
  `rx/ry=16`, `fill=none`, `stroke=#918F8F` (use `fg-muted`), `stroke-width=1.5`,
  `stroke-dasharray="3 5"`, sized `calc(100% - 1.5px)` (same as Paper).
- Content: `flex flex-col items-center justify-center gap-4 pt-12 pb-8 px-8`.
  - Illustration: a `relative size-16` box with two overlapping cards, each a
    `rounded-lg bg-bg` wrapper holding an `<img>` `w-10 rounded-lg
    border-[1.5px] border-surface object-cover`:
    - back card: `absolute left-[22px] top-[7px]` rotated `2deg`,
      img aspect ≈ `61/80`.
    - front card: `absolute left-0 top-4 size-10` rotated `-3.22deg`,
      img aspect ≈ `59/80`.
    - Images sourced from the mock pool.
  - Caption: `text-center tracking-[-0.28px] text-[14px] leading-[18px]
    text-fg-muted` — "Drag & drop image here, or upload file".

## Color panel (`276-0`) — spec

- Outer: chrome above, `w-full`, height **364px** (Paper `h-91`).
- Body: `flex flex-col items-center gap-2 size-full`.
- **SV square:** `w-full h-[275px] rounded-2xl relative shrink-0 ring-[0.5px]
  ring-border` (Paper `h-68.75`), base `bg-[#FF0000]`, with stacked
  `backgroundImage` (copied verbatim from Paper):
  `linear-gradient(in oklab 0deg, oklab(0% 0 0) 0%, oklab(0% 0 0 / 0%) 100%),
  linear-gradient(in oklab 90deg, oklab(100% 0 0) 0%, oklab(100% 0 0 / 0%) 100%)`.
  - Handle (static): `absolute left-0 top-full -translate-x-1/2 -translate-y-1/2
    size-4 rounded-full bg-black border-2 border-white` (bottom-left corner ⇒
    reads as black, consistent with the `#000000` chip).
- **Hue slider:** `flex h-4 w-full shrink-0`; inner `grow h-4 w-full rounded-full
  overflow-hidden` with `backgroundImage` (verbatim from Paper):
  `linear-gradient(in oklab 90deg, oklab(62.8% 0.225 0.126) 0%,
  oklab(96.8% -0.071 0.199) 16.67%, oklab(86.6% -0.234 0.179) 33.33%,
  oklab(90.5% -0.149 -0.039) 50%, oklab(45.2% -0.032 -0.312) 66.67%,
  oklab(70.2% 0.275 -0.169) 83.33%, oklab(62.8% 0.225 0.126) 100%)`.
- **Bottom row:** `flex items-center justify-between w-full`.
  - Left group `flex items-center gap-2`:
    - Hex chip: `flex items-center gap-0.5 rounded-full bg-surface
      ring-[0.5px] ring-border p-2.5` → swatch `size-5 rounded-full bg-black`,
      then `#` + `000000` as `text-fg text-[14px] leading-[18px] uppercase
      tracking-[-0.28px]`.
    - `+` button: `grid place-items-center shrink-0 size-10 rounded-full
      ring-[0.5px] ring-border` with a 20×20 plus icon (`path d="M12 3v18m-9-9h18"`,
      `stroke=currentColor` `text-fg`, `stroke-width=1.75`).
  - Right: Search button `flex items-center justify-center h-10 rounded-full
    px-5 bg-white text-[#0D0D0D] text-[14px] leading-[18px] font-medium
    tracking-[-0.28px]` — "Search". Inert (no handler).

## Out of scope

- Real file upload / drag-and-drop; selected-file preview.
- Draggable SV/hue handles; live hex updates.
- Wiring "Search" to results.
- Pickers in `scope` mode (buttons stay decorative, as today).
- Mobile/responsive-specific picker layouts (panels inherit the bar container
  width, same as the search dropdown; `fluid` mode already handles container width).
- Framer-motion enter/exit on the new panels: match the **existing search
  dropdown**, which renders without `AnimatePresence` (plain conditional). Keep
  parity — no motion wrapper — for consistency within `SearchBar`.

## Verification

- `npm run lint` and `npx tsc --noEmit` (or `npm run build`) pass.
- Manual: click each button → correct panel opens, bar widens to 601px, button
  shows active highlight; clicking the other button / input swaps panels; Escape
  and outside-click close; `scope` mode leaves buttons decorative.
- Visual diff against Paper frames `261-0` and `276-0`.
