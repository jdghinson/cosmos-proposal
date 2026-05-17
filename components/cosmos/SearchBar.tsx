"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { recentColors, recentSearches, recentlyViewed } from "@/lib/mock-data";
import { ImageSearchPanel } from "./ImageSearchPanel";
import { ColorSearchPanel } from "./ColorSearchPanel";

const PLACEHOLDERS = [
  "Search Cosmos…",
  "Try 'archival fashion'",
  "Try 'celestial maps'",
  "Try 'contemporary art'",
  "Try 'minimal product'",
];

const COSMOS_DOTS = [
  { cx: 12, cy: 4.441, fill: "#EBB042" },
  { cx: 17.205, cy: 6.769, fill: "#9C6030" },
  { cx: 19.548, cy: 11.686, fill: "#A0213E" },
  { cx: 17.205, cy: 17.231, fill: "#C877CB" },
  { cx: 12, cy: 19.559, fill: "#6951F5" },
  { cx: 6.796, cy: 17.118, fill: "#4694F6" },
  { cx: 4.452, cy: 11.686, fill: "#77CDD0" },
  { cx: 6.796, cy: 6.882, fill: "#81B386" },
];

export type SearchScope = {
  name: string;
  thumbnail?: string;
  avatar?: React.ReactNode;
  placeholder?: string;
};

export function SearchBar({ scope, fluid }: { scope?: SearchScope; fluid?: boolean }) {
  const [panel, setPanel] = useState<"search" | "image" | "color" | null>(null);
  const [placeholder, setPlaceholder] = useState(
    scope ? scope.placeholder ?? `Search in ${scope.name}…` : PLACEHOLDERS[3],
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scope) {
      setPlaceholder(scope.placeholder ?? `Search in ${scope.name}…`);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % PLACEHOLDERS.length;
      setPlaceholder(PLACEHOLDERS[i]);
    }, 2600);
    return () => clearInterval(id);
  }, [scope]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setPanel(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPanel(null);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={
        fluid
          ? "relative w-full"
          : `relative mx-auto transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${panel !== null && !scope ? "w-[601px]" : "w-[480px]"}`
      }
    >
      <div className="flex h-[54px] items-center gap-2 rounded-full bg-surface p-2 ring-1 ring-inset ring-border">
        {scope ? (
          <div className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-bg py-2 pl-2 pr-3 ring-[0.5px] ring-inset ring-border">
            <div className="h-6 w-6 shrink-0 overflow-hidden rounded-lg bg-surface2">
              {scope.avatar ? (
                scope.avatar
              ) : scope.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={scope.thumbnail} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-fg">
                  <svg width="14" height="14" viewBox="0 0 28 31" fill="currentColor">
                    <circle cx="14" cy="4.5" r="4.5" />
                    <circle cx="14" cy="26.5" r="4.5" />
                    <circle cx="4.5" cy="10" r="4.5" />
                    <circle cx="23.5" cy="21" r="4.5" />
                    <circle cx="23.5" cy="10" r="4.5" />
                    <circle cx="4.5" cy="21" r="4.5" />
                  </svg>
                </div>
              )}
            </div>
            <span className="line-clamp-1 max-w-[140px] text-[14px] font-medium leading-[18px] text-fg">
              {scope.name}
            </span>
          </div>
        ) : (
          <Search size={18} strokeWidth={1.75} className="ml-2 mr-0.5 text-fg-muted" />
        )}
        <input
          placeholder={placeholder}
          onFocus={() => !scope && setPanel("search")}
          className="min-w-0 flex-1 bg-transparent text-[14px] font-medium leading-[18px] tracking-[-0.28px] text-fg placeholder:text-fg-muted outline-none"
        />
        <button
          aria-label="Visual search"
          aria-pressed={panel === "image"}
          onClick={() => !scope && setPanel((p) => (p === "image" ? null : "image"))}
          className={
            "grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full hover:bg-surface2 hover:text-fg " +
            (panel === "image" ? "bg-surface2 text-fg" : "text-fg-muted")
          }
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              stroke="currentColor"
              strokeWidth="1.75"
              d="M9 4h-.2c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C4 6.28 4 7.12 4 8.8V9m11-5h.2c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C20 6.28 20 7.12 20 8.8V9M9 20h-.2c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C4 17.72 4 16.88 4 15.2V15m11 5h.2c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C20 17.72 20 16.88 20 15.2V15"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeLinecap="square" strokeWidth="1.75" />
          </svg>
        </button>
        <button
          aria-label="Color search"
          aria-pressed={panel === "color"}
          onClick={() => !scope && setPanel((p) => (p === "color" ? null : "color"))}
          className={
            "grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full hover:bg-surface2 " +
            (panel === "color" ? "bg-surface2" : "")
          }
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {COSMOS_DOTS.map((d, i) => (
              <ellipse key={i} cx={d.cx} cy={d.cy} rx="1.952" ry="1.941" fill={d.fill} />
            ))}
          </svg>
        </button>
      </div>

      {panel === "search" && !scope && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 flex flex-col gap-6 rounded-2xl bg-surface p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-inset ring-border"
        >
            <Section title="Recent" showClear>
              <HorizontalRow>
                {recentSearches.map((q) => (
                  <button
                    key={q}
                    className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-surface3 pl-2 pr-3 text-[14px] font-medium leading-[18px] tracking-[-0.28px] text-fg hover:bg-surface2"
                  >
                    <Search size={20} strokeWidth={1.75} className="shrink-0 text-fg-muted" />
                    <span className="whitespace-nowrap">{q}</span>
                  </button>
                ))}
              </HorizontalRow>
            </Section>

            <Section title="Colors">
              <HorizontalRow>
                {recentColors.map((c) => (
                  <button
                    key={c}
                    className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-surface3 pl-2 pr-3 text-[14px] font-medium leading-[18px] tracking-[-0.28px] text-fg hover:bg-surface2"
                  >
                    <span
                      className="block h-[18px] w-[18px] shrink-0 rounded-md"
                      style={{ background: c }}
                    />
                    <span className="whitespace-nowrap">{c}</span>
                  </button>
                ))}
              </HorizontalRow>
            </Section>

            <Section title="Recently viewed" showClear>
              <HorizontalRow>
                {recentlyViewed.map((url, i) => (
                  <span
                    key={i}
                    className="block h-[120px] w-[100px] shrink-0 overflow-hidden rounded-[10px] ring-[0.5px] ring-inset ring-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  </span>
                ))}
              </HorizontalRow>
            </Section>
        </div>
      )}

      {panel === "image" && !scope && <ImageSearchPanel />}
      {panel === "color" && !scope && <ColorSearchPanel />}
    </div>
  );
}

function Section({
  title,
  showClear,
  children,
}: {
  title: string;
  showClear?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-medium leading-[18px] tracking-[-0.28px] text-fg-muted">
          {title}
        </span>
        {showClear && (
          <button className="text-[12px] leading-[14px] tracking-[-0.24px] text-fg-muted hover:text-fg">
            Clear
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function HorizontalRow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="scrollbar-none -mx-2 flex gap-2 overflow-x-auto px-2"
      style={{
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)",
        maskImage:
          "linear-gradient(90deg, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)",
      }}
    >
      {children}
    </div>
  );
}
