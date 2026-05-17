export function ColorSearchPanel() {
  return (
    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 h-[364px] overflow-hidden rounded-3xl bg-surface p-2 ring-[0.5px] ring-inset ring-border shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
      <div className="flex h-full flex-col items-center gap-2">
        {/* Saturation / value square */}
        <div
          className="relative h-[275px] w-full shrink-0 rounded-2xl bg-[#FF0000] ring-[0.5px] ring-inset ring-border"
          style={{
            backgroundImage:
              "linear-gradient(in oklab 0deg, oklab(0% 0 0) 0%, oklab(0% 0 0 / 0%) 100%), linear-gradient(in oklab 90deg, oklab(100% 0 0) 0%, oklab(100% 0 0 / 0%) 100%)",
          }}
        >
          <span className="absolute left-0 top-full h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black" />
        </div>

        {/* Hue spectrum slider */}
        <div className="flex h-4 w-full shrink-0">
          <div
            className="h-4 w-full grow rounded-full"
            style={{
              backgroundImage:
                "linear-gradient(in oklab 90deg, oklab(62.8% 0.225 0.126) 0%, oklab(96.8% -0.071 0.199) 16.67%, oklab(86.6% -0.234 0.179) 33.33%, oklab(90.5% -0.149 -0.039) 50%, oklab(45.2% -0.032 -0.312) 66.67%, oklab(70.2% 0.275 -0.169) 83.33%, oklab(62.8% 0.225 0.126) 100%)",
            }}
          />
        </div>

        {/* Bottom row */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-surface p-2.5 ring-[0.5px] ring-inset ring-border">
              <span className="size-5 shrink-0 rounded-full bg-black" />
              <span className="text-[14px] font-medium uppercase leading-[18px] tracking-[-0.28px] text-fg">
                #000000
              </span>
            </div>
            <button
              aria-label="Add color"
              className="grid size-10 shrink-0 place-items-center rounded-full text-fg ring-[0.5px] ring-inset ring-border hover:bg-surface2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path stroke="currentColor" strokeWidth="1.75" d="M12 3v18m-9-9h18" />
              </svg>
            </button>
          </div>
          <button className="grid h-10 place-items-center rounded-full bg-white px-5 text-[14px] font-medium leading-[18px] tracking-[-0.28px] text-[#0D0D0D] hover:bg-[#D4D4D4]">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
