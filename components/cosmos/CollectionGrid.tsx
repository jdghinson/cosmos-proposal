"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

const ASPECTS = ["3 / 4", "1 / 1", "4 / 5", "3 / 4", "5 / 6", "1 / 1", "4 / 5", "3 / 4"];

export function CollectionGrid({ images, collectionName = "New" }: { images: string[]; collectionName?: string }) {
  return (
    <section className="px-8 pb-24">
      <div className="columns-2 gap-8 sm:columns-3 md:columns-4 xl:columns-5 [&>*]:mb-8 [&>*]:break-inside-avoid">
        {images.map((url, i) => (
          <Link
            key={url + i}
            href={`/element?src=${encodeURIComponent(url)}`}
            className="group relative block cursor-zoom-in overflow-hidden rounded-[4px] ring-1 ring-inset ring-border active:scale-[0.995] transition-transform duration-150 ease-out"
          >
            <div
              className="w-full bg-surface"
              style={{ aspectRatio: ASPECTS[i % ASPECTS.length] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 ease-out [@media(hover:hover)]:group-hover:scale-[1.01]"
              />
            </div>

            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              aria-hidden
            />

            <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <button
                onClick={(e) => e.preventDefault()}
                className="flex min-w-0 cursor-default items-center gap-0.5 text-[18px] font-semibold tracking-[-0.36px] text-white"
                style={{ textShadow: "0 2px 12px rgba(0, 0, 0, 0.45)" }}
              >
                <span className="truncate">{collectionName}</span>
                <ChevronDown size={18} strokeWidth={2.5} className="shrink-0" />
              </button>

              <button
                onClick={(e) => e.preventDefault()}
                className="shrink-0 cursor-default rounded-full bg-black/55 px-3.5 py-1.5 text-[14px] font-medium tracking-[-0.28px] text-white backdrop-blur-md hover:bg-black/70"
              >
                Saved
              </button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
