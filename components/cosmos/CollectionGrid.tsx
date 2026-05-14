"use client";

const ASPECTS = ["3 / 4", "1 / 1", "4 / 5", "3 / 4", "5 / 6", "1 / 1", "4 / 5", "3 / 4"];

const CAPTIONS = [
  "Flat design brutalism poster template | Free Vector",
  "Studio shot, monochrome reference",
  "Archival editorial reference photo",
  "Color palette study | Are.na",
  "Type-led layout exploration",
  "Material texture detail",
  "Portrait composition study",
  "Cover artwork concept | Behance",
];

function LinkIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
      aria-hidden
    >
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        d="m9 15 6-6M6.292 10.025l-1.7 1.7a5.433 5.433 0 1 0 7.682 7.684l1.7-1.7M10.026 6.291l1.7-1.7a5.433 5.433 0 0 1 7.684 7.682l-1.7 1.7"
      />
    </svg>
  );
}

export function CollectionGrid({ images }: { images: string[] }) {
  return (
    <section className="px-8 pb-24">
      <div className="columns-2 gap-8 sm:columns-3 md:columns-4 xl:columns-5 [&>*]:mb-8 [&>*]:break-inside-avoid">
        {images.map((url, i) => (
          <article
            key={url + i}
            className="overflow-hidden rounded-[4px] ring-1 ring-inset ring-border"
          >
            <div
              className="w-full bg-surface"
              style={{ aspectRatio: ASPECTS[i % ASPECTS.length] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
            </div>
            {/* <div className="flex items-center gap-1 px-4 py-2 text-fg">
              <LinkIcon />
              <span className="line-clamp-1 text-pretty text-[14px] font-medium tracking-[-0.28px]">
                {CAPTIONS[i % CAPTIONS.length]}
              </span>
            </div> */}
          </article>
        ))}
      </div>
    </section>
  );
}
