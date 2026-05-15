"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Check, Plus } from "lucide-react";
import { useCollections } from "@/lib/collections-store";
import { UserAvatar } from "./UserAvatar";

export function CollectionsPickerDropdown({
  open,
  onClose,
  elementSrc,
  align = "right",
  position = "below",
  anchorRef,
}: {
  open: boolean;
  onClose: () => void;
  elementSrc: string;
  align?: "left" | "right";
  position?: "above" | "below";
  anchorRef: React.RefObject<HTMLElement>;
}) {
  const { collections } = useCollections();
  const userCollections = useMemo(
    () => collections.filter((c) => !c.id.startsWith("seed-")),
    [collections],
  );
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = query
    ? userCollections.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
    : userCollections;

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      const inside = ref.current?.contains(e.target as Node);
      const inAnchor = anchorRef.current?.contains(e.target as Node);
      if (!inside && !inAnchor) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, anchorRef]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.16 }}
          className={`absolute z-50 flex w-[320px] flex-col gap-2 rounded-[20px] bg-surface p-2 ring-[0.5px] ring-border shadow-[0_1px_8px_rgba(0,0,0,0.5)] ${align === "right" ? "right-0" : "left-0"} ${position === "above" ? "bottom-full mb-2" : "top-full mt-2"}`}
        >
          <div className="flex items-center justify-between gap-2 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-surface3">
                <UserAvatar size={20} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[14px] font-medium leading-[18px] tracking-[-0.28px] text-fg">
                  Profile
                </span>
                <span className="text-[12px] leading-[14px] tracking-[-0.24px] text-fg-muted">
                  Public
                </span>
              </div>
            </div>
            <div className="h-6 w-6 rounded-full ring-[1.5px] ring-inset ring-border" />
          </div>

          <div className="px-3">
            <label className="flex h-[46px] w-full items-center gap-3 rounded-full px-3 ring-[0.5px] ring-inset ring-border">
              <Search size={18} strokeWidth={1.75} className="text-fg" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="flex-1 bg-transparent text-[14px] font-medium tracking-[-0.28px] text-fg placeholder:text-fg-muted outline-none"
              />
            </label>
          </div>

          <div className="flex flex-1 flex-col gap-1 px-3 pb-2">
            <span className="text-[14px] tracking-[-0.28px] text-fg-muted">Collections</span>

            <div className="-mx-3 max-h-[260px] overflow-y-auto">
              <button className="flex w-full items-center justify-between gap-3 rounded-xl p-3 hover:bg-surface2">
                <span className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface3 text-fg-muted">
                    <NewCollectionIcon />
                  </span>
                  <span className="flex flex-col gap-1 text-left">
                    <span className="text-[14px] font-medium tracking-[-0.28px] text-fg">
                      New collection
                    </span>
                    <span className="text-[12px] font-medium tracking-[-0.24px] text-fg-muted">
                      Your place to organize elements
                    </span>
                  </span>
                </span>
                <Plus size={20} strokeWidth={1.75} className="text-fg" />
              </button>

              {filtered.map((c) => {
                const inCollection = c.imageUrls.includes(elementSrc);
                return (
                  <button
                    key={c.id}
                    className="flex w-full items-center justify-between gap-3 rounded-xl p-3 hover:bg-surface2"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-surface3">
                        {c.imageUrls[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={c.imageUrls[0]}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </span>
                      <span className="flex flex-col items-start gap-1">
                        <span className="line-clamp-1 max-w-[160px] text-[14px] font-medium tracking-[-0.28px] text-fg">
                          {c.title}
                        </span>
                        <span className="text-[12px] font-medium tracking-[-0.24px] text-fg-muted">
                          {c.imageUrls.length} elements · {c.isPrivate ?? true ? "Private" : "Public"}
                        </span>
                      </span>
                    </span>
                    {inCollection ? (
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-[#0D0D0D]">
                        <Check size={14} strokeWidth={1.75} />
                      </span>
                    ) : (
                      <span className="h-6 w-6 shrink-0 rounded-full ring-[1.5px] ring-inset ring-border" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NewCollectionIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
      <path d="M0 12C0 5.373 5.373 0 12 0H28C34.627 0 40 5.373 40 12V28C40 34.627 34.627 40 28 40H12C5.373 40 0 34.627 0 28V12Z" fill="#323131" />
      <path d="M20 0V40" stroke="#212020" strokeWidth="2" />
      <path d="M20 20H40" stroke="#212020" strokeWidth="2" />
    </svg>
  );
}
