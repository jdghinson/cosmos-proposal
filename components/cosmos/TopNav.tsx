"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { SearchBar, type SearchScope } from "./SearchBar";
import { CreateDropdown } from "./CreateDropdown";
import { CollectionsButton } from "./CollectionsButton";
import { UserAvatar } from "./UserAvatar";

export function TopNav({ searchScope }: { searchScope?: SearchScope } = {}) {
  const pathname = usePathname();
  const isExplore = pathname === "/";
  const isProfile = pathname === "/profile";

  return (
    <div className="relative flex items-center justify-between px-8 py-6">
      <div className="relative z-10 flex items-center gap-1">
        <Link
          href="/"
          aria-label="Cosmos"
          className="grid h-[54px] w-[54px] place-items-center rounded-full bg-surface text-fg ring-1 ring-inset ring-border"
        >
          <Logo size={22} />
        </Link>
        <nav className="flex h-[54px] items-center gap-6 rounded-full bg-surface px-8 text-[14px] font-medium ring-1 ring-inset ring-border">
          <Link href="/" className="cursor-pointer text-fg-muted hover:text-fg">For You</Link>
          <Link href="/" className="cursor-pointer text-fg-muted hover:text-fg">Following</Link>
          <Link
            href="/"
            className={`cursor-pointer ${isExplore ? "text-fg" : "text-fg-muted hover:text-fg"}`}
          >
            Explore
          </Link>
        </nav>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2">
        <div className="pointer-events-auto">
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

        <CollectionsButton />

        <div className="flex items-center gap-1">
          <Link
            href="/profile"
            aria-label="Profile"
            className="group relative block h-7 w-7 rounded-full ring-focus"
          >
            <UserAvatar size={28} />
            <span
              aria-hidden
              className={`pointer-events-none absolute inset-0 rounded-full ${
                isProfile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
              style={{
                boxShadow: "#FFFFFF 0 0 0 2px inset, #141414 0 0 0 3px inset",
              }}
            />
          </Link>
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
