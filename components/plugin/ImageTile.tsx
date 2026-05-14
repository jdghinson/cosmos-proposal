"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, ArrowUpRight } from "lucide-react";

type Props = {
  src: string;
  onClick: () => void;
  aspect?: number;
};

export function ImageTile({ src, onClick, aspect = 1 }: Props) {
  const [adding, setAdding] = useState(false);

  function handleClick() {
    if (adding) return;
    setAdding(true);
    onClick();
    setTimeout(() => setAdding(false), 600);
  }

  return (
    <button
      onClick={handleClick}
      className="group relative block overflow-hidden rounded-sm bg-surface2"
      style={{ aspectRatio: aspect }}
    >
      <motion.img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        animate={
          adding
            ? { x: 200, y: -80, scale: 0.4, opacity: 0 }
            : { x: 0, y: 0, scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.55, ease: [0.2, 0.6, 0.2, 1] }}
      />
      <span
        className={
          "pointer-events-none absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/55 to-transparent p-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        }
      >
        <span className="flex items-center gap-1 rounded-pill bg-fg/90 px-2 py-0.5 text-[10px] font-medium text-bg">
          <Plus size={10} />
          Add
        </span>
        <span className="grid h-5 w-5 place-items-center rounded-sm bg-bg/60 text-fg">
          <ArrowUpRight size={10} />
        </span>
      </span>
    </button>
  );
}
