"use client";

import { useEffect, useRef, useState } from "react";
import { ClusterCard } from "./ClusterCard";
import { exploreClusters } from "@/lib/mock-data";
import { useCollections } from "@/lib/collections-store";

export function SelectedRow({ highlightId }: { highlightId?: string }) {
  const { collections } = useCollections();
  const saved = collections.filter((c) => c.source === "ai" && c.id.startsWith("seed-"));
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [saved.length]);

  function scrollByCard(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    // Card width (365) + gap-x-8 (32) = ~397; scroll by roughly one screen
    // of cards so the arrow advances visibly without feeling jumpy.
    const card = 365 + 32;
    const cards = Math.max(1, Math.floor(el.clientWidth / card));
    el.scrollBy({ left: direction * card * cards, behavior: "smooth" });
  }

  return (
    <section className="mb-10">
      <h2 className="mb-4 px-8 text-[14px] font-medium tracking-[-0.28px] text-fg">
        Selected by Cosmos
      </h2>
      <div className="relative">
        <div
          ref={scrollerRef}
          role="region"
          aria-roledescription="carousel"
          className="scrollbar-none relative flex h-full touch-manipulation animate-fade-in gap-x-3 overflow-x-auto px-3 pt-4 motion-reduce:animate-none md:gap-x-8 md:px-8"
          style={{
            scrollSnapType: "none",
            overscrollBehaviorX: "none",
            maskImage:
              "linear-gradient(to right, black 0, black calc(100% - 80px), transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, black 0, black calc(100% - 80px), transparent 100%)",
          }}
        >
          {saved.map((c) => (
            <ClusterCard key={c.id} cluster={c} highlight={c.id === highlightId} />
          ))}
          {exploreClusters.map((c) => (
            <ClusterCard key={c.id} cluster={c} />
          ))}
        </div>

        {canPrev && (
          <button
            onClick={() => scrollByCard(-1)}
            aria-label="Previous"
            className="absolute left-2 top-[91px] z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-fg ring-1 ring-inset ring-border backdrop-blur-md hover:bg-surface2"
            style={{ boxShadow: "0 3px 12px rgba(0,0,0,0.05)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="1.75"
                d="M14.75 4.25 7 12l7.75 7.75"
              />
            </svg>
          </button>
        )}

        {canNext && (
          <button
            onClick={() => scrollByCard(1)}
            aria-label="Next"
            className="absolute right-8 top-[91px] z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-fg ring-1 ring-inset ring-border backdrop-blur-md hover:bg-surface2"
            style={{ boxShadow: "0 3px 12px rgba(0,0,0,0.05)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="1.75"
                d="M9.25 4.25 17 12l-7.75 7.75"
              />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
