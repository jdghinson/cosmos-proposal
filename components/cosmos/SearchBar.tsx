"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { recentColors, recentSearches } from "@/lib/mock-data";

const PLACEHOLDERS = [
  "Search Cosmos…",
  "Try 'archival fashion'",
  "Try 'celestial maps'",
  "Try 'contemporary art'",
  "Try 'minimal product'",
];

const COSMOS_DOTS = [
  { cx: 12, cy: 4.441, fill: "#EBB042" },
  { cx: 17.205, cy: 6.769, fill: "#9C6030" },
  { cx: 19.548, cy: 11.686, fill: "#A0213E" },
  { cx: 17.205, cy: 17.231, fill: "#C877CB" },
  { cx: 12, cy: 19.559, fill: "#6951F5" },
  { cx: 6.796, cy: 17.118, fill: "#4694F6" },
  { cx: 4.452, cy: 11.686, fill: "#77CDD0" },
  { cx: 6.796, cy: 6.882, fill: "#81B386" },
];

export type SearchScope = {
  name: string;
  thumbnail?: string;
  avatar?: React.ReactNode;
  placeholder?: string;
};

export function SearchBar({ scope }: { scope?: SearchScope }) {
  const [open, setOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState(
    scope ? scope.placeholder ?? `Search in ${scope.name}…` : PLACEHOLDERS[3],
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scope) {
      setPlaceholder(scope.placeholder ?? `Search in ${scope.name}…`);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % PLACEHOLDERS.length;
      setPlaceholder(PLACEHOLDERS[i]);
    }, 2600);
    return () => clearInterval(id);
  }, [scope]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="flex h-[54px] items-center gap-2 rounded-full bg-surface p-2 ring-1 ring-inset ring-border">
        {scope ? (
          <div className="ml-1 flex h-[38px] items-center gap-1.5 rounded-full bg-bg pl-1 pr-3 ring-1 ring-inset ring-border">
            <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-surface2">
              {scope.avatar ? (
                scope.avatar
              ) : scope.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={scope.thumbnail} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-fg">
                  <svg width="14" height="14" viewBox="0 0 28 31" fill="currentColor">
                    <circle cx="14" cy="4.5" r="4.5" />
                    <circle cx="14" cy="26.5" r="4.5" />
                    <circle cx="4.5" cy="10" r="4.5" />
                    <circle cx="23.5" cy="21" r="4.5" />
                    <circle cx="23.5" cy="10" r="4.5" />
                    <circle cx="4.5" cy="21" r="4.5" />
                  </svg>
                </div>
              )}
            </div>
            <span className="max-w-[140px] truncate text-[13px] font-medium tracking-[-0.26px] text-fg">
              {scope.name}
            </span>
          </div>
        ) : (
          <Search size={18} strokeWidth={1.75} className="ml-2 mr-0.5 text-fg-muted" />
        )}
        <input
          placeholder={placeholder}
          onFocus={() => !scope && setOpen(true)}
          className="flex-1 bg-transparent text-[14px] font-medium tracking-[-0.28px] text-fg placeholder:text-fg-muted outline-none"
        />
        <button
          aria-label="Visual search"
          className="grid h-[38px] w-[38px] place-items-center rounded-full text-fg-muted hover:bg-surface2 hover:text-fg"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              stroke="currentColor"
              strokeWidth="1.75"
              d="M9 4h-.2c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C4 6.28 4 7.12 4 8.8V9m11-5h.2c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C20 6.28 20 7.12 20 8.8V9M9 20h-.2c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C4 17.72 4 16.88 4 15.2V15m11 5h.2c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C20 17.72 20 16.88 20 15.2V15"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
          </svg>
        </button>
        <button
          aria-label="Color search"
          className="grid h-[38px] w-[38px] place-items-center rounded-full hover:bg-surface2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            {COSMOS_DOTS.map((d, i) => (
              <ellipse key={i} cx={d.cx} cy={d.cy} rx="1.952" ry="1.941" fill={d.fill} />
            ))}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && !scope && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 rounded-2xl bg-surface p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-inset ring-border"
          >
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between text-[12px] text-fg-muted">
                <span>Recent</span>
                <button className="hover:text-fg">Clear</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((q) => (
                  <button
                    key={q}
                    className="flex items-center gap-2 rounded-full bg-surface2 px-3 py-1.5 text-[12px] text-fg hover:bg-surface3"
                  >
                    <Search size={12} className="text-fg-muted" />
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-2">
              <div className="mb-2 text-[12px] text-fg-muted">Colors</div>
              <div className="flex flex-wrap gap-2">
                {recentColors.map((c) => (
                  <button
                    key={c}
                    className="flex items-center gap-2 rounded-full bg-surface2 px-3 py-1.5 text-[12px] text-fg hover:bg-surface3"
                  >
                    <span className="block h-3 w-3 rounded-full" style={{ background: c }} />
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
