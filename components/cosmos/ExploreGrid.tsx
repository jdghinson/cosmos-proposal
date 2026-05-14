import { exploreElements } from "@/lib/mock-data";

export function ExploreGrid() {
  return (
    <section className="px-8 pb-16">
      <h2 className="mb-4 text-[14px] font-medium tracking-[-0.28px] text-fg">Explore elements</h2>
      <div className="columns-2 gap-3 sm:columns-3 md:columns-4 xl:columns-5 [&>*]:mb-3 [&>*]:break-inside-avoid">
        {exploreElements.map((el) => (
          <div
            key={el.id}
            className="w-full overflow-hidden rounded-md bg-surface2"
            style={{ aspectRatio: el.aspect }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={el.url}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-[1.015]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
