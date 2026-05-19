"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  const [error, setError] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % PLACEHOLDERS.length;
      setPlaceholder(PLACEHOLDERS[i]);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  // Close the "Add details" popover on outside click. No Escape handler here:
  // WizardModal owns Escape (closes the whole modal) and we don't want a
  // popover-level listener fighting it.
  useEffect(() => {
    if (!expanded) return;
    function onDown(e: MouseEvent) {
      if (detailsRef.current && !detailsRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [expanded]);

  function setName(name: string) {
    if (error && name.trim()) setError(false);
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

  function handleSubmit() {
    if (!state.name.trim()) {
      setError(true);
      return;
    }
    setError(false);
    onSubmit();
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
      </div>

      {error && (
        <p
          role="alert"
          className="-mt-2 text-center text-[12px] leading-[14px] tracking-[-0.24px] text-[#EF7759]"
        >
          Collection name is required
        </p>
      )}

      <Section label="Brief">
        <textarea
          value={state.brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full resize-none rounded-xl bg-surface px-3.5 py-3 text-[14px] leading-relaxed text-fg outline-none placeholder:text-fg-subtle ring-1 ring-inset ring-border focus:ring-fg/30"
        />
        <div className="mt-2 flex items-center justify-between">
          <div ref={detailsRef} className="relative">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] text-fg-muted hover:bg-surface hover:text-fg"
            >
              Add details
              <ChevronDown size={13} className={"transition-transform duration-200 ease-out " + (expanded ? "rotate-180" : "")} />
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -4, transition: { duration: 0.12, ease: [0.2, 0.6, 0.2, 1] } }}
                  transition={{ duration: 0.16, ease: [0.2, 0.6, 0.2, 1] }}
                  style={{ transformOrigin: "top left" }}
                  className="absolute left-0 top-[calc(100%+8px)] z-20 w-[320px] max-w-[calc(100vw-3rem)] space-y-4 rounded-xl bg-surface p-3 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-inset ring-border"
                >
                  <Refinements state={state} setState={setState} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {state.keywords.length + state.projectTypes.length > 0 && (
            <span className="text-[11px] text-fg-subtle">
              {state.keywords.length + state.projectTypes.length} refinements
            </span>
          )}
        </div>
      </Section>

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
          onClick={handleSubmit}
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
