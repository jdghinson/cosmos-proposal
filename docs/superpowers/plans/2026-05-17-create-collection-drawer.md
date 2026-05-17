# Create-collection Drawer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make "Create collection" open the existing wizard drawer in a single-step "create" mode (Name + Make-private + Collaborators, no brief/details/AI steps) that creates an empty `source: "manual"` collection and navigates to it.

**Architecture:** Add a `mode: "ai" | "create"` flag to the wizard store; reuse `WizardDrawer` branched by mode; extract the already-isolated `Section`/`PrivateToggle`/`CollaboratorsField` from `BriefStep.tsx` into a shared `fields.tsx` so the new `CreateStep` and the AI `BriefStep` share one copy. Both entry points (`CreateDropdown` "Collection", `NavMenu` "Create collection") call `openWizard("create")`.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind, framer-motion. No test runner exists in this repo and these are presentational/behavioral components; verification per task is `npx tsc --noEmit` + `npm run lint`, plus `npm run build` on integration tasks, then manual checks.

**Spec:** `docs/superpowers/specs/2026-05-17-create-collection-drawer-design.md`

---

### Task 1: Add `mode` to the wizard store

**Files:**
- Modify (full rewrite): `lib/wizard-store.tsx`

- [ ] **Step 1: Replace the entire file**

Overwrite `lib/wizard-store.tsx` with exactly:

```tsx
"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type WizardMode = "ai" | "create";

type Ctx = {
  isOpen: boolean;
  mode: WizardMode;
  openWizard: (mode?: WizardMode) => void;
  closeWizard: () => void;
};

const WizardContext = createContext<Ctx | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<WizardMode>("ai");

  const openWizard = useCallback((m: WizardMode = "ai") => {
    setMode(m);
    setIsOpen(true);
  }, []);
  const closeWizard = useCallback(() => setIsOpen(false), []);

  const value = useMemo<Ctx>(
    () => ({ isOpen, mode, openWizard, closeWizard }),
    [isOpen, mode, openWizard, closeWizard],
  );

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used inside WizardProvider");
  return ctx;
}
```

- [ ] **Step 2: Typecheck** — Run: `npx tsc --noEmit` — Expected: no errors. (Existing `openWizard()` no-arg callers still valid because `mode` defaults to `"ai"`.)

- [ ] **Step 3: Lint** — Run: `npm run lint` — Expected: no warnings/errors.

- [ ] **Step 4: Commit**

```bash
git add lib/wizard-store.tsx
git commit -m "Add mode (ai|create) to wizard store"
```

---

### Task 2: Extract shared fields from BriefStep

**Files:**
- Create: `components/ai-wizard/fields.tsx`
- Modify (full rewrite): `components/ai-wizard/BriefStep.tsx`

- [ ] **Step 1: Create `components/ai-wizard/fields.tsx`**

Create the file with exactly (these three functions are moved verbatim out of `BriefStep.tsx`):

```tsx
"use client";

import { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { sampleCollaborators, type Collaborator } from "@/lib/mock-data";

export function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[12px] font-medium tracking-[-0.24px] text-fg">{label}</div>
      {children}
    </div>
  );
}

export function PrivateToggle({ isPrivate, onToggle }: { isPrivate: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 text-left active:scale-[0.98] transition-transform duration-150 ease-out"
    >
      <div>
        <div className="text-[14px] font-medium text-fg">Make private</div>
        <div className="text-[12px] text-fg-muted">For just you and your collaborators</div>
      </div>
      <span
        aria-hidden
        className={
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-[background-color] duration-200 ease-out " +
          (isPrivate ? "bg-fg" : "bg-surface3")
        }
      >
        <span
          className={
            "inline-block h-5 w-5 rounded-full bg-bg shadow-sm transition-transform duration-200 ease-out " +
            (isPrivate ? "translate-x-[22px]" : "translate-x-[2px]")
          }
        />
      </span>
    </button>
  );
}

export function CollaboratorsField({
  collaborators,
  onAdd,
  onRemove,
}: {
  collaborators: Collaborator[];
  onAdd: (c: Collaborator) => void;
  onRemove: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = sampleCollaborators
    .filter((c) => !collaborators.find((x) => x.id === c.id))
    .filter((c) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    })
    .slice(0, 4);

  return (
    <div>
      {collaborators.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {collaborators.map((c) => (
            <span
              key={c.id}
              className="flex items-center gap-1.5 rounded-full bg-surface py-1 pl-1 pr-2 text-[12px] text-fg ring-1 ring-inset ring-border"
            >
              <span
                className="grid h-5 w-5 place-items-center rounded-full text-[10px] font-medium text-bg"
                style={{ background: c.avatarColor }}
              >
                {c.name.charAt(0)}
              </span>
              {c.name}
              <button onClick={() => onRemove(c.id)} aria-label={`Remove ${c.name}`}>
                <X size={11} className="text-fg-muted hover:text-fg" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="flex items-center gap-2 rounded-full bg-surface px-3 py-2 ring-1 ring-inset ring-border focus-within:ring-fg/30">
          <Search size={13} className="text-fg-muted" strokeWidth={1.75} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search by name or email…"
            className="flex-1 bg-transparent text-[13px] text-fg outline-none placeholder:text-fg-muted"
          />
        </div>

        {focused && results.length > 0 && (
          <div className="absolute inset-x-0 top-[calc(100%+6px)] z-10 overflow-hidden rounded-xl bg-surface p-1 shadow-lg ring-1 ring-inset ring-border">
            {results.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onAdd(c);
                  setQuery("");
                }}
                className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left hover:bg-surface2"
              >
                <span
                  className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-medium text-bg"
                  style={{ background: c.avatarColor }}
                >
                  {c.name.charAt(0)}
                </span>
                <span className="flex-1">
                  <span className="block text-[13px] text-fg">{c.name}</span>
                  <span className="block text-[11px] text-fg-muted">{c.email}</span>
                </span>
                <Plus size={13} className="text-fg-muted" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `components/ai-wizard/BriefStep.tsx`**

Overwrite the file with exactly (imports updated; `Section`/`PrivateToggle`/`CollaboratorsField` now imported from `./fields`; `Refinements` kept locally; `Search`/`Plus`/`sampleCollaborators` no longer imported here):

```tsx
"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Sparkles, X } from "lucide-react";
import { projectTypes, type ProjectType, type Collaborator } from "@/lib/mock-data";
import { Section, PrivateToggle, CollaboratorsField } from "./fields";
import type { WizardState } from "./types";

const PLACEHOLDERS = [
  "A warm, archival editorial for a coffee brand. Earthy, soft, type-led.",
  "Clean, minimal product page for a developer tool. Calm, technical.",
  "Brutalist architecture moodboard — concrete, structural, monochrome.",
  "Botanical wedding stationery — soft greens, hand-set type, muted.",
];

type Props = {
  state: WizardState;
  setState: React.Dispatch<React.SetStateAction<WizardState>>;
  onSubmit: () => void;
};

export function BriefStep({ state, setState, onSubmit }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % PLACEHOLDERS.length;
      setPlaceholder(PLACEHOLDERS[i]);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  function setName(name: string) {
    setState((s) => ({ ...s, name }));
  }

  function setBrief(brief: string) {
    setState((s) => ({ ...s, brief }));
  }

  function togglePrivate() {
    setState((s) => ({ ...s, isPrivate: !s.isPrivate }));
  }

  function addCollaborator(c: Collaborator) {
    setState((s) =>
      s.collaborators.find((x) => x.id === c.id)
        ? s
        : { ...s, collaborators: [...s.collaborators, c] },
    );
  }

  function removeCollaborator(id: string) {
    setState((s) => ({
      ...s,
      collaborators: s.collaborators.filter((c) => c.id !== id),
    }));
  }

  const canSubmit = state.brief.trim().length > 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <input
          value={state.name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New collection"
          className="w-full bg-transparent text-center text-[28px] font-medium tracking-[-0.56px] text-fg outline-none placeholder:text-fg-subtle"
        />
        <p className="mt-1 text-[12px] text-fg-muted">Name your collection</p>
      </div>

      <Section label="Brief">
        <textarea
          value={state.brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full resize-none rounded-xl bg-surface px-3.5 py-3 text-[14px] leading-relaxed text-fg outline-none placeholder:text-fg-subtle ring-1 ring-inset ring-border focus:ring-fg/30"
        />
        <div className="mt-2 flex items-center justify-between">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] text-fg-muted hover:bg-surface hover:text-fg"
          >
            Add details
            <ChevronDown size={13} className={"transition-transform duration-200 ease-out " + (expanded ? "rotate-180" : "")} />
          </button>
          {state.keywords.length + state.projectTypes.length > 0 && (
            <span className="text-[11px] text-fg-subtle">
              {state.keywords.length + state.projectTypes.length} refinements
            </span>
          )}
        </div>

        {expanded && (
          <div className="mt-3 space-y-4 rounded-xl bg-surface/60 p-3 ring-1 ring-inset ring-border">
            <Refinements state={state} setState={setState} />
          </div>
        )}
      </Section>

      <div className="h-px bg-border" />

      <PrivateToggle isPrivate={state.isPrivate} onToggle={togglePrivate} />

      <div className="h-px bg-border" />

      <Section label="Collaborators">
        <CollaboratorsField
          collaborators={state.collaborators}
          onAdd={addCollaborator}
          onRemove={removeCollaborator}
        />
      </Section>

      <div className="sticky bottom-0 -mx-5 -mb-6 mt-2 border-t border-border bg-bg/95 px-5 pb-6 pt-4 backdrop-blur">
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="flex w-full items-center justify-center gap-1.5 rounded-full bg-fg px-4 py-3 text-[14px] font-medium tracking-[-0.28px] text-[#0D0D0D] disabled:cursor-not-allowed disabled:opacity-30 active:scale-[0.97] transition-transform duration-150 ease-out"
        >
          <Sparkles size={14} />
          Generate collection
        </button>
      </div>
    </div>
  );
}

function Refinements({
  state,
  setState,
}: {
  state: WizardState;
  setState: React.Dispatch<React.SetStateAction<WizardState>>;
}) {
  const [keywordInput, setKeywordInput] = useState("");

  function toggleType(t: ProjectType) {
    setState((s) => ({
      ...s,
      projectTypes: s.projectTypes.includes(t)
        ? s.projectTypes.filter((x) => x !== t)
        : [...s.projectTypes, t],
    }));
  }

  function addKeyword() {
    const k = keywordInput.trim();
    if (!k || state.keywords.includes(k)) {
      setKeywordInput("");
      return;
    }
    setState((s) => ({ ...s, keywords: [...s.keywords, k] }));
    setKeywordInput("");
  }

  function removeKeyword(k: string) {
    setState((s) => ({ ...s, keywords: s.keywords.filter((x) => x !== k) }));
  }

  return (
    <>
      <div>
        <div className="mb-1.5 text-[11px] uppercase tracking-wider text-fg-muted">Project type</div>
        <div className="flex flex-wrap gap-1.5">
          {projectTypes.map((t) => {
            const on = state.projectTypes.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggleType(t)}
                className={
                  "rounded-full px-2.5 py-1 text-[12px] " +
                  (on
                    ? "bg-fg text-bg"
                    : "bg-surface2 text-fg-muted hover:bg-surface3 hover:text-fg")
                }
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-1.5 text-[11px] uppercase tracking-wider text-fg-muted">Keywords</div>
        <div className="flex flex-wrap items-center gap-1.5 rounded-full bg-bg/40 px-3 py-1.5 ring-1 ring-inset ring-border">
          {state.keywords.map((k) => (
            <span
              key={k}
              className="flex items-center gap-1 rounded-full bg-surface2 px-2 py-0.5 text-[12px] text-fg"
            >
              {k}
              <button onClick={() => removeKeyword(k)} aria-label={`Remove ${k}`}>
                <X size={11} className="text-fg-muted hover:text-fg" />
              </button>
            </span>
          ))}
          <input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addKeyword();
              }
            }}
            placeholder={state.keywords.length ? "" : "warm, archival, muted…"}
            className="flex-1 bg-transparent py-0.5 text-[12px] text-fg placeholder:text-fg-subtle outline-none"
          />
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Typecheck** — Run: `npx tsc --noEmit` — Expected: no errors.

- [ ] **Step 4: Lint** — Run: `npm run lint` — Expected: clean (no unused `Search`/`Plus`/`sampleCollaborators` in BriefStep).

- [ ] **Step 5: Build** — Run: `npm run build` — Expected: compiles successfully (confirms the AI flow still wires up after extraction).

- [ ] **Step 6: Commit**

```bash
git add components/ai-wizard/fields.tsx components/ai-wizard/BriefStep.tsx
git commit -m "Extract Section/PrivateToggle/CollaboratorsField to shared fields module"
```

---

### Task 3: CreateStep component

**Files:**
- Create: `components/ai-wizard/CreateStep.tsx`

- [ ] **Step 1: Create the file**

Create `components/ai-wizard/CreateStep.tsx` with exactly:

```tsx
"use client";

import type { Collaborator } from "@/lib/mock-data";
import { Section, PrivateToggle, CollaboratorsField } from "./fields";
import type { WizardState } from "./types";

type Props = {
  state: WizardState;
  setState: React.Dispatch<React.SetStateAction<WizardState>>;
  onSubmit: () => void;
};

export function CreateStep({ state, setState, onSubmit }: Props) {
  function setName(name: string) {
    setState((s) => ({ ...s, name }));
  }

  function togglePrivate() {
    setState((s) => ({ ...s, isPrivate: !s.isPrivate }));
  }

  function addCollaborator(c: Collaborator) {
    setState((s) =>
      s.collaborators.find((x) => x.id === c.id)
        ? s
        : { ...s, collaborators: [...s.collaborators, c] },
    );
  }

  function removeCollaborator(id: string) {
    setState((s) => ({
      ...s,
      collaborators: s.collaborators.filter((c) => c.id !== id),
    }));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <input
          value={state.name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New collection"
          className="w-full bg-transparent text-center text-[28px] font-medium tracking-[-0.56px] text-fg outline-none placeholder:text-fg-subtle"
        />
        <p className="mt-1 text-[12px] text-fg-muted">Name your collection</p>
      </div>

      <div className="h-px bg-border" />

      <PrivateToggle isPrivate={state.isPrivate} onToggle={togglePrivate} />

      <div className="h-px bg-border" />

      <Section label="Collaborators">
        <CollaboratorsField
          collaborators={state.collaborators}
          onAdd={addCollaborator}
          onRemove={removeCollaborator}
        />
      </Section>

      <div className="sticky bottom-0 -mx-5 -mb-6 mt-2 border-t border-border bg-bg/95 px-5 pb-6 pt-4 backdrop-blur">
        <button
          onClick={onSubmit}
          className="flex w-full items-center justify-center gap-1.5 rounded-full bg-fg px-4 py-3 text-[14px] font-medium tracking-[-0.28px] text-[#0D0D0D] active:scale-[0.97] transition-transform duration-150 ease-out"
        >
          Create collection
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck** — Run: `npx tsc --noEmit` — Expected: no errors (depends on `./fields` from Task 2).

- [ ] **Step 3: Lint** — Run: `npm run lint` — Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add components/ai-wizard/CreateStep.tsx
git commit -m "Add CreateStep (name + privacy + collaborators) form"
```

---

### Task 4: Branch WizardDrawer on mode

**Files:**
- Modify: `components/ai-wizard/WizardDrawer.tsx`

Read the full file first. Apply these exact edits.

- [ ] **Step 1: Update the lucide import**

Find:
```tsx
import { X, Sparkles, ArrowLeft } from "lucide-react";
```
Replace with:
```tsx
import { X, Sparkles, ArrowLeft, LayoutGrid } from "lucide-react";
```

- [ ] **Step 2: Import CreateStep**

Find:
```tsx
import { ResultsStep } from "./ResultsStep";
```
Replace with:
```tsx
import { ResultsStep } from "./ResultsStep";
import { CreateStep } from "./CreateStep";
```

- [ ] **Step 3: Read `mode` from the store**

Find:
```tsx
  const { isOpen, closeWizard } = useWizard();
```
Replace with:
```tsx
  const { isOpen, mode, closeWizard } = useWizard();
```

- [ ] **Step 4: Add `createManual`**

Find (the end of `save()`):
```tsx
    closeWizard();
    setTimeout(reset, 350);
    router.push(`/collection/${id}`);
  }

  return (
```
Replace with:
```tsx
    closeWizard();
    setTimeout(reset, 350);
    router.push(`/collection/${id}`);
  }

  function createManual() {
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
  }

  return (
```

- [ ] **Step 5: Mode-aware aria-label**

Find:
```tsx
            role="dialog"
            aria-label="New AI Collection"
          >
```
Replace with:
```tsx
            role="dialog"
            aria-label={mode === "create" ? "New collection" : "New AI Collection"}
          >
```

- [ ] **Step 6: Mode-aware header content**

Find:
```tsx
              <div className="flex items-center gap-2">
                {step === "results" || step === "generating" ? (
                  <button
                    onClick={() => setStep("brief")}
                    className="grid h-8 w-8 place-items-center rounded-full text-fg-muted hover:bg-surface hover:text-fg transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.92]"
                    aria-label="Back"
                  >
                    <ArrowLeft size={15} />
                  </button>
                ) : null}
                <span className="flex items-center gap-2 text-[13px] font-medium tracking-[-0.26px] text-fg">
                  <Sparkles size={14} className="text-fg" strokeWidth={1.75} />
                  New AI Collection
                </span>
                <span className="rounded-full bg-fg/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-fg-muted">
                  Premium
                </span>
              </div>
```
Replace with:
```tsx
              <div className="flex items-center gap-2">
                {mode === "create" ? (
                  <span className="flex items-center gap-2 text-[13px] font-medium tracking-[-0.26px] text-fg">
                    <LayoutGrid size={14} className="text-fg" strokeWidth={1.75} />
                    New collection
                  </span>
                ) : (
                  <>
                    {step === "results" || step === "generating" ? (
                      <button
                        onClick={() => setStep("brief")}
                        className="grid h-8 w-8 place-items-center rounded-full text-fg-muted hover:bg-surface hover:text-fg transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.92]"
                        aria-label="Back"
                      >
                        <ArrowLeft size={15} />
                      </button>
                    ) : null}
                    <span className="flex items-center gap-2 text-[13px] font-medium tracking-[-0.26px] text-fg">
                      <Sparkles size={14} className="text-fg" strokeWidth={1.75} />
                      New AI Collection
                    </span>
                    <span className="rounded-full bg-fg/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-fg-muted">
                      Premium
                    </span>
                  </>
                )}
              </div>
```

- [ ] **Step 7: Mode-aware body**

Find:
```tsx
            <div className="relative flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {step === "brief" && (
                  <motion.div
                    key="brief"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.16 } }}
                    transition={{ duration: 0.22 }}
                    className="mx-auto max-w-[560px] px-6 py-8"
                  >
                    <BriefStep state={state} setState={setState} onSubmit={startGenerate} />
                  </motion.div>
                )}
                {step === "generating" && (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.16 } }}
                    transition={{ duration: 0.22 }}
                    className="px-8 py-8"
                  >
                    <GeneratingStep state={state} />
                  </motion.div>
                )}
                {step === "results" && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.16 } }}
                    transition={{ duration: 0.22 }}
                    className="px-8 py-6"
                  >
                    <ResultsStep
                      state={state}
                      setState={setState}
                      onSave={save}
                      onRegenerate={regenerate}
                      onBack={() => setStep("brief")}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
```
Replace with:
```tsx
            <div className="relative flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {mode === "create" && (
                  <motion.div
                    key="create"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.16 } }}
                    transition={{ duration: 0.22 }}
                    className="mx-auto max-w-[560px] px-6 py-8"
                  >
                    <CreateStep state={state} setState={setState} onSubmit={createManual} />
                  </motion.div>
                )}
                {mode === "ai" && step === "brief" && (
                  <motion.div
                    key="brief"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.16 } }}
                    transition={{ duration: 0.22 }}
                    className="mx-auto max-w-[560px] px-6 py-8"
                  >
                    <BriefStep state={state} setState={setState} onSubmit={startGenerate} />
                  </motion.div>
                )}
                {mode === "ai" && step === "generating" && (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.16 } }}
                    transition={{ duration: 0.22 }}
                    className="px-8 py-8"
                  >
                    <GeneratingStep state={state} />
                  </motion.div>
                )}
                {mode === "ai" && step === "results" && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.16 } }}
                    transition={{ duration: 0.22 }}
                    className="px-8 py-6"
                  >
                    <ResultsStep
                      state={state}
                      setState={setState}
                      onSave={save}
                      onRegenerate={regenerate}
                      onBack={() => setStep("brief")}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
```

- [ ] **Step 8: Typecheck** — Run: `npx tsc --noEmit` — Expected: no errors.
- [ ] **Step 9: Lint** — Run: `npm run lint` — Expected: clean (no unused imports; `LayoutGrid`, `CreateStep`, `mode`, `createManual` all used).
- [ ] **Step 10: Build** — Run: `npm run build` — Expected: compiles successfully.
- [ ] **Step 11: Commit**

```bash
git add components/ai-wizard/WizardDrawer.tsx
git commit -m "Branch WizardDrawer on mode; add create (manual) flow"
```

---

### Task 5: Wire both entry points to create mode

**Files:**
- Modify: `components/cosmos/CreateDropdown.tsx`
- Modify: `components/cosmos/NavMenu.tsx`

- [ ] **Step 1: CreateDropdown — remove `useRouter` import**

In `components/cosmos/CreateDropdown.tsx`, find:
```tsx
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCollections } from "@/lib/collections-store";
import { useWizard } from "@/lib/wizard-store";
```
Replace with:
```tsx
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWizard } from "@/lib/wizard-store";
```

- [ ] **Step 2: CreateDropdown — drop `router`/`addCollection` and `createBlankCollection`**

Find:
```tsx
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { addCollection } = useCollections();
  const { openWizard } = useWizard();
```
Replace with:
```tsx
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { openWizard } = useWizard();
```

Then find and delete the entire `createBlankCollection` function (exact block):
```tsx
  function createBlankCollection() {
    const id = "manual-" + Date.now().toString(36);
    addCollection({
      id,
      title: "Vheni",
      brief: "minimal product",
      createdAt: Date.now(),
      imageUrls: [],
      source: "manual",
    });
    setOpen(false);
    router.push(`/collection/${id}`);
  }

```
(Delete those lines entirely, including the trailing blank line, so the next line after the `useEffect` cleanup is the `return (`.)

- [ ] **Step 3: CreateDropdown — point the "Collection" item at create mode**

Find:
```tsx
            <DropdownItem
              icon={<LayoutGrid size={16} strokeWidth={1.6} />}
              title="Collection"
              subtitle="A collection of elements"
              onClick={createBlankCollection}
            />
```
Replace with:
```tsx
            <DropdownItem
              icon={<LayoutGrid size={16} strokeWidth={1.6} />}
              title="Collection"
              subtitle="A collection of elements"
              onClick={() => {
                setOpen(false);
                openWizard("create");
              }}
            />
```

- [ ] **Step 4: NavMenu — add `createCollection` and wire the row**

In `components/cosmos/NavMenu.tsx`, find:
```tsx
  function createAICollection() {
    setOpen(false);
    openWizard();
  }
```
Replace with:
```tsx
  function createCollection() {
    setOpen(false);
    openWizard("create");
  }

  function createAICollection() {
    setOpen(false);
    openWizard();
  }
```

Then find:
```tsx
                  <Row
                    label="Create collection"
                    icon={<LayoutGrid size={20} strokeWidth={1.75} />}
                  />
```
Replace with:
```tsx
                  <Row
                    label="Create collection"
                    icon={<LayoutGrid size={20} strokeWidth={1.75} />}
                    onClick={createCollection}
                  />
```

- [ ] **Step 5: Typecheck** — Run: `npx tsc --noEmit` — Expected: no errors.
- [ ] **Step 6: Lint** — Run: `npm run lint` — Expected: clean (CreateDropdown has no unused `useRouter`/`useCollections`).
- [ ] **Step 7: Build** — Run: `npm run build` — Expected: compiles successfully.
- [ ] **Step 8: Manual verification** (dev server)

Run `npm run dev`. Verify against the spec:
- NavMenu "Create collection" and CreateDropdown "Collection" both open the drawer with header "New collection" — `LayoutGrid` icon, NO "Premium" badge, NO back arrow — showing only Name + Make-private + Collaborators (no Brief textarea, no "Add details").
- Submit with a name → new collection titled that name; empty name → "Untitled collection"; collection opens at `/collection/{id}` and appears in the collections list.
- CreateDropdown "AI Collection" and visiting `/create` still run the full AI flow (brief → generating → results → Done) unchanged.
- Escape and backdrop click close the drawer in both modes.

- [ ] **Step 9: Commit**

```bash
git add components/cosmos/CreateDropdown.tsx components/cosmos/NavMenu.tsx
git commit -m "Wire Create collection entry points to create-mode drawer"
```

---

## Notes for the executor

- This repo has **no test runner** (by design) — do not add one. Verification is `tsc`/`lint`/`build` + the manual checks in Task 5 Step 8.
- The AI flow must remain byte-for-byte behaviorally identical. Tasks 2 and 4 only restructure/branch; if any AI-flow behavior would change, stop and report.
- `openWizard()` with no argument must keep defaulting to `"ai"` (existing callers in `CreateDropdown` "AI Collection", `NavMenu` `createAICollection`, and `app/create/page.tsx` rely on this).
- Keep commits scoped exactly as specified (one task = one commit, except Task 2 which commits its two files together).
