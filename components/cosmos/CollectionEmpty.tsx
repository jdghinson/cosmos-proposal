"use client";

import { resultsForBrief } from "@/lib/mock-data";

export function CollectionEmpty({ brief = "" }: { brief?: string }) {
  const sampleImages = resultsForBrief(brief || "minimal product").slice(0, 4);

  return (
    <section className="mt-20 flex flex-col items-center px-8 text-center">
      <h2 className="text-[20px] font-medium tracking-[-0.4px] text-fg">Suggested elements</h2>
      <p className="mt-1 text-[14px] tracking-[-0.28px] text-fg-muted">
        Get started curating your collection
      </p>

      <div className="mt-6 grid grid-cols-4 gap-1.5">
        {sampleImages.map((url, i) => (
          <div
            key={i}
            className="h-[140px] w-[140px] overflow-hidden rounded-md bg-surface2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>

      <button className="mt-6 rounded-full bg-fg px-6 py-2 text-[14px] font-medium tracking-[-0.28px] text-[#0D0D0D] hover:bg-fg/95">
        View
      </button>
    </section>
  );
}
