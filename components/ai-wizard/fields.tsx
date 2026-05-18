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
