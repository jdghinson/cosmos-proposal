import Link from "next/link";
import { exploreElements } from "@/lib/mock-data";

export function ExploreGrid() {
  return (
    <section className="px-8 pb-16">
      <h2 className="mb-4 text-[14px] font-medium tracking-[-0.28px] text-fg">Explore elements</h2>
      <div className="columns-2 gap-3 sm:columns-3 md:columns-4 xl:columns-5 [&>*]:mb-3 [&>*]:break-inside-avoid">
        {exploreElements.map((el) => (
          <Link
            key={el.id}
            href={`/element?src=${encodeURIComponent(el.url)}`}
            className="block w-full cursor-zoom-in overflow-hidden rounded-md bg-surface2 active:scale-[0.995] transition-transform duration-150 ease-out"
            style={{ aspectRatio: el.aspect }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={el.url}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 ease-out [@media(hover:hover)]:hover:scale-[1.015]"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
