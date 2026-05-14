"use client";

import { Globe, Lock, Plus, UserPlus, MoreHorizontal } from "lucide-react";
import type { Collaborator } from "@/lib/mock-data";

type Props = {
  title: string;
  author: string;
  isPrivate?: boolean;
  collaborators?: Collaborator[];
};

export function CollectionHeader({
  title,
  author,
  isPrivate = true,
  collaborators = [],
}: Props) {
  return (
    <header className="flex flex-col items-center px-8 pt-16 text-center">
      <h1 className="max-w-[840px] text-balance text-[48px] font-medium leading-[110%] tracking-[-0.96px] text-fg">
        {title}
      </h1>

      <div className="mt-3 flex items-center gap-2 text-[14px] tracking-[-0.28px] text-fg-muted">
        <span>@{author}</span>
        <span>·</span>
        <span className="flex items-center gap-1">
          {isPrivate ? "Private" : "Public"}
          {isPrivate ? (
            <Lock size={12} strokeWidth={1.75} />
          ) : (
            <Globe size={12} strokeWidth={1.75} />
          )}
        </span>
      </div>

      <div className="mt-5 flex items-center">
        <div
          className="h-9 w-9 rounded-full ring-2 ring-bg"
          style={{ background: "radial-gradient(circle at 30% 30%, #f7c2a5, #d99172)" }}
          aria-label="Owner"
        />
        {collaborators.slice(0, 4).map((c, i) => (
          <div
            key={c.id}
            className="grid h-9 w-9 place-items-center rounded-full text-[12px] font-medium text-bg ring-2 ring-bg"
            style={{
              background: c.avatarColor,
              marginLeft: i === 0 ? -8 : -14,
              zIndex: 4 - i,
            }}
            aria-label={c.name}
          >
            {c.name.charAt(0)}
          </div>
        ))}
        <button
          className="-ml-1.5 grid h-9 w-9 place-items-center rounded-full bg-surface text-fg ring-1 ring-inset ring-border hover:bg-surface2"
          aria-label="Invite collaborators"
        >
          <UserPlus size={14} strokeWidth={1.75} />
        </button>
      </div>

      <div className="mt-10 flex items-start gap-6">
        <ActionButton icon={<Plus size={20} strokeWidth={1.75} />} label="New" />
        <ActionButton icon={<SimilarIcon />} label="Similar" disabled />
        <ActionButton icon={<OrganizeIcon />} label="Organize" />
        <ActionButton icon={<MoreHorizontal size={20} strokeWidth={1.75} />} label="More" />
      </div>
    </header>
  );
}

function ActionButton({
  icon,
  label,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button disabled={disabled} className="group flex flex-col items-center gap-2">
      <span
        className={
          "grid h-12 w-12 place-items-center rounded-full ring-1 ring-inset ring-border transition-colors " +
          (disabled
            ? "bg-surface/60 text-fg-subtle"
            : "bg-surface text-fg group-hover:bg-surface2")
        }
      >
        {icon}
      </span>
      <span
        className={
          "text-[13px] tracking-[-0.26px] " +
          (disabled ? "text-fg-subtle" : "text-fg-muted group-hover:text-fg")
        }
      >
        {label}
      </span>
    </button>
  );
}

function SimilarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 11.5a7.5 7.5 0 0 1 13-5.1m2 5.1a7.5 7.5 0 0 1-13 5.1"
      />
      <path stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M16.5 4v3.5h3.5" />
      <path stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M7.5 20v-3.5H4" />
    </svg>
  );
}

function OrganizeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        d="M5 9c0-1.4 0-2.1.27-2.63a2.5 2.5 0 0 1 1.1-1.1C6.9 5 7.6 5 9 5h6c1.4 0 2.1 0 2.63.27a2.5 2.5 0 0 1 1.1 1.1C19 6.9 19 7.6 19 9v8c0 1.4 0 2.1-.27 2.63a2.5 2.5 0 0 1-1.1 1.1C17.1 21 16.4 21 15 21H9c-1.4 0-2.1 0-2.63-.27a2.5 2.5 0 0 1-1.1-1.1C5 19.1 5 18.4 5 17V9Z"
      />
      <path stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" d="M8 9h8" />
    </svg>
  );
}
