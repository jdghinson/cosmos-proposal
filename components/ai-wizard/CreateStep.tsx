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
