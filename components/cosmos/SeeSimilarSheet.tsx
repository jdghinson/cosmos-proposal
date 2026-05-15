"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { resultsForBrief } from "@/lib/mock-data";
import { useCollections } from "@/lib/collections-store";
import { CollectionsPickerDropdown } from "./CollectionsPickerDropdown";

const ASPECTS = ["3 / 4", "1 / 1", "4 / 5", "3 / 4", "5 / 6", "1 / 1", "4 / 5", "3 / 4"];

export function SeeSimilarSheet({
  open,
  onClose,
  brief,
  collectionName,
  collectionThumbnail,
}: {
  open: boolean;
  onClose: () => void;
  brief: string;
  collectionName: string;
  collectionThumbnail?: string;
}) {
  const images = useMemo(() => (open ? resultsForBrief(brief) : []), [open, brief]);
  const { collections } = useCollections();
  const destination = useMemo(() => {
    const recent = collections.find(
      (c) => !c.id.startsWith("seed-") && c.title !== collectionName,
    );
    return recent?.title ?? "New";
  }, [collections, collectionName]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setShowBackToTop(false);
      return;
    }
    const el = scrollRef.current;
    if (!el) return;
    function update() {
      setShowBackToTop((el?.scrollTop ?? 0) > 400);
    }
    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [open]);

  function scrollToTop() {
    const el = scrollRef.current;
    if (!el) return;
    try {
      el.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      el.scrollTop = 0;
    }
    // Fallback if smooth scrolling is disabled (e.g. reduced-motion or preview).
    setTimeout(() => {
      if (el.scrollTop > 0) el.scrollTop = 0;
    }, 600);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", ease: [0.2, 0.6, 0.2, 1], duration: 0.42 }}
            className="fixed inset-0 z-50 bg-bg"
            role="dialog"
            aria-modal="true"
          >
            <div ref={scrollRef} className="h-full overflow-y-auto">
              <div className="sticky top-0 z-10 flex h-[104px] items-center justify-center bg-bg px-8">
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute left-12 top-8 grid h-10 w-10 place-items-center rounded-full bg-surface text-fg hover:bg-surface2"
                >
                  <X size={20} strokeWidth={1.75} />
                </button>
                <div className="flex items-center">
                  <span className="text-[18px] font-medium leading-[22px] tracking-[-0.18px] text-fg">
                    More ideas for
                  </span>
                  <span className="ml-2.5 flex h-10 items-center gap-1 rounded-full bg-surface3 pl-2.5 pr-4">
                    <span className="h-6 w-6 shrink-0 overflow-hidden rounded-lg bg-surface2">
                      {collectionThumbnail && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={collectionThumbnail}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </span>
                    <span className="max-w-[215px] truncate text-[14px] leading-[18px] tracking-[-0.28px] text-fg">
                      {collectionName}
                    </span>
                  </span>
                </div>
              </div>

              <section className="px-8 pb-16">
                <div className="columns-2 gap-6 sm:columns-3 md:columns-4 xl:columns-5 [&>*]:mb-6 [&>*]:break-inside-avoid">
                  {images.map((url, i) => (
                    <SimilarCard
                      key={url + i}
                      url={url}
                      aspect={ASPECTS[i % ASPECTS.length]}
                      showStack={i % 5 === 1}
                      destination={destination}
                    />
                  ))}
                </div>
              </section>
            </div>

            <AnimatePresence>
              {showBackToTop && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  onClick={scrollToTop}
                  className="fixed bottom-8 right-8 z-20 flex h-10 items-center gap-1 rounded-full bg-white pl-3 pr-5 text-[14px] font-medium tracking-[-0.28px] text-[#0D0D0D] shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:bg-white/90"
                >
                  <ChevronUp size={20} strokeWidth={1.75} className="-mt-px" />
                  Back to top
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SimilarCard({
  url,
  aspect,
  showStack,
  destination,
}: {
  url: string;
  aspect: string;
  showStack: boolean;
  destination: string;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const destRef = useRef<HTMLButtonElement>(null);
  const overlayVisible = hover || pickerOpen;

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative"
    >
      <Link
        href={`/element?src=${encodeURIComponent(url)}`}
        className="block w-full cursor-zoom-in overflow-hidden rounded-[6px] bg-surface ring-1 ring-inset ring-border"
        style={{ aspectRatio: aspect }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt=""
          className={`h-full w-full object-cover transition-transform duration-300 ease-out ${hover ? "scale-[1.01]" : ""}`}
        />
      </Link>

      {showStack && (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-md bg-black/30 text-white backdrop-blur-sm"
        >
          <Copy size={12} strokeWidth={1.75} />
        </span>
      )}

      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent transition-opacity duration-200 ${overlayVisible ? "opacity-100" : "opacity-0"}`}
        aria-hidden
      />

      <div
        className={`absolute inset-x-3 top-3 flex items-start justify-between transition-opacity duration-200 ${overlayVisible ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div className="relative">
          <button
            ref={destRef}
            onClick={() => setPickerOpen((v) => !v)}
            aria-expanded={pickerOpen}
            className="flex items-center gap-0.5 text-[18px] font-semibold tracking-[-0.36px] text-white"
            style={{ textShadow: "0 2px 12px rgba(0, 0, 0, 0.45)" }}
          >
            {destination}
            <ChevronDown size={18} strokeWidth={2.5} />
          </button>
          <CollectionsPickerDropdown
            open={pickerOpen}
            onClose={() => setPickerOpen(false)}
            elementSrc={url}
            anchorRef={destRef as React.RefObject<HTMLElement>}
            align="left"
          />
        </div>
        <button className="rounded-full bg-white px-4 py-2 text-[14px] font-medium tracking-[-0.28px] text-[#0D0D0D] hover:bg-white/95">
          Save
        </button>
      </div>
    </article>
  );
}
