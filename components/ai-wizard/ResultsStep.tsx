"use client";

import { Check, Lock, RefreshCw, Users } from "lucide-react";
import type { WizardState } from "./types";

type Props = {
  state: WizardState;
  setState: React.Dispatch<React.SetStateAction<WizardState>>;
  onSave: () => void;
  onRegenerate: () => void;
  onBack: () => void;
};

const ASPECTS = ["3 / 4", "1 / 1", "4 / 5", "3 / 4", "5 / 6", "1 / 1", "3 / 4", "4 / 5"];

export function ResultsStep({ state, setState, onSave, onRegenerate }: Props) {
  const selectedCount = state.selected.size;

  function toggle(url: string) {
    setState((s) => {
      const next = new Set(s.selected);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return { ...s, selected: next };
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-[20px] font-medium tracking-[-0.4px] text-fg">{state.name}</h2>
        <p className="mt-1 text-[13px] text-fg-muted">
          Tap to add elements to your collection · {selectedCount} of {state.imageUrls.length} selected
        </p>
        <div className="mt-2 flex items-center justify-center gap-3 text-[12px] text-fg-muted">
          {state.isPrivate && (
            <span className="flex items-center gap-1">
              <Lock size={10} strokeWidth={1.75} /> Private
            </span>
          )}
          {state.collaborators.length > 0 && (
            <span className="flex items-center gap-1">
              <Users size={10} strokeWidth={1.75} /> {state.collaborators.length}{" "}
              collaborator{state.collaborators.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </div>

      <div className="columns-2 gap-3 sm:columns-3 md:columns-4 xl:columns-5 [&>*]:mb-3 [&>*]:break-inside-avoid">
        {state.imageUrls.map((url, i) => {
          const on = state.selected.has(url);
          const aspect = ASPECTS[i % ASPECTS.length];
          return (
            <button
              key={url + i}
              onClick={() => toggle(url)}
              className="group relative block w-full overflow-hidden rounded-lg bg-surface2 active:scale-[0.99] transition-transform duration-150 ease-out"
              style={{ aspectRatio: aspect }}
              aria-pressed={on}
              aria-label={on ? "Remove from collection" : "Add to collection"}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className={
                  "absolute inset-0 h-full w-full object-cover transition-[transform,filter] ease-out duration-300 group-hover:scale-[1.02] " +
                  (on ? "" : "brightness-[0.7]")
                }
              />
              <span
                className={
                  "absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.35)] transition-transform duration-150 ease-out group-hover:scale-105 " +
                  (on ? "bg-black text-white" : "bg-white text-black")
                }
              >
                {on ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="1.75"
                      d="M4 13.615 9.714 19A99.4 99.4 0 0 1 20 5"
                    />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path stroke="currentColor" strokeWidth="1.75" d="M12 3v18m-9-9h18" />
                  </svg>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="sticky bottom-0 -mx-8 -mb-6 mt-2 flex items-center justify-between gap-3 border-t border-border bg-bg/95 px-8 pb-6 pt-4 backdrop-blur">
        <button
          onClick={onRegenerate}
          className="flex items-center gap-1.5 rounded-full bg-surface px-4 py-2.5 text-[13px] text-fg-muted ring-1 ring-inset ring-border hover:text-fg active:scale-[0.97] transition-transform duration-150 ease-out"
        >
          <RefreshCw size={13} />
          Regenerate
        </button>
        <button
          onClick={onSave}
          disabled={selectedCount === 0}
          className="flex items-center gap-1.5 rounded-full bg-fg px-6 py-2.5 text-[14px] font-medium tracking-[-0.28px] text-[#0D0D0D] disabled:opacity-30 active:scale-[0.97] transition-transform duration-150 ease-out"
        >
          Done
        </button>
      </div>
    </div>
  );
}
