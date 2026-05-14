"use client";

import { useState } from "react";
import { exploreCategories } from "@/lib/mock-data";

export function CategoryChips() {
  const [active, setActive] = useState("Featured");
  return (
    <div className="mb-4 pl-8 md:mb-10 md:mt-4">
      <div
        role="region"
        aria-roledescription="carousel"
        className="scrollbar-none relative flex h-full touch-manipulation animate-fade-in items-center gap-x-6 overflow-x-auto pr-8 motion-reduce:animate-none"
        style={{
          scrollSnapType: "none",
          overscrollBehaviorX: "none",
          maskImage:
            "linear-gradient(to right, black 0, black calc(100% - 80px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, black 0, black calc(100% - 80px), transparent 100%)",
        }}
      >
        {exploreCategories.map((c) => {
          const isActive = active === c;
          return (
            <button
              key={c}
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
  );
}
