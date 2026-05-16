"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, Layers, Lock, Plus, Search, Sparkles, Users, X } from "lucide-react";
import { motion } from "framer-motion";
import { useCollections } from "@/lib/collections-store";
import {
  resultsForBrief,
  sampleCollaborators,
  suggestTitle,
  type Collaborator,
  type SavedCollection,
} from "@/lib/mock-data";
import { Logo } from "@/components/cosmos/Logo";
import type { useToaster } from "./Toaster";
import { ImageTile } from "./ImageTile";

type Draft = {
  name: string;
  brief: string;
  isPrivate: boolean;
  collaborators: Collaborator[];
};

const emptyDraft: Draft = {
  name: "",
  brief: "",
  isPrivate: true,
  collaborators: [],
};

type View =
  | { kind: "list" }
  | { kind: "collection"; id: string }
  | { kind: "new-brief" }
  | { kind: "new-generating" }
  | { kind: "new-results"; images: string[] };

export function AICollectionsTab({
  toaster,
  initialCollectionId,
}: {
  toaster: ReturnType<typeof useToaster>;
  initialCollectionId?: string;
}) {
  const { collections, addCollection } = useCollections();
  const [view, setView] = useState<View>(
    initialCollectionId ? { kind: "collection", id: initialCollectionId } : { kind: "list" },
  );
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  useEffect(() => {
    if (initialCollectionId && view.kind === "list") {
      setView({ kind: "collection", id: initialCollectionId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCollectionId]);

  function resetDraft() {
    setDraft(emptyDraft);
  }

  if (view.kind === "list") {
    return (
      <CollectionList
        collections={collections}
        onOpen={(id) => setView({ kind: "collection", id })}
        onNew={() => {
          resetDraft();
          setView({ kind: "new-brief" });
        }}
      />
    );
  }

  if (view.kind === "collection") {
    const c = collections.find((x) => x.id === view.id);
    if (!c) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-fg-muted">
          <span className="text-[13px]">Collection not found.</span>
          <button
            onClick={() => setView({ kind: "list" })}
            className="rounded-pill bg-surface2 px-3 py-1 text-[12px] text-fg"
          >
            Back
          </button>
        </div>
      );
    }
    return (
      <CollectionDetail
        collection={c}
        onBack={() => setView({ kind: "list" })}
        onAdd={() => toaster.push("Added to canvas.")}
        onAddAll={() =>
          toaster.push(`Added ${c.imageUrls.length} elements to canvas.`)
        }
      />
    );
  }

  if (view.kind === "new-brief") {
    return (
      <NewBriefView
        draft={draft}
        setDraft={setDraft}
        onBack={() => setView({ kind: "list" })}
        onGenerate={() => {
          setView({ kind: "new-generating" });
          setTimeout(() => {
            setView({ kind: "new-results", images: resultsForBrief(draft.brief) });
          }, 1800);
        }}
      />
    );
  }

  if (view.kind === "new-generating") {
    return <NewGeneratingView brief={draft.brief} />;
  }

  if (view.kind === "new-results") {
    return (
      <NewResultsView
        draft={draft}
        images={view.images}
        onAdd={() => toaster.push("Added to canvas.")}
        onAddAll={() =>
          toaster.push(`Added ${view.images.length} elements to canvas.`)
        }
        onSave={() => {
          const id = "ai-" + Date.now().toString(36);
          addCollection({
            id,
            title: draft.name.trim() || suggestTitle(draft.brief),
            brief: draft.brief,
            createdAt: Date.now(),
            imageUrls: view.images,
            source: "ai",
            isPrivate: draft.isPrivate,
            collaborators: draft.collaborators,
          });
          toaster.push("Collection saved.");
          setView({ kind: "collection", id });
        }}
        onBack={() => setView({ kind: "new-brief" })}
      />
    );
  }

  return null;
}

function CollectionList({
  collections,
  onOpen,
  onNew,
}: {
  collections: SavedCollection[];
  onOpen: (id: string) => void;
  onNew: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-surface px-3 py-2.5 text-[11px] uppercase tracking-wider text-fg-muted">
        Your AI Collections
      </div>
      <div className="flex-1 overflow-y-auto">
        <button
          onClick={onNew}
          className="flex w-full items-center gap-3 border-b border-border px-3 py-3 text-left transition-[background-color,transform] duration-150 ease-out hover:bg-surface2 active:scale-[0.97]"
        >
          <div className="grid h-10 w-10 place-items-center rounded-md bg-bg ring-1 ring-border">
            <Plus size={14} className="text-fg" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-fg">
              New AI Collection
              <Sparkles size={11} className="text-fg-muted" />
            </div>
            <div className="text-[11px] text-fg-muted">Generate from a brief, without leaving Figma.</div>
          </div>
        </button>
        {collections
          .filter((c) => c.source === "ai")
          .map((c) => (
            <button
              key={c.id}
              onClick={() => onOpen(c.id)}
              className="flex w-full items-center gap-3 border-b border-border px-3 py-3 text-left transition-[background-color,transform] duration-150 ease-out hover:bg-surface2 active:scale-[0.97]"
            >
              <div className="grid h-10 w-10 grid-cols-2 grid-rows-2 gap-px overflow-hidden rounded-md bg-bg">
                {c.imageUrls.slice(0, 4).map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={url} alt="" className="h-full w-full object-cover" />
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] font-medium text-fg">{c.title}</div>
                <div className="text-[11px] text-fg-muted">{c.imageUrls.length} elements</div>
              </div>
              <ChevronRight size={14} className="text-fg-muted" />
            </button>
          ))}
      </div>
    </div>
  );
}

function CollectionDetail({
  collection,
  onBack,
  onAdd,
  onAddAll,
}: {
  collection: SavedCollection;
  onBack: () => void;
  onAdd: (url: string) => void;
  onAddAll: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border bg-surface px-2 py-2">
        <button
          onClick={onBack}
          className="grid h-7 w-7 place-items-center rounded-sm text-fg-muted hover:bg-surface2 hover:text-fg active:scale-[0.97] transition-transform duration-150 ease-out"
        >
          <ArrowLeft size={13} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12px] font-medium text-fg">{collection.title}</div>
          <div className="flex items-center gap-1.5 text-[10px] text-fg-muted">
            <span>{collection.imageUrls.length} elements · AI</span>
            {collection.isPrivate && (
              <span className="flex items-center gap-0.5">
                · <Lock size={9} strokeWidth={1.75} /> Private
              </span>
            )}
            {collection.collaborators && collection.collaborators.length > 0 && (
              <span className="flex items-center gap-0.5">
                · <Users size={9} strokeWidth={1.75} /> {collection.collaborators.length}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 gap-1.5">
          {collection.imageUrls.map((url, i) => (
            <ImageTile key={url + i} src={url} onClick={() => onAdd(url)} />
          ))}
        </div>
      </div>
      <div className="shrink-0 border-t border-border bg-surface px-3 py-2.5">
        <button
          onClick={onAddAll}
          className="flex w-full items-center justify-center gap-1.5 rounded-pill bg-fg px-3 py-2 text-[12px] font-medium text-bg active:scale-[0.97] transition-transform duration-150 ease-out"
        >
          <Layers size={12} />
          Add all to canvas
        </button>
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  "Warm archival coffee brand",
  "Minimal SaaS launch",
  "Brutalist architecture posters",
  "Botanical wedding stationery",
];

function NewBriefView({
  draft,
  setDraft,
  onBack,
  onGenerate,
}: {
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
  onBack: () => void;
  onGenerate: () => void;
}) {
  const canSubmit = draft.brief.trim().length > 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border bg-surface px-2 py-2">
        <button
          onClick={onBack}
          className="grid h-7 w-7 place-items-center rounded-sm text-fg-muted hover:bg-surface2 hover:text-fg active:scale-[0.97] transition-transform duration-150 ease-out"
        >
          <ArrowLeft size={13} />
        </button>
        <div className="flex-1 text-[12px] font-medium text-fg">New AI Collection</div>
        <span className="rounded-pill bg-fg/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-fg">
          Premium
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
        <div>
          <FieldLabel>Name</FieldLabel>
          <input
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            placeholder="New collection"
            className="w-full rounded-md bg-surface2 px-2.5 py-2 text-[12px] text-fg placeholder:text-fg-subtle outline-none ring-1 ring-inset ring-border/60 focus:ring-fg/40"
          />
        </div>

        <div>
          <FieldLabel>Brief</FieldLabel>
          <textarea
            value={draft.brief}
            onChange={(e) => setDraft((d) => ({ ...d, brief: e.target.value }))}
            rows={4}
            placeholder="A warm, archival editorial for a coffee brand…"
            className="w-full resize-none rounded-md bg-surface2 p-2.5 text-[12px] leading-relaxed text-fg placeholder:text-fg-subtle outline-none ring-1 ring-inset ring-border/60 focus:ring-fg/40"
          />
        </div>

        <div>
          <FieldLabel>Suggestions</FieldLabel>
          <div className="flex flex-col gap-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setDraft((d) => ({ ...d, brief: s, name: d.name || suggestTitle(s) }))}
                className="flex items-center justify-between rounded-md bg-surface2 px-2.5 py-1.5 text-left text-[11px] text-fg-muted hover:bg-surface3 hover:text-fg active:scale-[0.98] transition-transform duration-150 ease-out"
              >
                <span>{s}</span>
                <Plus size={11} />
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-border" />

        <PrivateToggle
          isPrivate={draft.isPrivate}
          onToggle={() => setDraft((d) => ({ ...d, isPrivate: !d.isPrivate }))}
        />

        <div className="h-px bg-border" />

        <div>
          <FieldLabel>Collaborators</FieldLabel>
          <CollaboratorsField
            collaborators={draft.collaborators}
            onAdd={(c) =>
              setDraft((d) =>
                d.collaborators.find((x) => x.id === c.id)
                  ? d
                  : { ...d, collaborators: [...d.collaborators, c] },
              )
            }
            onRemove={(id) =>
              setDraft((d) => ({ ...d, collaborators: d.collaborators.filter((c) => c.id !== id) }))
            }
          />
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-surface px-3 py-2.5">
        <button
          onClick={onGenerate}
          disabled={!canSubmit}
          className="flex w-full items-center justify-center gap-1.5 rounded-pill bg-fg px-3 py-2 text-[12px] font-medium text-bg disabled:opacity-30 active:scale-[0.97] transition-transform duration-150 ease-out"
        >
          <Sparkles size={12} />
          Generate
        </button>
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-fg-muted">{children}</div>
  );
}

function PrivateToggle({
  isPrivate,
  onToggle,
}: {
  isPrivate: boolean;
  onToggle: () => void;
}) {
  return (
    <button onClick={onToggle} className="flex w-full items-center justify-between gap-3 text-left active:scale-[0.98] transition-transform duration-150 ease-out">
      <div>
        <div className="text-[12px] font-medium text-fg">Make private</div>
        <div className="text-[10px] text-fg-muted">For just you and your collaborators</div>
      </div>
      <span
        aria-hidden
        className={
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-[background-color] duration-200 ease-out " +
          (isPrivate ? "bg-fg" : "bg-surface3")
        }
      >
        <span
          className={
            "inline-block h-4 w-4 rounded-full bg-bg shadow-sm transition-transform duration-200 ease-out " +
            (isPrivate ? "translate-x-[18px]" : "translate-x-[2px]")
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
        <div className="mb-1.5 flex flex-wrap gap-1">
          {collaborators.map((c) => (
            <span
              key={c.id}
              className="flex items-center gap-1 rounded-full bg-surface2 py-0.5 pl-0.5 pr-1.5 text-[11px] text-fg ring-1 ring-inset ring-border"
            >
              <span
                className="grid h-4 w-4 place-items-center rounded-full text-[8px] font-medium text-bg"
                style={{ background: c.avatarColor }}
              >
                {c.name.charAt(0)}
              </span>
              {c.name}
              <button onClick={() => onRemove(c.id)} aria-label={`Remove ${c.name}`}>
                <X size={9} className="text-fg-muted hover:text-fg" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="flex items-center gap-1.5 rounded-md bg-surface2 px-2 py-1.5 ring-1 ring-inset ring-border/60 focus-within:ring-fg/40">
          <Search size={11} className="text-fg-muted" strokeWidth={1.75} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search by name or email…"
            className="flex-1 bg-transparent text-[11px] text-fg outline-none placeholder:text-fg-muted"
          />
        </div>

        {focused && results.length > 0 && (
          <div className="absolute inset-x-0 bottom-[calc(100%+4px)] z-10 overflow-hidden rounded-md bg-surface p-1 shadow-lg ring-1 ring-inset ring-border">
            {results.map((c) => (
              <button
                key={c.id}
                onMouseDown={(e) => {
                  // Use mousedown so the click registers before the input blur
                  // hides the dropdown.
                  e.preventDefault();
                  onAdd(c);
                  setQuery("");
                }}
                className="flex w-full items-center gap-2 rounded-sm px-1.5 py-1.5 text-left hover:bg-surface2"
              >
                <span
                  className="grid h-5 w-5 place-items-center rounded-full text-[9px] font-medium text-bg"
                  style={{ background: c.avatarColor }}
                >
                  {c.name.charAt(0)}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate text-[11px] text-fg">{c.name}</span>
                  <span className="block truncate text-[10px] text-fg-muted">{c.email}</span>
                </span>
                <Plus size={11} className="text-fg-muted" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NewGeneratingView({ brief }: { brief: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2.5 text-[11px] text-fg-muted">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.6, ease: "linear", repeat: Infinity }}
          className="shrink-0 text-fg"
        >
          <Logo size={12} />
        </motion.div>
        <span className="truncate">
          Generating · “{brief.slice(0, 40)}{brief.length > 40 ? "…" : ""}”
        </span>
      </div>
      <div className="flex-1 overflow-hidden p-2">
        <div className="grid grid-cols-2 gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.06 }}
              className="aspect-square rounded-sm shimmer-bg animate-shimmer"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function NewResultsView({
  draft,
  images,
  onAdd,
  onAddAll,
  onSave,
  onBack,
}: {
  draft: Draft;
  images: string[];
  onAdd: () => void;
  onAddAll: () => void;
  onSave: () => void;
  onBack: () => void;
}) {
  const title = draft.name.trim() || suggestTitle(draft.brief);
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border bg-surface px-2 py-2">
        <button
          onClick={onBack}
          className="grid h-7 w-7 place-items-center rounded-sm text-fg-muted hover:bg-surface2 hover:text-fg active:scale-[0.97] transition-transform duration-150 ease-out"
        >
          <ArrowLeft size={13} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12px] font-medium text-fg">{title}</div>
          <div className="flex items-center gap-1.5 text-[10px] text-fg-muted">
            <span>{images.length} generated</span>
            {draft.isPrivate && (
              <span className="flex items-center gap-0.5">
                · <Lock size={9} strokeWidth={1.75} /> Private
              </span>
            )}
            {draft.collaborators.length > 0 && (
              <span className="flex items-center gap-0.5">
                · <Users size={9} strokeWidth={1.75} /> {draft.collaborators.length}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 gap-1.5">
          {images.map((url, i) => (
            <ImageTile key={url + i} src={url} onClick={onAdd} />
          ))}
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-2 border-t border-border bg-surface px-3 py-2.5">
        <button
          onClick={onAddAll}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-pill bg-surface2 px-3 py-2 text-[12px] font-medium text-fg ring-1 ring-inset ring-border hover:bg-surface3 active:scale-[0.97] transition-[background-color,transform] duration-150 ease-out"
        >
          <Layers size={12} />
          Add all to canvas
        </button>
        <button
          onClick={onSave}
          className="flex shrink-0 items-center justify-center rounded-pill bg-fg px-4 py-2 text-[12px] font-medium text-bg active:scale-[0.97] transition-transform duration-150 ease-out"
        >
          Save
        </button>
      </div>
    </div>
  );
}
