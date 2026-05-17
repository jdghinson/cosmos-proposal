"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Contrast,
  LayoutGrid,
  LogOut,
  MessageSquareMore,
  Moon,
  Play,
  Settings,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";
import { useCollections } from "@/lib/collections-store";
import { useWizard } from "@/lib/wizard-store";
import { UserAvatar } from "./UserAvatar";

function MenuIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect y="3.25" width="14" height="1.5" rx="0.75" fill="currentColor" />
      <rect y="9.25" width="14" height="1.5" rx="0.75" fill="currentColor" />
    </svg>
  );
}

function Row({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between gap-2 rounded-2xl px-4 py-3 text-left hover:bg-surface2 active:scale-[0.99] transition-[background-color,transform] duration-150 ease-out"
    >
      <span className="text-[14px] font-medium leading-[18px] tracking-[-0.28px] text-fg">
        {label}
      </span>
      <span className="grid h-6 w-6 shrink-0 place-items-center text-fg">{icon}</span>
    </button>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { id: string; icon: React.ReactNode }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="mr-4 flex min-w-20 items-center justify-between gap-0.5 rounded-full bg-surface3 p-1">
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            aria-pressed={active}
            className={
              "grid h-6 w-6 shrink-0 place-items-center rounded-full transition-colors duration-150 " +
              (active ? "bg-white text-[#0D0D0D]" : "text-fg-muted hover:text-fg")
            }
          >
            {o.icon}
          </button>
        );
      })}
    </div>
  );
}

function GridGlyph({ bars }: { bars: 1 | 2 | 3 }) {
  const d =
    bars === 1 ? "M9 4v10" : bars === 2 ? "M7 4v10M11 4v10" : "M5 4v10M9 4v10M13 4v10";
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" d={d} />
    </svg>
  );
}

export function NavMenu({
  variant = "inline",
  showCreate = false,
}: {
  variant?: "inline" | "circle";
  showCreate?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("system");
  const [grid, setGrid] = useState("md");
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { addCollection } = useCollections();
  const { openWizard } = useWizard();

  function createCollection() {
    const id = "manual-" + Date.now().toString(36);
    addCollection({
      id,
      title: "Untitled collection",
      brief: "",
      createdAt: Date.now(),
      imageUrls: [],
      source: "manual",
    });
    setOpen(false);
    router.push(`/collection/${id}`);
  }

  function createAICollection() {
    setOpen(false);
    openWizard();
  }

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
        aria-label="Menu"
        aria-expanded={open}
        className={
          variant === "circle"
            ? "grid h-[54px] w-[54px] shrink-0 place-items-center rounded-full bg-surface text-fg-muted ring-1 ring-inset ring-border hover:text-fg ring-focus active:scale-[0.97] transition-[background-color,transform] duration-150 ease-out"
            : "-mr-1 grid h-7 w-7 place-items-center text-fg-muted hover:text-fg ring-focus active:scale-[0.92] transition-transform duration-150 ease-out"
        }
      >
        <MenuIcon />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4, transition: { duration: 0.12, ease: [0.2, 0.6, 0.2, 1] } }}
            transition={{ duration: 0.16, ease: [0.2, 0.6, 0.2, 1] }}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-[calc(100%+8px)] z-50 flex w-[244px] flex-col gap-1 rounded-[20px] bg-surface p-1 shadow-[0_1px_8px_rgba(0,0,0,0.05)] ring-1 ring-border"
          >
            {showCreate && (
              <>
                <div className="flex flex-col">
                  <Row
                    label="Create collection"
                    icon={<LayoutGrid size={20} strokeWidth={1.75} />}
                    onClick={createCollection}
                  />
                  <Row
                    label="AI collection"
                    icon={<Sparkles size={20} strokeWidth={1.75} />}
                    onClick={createAICollection}
                  />
                </div>

                <div className="mx-4 h-px shrink-0 bg-surface3" />
              </>
            )}

            <div className="flex flex-col">
              <Row label="View profile" icon={<span className="block h-5 w-5 overflow-hidden rounded-full ring-[0.5px] ring-inset ring-border"><UserAvatar size={20} /></span>} />
              <Row label="Settings" icon={<Settings size={20} strokeWidth={1.75} />} />
              <Row label="Contact us" icon={<MessageSquareMore size={20} strokeWidth={1.75} />} />
              <Row label="Community" icon={<Users size={20} strokeWidth={1.75} />} />
              <Row label="Logout" icon={<LogOut size={20} strokeWidth={1.75} />} />
            </div>

            <div className="mx-4 h-px shrink-0 bg-surface3" />

            <div className="flex flex-col">
              <Row label="Watch the film" icon={<Play size={18} fill="currentColor" strokeWidth={0} />} />
            </div>

            <div className="mx-4 h-px shrink-0 bg-surface3" />

            <div className="flex flex-col">
              <div className="flex h-[46px] items-center justify-between">
                <span className="px-4 text-[14px] font-medium leading-[18px] tracking-[-0.28px] text-fg">
                  Theme
                </span>
                <Segmented
                  value={theme}
                  onChange={setTheme}
                  options={[
                    { id: "light", icon: <Sun size={18} strokeWidth={1.5} /> },
                    { id: "dark", icon: <Moon size={18} strokeWidth={1.5} /> },
                    { id: "system", icon: <Contrast size={18} strokeWidth={1.5} /> },
                  ]}
                />
              </div>

              <div className="flex h-[46px] items-center justify-between">
                <span className="px-4 text-[14px] font-medium leading-[18px] tracking-[-0.28px] text-fg">
                  Grid size
                </span>
                <Segmented
                  value={grid}
                  onChange={setGrid}
                  options={[
                    { id: "sm", icon: <GridGlyph bars={1} /> },
                    { id: "md", icon: <GridGlyph bars={2} /> },
                    { id: "lg", icon: <GridGlyph bars={3} /> },
                  ]}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
