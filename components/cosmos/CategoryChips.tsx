"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { exploreCategories } from "@/lib/mock-data";

const EDGE_MASK =
  "linear-gradient(to right, black 0, black calc(100% - 80px), transparent 100%)";

export function CategoryChips() {
  const [active, setActive] = useState("Featured");
  const prefersReduced = useReducedMotion();

  return (
    <>
      {/* ≥768 (md+). Existing pill treatment, unchanged. */}
      <div className="hidden pl-8 md:mb-10 md:mt-4 md:block">
        <div
          role="region"
          aria-roledescription="carousel"
          className="scrollbar-none relative flex h-full touch-manipulation animate-fade-in items-center gap-x-6 overflow-x-auto pr-8 motion-reduce:animate-none"
          style={{
            scrollSnapType: "none",
            overscrollBehaviorX: "none",
            maskImage: EDGE_MASK,
            WebkitMaskImage: EDGE_MASK,
          }}
        >
          {exploreCategories.map((c) => {
            const isActive = active === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={
                  "shrink-0 text-[14px] font-medium tracking-[-0.28px] transition-colors " +
                  (isActive
                    ? "rounded-full bg-fg px-4 py-2 text-[#0D0D0D]"
                    : "text-fg-muted hover:text-fg")
                }
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* <768 (mobile). Underline tab strip with sliding active indicator. */}
      <div className="mb-4 border-b border-border [border-bottom-width:0.5px] bg-bg md:hidden">
        <div
          role="region"
          aria-roledescription="carousel"
          className="scrollbar-none relative flex touch-manipulation animate-fade-in items-stretch overflow-x-auto pr-2 motion-reduce:animate-none"
          style={{
            scrollSnapType: "none",
            overscrollBehaviorX: "none",
            maskImage: EDGE_MASK,
            WebkitMaskImage: EDGE_MASK,
          }}
        >
          {exploreCategories.map((c) => {
            const isActive = active === c;
            return (
              <button
                key={c}
                type="button"
                aria-current={isActive ? "true" : undefined}
                onClick={(e) => {
                  setActive(c);
                  e.currentTarget.scrollIntoView({
                    inline: "nearest",
                    block: "nearest",
                    behavior: prefersReduced ? "auto" : "smooth",
                  });
                }}
                className={
                  "relative shrink-0 px-4 pb-3 pt-2.5 text-[14px] leading-[18px] tracking-[-0.28px] transition-colors " +
                  (isActive
                    ? "font-medium text-fg"
                    : "text-fg-muted hover:text-fg")
                }
              >
                {c}
                {isActive && (
                  <motion.span
                    aria-hidden
                    layoutId="category-underline"
                    className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-fg"
                    transition={
                      prefersReduced
                        ? { duration: 0 }
                        : { duration: 0.18, ease: [0.2, 0.6, 0.2, 1] }
                    }
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
