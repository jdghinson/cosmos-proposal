"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useWizard } from "@/lib/wizard-store";
import { CollectionIcon, ElementIcon, ImportIcon } from "./CreateMenuIcons";

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
            style={{
              transformOrigin: "top right",
              boxShadow: "#F7F5F31F 0 0 0 0.5px, rgba(0,0,0,0.05) 0 1px 8px",
            }}
            className="absolute right-0 top-[calc(100%+8px)] z-40 w-[246px] overflow-hidden rounded-[20px] bg-surface p-1"
          >
            <div className="flex flex-col gap-[3px]">
              <DropdownItem
                icon={<CollectionIcon />}
                title="Collection"
                subtitle="A collection of elements"
                onClick={() => {
                  setOpen(false);
                  openWizard("create");
                }}
              />
              <DropdownItem
                icon={<ElementIcon />}
                title="Element"
                subtitle="Media, URL, or note"
              />
              <DropdownItem
                icon={<ImportIcon />}
                title="Import"
                subtitle="From Pinterest, Are.na or Tumblr"
              />
              <DropdownItem
                icon={<Sparkles size={20} strokeWidth={1.75} />}
                title="Moodboard"
                subtitle="Generate from a brief"
                isNew
                spinIcon
                onClick={() => {
                  setOpen(false);
                  openWizard();
                }}
              />
            </div>
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
  spinIcon,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  isNew?: boolean;
  onClick?: () => void;
  spinIcon?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [spin, setSpin] = useState(0);
  const enableSpin = !!spinIcon && !reduceMotion;

  // One revolution per hover/focus, then it stops. 360° is visually identical
  // to rest, so there's no unwind on leave; re-hovering adds another spin and
  // Framer retargets smoothly if interrupted mid-spin.
  const hoverHandlers = enableSpin
    ? {
        onMouseEnter: () => setSpin((s) => s + 360),
        onFocus: () => setSpin((s) => s + 360),
      }
    : {};

  return (
    <button
      type="button"
      onClick={onClick}
      {...hoverHandlers}
      className="flex h-[58px] w-full items-center gap-4 rounded-2xl border-[0.5px] border-border bg-bg px-4 py-3 text-left text-fg hover:bg-surface2 active:scale-[0.99] transition-[background-color,transform] duration-150 ease-out"
    >
      {enableSpin ? (
        <motion.span
          className="inline-flex shrink-0"
          style={{ transformPerspective: 400 }}
          animate={{ rotateY: spin }}
          transition={{ rotateY: { duration: 3.0, ease: [0.23, 1, 0.32, 1] } }}
        >
          {icon}
        </motion.span>
      ) : (
        icon
      )}
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="flex items-center gap-2 text-[14px] font-medium tracking-[-0.28px] text-fg">
          {title}
          {isNew && (
            <span className="rounded-pill bg-fg/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-fg-muted">
              New
            </span>
          )}
        </span>
        <span className="truncate text-[12px] font-medium tracking-[-0.24px] text-fg-muted">
          {subtitle}
        </span>
      </span>
    </button>
  );
}
