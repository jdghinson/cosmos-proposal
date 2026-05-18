"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { SearchBar, type SearchScope } from "./SearchBar";
import { CreateDropdown } from "./CreateDropdown";
import { CollectionsButton } from "./CollectionsButton";
import { UserAvatar } from "./UserAvatar";
import { NavMenu } from "./NavMenu";

const FEEDS = ["For You", "Following", "Explore"];

function SparkButton() {
  return (
    <button
      aria-label="Quick generate"
      className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full text-fg ring-1 ring-inset ring-border hover:bg-surface2 ring-focus active:scale-[0.97] transition-[background-color,transform] duration-150 ease-out"
    >
      <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
        <path
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M10 7.25h3.96a.5.5 0 0 1 .39.812l-6.172 7.716a.592.592 0 0 1-1.044-.48L8 10.75H4.04a.5.5 0 0 1-.39-.812l6.172-7.716a.592.592 0 0 1 1.044.48z"
        />
      </svg>
    </button>
  );
}

function AvatarLink({ isProfile }: { isProfile: boolean }) {
  return (
    <Link
      href="/profile"
      aria-label="Profile"
      className="group relative block h-7 w-7 shrink-0 rounded-full ring-focus"
    >
      <UserAvatar size={28} />
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-full ${
          isProfile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        style={{ boxShadow: "#FFFFFF 0 0 0 2px inset, #141414 0 0 0 3px inset" }}
      />
    </Link>
  );
}

function FeedPill() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex h-[54px] min-w-[140px] items-center justify-center gap-2 rounded-full bg-surface px-4 text-[14px] font-medium tracking-[-0.28px] text-fg ring-1 ring-inset ring-border ring-focus active:scale-[0.98] transition-[background-color,transform] duration-150 ease-out"
      >
        For You
        <ChevronDown
          size={16}
          strokeWidth={2}
          className={"shrink-0 transition-transform duration-200 ease-out " + (open ? "rotate-180" : "")}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4, transition: { duration: 0.12, ease: [0.2, 0.6, 0.2, 1] } }}
            transition={{ duration: 0.16, ease: [0.2, 0.6, 0.2, 1] }}
            style={{ transformOrigin: "top left" }}
            className="absolute left-0 top-[calc(100%+8px)] z-40 w-[200px] rounded-md bg-surface p-2 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-border"
          >
            {FEEDS.map((f) => (
              <Link
                key={f}
                href="/"
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-[14px] font-medium tracking-[-0.28px] text-fg-muted hover:bg-surface2 hover:text-fg"
              >
                {f}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TopNav({ searchScope }: { searchScope?: SearchScope } = {}) {
  const pathname = usePathname();
  const isExplore = pathname === "/";
  const isProfile = pathname === "/profile";

  return (
    // z-30 establishes a stacking layer for the nav's dropdowns (NavMenu,
    // CreateDropdown, FeedPill) above page body content like the carousel
    // arrows (z-10) and Back-to-top (z-20), but below app modals (z-40/50).
    <div className="relative z-30">
      {/* ≥1024 (lg & xl). xl shows the 3 feed links; lg collapses them into a dropdown pill. */}
      <div className="relative hidden items-center justify-between px-8 py-6 lg:flex">
        <div className="relative z-10 flex items-center gap-1">
          <Link
            href="/"
            aria-label="Cosmos"
            className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-full bg-surface text-fg ring-1 ring-inset ring-border"
          >
            <Logo size={22} />
          </Link>

          <nav className="hidden h-[54px] items-center gap-6 rounded-full bg-surface px-8 text-[14px] font-medium ring-1 ring-inset ring-border xl:flex">
            <Link href="/" className="cursor-pointer text-fg-muted hover:text-fg">For You</Link>
            <Link href="/" className="cursor-pointer text-fg-muted hover:text-fg">Following</Link>
            <Link
              href="/"
              className={`cursor-pointer ${isExplore ? "text-fg" : "text-fg-muted hover:text-fg"}`}
            >
              Explore
            </Link>
          </nav>

          <div className="flex xl:hidden">
            <FeedPill />
          </div>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2">
          <div className="pointer-events-auto">
            <SearchBar scope={searchScope} />
          </div>
        </div>

        <div className="relative z-10 flex h-[54px] items-center gap-3 rounded-full bg-surface pl-3 pr-4 ring-1 ring-inset ring-border">
          <SparkButton />
          <CreateDropdown />
          <CollectionsButton />
          <div className="flex items-center gap-1">
            <AvatarLink isProfile={isProfile} />
            <NavMenu variant="inline" />
          </div>
        </div>
      </div>

      {/* 768–1023 (md). No logo, no Create label, no collections — For You pill + fluid search + compact actions. */}
      <div className="hidden items-center gap-3 px-8 py-6 md:flex lg:hidden">
        <FeedPill />
        <div className="min-w-0 flex-1">
          <SearchBar scope={searchScope} fluid />
        </div>
        <div className="flex h-[54px] shrink-0 items-center gap-3 rounded-full bg-surface pl-3 pr-4 ring-1 ring-inset ring-border">
          <SparkButton />
          <AvatarLink isProfile={isProfile} />
          <NavMenu variant="inline" showCreate />
        </div>
      </div>

      {/* <768 (mobile). Logo mark + fluid search + single circular menu. */}
      <div className="flex items-center gap-3 px-4 py-3 md:hidden">
        <Link href="/" aria-label="Cosmos" className="shrink-0 text-fg">
          <Logo size={24} />
        </Link>
        <div className="min-w-0 flex-1">
          <SearchBar scope={searchScope} fluid />
        </div>
        <NavMenu variant="circle" showCreate />
      </div>
    </div>
  );
}
