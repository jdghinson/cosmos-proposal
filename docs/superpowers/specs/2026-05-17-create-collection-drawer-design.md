# Create-collection drawer — design

**Date:** 2026-05-17
**Status:** Approved (design + Approach A)

## Goal

Make "Create collection" use the **same drawer** as the AI Collection wizard so it
feels consistent, but as a single-step form **without the Brief textarea, the
"Add details" refinements, or the AI generate/results steps**. The drawer keeps a
Name field, the Make-private toggle, and the Collaborators picker. Submitting
creates an empty (`source: "manual"`) collection and navigates to it.

## Scope decision (approved)

Create-collection form keeps: **Name + Make-private toggle + Collaborators**.
Submit → empty collection → open it. No brief, no refinements, no AI steps.

## Approach (approved: A)

Reuse the existing `WizardDrawer` branched by a `mode` flag, and extract the two
already-isolated field components so both the AI brief step and the new create
step share one copy. No second drawer shell; no duplicated chrome/animation.

## Architecture / changes

### 1. `lib/wizard-store.tsx`

Add a wizard mode to context:

- `type WizardMode = "ai" | "create"`.
- Context `Ctx` gains `mode: WizardMode`.
- `openWizard(mode: WizardMode = "ai")` sets `isOpen = true` and stores the mode.
- `closeWizard()` unchanged (sets `isOpen = false`). Mode is set fresh on every
  `openWizard` call, so no stale-mode reset is needed; default `"ai"` preserves
  all existing callers that call `openWizard()` with no args.
- `useWizard()` consumers can read `mode`.

### 2. `components/ai-wizard/fields.tsx` (new — shared fields)

Move these **verbatim** out of `BriefStep.tsx` into a new module and export them:

- `Section` (label + children wrapper)
- `PrivateToggle` (`{ isPrivate, onToggle }`)
- `CollaboratorsField` (`{ collaborators, onAdd, onRemove }`)

`BriefStep.tsx` imports them from `./fields` instead of defining them locally.
Its remaining local helper `Refinements` stays in `BriefStep.tsx` (AI-only).
No behavior change to the AI flow — pure extraction.

### 3. `components/ai-wizard/CreateStep.tsx` (new)

Single-step form, props `{ state, setState, onSubmit }` (same prop shape style as
`BriefStep`). Reuses `WizardState`/`initial` (only `name`, `isPrivate`,
`collaborators` are used; `brief` stays `""`). Layout mirrors `BriefStep`'s
non-AI parts:

- Centered Name `input` bound to `state.name` (same classes as BriefStep's name
  input) with caption "Name your collection". Placeholder "New collection".
- `<div className="h-px bg-border" />` divider.
- `PrivateToggle` (from `./fields`) bound to `state.isPrivate`.
- divider.
- `Section label="Collaborators"` + `CollaboratorsField` (from `./fields`) bound
  to `state.collaborators` (add/remove handlers identical to BriefStep's).
- Sticky footer button "Create collection" (same sticky/footer styling as
  BriefStep's Generate button, but **always enabled** — no `disabled`/Sparkles).
  `onClick={onSubmit}`.

No Brief textarea, no "Add details"/`Refinements`, no Generate copy.

### 4. `components/ai-wizard/WizardDrawer.tsx`

Branch on `mode` from `useWizard()`:

- Read `mode` alongside `isOpen, closeWizard`.
- **Header:**
  - `mode === "ai"` (unchanged): Sparkles icon, "New AI Collection", "Premium"
    badge, back arrow on generating/results.
  - `mode === "create"`: `LayoutGrid` icon (lucide-react, matches the
    create-collection icon used elsewhere), label "New collection", **no**
    Premium badge, **no** back arrow (single step).
  - `aria-label` on the `motion.aside`: "New collection" when create, else
    "New AI Collection".
- **Body:**
  - `mode === "create"`: render a single animated `CreateStep` (one
    `motion.div`, same enter/exit as the brief panel) wired to
    `onSubmit={createManual}`. Do not render brief/generating/results.
  - `mode === "ai"`: existing `step`-driven brief/generating/results, unchanged.
- **`createManual()`** (new, mirrors `save()` minus AI bits):
  ```
  const id = "manual-" + Date.now().toString(36);
  addCollection({
    id,
    title: state.name.trim() || "Untitled collection",
    brief: "",
    createdAt: Date.now(),
    imageUrls: [],
    source: "manual",
    isPrivate: state.isPrivate,
    collaborators: state.collaborators,
  });
  closeWizard();
  setTimeout(reset, 350);
  router.push(`/collection/${id}`);
  ```
  (Same `SavedCollection` field set as the existing AI `save()`, with
  `source: "manual"`, `brief: ""`, `imageUrls: []`.)
- `reset()`/`handleClose()` unchanged (reset still sets step `"brief"`, harmless
  in create mode since step is unused there).
- The existing `useEffect` that suggests a name from `state.brief` is a no-op in
  create mode (`state.brief` stays `""`) — no change needed.

### 5. Entry points (both wired to the new flow)

- `components/cosmos/CreateDropdown.tsx`: the **"Collection"** `DropdownItem`
  `onClick` → `() => { setOpen(false); openWizard("create"); }`. Delete
  `createBlankCollection` (the hardcoded "Vheni"/"minimal product" instant
  create). Remove now-unused `useCollections`/`addCollection` and
  `useRouter`/`router` (imports + declarations) so `next lint` stays clean. Keep
  `useWizard`/`openWizard`. The "AI Collection" item still calls
  `openWizard()` (defaults to `"ai"`).
- `components/cosmos/NavMenu.tsx`: add a `createCollection` function
  `() => { setOpen(false); openWizard("create"); }` and wire it to the
  "Create collection" `Row`'s `onClick` (currently inert). `useWizard`/
  `openWizard` are already imported/used (for `createAICollection`); no other
  imports change.

## Out of scope

- No AI generation, image-selection, or results step in create mode.
- No changes to the AI flow's behavior or copy.
- No new persistence layer — reuses `useCollections().addCollection`.
- `app/create/page.tsx` unchanged (still opens the AI wizard).
- No restyle of the drawer shell, backdrop, or animations.

## Verification

- `npx tsc --noEmit`, `npm run lint`, `npm run build` all clean.
- Manual:
  - NavMenu "Create collection" and CreateDropdown "Collection" both open the
    drawer in create mode: header "New collection" (no Premium badge, no back
    arrow), only Name + Make-private + Collaborators visible.
  - Submitting with a name creates a collection titled that name; empty name →
    "Untitled collection". New collection is `source: "manual"`, opens at
    `/collection/{id}`, appears in collections list.
  - AI Collection flow (CreateDropdown "AI Collection", `/create`) still works
    exactly as before (brief → generating → results → save).
  - Escape / backdrop click close the drawer in both modes.
