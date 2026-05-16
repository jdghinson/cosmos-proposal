"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, ChevronLeft, ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import { useCollections } from "@/lib/collections-store";
import type { SavedCollection } from "@/lib/mock-data";
import { CollectionsPickerDropdown } from "./CollectionsPickerDropdown";

const FALLBACK_DESCRIPTION =
  "An element saved on Cosmos. Add a description in the collection brief to give this image more context.";

export function ElementDetail({ src }: { src: string }) {
  const router = useRouter();
  const { collections } = useCollections();

  const savedByCollections = useMemo(
    () => collections.filter((c) => c.imageUrls.includes(src)).slice(0, 3),
    [collections, src],
  );

  // On the explore path there's no collection context, so default the save
  // target to the user's most recently created collection.
  const destination = useMemo(() => {
    const userCollections = collections.filter((c) => !c.id.startsWith("seed-"));
    return [...userCollections].sort((a, b) => b.createdAt - a.createdAt)[0];
  }, [collections]);

  const [pickerOpen, setPickerOpen] = useState(false);
  const destRef = useRef<HTMLButtonElement>(null);

  // Hover preview popover for the "Saved by" collection rows.
  const asideRef = useRef<HTMLElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [preview, setPreview] = useState<{ c: SavedCollection; top: number } | null>(null);
  const [followed, setFollowed] = useState<Set<string>>(new Set());

  function showPreview(c: SavedCollection, rowEl: HTMLElement) {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    const asideBox = asideRef.current?.getBoundingClientRect();
    const rowBox = rowEl.getBoundingClientRect();
    setPreview({ c, top: asideBox ? rowBox.top - asideBox.top : 0 });
  }

  function hidePreview() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setPreview(null), 120);
  }

  function cancelHide() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }

  function toggleFollow(id: string) {
    setFollowed((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section className="px-8 pb-12">
      <div className="flex h-[594px] rounded-[20px] ring-[0.5px] ring-inset ring-border">
        <div className="flex w-25 shrink-0 flex-col items-center p-8">
          <button
            onClick={() => router.back()}
            aria-label="Back"
            className="grid h-10 w-10 place-items-center rounded-full ring-[0.5px] ring-inset ring-border hover:bg-surface2"
          >
            <ChevronLeft size={20} strokeWidth={1.75} className="text-fg" />
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center p-8">
          <div className="flex h-full max-w-[840px] items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="block max-h-full max-w-full rounded-[3px] object-contain"
            />
          </div>
        </div>

        <aside
          ref={asideRef}
          className="relative flex w-[420px] shrink-0 flex-col gap-6 border-l-[0.5px] border-border pt-8"
        >
          <div className="flex items-center justify-end px-8">
            <button
              aria-label="More"
              className="grid h-10 w-10 place-items-center rounded-full ring-[0.5px] ring-inset ring-border hover:bg-surface2"
            >
              <MoreHorizontal size={20} strokeWidth={1.75} className="text-fg" />
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6">
            <p className="text-[14px] leading-[28px] tracking-[-0.28px] text-fg">
              {FALLBACK_DESCRIPTION}
            </p>

            <div>
              <span className="text-[14px] leading-[18px] tracking-[-0.28px] text-fg-muted">
                Saved by{" "}
              </span>
              <span className="text-[14px] leading-[18px] tracking-[-0.28px] text-fg">
                {savedByCollections.length > 0
                  ? `${savedByCollections.length * 42 + 12} others`
                  : "0 others"}
              </span>
            </div>

            <div className="flex flex-col gap-2 pb-4">
              {savedByCollections.length === 0 ? (
                <p className="text-[13px] text-fg-muted">
                  Not yet saved to any collection.
                </p>
              ) : (
                savedByCollections.map((c) => (
                  <div
                    key={c.id}
                    onMouseEnter={(e) => showPreview(c, e.currentTarget)}
                    onMouseLeave={hidePreview}
                    className={
                      "flex cursor-pointer items-center gap-3 rounded-2xl p-3 ring-[0.5px] ring-inset transition-colors duration-150 " +
                      (preview?.c.id === c.id
                        ? "bg-surface2 ring-border"
                        : "ring-border hover:bg-surface2")
                    }
                  >
                    <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface3 ring-[0.5px] ring-inset ring-border">
                      {c.imageUrls[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.imageUrls[0]}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="line-clamp-1 text-[14px] font-medium tracking-[-0.28px] text-fg">
                        {c.title}
                      </span>
                      <span className="text-[12px] tracking-[-0.24px] text-fg-muted">
                        {c.imageUrls.length} elements · @jdghinson
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 px-8 pb-8">
            <div className="relative flex-1">
              <button
                ref={destRef}
                onClick={() => setPickerOpen((v) => !v)}
                className="flex h-12 w-full items-center justify-between gap-3 overflow-hidden rounded-full pl-4 pr-5 ring-[0.5px] ring-inset ring-border hover:bg-surface2"
              >
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 shrink-0 overflow-hidden rounded-sm bg-surface3">
                    {destination?.imageUrls[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={destination.imageUrls[0]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </span>
                  <span className="line-clamp-1 max-w-[160px] text-[16px] font-medium leading-[125%] tracking-[-0.32px] text-fg">
                    {destination?.title ?? "New"}
                  </span>
                </span>
                {pickerOpen ? (
                  <ChevronUp size={20} strokeWidth={2} className="text-fg" />
                ) : (
                  <ChevronDown size={20} strokeWidth={2} className="text-fg" />
                )}
              </button>
              <CollectionsPickerDropdown
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                elementSrc={src}
                anchorRef={destRef as React.RefObject<HTMLElement>}
                align="left"
                position="above"
              />
            </div>
            <button className="flex h-12 items-center justify-center rounded-full bg-white px-6 text-[15px] font-medium tracking-[-0.3px] text-[#0D0D0D] hover:bg-white/95">
              Save
            </button>
          </div>

          <AnimatePresence>
            {preview && (
              <motion.div
                key={preview.c.id}
                initial={{ opacity: 0, scale: 0.96, x: 8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.96, x: 8, transition: { duration: 0.12, ease: [0.2, 0.6, 0.2, 1] } }}
                transition={{ duration: 0.18, ease: [0.2, 0.6, 0.2, 1] }}
                onMouseEnter={cancelHide}
                onMouseLeave={hidePreview}
                style={{ top: preview.top, transformOrigin: "right center" }}
                className="absolute right-[calc(100%+16px)] z-50 w-[460px] overflow-hidden rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.45)] ring-[0.5px] ring-border"
              >
                <div className="flex h-[150px]">
                  {preview.c.imageUrls.slice(0, 4).map((u, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={u + i}
                      src={u}
                      alt=""
                      className="h-full flex-1 object-cover"
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3 bg-[#0D0D0D] p-3">
                  <span className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-surface3">
                    {preview.c.imageUrls[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={preview.c.imageUrls[0]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex items-center gap-1 text-[15px] font-medium tracking-[-0.3px] text-white">
                      <span className="truncate">{preview.c.title}</span>
                      <BadgeCheck size={15} strokeWidth={2} className="shrink-0 text-white/60" />
                    </span>
                    <span className="truncate text-[13px] tracking-[-0.26px] text-white/55">
                      {preview.c.imageUrls.length} elements · @jdghinson
                    </span>
                  </div>
                  <button
                    onClick={() => toggleFollow(preview.c.id)}
                    className={
                      "shrink-0 rounded-full px-5 py-2 text-[14px] font-medium tracking-[-0.28px] transition-[background-color,transform] duration-150 ease-out active:scale-[0.97] " +
                      (followed.has(preview.c.id)
                        ? "bg-white/15 text-white hover:bg-white/20"
                        : "bg-white text-[#0D0D0D] hover:bg-white/90")
                    }
                  >
                    {followed.has(preview.c.id) ? "Following" : "Follow"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>

      <div className="mt-12 flex flex-col gap-6">
        <h2 className="text-[16px] leading-[125%] tracking-[-0.32px] text-fg">
          You may also like
        </h2>
        <div className="flex min-h-[200px] items-center justify-center opacity-[0.35]">
          <span className="text-[18px] font-medium leading-[22px] tracking-[-0.18px] text-fg">
            No similar elements found
          </span>
        </div>
      </div>
    </section>
  );
}
