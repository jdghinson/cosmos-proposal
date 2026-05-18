"use client";

import { LayoutGrid, Square, Upload, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWizard } from "@/lib/wizard-store";

export function CreateDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { openWizard } = useWizard();

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
        className="grid h-[30px] place-items-center rounded-full bg-fg px-3 text-[14px] font-medium tracking-[-0.28px] text-[#0D0D0D] hover:bg-[#D4D4D4] ring-focus active:scale-[0.97] transition-[background-color,transform] duration-150 ease-out"
      >
        Create
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4, transition: { duration: 0.12, ease: [0.2, 0.6, 0.2, 1] } }}
            transition={{ duration: 0.16, ease: [0.2, 0.6, 0.2, 1] }}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-[calc(100%+8px)] z-40 w-[260px] rounded-md bg-surface p-2 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-border"
          >
            <DropdownItem
              icon={<LayoutGrid size={16} strokeWidth={1.6} />}
              title="Collection"
              subtitle="A collection of elements"
              onClick={() => {
                setOpen(false);
                openWizard("create");
              }}
            />
            <DropdownItem icon={<Square size={16} strokeWidth={1.6} />} title="Element" subtitle="Media, URL, or note" />
            <DropdownItem icon={<Upload size={16} strokeWidth={1.6} />} title="Import" subtitle="From Pinterest, Are.na or Tumblr" />
            <div className="my-1 h-px bg-border" />
            <DropdownItem
              icon={<Sparkles size={16} strokeWidth={1.6} />}
              title="AI Collection"
              subtitle="Generate from a brief"
              isNew
              onClick={() => {
                setOpen(false);
                openWizard();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DropdownItem({
  icon,
  title,
  subtitle,
  isNew,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  isNew?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-md px-2.5 py-2 text-left hover:bg-surface2"
    >
      <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-md bg-surface2 text-fg-muted">
        {icon}
      </span>
      <span className="flex-1">
        <span className="flex items-center gap-2 text-[13px] font-medium text-fg">
          {title}
          {isNew && (
            <span className="rounded-pill bg-fg/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-fg-muted">
              New
            </span>
          )}
        </span>
        <span className="block text-[12px] text-fg-muted">{subtitle}</span>
      </span>
    </button>
  );
}
