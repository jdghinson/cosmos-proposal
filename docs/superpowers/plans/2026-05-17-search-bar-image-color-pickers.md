# SearchBar Image & Color Picker Panels Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the SearchBar's "Visual search" and "Color search" buttons open static dropdown panels (image drop zone / HSV color picker) using the same open/close interaction as focusing the search input.

**Architecture:** Approach B — two new presentational components (`ImageSearchPanel`, `ColorSearchPanel`), each rendering its own positioned dropdown wrapper. `SearchBar` replaces its boolean `open` state with a 4-way `panel` union (`"search" | "image" | "color" | null`) and reuses its existing click-outside/Escape effect verbatim (only the setter changes). The existing inline search dropdown is left untouched.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS. No test runner exists in this repo and these are pure-presentational components; the verification gate per task is `npx tsc --noEmit`, `npm run lint`, and a visual diff against Paper frames `261-0`/`276-0`.

**Spec:** `docs/superpowers/specs/2026-05-17-search-bar-image-color-pickers-design.md`

---

### Task 1: ColorSearchPanel component

**Files:**
- Create: `components/cosmos/ColorSearchPanel.tsx`

- [ ] **Step 1: Create the component**

Create `components/cosmos/ColorSearchPanel.tsx` with exactly this content:

```tsx
export function ColorSearchPanel() {
  return (
    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 h-[364px] overflow-hidden rounded-3xl bg-surface p-2 ring-[0.5px] ring-inset ring-border shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
      <div className="flex h-full flex-col items-center gap-2">
        {/* Saturation / value square */}
        <div
          className="relative h-[275px] w-full shrink-0 rounded-2xl bg-[#FF0000] ring-[0.5px] ring-inset ring-border"
          style={{
            backgroundImage:
              "linear-gradient(in oklab 0deg, oklab(0% 0 0) 0%, oklab(0% 0 0 / 0%) 100%), linear-gradient(in oklab 90deg, oklab(100% 0 0) 0%, oklab(100% 0 0 / 0%) 100%)",
          }}
        >
          <span className="absolute left-0 top-full h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black" />
        </div>

        {/* Hue spectrum slider */}
        <div className="flex h-4 w-full shrink-0">
          <div
            className="h-4 w-full grow rounded-full"
            style={{
              backgroundImage:
                "linear-gradient(in oklab 90deg, oklab(62.8% 0.225 0.126) 0%, oklab(96.8% -0.071 0.199) 16.67%, oklab(86.6% -0.234 0.179) 33.33%, oklab(90.5% -0.149 -0.039) 50%, oklab(45.2% -0.032 -0.312) 66.67%, oklab(70.2% 0.275 -0.169) 83.33%, oklab(62.8% 0.225 0.126) 100%)",
            }}
          />
        </div>

        {/* Bottom row */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-surface p-2.5 ring-[0.5px] ring-inset ring-border">
              <span className="size-5 shrink-0 rounded-full bg-black" />
              <span className="text-[14px] font-medium uppercase leading-[18px] tracking-[-0.28px] text-fg">
                #000000
              </span>
            </div>
            <button
              aria-label="Add color"
              className="grid size-10 shrink-0 place-items-center rounded-full text-fg ring-[0.5px] ring-inset ring-border hover:bg-surface2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path stroke="currentColor" strokeWidth="1.75" d="M12 3v18m-9-9h18" />
              </svg>
            </button>
          </div>
          <button className="grid h-10 place-items-center rounded-full bg-white px-5 text-[14px] font-medium leading-[18px] tracking-[-0.28px] text-[#0D0D0D] hover:bg-[#D4D4D4]">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors (no new errors referencing `ColorSearchPanel.tsx`).

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors/warnings for `ColorSearchPanel.tsx`.

- [ ] **Step 4: Commit**

```bash
git add components/cosmos/ColorSearchPanel.tsx
git commit -m "Add ColorSearchPanel presentational component"
```

---

### Task 2: ImageSearchPanel component

**Files:**
- Create: `components/cosmos/ImageSearchPanel.tsx`
- Reference (do not modify): `lib/mock-data.ts` (exports `recentlyViewed: string[]`)

- [ ] **Step 1: Confirm the mock image export name**

Run: `grep -n "recentlyViewed" lib/mock-data.ts`
Expected: a line like `export const recentlyViewed = [` (string URL array). If the export is named differently, use that name in Step 2 instead of `recentlyViewed`.

- [ ] **Step 2: Create the component**

Create `components/cosmos/ImageSearchPanel.tsx` with exactly this content:

```tsx
import { recentlyViewed } from "@/lib/mock-data";

export function ImageSearchPanel() {
  const front = recentlyViewed[0];
  const back = recentlyViewed[1];
  return (
    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 h-[316px] overflow-hidden rounded-3xl bg-surface p-2 ring-[0.5px] ring-inset ring-border shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
      <div className="relative h-full w-full rounded-2xl">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          fill="none"
        >
          <rect
            x="0.75"
            y="0.75"
            width="calc(100% - 1.5px)"
            height="calc(100% - 1.5px)"
            rx="16"
            ry="16"
            fill="none"
            stroke="#918F8F"
            strokeWidth="1.5"
            strokeDasharray="3 5"
          />
        </svg>
        <div className="relative flex h-full flex-col items-center justify-center gap-4 px-8 pb-8 pt-12">
          <div className="relative size-16 shrink-0">
            <div
              className="absolute left-[22px] top-[7px] origin-top-left rounded-lg bg-bg"
              style={{ rotate: "2deg" }}
            >
              {back && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={back}
                  alt=""
                  className="aspect-[61/80] w-10 rounded-lg border-[1.5px] border-surface object-cover"
                />
              )}
            </div>
            <div
              className="absolute left-0 top-4 origin-top-left rounded-lg bg-bg"
              style={{ rotate: "-3.22deg" }}
            >
              {front && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={front}
                  alt=""
                  className="aspect-[59/80] w-10 rounded-lg border-[1.5px] border-surface object-cover"
                />
              )}
            </div>
          </div>
          <div className="text-center text-[14px] leading-[18px] tracking-[-0.28px] text-fg-muted">
            Drag & drop image here, or upload file
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing `ImageSearchPanel.tsx`.

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no errors/warnings for `ImageSearchPanel.tsx`.

- [ ] **Step 5: Commit**

```bash
git add components/cosmos/ImageSearchPanel.tsx
git commit -m "Add ImageSearchPanel presentational component"
```

---

### Task 3: Wire panels into SearchBar

**Files:**
- Modify: `components/cosmos/SearchBar.tsx`

- [ ] **Step 1: Add imports**

In `components/cosmos/SearchBar.tsx`, immediately after the existing
`import { recentColors, recentSearches, recentlyViewed } from "@/lib/mock-data";`
line, add:

```tsx
import { ImageSearchPanel } from "./ImageSearchPanel";
import { ColorSearchPanel } from "./ColorSearchPanel";
```

- [ ] **Step 2: Replace the `open` state with the `panel` union**

Find:

```tsx
  const [open, setOpen] = useState(false);
```

Replace with:

```tsx
  const [panel, setPanel] = useState<"search" | "image" | "color" | null>(null);
```

- [ ] **Step 3: Update the click-outside and Escape handlers**

In the second `useEffect`, find the two `setOpen(false)` calls:

```tsx
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
```
and
```tsx
      if (e.key === "Escape") setOpen(false);
```

Replace each `setOpen(false)` with `setPanel(null)`.

- [ ] **Step 4: Update the bar width condition**

Find:

```tsx
          : `relative mx-auto transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${open && !scope ? "w-[601px]" : "w-[480px]"}`
```

Replace with:

```tsx
          : `relative mx-auto transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${panel !== null && !scope ? "w-[601px]" : "w-[480px]"}`
```

- [ ] **Step 5: Update the input focus handler**

Find:

```tsx
          onFocus={() => !scope && setOpen(true)}
```

Replace with:

```tsx
          onFocus={() => !scope && setPanel("search")}
```

- [ ] **Step 6: Wire the Visual search button (onClick + active state)**

Find the full opening tag of the visual-search button:

```tsx
        <button
          aria-label="Visual search"
          className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full text-fg-muted hover:bg-surface2 hover:text-fg"
        >
```

Replace with:

```tsx
        <button
          aria-label="Visual search"
          onClick={() => !scope && setPanel((p) => (p === "image" ? null : "image"))}
          className={
            "grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full hover:bg-surface2 hover:text-fg " +
            (panel === "image" ? "bg-surface2 text-fg" : "text-fg-muted")
          }
        >
```

- [ ] **Step 7: Wire the Color search button (onClick + active state)**

Find the full opening tag of the color-search button:

```tsx
        <button
          aria-label="Color search"
          className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full hover:bg-surface2"
        >
```

Replace with:

```tsx
        <button
          aria-label="Color search"
          onClick={() => !scope && setPanel((p) => (p === "color" ? null : "color"))}
          className={
            "grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full hover:bg-surface2 " +
            (panel === "color" ? "bg-surface2" : "")
          }
        >
```

- [ ] **Step 8: Gate the existing search dropdown on the new state**

Find:

```tsx
      {open && !scope && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 flex flex-col gap-6 rounded-2xl bg-surface p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-inset ring-border"
        >
```

Replace only the first line (`{open && !scope && (`) with:

```tsx
      {panel === "search" && !scope && (
```

(Leave the `<div className="absolute ...">` and all dropdown contents unchanged.)

- [ ] **Step 9: Render the two new panels**

Locate the closing of that search-dropdown block — the lines:

```tsx
        </div>
      )}
    </div>
  );
}
```

Insert the two panel renders between the `)}` that closes the search dropdown and the closing `</div>` of the root container, so it reads:

```tsx
        </div>
      )}

      {panel === "image" && !scope && <ImageSearchPanel />}
      {panel === "color" && !scope && <ColorSearchPanel />}
    </div>
  );
}
```

- [ ] **Step 10: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors. (If `tsc` reports `panel` possibly unused or type errors, re-check Steps 2–9.)

- [ ] **Step 11: Lint**

Run: `npm run lint`
Expected: no new errors/warnings.

- [ ] **Step 12: Build**

Run: `npm run build`
Expected: build completes successfully (no type or compile errors).

- [ ] **Step 13: Commit**

```bash
git add components/cosmos/SearchBar.tsx
git commit -m "Wire image and color picker panels into SearchBar"
```

---

### Task 4: Visual verification against Paper

**Files:**
- Possibly modify: `components/cosmos/ImageSearchPanel.tsx`, `components/cosmos/ColorSearchPanel.tsx`, `components/cosmos/SearchBar.tsx`

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (background)
Open the app, focus the search bar, and click each of the two buttons.

- [ ] **Step 2: Verify interaction**

Confirm, by inspection:
- Clicking "Visual search" opens the image panel; bar widens to 601px; the button shows the active (filled circle) state.
- Clicking "Color search" swaps to the color panel; its button is active, the image button is not.
- Clicking the search input swaps back to the search dropdown.
- Escape and clicking outside close any open panel.
- In a `scope` SearchBar (e.g. a collection page), the buttons stay decorative and no panel opens.

- [ ] **Step 3: Visual diff against Paper**

Compare the rendered panels to Paper frames `261-0` (image) and `276-0` (color):
spacing, dashed border, illustration tilt, gradient square + hue bar, hex chip,
`+` button, and white Search button. Note any visible discrepancies.

- [ ] **Step 4: Fix discrepancies (only if Step 3 found any)**

Apply targeted className/style fixes to the relevant component(s). Re-run
`npx tsc --noEmit` and `npm run lint` after edits.

- [ ] **Step 5: Commit (only if Step 4 changed files)**

```bash
git add components/cosmos/*.tsx
git commit -m "Polish image/color picker panels to match Paper design"
```

---

## Notes for the executor

- These components are intentionally **static/presentational** (no upload, no
  draggable handles, inert "Search"). Do not add interactivity — it is explicitly
  out of scope per the spec.
- Keep the existing search dropdown markup and behavior byte-for-byte unchanged
  except for the single `{open && !scope && (` → `{panel === "search" && !scope && (`
  line.
- `oklab(...)` gradient strings must be copied verbatim — they are the exact
  values exported from the Paper design.
