"use client";

import { useMemo, useState } from "react";
import { Search, Camera } from "lucide-react";
import { exploreElements } from "@/lib/mock-data";
import type { useToaster } from "./Toaster";
import { ImageTile } from "./ImageTile";

const PLUGIN_CATEGORIES = [
  "All",
  "Graphic Design",
  "Type",
  "Color",
  "Nature",
  "Architecture",
  "Product",
  "Fashion",
];

export function SearchTab({ toaster }: { toaster: ReturnType<typeof useToaster> }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const images = useMemo(() => {
    let pool = [...exploreElements, ...exploreElements]; // duplicate for fuller grid
    if (q.trim()) {
      const needle = q.toLowerCase();
      pool = pool.filter((e) => e.tags.some((t) => t.includes(needle)));
      if (pool.length === 0) pool = exploreElements;
    }
    return pool;
  }, [q]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-surface px-3 py-2.5">
        <div className="flex items-center gap-2 rounded-md bg-surface2 px-2.5 py-1.5 ring-1 ring-border/60">
          <Search size={12} className="text-fg-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Cosmos…"
            className="flex-1 bg-transparent text-[12px] text-fg placeholder:text-fg-subtle outline-none"
          />
          <button aria-label="Visual search" className="text-fg-muted hover:text-fg">
            <Camera size={12} />
          </button>
          <button aria-label="Color search" className="grid h-4 w-4 place-items-center">
            <span
              className="block h-3 w-3 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, #ff6a00, #ee0979, #6a00ff, #00b3ff, #00ff85, #faff00, #ff6a00)",
              }}
            />
          </button>
        </div>
        <div className="scrollbar-none mt-2 flex gap-1 overflow-x-auto">
          {PLUGIN_CATEGORIES.map((c) => {
            const on = cat === c;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={
                  "shrink-0 rounded-pill px-2.5 py-1 text-[11px] transition-colors " +
                  (on ? "bg-fg text-bg" : "text-fg-muted hover:bg-surface2 hover:text-fg")
                }
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 gap-1.5">
          {images.map((img, i) => (
            <ImageTile
              key={img.id + i}
              src={img.url}
              onClick={() => toaster.push("Added to canvas.")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
