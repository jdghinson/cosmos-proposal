"use client";

import { Logo } from "./Logo";
import { SearchBar, type SearchScope } from "./SearchBar";
import { CreateDropdown } from "./CreateDropdown";

export function TopNav({ searchScope }: { searchScope?: SearchScope } = {}) {
  return (
    <div className="relative flex items-center justify-between px-8 py-6">
      <div className="relative z-10 flex items-center gap-1">
        <button
          aria-label="Cosmos"
          className="grid h-[54px] w-[54px] place-items-center rounded-full bg-surface text-fg ring-1 ring-inset ring-border"
        >
          <Logo size={22} />
        </button>
        <nav className="flex h-[54px] items-center gap-6 rounded-full bg-surface px-8 text-[14px] font-medium ring-1 ring-inset ring-border">
          <span className="cursor-pointer text-fg-muted hover:text-fg">For You</span>
          <span className="cursor-pointer text-fg-muted hover:text-fg">Following</span>
          <span className="cursor-pointer text-fg">Explore</span>
        </nav>
      </div>

      <div className="pointer-events-none absolute inset-x-0 flex justify-center">
        <div className="pointer-events-auto w-[480px] max-w-[640px]">
          <SearchBar scope={searchScope} />
        </div>
      </div>

      <div className="relative z-10 flex h-[54px] items-center gap-3 rounded-full bg-surface pl-3 pr-4 ring-1 ring-inset ring-border">
        <button
          aria-label="Quick generate"
          className="grid h-[30px] w-[30px] place-items-center rounded-full text-fg ring-1 ring-inset ring-border hover:bg-surface2 ring-focus"
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

        <CreateDropdown />

        <button
          aria-label="Apps"
          className="-ml-[2px] grid h-7 w-7 place-items-center rounded-lg bg-surface3 text-fg-muted ring-[1.5px] ring-inset ring-surface hover:text-fg"
        >
          <svg width="10" height="11" viewBox="0 0 28 31" fill="currentColor">
            <circle cx="14" cy="4.5" r="4.5" />
            <circle cx="14" cy="26.5" r="4.5" />
            <circle cx="4.5" cy="10" r="4.5" />
            <circle cx="23.5" cy="21" r="4.5" />
            <circle cx="23.5" cy="10" r="4.5" />
            <circle cx="4.5" cy="21" r="4.5" />
          </svg>
        </button>

        <div className="flex items-center gap-1">
          <div
            aria-label="Avatar"
            className="h-7 w-7 rounded-full"
            style={{ background: "radial-gradient(circle at 30% 30%, #f7c2a5, #d99172)" }}
          />
          <button
            aria-label="Menu"
            className="-mr-1 grid h-7 w-7 place-items-center text-fg-muted hover:text-fg ring-focus"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect y="3.25" width="14" height="1.5" rx="0.75" fill="currentColor" />
              <rect y="9.25" width="14" height="1.5" rx="0.75" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
