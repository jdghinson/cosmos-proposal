"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useCollections } from "@/lib/collections-store";
import { resultsForBrief, suggestTitle, type SavedCollection } from "@/lib/mock-data";
import type { useToaster } from "./Toaster";
import { ImageTile } from "./ImageTile";

type View =
  | { kind: "list" }
  | { kind: "collection"; id: string }
  | { kind: "new-brief" }
  | { kind: "new-generating"; brief: string }
  | { kind: "new-results"; brief: string; images: string[] };

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

  useEffect(() => {
    if (initialCollectionId && view.kind === "list") {
      setView({ kind: "collection", id: initialCollectionId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCollectionId]);

  if (view.kind === "list") {
    return (
      <CollectionList
        collections={collections}
        onOpen={(id) => setView({ kind: "collection", id })}
        onNew={() => setView({ kind: "new-brief" })}
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
        onAdd={(url) => toaster.push("Added to canvas.")}
      />
    );
  }

  if (view.kind === "new-brief") {
    return (
      <NewBriefView
        onBack={() => setView({ kind: "list" })}
        onGenerate={(brief) => {
          setView({ kind: "new-generating", brief });
          setTimeout(() => {
            setView({ kind: "new-results", brief, images: resultsForBrief(brief) });
          }, 1800);
        }}
      />
    );
  }

  if (view.kind === "new-generating") {
    return <NewGeneratingView brief={view.brief} />;
  }

  if (view.kind === "new-results") {
    return (
      <NewResultsView
        brief={view.brief}
        images={view.images}
        onAdd={() => toaster.push("Added to canvas.")}
        onSave={() => {
          const id = "ai-" + Date.now().toString(36);
          addCollection({
            id,
            title: suggestTitle(view.brief),
            brief: view.brief,
            createdAt: Date.now(),
            imageUrls: view.images,
            source: "ai",
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
          className="flex w-full items-center gap-3 border-b border-border px-3 py-3 text-left transition-colors hover:bg-surface2"
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
              className="flex w-full items-center gap-3 border-b border-border px-3 py-3 text-left transition-colors hover:bg-surface2"
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
}: {
  collection: SavedCollection;
  onBack: () => void;
  onAdd: (url: string) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border bg-surface px-2 py-2">
        <button
          onClick={onBack}
          className="grid h-7 w-7 place-items-center rounded-sm text-fg-muted hover:bg-surface2 hover:text-fg"
        >
          <ArrowLeft size={13} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12px] font-medium text-fg">{collection.title}</div>
          <div className="text-[10px] text-fg-muted">{collection.imageUrls.length} elements · AI</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 gap-1.5">
          {collection.imageUrls.map((url, i) => (
            <ImageTile key={url + i} src={url} onClick={() => onAdd(url)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function NewBriefView({
  onBack,
  onGenerate,
}: {
  onBack: () => void;
  onGenerate: (brief: string) => void;
}) {
  const [brief, setBrief] = useState("");
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border bg-surface px-2 py-2">
        <button
          onClick={onBack}
          className="grid h-7 w-7 place-items-center rounded-sm text-fg-muted hover:bg-surface2 hover:text-fg"
        >
          <ArrowLeft size={13} />
        </button>
        <div className="flex-1 text-[12px] font-medium text-fg">New AI Collection</div>
        <span className="rounded-pill bg-fg/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-fg">
          Premium
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <div className="mb-1.5 text-[11px] uppercase tracking-wider text-fg-muted">Brief</div>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            rows={5}
            placeholder="A warm, archival editorial for a coffee brand…"
            className="w-full resize-none rounded-md bg-surface2 p-3 text-[12px] leading-relaxed text-fg placeholder:text-fg-subtle outline-none ring-1 ring-border/60 focus:ring-fg/40"
          />
        </div>

        <div>
          <div className="mb-1.5 text-[11px] uppercase tracking-wider text-fg-muted">Suggestions</div>
          <div className="flex flex-col gap-1">
            {[
              "Warm archival coffee brand",
              "Minimal SaaS launch",
              "Brutalist architecture posters",
              "Botanical wedding stationery",
            ].map((s) => (
              <button
                key={s}
                onClick={() => setBrief(s)}
                className="flex items-center justify-between rounded-md bg-surface2 px-2.5 py-1.5 text-left text-[11px] text-fg-muted hover:bg-surface3 hover:text-fg"
              >
                <span>{s}</span>
                <Plus size={11} />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onGenerate(brief)}
          disabled={!brief.trim()}
          className="mt-auto flex items-center justify-center gap-1.5 rounded-pill bg-fg px-3 py-2 text-[12px] font-medium text-bg disabled:opacity-30"
        >
          <Sparkles size={12} />
          Generate
        </button>
      </div>
    </div>
  );
}

function NewGeneratingView({ brief }: { brief: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-surface px-3 py-2.5 text-[11px] text-fg-muted">
        Generating · “{brief.slice(0, 40)}{brief.length > 40 ? "…" : ""}”
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
  brief,
  images,
  onAdd,
  onSave,
  onBack,
}: {
  brief: string;
  images: string[];
  onAdd: () => void;
  onSave: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border bg-surface px-2 py-2">
        <button
          onClick={onBack}
          className="grid h-7 w-7 place-items-center rounded-sm text-fg-muted hover:bg-surface2 hover:text-fg"
        >
          <ArrowLeft size={13} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12px] font-medium text-fg">{suggestTitle(brief)}</div>
          <div className="text-[10px] text-fg-muted">{images.length} generated</div>
        </div>
        <button
          onClick={onSave}
          className="rounded-pill bg-fg px-2.5 py-1 text-[11px] font-medium text-bg"
        >
          Save
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 gap-1.5">
          {images.map((url, i) => (
            <ImageTile key={url + i} src={url} onClick={onAdd} />
          ))}
        </div>
      </div>
    </div>
  );
}
