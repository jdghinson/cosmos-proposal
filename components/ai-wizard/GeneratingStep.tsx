"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { WizardState } from "./types";

const ASPECTS = ["3 / 4", "1 / 1", "4 / 5", "3 / 4", "5 / 6", "1 / 1", "3 / 4", "4 / 5"];

export function GeneratingStep({ state }: { state: WizardState }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-surface ring-1 ring-inset ring-border">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, ease: "linear", repeat: Infinity }}
          >
            <Sparkles size={18} className="text-fg" strokeWidth={1.5} />
          </motion.div>
        </div>
        <h2 className="text-[20px] font-medium tracking-[-0.4px] text-fg">
          Generating {state.name || "your collection"}…
        </h2>
        <p className="mx-auto mt-2 max-w-[480px] rounded-md bg-surface px-3 py-1.5 text-[12px] text-fg-muted">
          “{state.brief}”
        </p>
      </div>

      <div className="columns-2 gap-3 sm:columns-3 md:columns-4 xl:columns-5 [&>*]:mb-3 [&>*]:break-inside-avoid">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className="w-full rounded-lg shimmer-bg animate-shimmer"
            style={{ aspectRatio: ASPECTS[i % ASPECTS.length] }}
          />
        ))}
      </div>
    </div>
  );
}
