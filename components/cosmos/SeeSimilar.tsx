"use client";

import { ChevronDown } from "lucide-react";
import { resultsForBrief } from "@/lib/mock-data";

export function SeeSimilar({ brief }: { brief: string }) {
  const thumbs = resultsForBrief(brief).slice(0, 3);
  return (
    <div className="fixed inset-x-0 bottom-6 z-30 flex justify-center">
      <button className="group flex flex-col items-center gap-2">
        <div className="flex h-12 w-[88px] items-center justify-center -space-x-4">
          {thumbs.map((url, i) => (
            <span
              key={i}
              className="h-10 w-10 overflow-hidden rounded-md bg-surface2 ring-2 ring-bg transition-transform group-hover:translate-y-0"
              style={{ transform: `rotate(${(i - 1) * 6}deg)` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-[13px] font-medium tracking-[-0.26px] text-fg-muted group-hover:text-fg">
          See similar
          <ChevronDown size={14} strokeWidth={1.75} />
        </div>
      </button>
    </div>
  );
}
