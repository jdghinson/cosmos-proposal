import { recentlyViewed } from "@/lib/mock-data";

export function ImageSearchPanel() {
  const front = recentlyViewed[0];
  const back = recentlyViewed[1];
  return (
    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 h-[316px] rounded-3xl bg-surface p-2 ring-[0.5px] ring-inset ring-border shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
      <div className="relative h-full w-full rounded-2xl">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          fill="none"
        >
          <rect
            x="0.75"
            y="0.75"
            width="calc(100% - 1.5px)"
            height="calc(100% - 1.5px)"
            rx="16"
            ry="16"
            fill="none"
            stroke="#918F8F"
            strokeWidth="1.5"
            strokeDasharray="3 5"
          />
        </svg>
        <div className="relative flex h-full flex-col items-center justify-center gap-4 px-8 pb-8 pt-12">
          <div className="relative size-16 shrink-0">
            <div
              className="absolute left-[22px] top-[7px] origin-top-left rounded-lg bg-bg"
              style={{ rotate: "2deg" }}
            >
              {back && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={back}
                  alt=""
                  className="aspect-[61/80] w-10 rounded-lg border-[1.5px] border-surface object-cover"
                />
              )}
            </div>
            <div
              className="absolute left-0 top-4 origin-top-left rounded-lg bg-bg"
              style={{ rotate: "-3.22deg" }}
            >
              {front && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={front}
                  alt=""
                  className="aspect-[59/80] w-10 rounded-lg border-[1.5px] border-surface object-cover"
                />
              )}
            </div>
          </div>
          <div className="text-center text-[14px] leading-[18px] tracking-[-0.28px] text-fg-muted">
            Drag & drop image here, or upload file
          </div>
        </div>
      </div>
    </div>
  );
}
