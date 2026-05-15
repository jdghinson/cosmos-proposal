"use client";

import { UserAvatar } from "./UserAvatar";
import { currentUser } from "@/lib/user";

type Tab = "elements" | "collections";

export function ProfileHeader({
  elementsCount,
  collectionsCount,
  activeTab,
  onTabChange,
}: {
  elementsCount: number;
  collectionsCount: number;
  activeTab: Tab;
  onTabChange: (t: Tab) => void;
}) {
  return (
    <div className="flex flex-col gap-6 px-8 pt-8 pb-14">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-[18px]">
            <div className="rounded-full outline outline-[0.5px] outline-border">
              <UserAvatar size={80} />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-[26px] leading-[26px] tracking-[-0.52px] text-fg">
                {currentUser.name}
              </h1>
              <span className="text-[16px] leading-[125%] tracking-[-0.32px] text-fg-muted">
                @{currentUser.handle}
              </span>
            </div>
          </div>
          <button className="max-w-md self-start text-left text-[16px] leading-[125%] tracking-[-0.32px] text-fg-muted hover:text-fg">
            {currentUser.bio || "Add a bio…"}
          </button>
        </div>

        <div className="flex items-start gap-[50px] pt-3">
          <StatStack count={currentUser.followers} label="Follower" />
          <StatStack count={currentUser.following} label="Following" />
        </div>
      </div>

      <div className="grid w-full grid-cols-3 items-center">
        <div className="flex">
          <button className="flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-medium tracking-[-0.3px] text-fg ring-[0.5px] ring-inset ring-border hover:bg-surface2">
            Edit profile
          </button>
        </div>

        <div className="justify-self-center">
          <div className="flex h-12 items-center rounded-full p-[3.5px] ring-[0.5px] ring-inset ring-border">
            <TabButton
              label="Elements"
              count={elementsCount}
              active={activeTab === "elements"}
              onClick={() => onTabChange("elements")}
            />
            <TabButton
              label="Collections"
              count={collectionsCount}
              active={activeTab === "collections"}
              onClick={() => onTabChange("collections")}
            />
          </div>
        </div>

        <div className="justify-self-end">
          <button
            aria-label="Filters"
            className="grid h-12 w-12 place-items-center rounded-full ring-[0.5px] ring-inset ring-border hover:bg-surface2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                stroke="currentColor"
                strokeLinecap="square"
                strokeLinejoin="round"
                strokeWidth="1.75"
                d="M14.25 4.75a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 1 0 0-5.5ZM9.75 13.75a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 1 0 0-5.5Z"
              />
              <path
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="1.75"
                d="M11.5 7.5H4M20 7.5h-3M20 16.5h-7.5M7 16.5H4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function StatStack({ count, label }: { count: number; label: string }) {
  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center">
        <span
          className="-ml-1.5 grid h-6 w-6 shrink-0 place-items-center overflow-hidden rounded-full bg-bg shadow-[0_0_0_1.5px_#141414]"
          style={{ translate: "2px 0px" }}
        >
          <UserAvatar size={24} className="outline outline-[0.5px] outline-border" />
        </span>
        <span
          className="-ml-1.5 h-6 w-6 shrink-0 rounded-full bg-surface3 shadow-[0_0_0_1.5px_#141414] outline outline-[0.5px] outline-border"
          style={{ translate: "1px 0px" }}
        />
        <span className="-ml-1.5 h-6 w-6 shrink-0 rounded-full bg-surface3 outline outline-[0.5px] outline-border" />
      </div>
      <span className="text-[16px] leading-[125%] tracking-[-0.32px] text-fg">
        {count} {label}
      </span>
    </div>
  );
}

function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-[41px] items-center gap-1 rounded-full pl-[18px] pr-3 text-[14px] font-medium tracking-[-0.28px] transition-colors ${
        active ? "bg-surface3 text-fg" : "text-fg-muted hover:text-fg"
      }`}
    >
      {label}
      <span
        className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-medium tracking-[-0.1px] ${
          active ? "bg-fg text-bg" : "bg-surface3 text-fg-muted"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
