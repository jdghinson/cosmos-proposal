"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";

/**
 * Window-scroll "Back to top" affordance for full-page routes (explore).
 * Mirrors the in-sheet variant in SeeSimilarSheet for visual consistency.
 */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function update() {
      setShow(window.scrollY > 400);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  function scrollToTop() {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
    // Fallback if smooth scrolling is disabled (e.g. reduced-motion or preview).
    setTimeout(() => {
      if (window.scrollY > 0) window.scrollTo(0, 0);
    }, 600);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18 }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-8 right-8 z-20 flex h-10 items-center gap-1 rounded-full bg-white pl-3 pr-5 text-[14px] font-medium tracking-[-0.28px] text-[#0D0D0D] shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:bg-white/90"
        >
          <ChevronUp size={20} strokeWidth={1.75} className="-mt-px" />
          Back to top
        </motion.button>
      )}
    </AnimatePresence>
  );
}
