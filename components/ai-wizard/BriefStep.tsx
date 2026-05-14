"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Search, Sparkles, Plus, X } from "lucide-react";
import { projectTypes, sampleCollaborators, type Collaborator, type ProjectType } from "@/lib/mock-data";
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
            <ChevronDown size={13} className={"transition-transform " + (expanded ? "rotate-180" : "")} />
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
          className="flex w-full items-center justify-center gap-1.5 rounded-full bg-fg px-4 py-3 text-[14px] font-medium tracking-[-0.28px] text-[#0D0D0D] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Sparkles size={14} />
          Generate collection
        </button>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[12px] font-medium tracking-[-0.24px] text-fg">{label}</div>
      {children}
    </div>
  );
}

function PrivateToggle({ isPrivate, onToggle }: { isPrivate: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 text-left"
    >
      <div>
        <div className="text-[14px] font-medium text-fg">Make private</div>
        <div className="text-[12px] text-fg-muted">For just you and your collaborators</div>
      </div>
      <span
        aria-hidden
        className={
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors " +
          (isPrivate ? "bg-fg" : "bg-surface3")
        }
      >
        <span
          className={
            "inline-block h-5 w-5 rounded-full bg-bg shadow-sm transition-transform " +
            (isPrivate ? "translate-x-[22px]" : "translate-x-[2px]")
          }
        />
      </span>
    </button>
  );
}

function CollaboratorsField({
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

  function setColor(c: string | null) {
    setState((s) => ({ ...s, color: c }));
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

      {/* <div>
        <div className="mb-1.5 text-[11px] uppercase tracking-wider text-fg-muted">Color anchor</div>
        <div className="flex flex-wrap items-center gap-1.5">
          {["#57612C", "#CB1E1E", "#601515", "#6BA661", "#949494", "#E8C58E", "#1F3A5F"].map((c) => (
            <button
              key={c}
              onClick={() => setColor(state.color === c ? null : c)}
              aria-label={`Anchor color ${c}`}
              className={
                "h-6 w-6 rounded-full border-2 transition-all " +
                (state.color === c ? "scale-110 border-fg" : "border-transparent")
              }
              style={{ background: c }}
            />
          ))}
          {state.color && (
            <button
              onClick={() => setColor(null)}
              className="ml-1 flex items-center gap-1 rounded-full bg-surface2 px-2 py-0.5 text-[11px] text-fg-muted hover:text-fg"
            >
              <X size={10} />
              Clear
            </button>
          )}
        </div>
      </div> */}
    </>
  );
}
