"use client";

import { Link as LinkIcon } from "lucide-react";

const BG_COLORS = [
  "#3D3923",
  "#1F2A3A",
  "#2A1F2D",
  "#1A2A26",
  "#2B2418",
  "#252525",
  "#2D1F1F",
  "#1F2D29",
];

function captionFor(url: string, i: number) {
  const captions = [
    "Flat design poster, editorial",
    "Studio shot, monochrome",
    "Archival editorial reference",
    "Color palette study",
    "Type-led layout exploration",
    "Material texture detail",
    "Portrait composition",
    "Cover artwork concept",
  ];
  return captions[i % captions.length];
}

export function CollectionGrid({ images }: { images: string[] }) {
  return (
    <section className="mt-12 px-8 pb-24">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((url, i) => (
          <article
            key={url + i}
            className="overflow-hidden rounded-md"
            style={{ background: BG_COLORS[i % BG_COLORS.length] }}
          >
            <div className="flex aspect-[3/4] items-center justify-center p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="max-h-full max-w-full rounded-sm object-contain shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
              />
            </div>
            <div className="flex items-center gap-1.5 px-3 pb-3 pt-1 text-[12px] tracking-[-0.24px] text-fg/80">
              <LinkIcon size={11} strokeWidth={1.75} />
              <span className="truncate">{captionFor(url, i)}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
