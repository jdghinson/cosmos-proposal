"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { resultsForBrief } from "@/lib/mock-data";
import { SeeSimilarSheet } from "./SeeSimilarSheet";

export function SeeSimilar({
  brief,
  collectionName,
  collectionThumbnail,
}: {
  brief: string;
  collectionName: string;
  collectionThumbnail?: string;
}) {
  const thumbs = useMemo(() => resultsForBrief(brief).slice(0, 3), [brief]);
  const pathname = usePathname();
  const params = useSearchParams();
  const initiallyOpen = params.get("similar") === "1";
  const [open, setOpen] = useState(initiallyOpen);
  const [hover, setHover] = useState(false);

  // Keep `?similar=1` in sync with the modal open state so back-navigation
  // from /element returns here with the modal restored.
  useEffect(() => {
    const url = new URL(window.location.href);
    const has = url.searchParams.get("similar") === "1";
    if (open && !has) {
      url.searchParams.set("similar", "1");
      window.history.replaceState(window.history.state, "", url.pathname + url.search);
    } else if (!open && has) {
      url.searchParams.delete("similar");
      window.history.replaceState(
        window.history.state,
        "",
        url.pathname + (url.search || ""),
      );
    }
  }, [open, pathname]);

  // Sync open state back from the URL when it changes (e.g. browser back).
  useEffect(() => {
    setOpen(params.get("similar") === "1");
  }, [params]);

  return (
    <>
      <div className="fixed inset-x-0 bottom-6 z-30 flex justify-center">
        <button
          onClick={() => setOpen(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex h-9 items-center justify-center">
            {thumbs.map((url, i) => {
              // Default fan layout from Paper spec:
              // left  thumb: translate( 18, 0)  rotate(-6.911deg)
              // center thumb: translate(  0,-4)  rotate(0)
              // right thumb: translate(-18, 0)  rotate(10.972deg)
              const base = [
                { x: 18, y: 0, r: -6.911 },
                { x: 0, y: -4, r: 0 },
                { x: -18, y: 0, r: 10.972 },
              ][i];
              const hoverShift = [
                { x: 14, y: -2, r: -10 },
                { x: 0, y: -8, r: 0 },
                { x: -14, y: -2, r: 14 },
              ][i];
              const t = hover ? hoverShift : base;
              return (
                <span
                  key={i}
                  className="h-[30px] w-[30px] shrink-0 overflow-hidden rounded-lg border-2 border-bg bg-surface3 transition-transform duration-300 ease-out"
                  style={{ transform: `translate(${t.x}px, ${t.y}px) rotate(${t.r}deg)` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full rounded-md object-cover ring-[0.5px] ring-inset ring-border"
                  />
                </span>
              );
            })}
          </div>
          <div
            className={`flex items-center gap-1 text-[13px] font-medium tracking-[-0.26px] transition-colors ${hover ? "text-fg" : "text-fg-muted"}`}
          >
            See similar
            <ChevronDown size={14} strokeWidth={1.75} />
          </div>
        </button>
      </div>

      <SeeSimilarSheet
        open={open}
        onClose={() => setOpen(false)}
        brief={brief}
        collectionName={collectionName}
        collectionThumbnail={collectionThumbnail}
      />
    </>
  );
}
