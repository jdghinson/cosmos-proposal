"use client";

const ASPECTS = ["3 / 4", "1 / 1", "4 / 5", "3 / 4", "5 / 6", "1 / 1", "3 / 4", "4 / 5"];

type Props = {
  items: string[];
  selected: Set<string>;
  onToggle: (url: string) => void;
};

/**
 * Shared selectable element grid used by both the create "Suggested elements"
 * step and the AI results step. Per-tile circular button reads "+" when the
 * element is not in the collection and "✓" once added.
 */
export function ElementPicker({ items, selected, onToggle }: Props) {
  return (
    <div className="columns-2 gap-3 sm:columns-3 md:columns-4 xl:columns-5 [&>*]:mb-3 [&>*]:break-inside-avoid">
      {items.map((url, i) => {
        const on = selected.has(url);
        const aspect = ASPECTS[i % ASPECTS.length];
        return (
          <button
            key={url + i}
            type="button"
            onClick={() => onToggle(url)}
            className="group relative block w-full overflow-hidden rounded-lg bg-surface2 active:scale-[0.99] transition-transform duration-150 ease-out"
            style={{ aspectRatio: aspect }}
            aria-pressed={on}
            aria-label={on ? "Remove from collection" : "Add to collection"}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              className={
                "absolute inset-0 h-full w-full object-cover transition-[transform,filter] ease-out duration-300 group-hover:scale-[1.02] " +
                (on ? "" : "brightness-[0.7]")
              }
            />
            <span
              className={
                "absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.35)] transition-transform duration-150 ease-out group-hover:scale-105 " +
                (on ? "bg-black text-white" : "bg-white text-black")
              }
            >
              {on ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="1.75"
                    d="M4 13.615 9.714 19A99.4 99.4 0 0 1 20 5"
                  />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path stroke="currentColor" strokeWidth="1.75" d="M12 3v18m-9-9h18" />
                </svg>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
