"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, ChevronRight } from "lucide-react";
import { useCollections } from "@/lib/collections-store";

function ThumbStack({ thumbs }: { thumbs: string[] }) {
  const front = thumbs[0];
  const back = thumbs[1];
  if (!front) return null;
  return (
    <div className="relative -mx-[3px] grid h-7 w-[34px] place-items-center">
      {back && (
        <div
          className="absolute left-0 top-0 h-7 w-7 overflow-hidden rounded-lg ring-[1.5px] ring-surface"
          style={{ transform: "rotate(-3deg)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={back} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div
        className={`absolute h-[26px] w-[26px] overflow-hidden rounded-md ${back ? "left-[8px] top-[2px]" : "left-[4px] top-[1px]"}`}
        style={{ transform: back ? "rotate(2deg)" : "rotate(-2deg)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={front} alt="" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}

function AppsIcon() {
  return (
    <svg width="10" height="11" viewBox="0 0 28 31" fill="currentColor">
      <circle cx="14" cy="4.5" r="4.5" />
      <circle cx="14" cy="26.5" r="4.5" />
      <circle cx="4.5" cy="10" r="4.5" />
      <circle cx="23.5" cy="21" r="4.5" />
      <circle cx="23.5" cy="10" r="4.5" />
      <circle cx="4.5" cy="21" r="4.5" />
    </svg>
  );
}

export function CollectionsButton() {
  const { collections, hydrated } = useCollections();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const userCollections = collections.filter(
    (c) => !c.id.startsWith("seed-") && c.imageUrls.length > 0,
  );
  const recent = userCollections.slice(0, 3);
  const totalElements = userCollections.reduce((sum, c) => sum + c.imageUrls.length, 0);
  const hasCollections = userCollections.length > 0;

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

  // Avoid flicker between Apps icon and stack on hydrate.
  const showStack = hydrated && hasCollections;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => hasCollections && setOpen((v) => !v)}
        aria-label={hasCollections ? "Collections" : "Apps"}
        aria-expanded={open}
        className={
          showStack
            ? "-ml-[2px] grid h-7 w-[34px] place-items-center ring-focus"
            : "-ml-[2px] grid h-7 w-7 place-items-center rounded-lg bg-surface3 text-fg-muted ring-[1.5px] ring-inset ring-surface hover:text-fg ring-focus"
        }
      >
        {showStack ? (
          <ThumbStack thumbs={recent.map((c) => c.imageUrls[0]).filter(Boolean)} />
        ) : (
          <AppsIcon />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-[calc(100%+12px)] z-40 w-[246px] rounded-[20px] bg-surface p-1 ring-[0.5px] ring-border shadow-[0_1px_8px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-2 rounded-2xl px-3 py-4">
              <span className="grid h-[30px] w-[30px] place-items-center rounded-lg bg-surface3 text-fg">
                <Bookmark size={16} strokeWidth={1.8} fill="currentColor" />
              </span>
              <span className="flex flex-1 items-center justify-between">
                <span className="text-[14px] font-medium tracking-[-0.28px] text-fg">
                  All elements
                </span>
                <span className="grid min-w-5 place-items-center rounded-full bg-surface3 px-1.5 py-[3px] text-[10px] font-medium tracking-[-0.1px] text-fg">
                  {totalElements}
                </span>
              </span>
            </div>

            <div className="mx-3 h-px bg-surface3" />

            <div className="flex flex-col">
              {recent.map((c) => (
                <Link
                  key={c.id}
                  href={`/collection/${c.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-2xl p-3 hover:bg-surface2"
                >
                  <span className="h-[30px] w-[30px] shrink-0 overflow-hidden rounded-lg bg-surface3">
                    {c.imageUrls[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.imageUrls[0]} alt="" className="h-full w-full object-cover" />
                    )}
                  </span>
                  <span className="line-clamp-1 max-w-[180px] text-[14px] font-medium tracking-[-0.28px] text-fg">
                    {c.title}
                  </span>
                </Link>
              ))}
            </div>

            <Link
              href="/profile?tab=collections"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-2xl p-3 hover:bg-surface2"
            >
              <span className="relative grid h-[30px] w-[30px] place-items-center rounded-lg bg-surface3 text-fg">
                <AppsIcon />
                <span className="absolute inset-0 grid place-items-center rounded-lg bg-black/50 text-[12px] font-medium tracking-[-0.24px] text-fg">
                  +{Math.max(0, userCollections.length - recent.length)}
                </span>
              </span>
              <span className="flex flex-1 items-center justify-between">
                <span className="text-[14px] font-medium tracking-[-0.28px] text-fg">
                  All collections
                </span>
                <ChevronRight size={20} strokeWidth={1.75} className="text-fg" />
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
