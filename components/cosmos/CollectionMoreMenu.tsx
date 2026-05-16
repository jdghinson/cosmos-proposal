"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Pencil,
  Unlock,
  Pin,
  UserPlus,
  LayoutGrid,
  Download,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { useCollections } from "@/lib/collections-store";

const DANGER = "#EF7759";

export function CollectionMoreMenu({ collectionId }: { collectionId: string }) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { removeCollection } = useCollections();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
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
  }, [open]);

  function handleDelete() {
    setConfirmOpen(false);
    router.push("/profile?tab=collections");
    // Remove after navigation is initiated so the collection page doesn't
    // flash its "not found" state before the route changes.
    setTimeout(() => removeCollection(collectionId), 80);
  }

  return (
    <>
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="More"
          aria-expanded={open}
          className="group flex flex-col items-center gap-2"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-surface text-fg ring-1 ring-inset ring-border transition-colors group-hover:bg-surface2">
            <MoreHorizontal size={20} strokeWidth={1.75} />
          </span>
          <span className="text-[13px] tracking-[-0.26px] text-fg-muted group-hover:text-fg">
            More
          </span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: -4,
                transition: { duration: 0.12, ease: [0.2, 0.6, 0.2, 1] },
              }}
              transition={{ duration: 0.16, ease: [0.2, 0.6, 0.2, 1] }}
              style={{ transformOrigin: "top right" }}
              className="absolute right-0 top-[calc(100%+12px)] z-50 w-60 overflow-hidden rounded-[20px] bg-surface p-1 ring-[0.5px] ring-border shadow-[0_1px_8px_rgba(0,0,0,0.5)]"
            >
              <MenuRow label="Edit details" icon={<Pencil size={20} strokeWidth={1.75} />} />
              <MenuRow label="Make public" icon={<Unlock size={20} strokeWidth={1.75} />} />
              <MenuRow label="Pin collection" icon={<Pin size={20} strokeWidth={1.75} />} />
              <MenuRow
                label="Invite collaborators"
                icon={<UserPlus size={20} strokeWidth={1.75} />}
              />
              <MenuRow label="View canvas" icon={<LayoutGrid size={20} strokeWidth={1.75} />} />
              <MenuRow
                label="Export collection"
                icon={<Download size={20} strokeWidth={1.75} />}
              />
              <MenuRow
                label="Delete collection"
                icon={<Trash2 size={20} strokeWidth={1.75} />}
                danger
                onClick={() => {
                  setOpen(false);
                  setConfirmOpen(true);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DeleteCollectionDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}

function MenuRow({
  label,
  icon,
  danger,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-14 w-full items-center justify-between gap-2 rounded-2xl p-4 text-left transition-colors hover:bg-surface2"
      style={danger ? { color: DANGER } : undefined}
    >
      <span
        className={`line-clamp-1 text-[14px] font-medium leading-[18px] tracking-[-0.28px] ${danger ? "" : "text-fg"}`}
      >
        {label}
      </span>
      <span className={danger ? "" : "text-fg"}>{icon}</span>
    </button>
  );
}

function DeleteCollectionDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-[60] bg-black/50"
            onClick={onCancel}
          />
          <div className="fixed inset-0 z-[70] grid place-items-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18, ease: [0.2, 0.6, 0.2, 1] }}
              role="dialog"
              aria-modal="true"
              className="flex w-[420px] flex-col gap-8 rounded-3xl bg-bg px-6 pb-6 pt-10 ring-[0.5px] ring-border shadow-[0_1px_8px_rgba(0,0,0,0.5)]"
            >
              <div className="flex flex-col items-center">
                <h2 className="mb-1 text-center text-[18px] font-medium leading-[22px] tracking-[-0.18px] text-fg">
                  Delete collection?
                </h2>
                <p className="text-center text-[14px] leading-[18px] tracking-[-0.28px] text-fg-muted">
                  Elements connected to this collection will be removed
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onCancel}
                  className="flex h-14 flex-1 items-center justify-center rounded-full px-6 text-[15px] font-medium tracking-[-0.3px] text-fg ring-[0.5px] ring-inset ring-border hover:bg-surface2"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex h-14 flex-1 items-center justify-center rounded-full bg-surface3 px-6 text-[15px] font-medium tracking-[-0.3px] hover:bg-surface3/80"
                  style={{ color: DANGER }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
