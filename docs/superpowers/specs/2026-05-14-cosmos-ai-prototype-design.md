# Cosmos AI Creation Collection + Figma Plugin — Prototype Design

**Date:** 2026-05-14
**Status:** Draft for approval
**Owner:** Prototype for proposal review

---

## 1. Purpose

A visual + interactive prototype that demonstrates two product bets from the Cosmos proposal:

- **AI brief-to-collection** on the Cosmos web app (Proposal 2 — the premium wedge).
- **Cosmos Figma plugin** as a standalone panel (Proposal 1 — the acquisition surface).

The prototype is for proposal review. It is not a production app. There is no backend, no auth, no real AI. All data is mocked. All AI responses are pre-curated.

## 2. Scope

### In scope

- A minimal Cosmos Explore page (top nav, search, category chips, a small Selected/Explore grid) — just enough chrome to land the user and host the **Create → AI Collection** entry point.
- The full AI creation wizard: brief input → generating → curated results → save → success.
- A standalone Figma plugin panel rendered at realistic plugin dimensions (~360px wide × ~640px tall) with Search and AI Collections tabs, simulated drag-to-canvas via click feedback.
- Dark mode only (matches the supplied screenshots).
- Design tokens ported from the design-system audit.

### Out of scope

- Light mode toggle.
- Real auth, billing, real AI calls.
- A full Cosmos clone (For You, Following, profile pages, settings, etc.).
- An embedded fake Figma editor around the plugin. The plugin stands alone.
- Mobile layouts (desktop only; the plugin panel is intrinsically narrow).
- Sketch/Framer/other host apps.
- Backwards compatibility, accessibility audits beyond reasonable defaults, browser support beyond modern Chromium/Safari.

## 3. Architecture

A single Next.js 14 app (App Router) with three routes:

| Route | Purpose |
|---|---|
| `/` | Cosmos Explore landing — chrome only, hosts the Create dropdown that opens the AI flow. |
| `/create` | AI brief-to-collection wizard. Multi-step state managed locally. |
| `/plugin` | Standalone Figma plugin panel, centered on a neutral backdrop. |

**Stack:**

- Next.js 14 + TypeScript
- Tailwind CSS, with tokens from the audit ported as theme extensions
- Framer Motion for step transitions and the "AI generating" shimmer
- Lucide React for icons (matches the audit's "line icons, single weight" rule)
- No state management library; React state + URL params are enough
- Mock data lives in `lib/mock-data.ts` (curated image URLs + collection metadata)

**File structure:**

```
app/
  layout.tsx              // global dark theme + font
  page.tsx                // Explore landing
  create/
    page.tsx              // AI wizard host
  plugin/
    page.tsx              // standalone plugin
components/
  cosmos/
    TopNav.tsx
    SearchBar.tsx
    CategoryChips.tsx
    ClusterCard.tsx
    ExploreGrid.tsx
    CreateDropdown.tsx
  ai-wizard/
    BriefStep.tsx
    GeneratingStep.tsx
    ResultsStep.tsx
    SuccessStep.tsx
    WizardShell.tsx
  plugin/
    PluginShell.tsx
    PluginTabs.tsx
    SearchTab.tsx
    AICollectionsTab.tsx
    DragPreview.tsx
lib/
  mock-data.ts
  tokens.ts               // re-exported design tokens for runtime use
```

## 4. AI Creation Wizard

A full-screen overlay launched from the **Create** dropdown's "AI Collection" option (a new third item we add to the existing Collection / Element / Import menu shown in the screenshots).

**Steps:**

1. **Brief (hybrid input).**
   - Top: a large single textarea — "Describe your project" — placeholder cycles through examples ("A warm, archival editorial for a coffee brand…").
   - Below, collapsed by default behind "Add details ▾": project-type chips (Branding · Product · Website · Editorial · Identity · Packaging), keyword tags input, optional color anchor (color picker that defaults to none).
   - Primary button: **Generate collection**. Disabled until the textarea has content.

2. **Generating.**
   - Replace the form with a 4-column placeholder grid where each tile shimmers (Framer Motion gradient sweep). The brief is echoed back at the top as a small caption.
   - Simulated delay: ~2.5s, then auto-advances.

3. **Results.**
   - 4×4 grid of curated images (16 mock results). Each card has a thumbs-up / thumbs-down toggle on hover.
   - Default state: all selected (thumbs-up filled). User can deselect.
   - Header: brief summary, count of selected, **Save as Collection** primary button, **Regenerate** secondary.
   - Collection-name input appears inline above the grid (auto-suggested from the brief).

4. **Success.**
   - Compact card: "Collection saved." with the collection title, count, and two CTAs: **View collection** (goes to `/` and scrolls to a fake new card) and **Open in Figma plugin** (goes to `/plugin` with the collection preselected via query param).

**State:** held in a single `WizardState` object in `WizardShell.tsx`. URL is updated with `?step=brief|generating|results|success` so refresh and shareability work.

## 5. Cosmos Explore Landing (`/`)

Just enough to give the Create flow a believable home:

- Top nav: logo, For You / Following / Explore (Explore is active), search input, lightning icon, **Create** button, settings, avatar, hamburger.
- Category chip row (Featured active, then Shop, Graphic Design, etc. — match the screenshot order).
- "Selected by Cosmos" row with 3–4 cluster cards.
- "Explore elements" masonry below with ~10 image tiles.
- The **Create** button opens a dropdown matching the screenshot (Collection / Element / Import) plus a new **AI Collection** item with a sparkle icon. Selecting it routes to `/create`.

This page is decorative. It is not the focus of the prototype; it exists to make the entry point feel real.

## 6. Figma Plugin (`/plugin`)

A standalone panel rendered on a neutral dark backdrop (think a Dribbble shot of the plugin in isolation).

**Frame:** 360×640px panel with Figma-like chrome — small title bar reading "Cosmos", a close × on the right, rounded 8px corners, subtle 1px border, a soft shadow.

**Tabs (segmented control at the top of the panel body):**

- **Search** — default tab.
  - Sticky search input with a small color-picker affordance and a camera (visual search) icon.
  - Below: category chip row (horizontally scrollable, condensed).
  - Below: 2-column image grid with infinite scroll feel. Each image has a hover state showing a tiny "drag to canvas" hint.
  - Click an image → it animates outward toward the right edge of the panel with a subtle toast: "Added to canvas." This simulates drag without us building a real Figma host.

- **AI Collections** — lists collections created via the web wizard (loaded from `lib/mock-data.ts` + any collection passed via `?collection=`).
  - Each collection row: thumbnail strip + name + element count.
  - Tapping a row expands it into a 2-column grid of that collection's images (same click-to-add interaction).
  - At the top: a **+ New AI Collection** card that opens a compact inline brief input (single textarea + Generate). Generation simulates the same shimmer-to-results flow but inside the panel.

**Footer:** small account row ("Signed in as @jeff · Premium") to imply the plugin respects the user's subscription.

## 7. Design Tokens

Ported from the audit, inverted for dark mode:

```ts
// tailwind.config.ts (excerpt)
colors: {
  bg:          '#0E0E0E',   // page
  surface:     '#1A1A1A',   // cards, panel
  surface2:    '#222220',   // hover, elevated chips
  fg:          '#FAFAF7',   // primary text
  fgMuted:     '#A6A6A0',   // secondary
  fgSubtle:    '#6B6B66',   // tertiary / placeholder
  border:      '#2A2A28',   // hairline
  accent:      '#FAFAF7',   // inverse buttons (white on dark)
}
fontFamily: { sans: ['Inter', 'ABC Diatype', 'Söhne', 'system-ui', ...] }
borderRadius: { sm: '6px', md: '8px', pill: '9999px' }
spacing: keep Tailwind defaults (they're already 4pt)
```

Motion: 150ms ease-out for hover, 250ms ease-out for step transitions, 2.5s simulated AI delay.

## 8. Mock Data

A single `lib/mock-data.ts` with:

- `exploreClusters`: 4 cluster cards (matching the screenshot's "print / papper", "Komorebi", "The Nancy Meyers Fantasy", "Explore").
- `exploreElements`: ~12 individual image tiles.
- `aiResultsByBrief`: a map from brief keyword (e.g. "warm editorial", "minimal tech", "archival fashion") to an array of 16 image URLs. The "generate" step picks the closest match by simple keyword overlap, with a fallback set.
- `seededAICollections`: 2–3 pre-existing AI collections shown in the plugin's AI Collections tab.

Images sourced from Unsplash (`source.unsplash.com/...`) for the prototype. Curated keyword-tagged sets so results look intentional rather than random.

## 9. Interactions Worth Calling Out

- **Create dropdown** opens on click, closes on outside click and escape.
- **Wizard transitions** between steps use a shared layout fade + 8px y-translate.
- **Image card hover** in results uses a 1.01 scale and reveals thumbs controls (matches the audit's "faint scale, no shadow").
- **Plugin click-to-add** uses Framer Motion's `layoutId` to morph the clicked thumbnail toward the right edge of the panel, then it dissolves and a toast fires.

## 10. Risks & Trade-offs

- **No real Figma host:** the plugin is visually convincing but the drag interaction is simulated. We label this explicitly in the proposal context, not in the UI.
- **Unsplash dependency:** if offline, the prototype looks empty. Acceptable for a demo; can swap to local images later if needed.
- **Dark mode only:** if the proposal audience prefers seeing light mode, we'd need a second pass. Calling this out so it doesn't surprise anyone.

## 11. Success Criteria

The prototype is "done" when:

- I can land on `/`, click **Create → AI Collection**, complete the wizard, and see a saved collection that appears on `/` and inside the plugin's AI Collections tab.
- I can land on `/plugin` and use both tabs (Search and AI Collections) end-to-end, including the inline "+ New AI Collection" flow inside the plugin.
- The visual treatment matches the supplied screenshots' chrome closely enough that a stakeholder believes it's a real product.
- The whole prototype runs locally via `npm run dev` with no backend.
