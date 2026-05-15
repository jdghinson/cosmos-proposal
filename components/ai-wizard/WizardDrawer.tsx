"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles, ArrowLeft } from "lucide-react";
import { BriefStep } from "./BriefStep";
import { GeneratingStep } from "./GeneratingStep";
import { ResultsStep } from "./ResultsStep";
import { resultsForBrief, suggestTitle } from "@/lib/mock-data";
import { useCollections } from "@/lib/collections-store";
import { useWizard } from "@/lib/wizard-store";
import type { WizardState } from "./types";

type Step = "brief" | "generating" | "results";

const initial: WizardState = {
  name: "",
  brief: "",
  projectTypes: [],
  keywords: [],
  color: null,
  isPrivate: true,
  collaborators: [],
  imageUrls: [],
  selected: new Set(),
};

export function WizardDrawer() {
  const router = useRouter();
  const { isOpen, closeWizard } = useWizard();
  const { addCollection } = useCollections();
  const [step, setStep] = useState<Step>("brief");
  const [state, setState] = useState<WizardState>(initial);

  useEffect(() => {
    if (!state.name && state.brief) {
      setState((s) => (s.name ? s : { ...s, name: suggestTitle(s.brief) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.brief]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeWizard();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeWizard]);

  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  function reset() {
    setState(initial);
    setStep("brief");
  }

  function handleClose() {
    closeWizard();
    setTimeout(reset, 350);
  }

  function startGenerate() {
    const imgs = resultsForBrief(state.brief, [...state.keywords, ...state.projectTypes]);
    const name = state.name.trim() || suggestTitle(state.brief);
    setState((s) => ({
      ...s,
      imageUrls: imgs,
      selected: new Set(imgs),
      name,
    }));
    setStep("generating");
    setTimeout(() => setStep("results"), 2500);
  }

  function regenerate() {
    setStep("generating");
    setTimeout(() => {
      const imgs = resultsForBrief(state.brief + " " + Math.random(), [
        ...state.keywords,
        ...state.projectTypes,
      ]);
      setState((s) => ({ ...s, imageUrls: imgs, selected: new Set(imgs) }));
      setStep("results");
    }, 1800);
  }

  function save() {
    const id = "ai-" + Date.now().toString(36);
    const selectedImages = state.imageUrls.filter((u) => state.selected.has(u));
    addCollection({
      id,
      title: state.name.trim() || suggestTitle(state.brief),
      brief: state.brief,
      createdAt: Date.now(),
      imageUrls: selectedImages,
      source: "ai",
      isPrivate: state.isPrivate,
      collaborators: state.collaborators,
    });
    closeWizard();
    setTimeout(reset, 350);
    router.push(`/collection/${id}`);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.16 } }}
            transition={{ duration: 0.22 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm"
          />
          <motion.aside
            key="panel"
            initial={{ transform: "translateX(100%)" }}
            animate={{ transform: "translateX(0%)" }}
            exit={{ transform: "translateX(100%)", transition: { duration: 0.32, ease: [0.32, 0.72, 0, 1] } }}
            transition={{ type: "tween", duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="fixed right-0 top-0 z-50 flex h-full w-[85vw] max-w-[1180px] flex-col bg-bg shadow-[0_0_64px_rgba(0,0,0,0.6)] ring-1 ring-inset ring-border"
            role="dialog"
            aria-label="New AI Collection"
          >
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                {step === "results" || step === "generating" ? (
                  <button
                    onClick={() => setStep("brief")}
                    className="grid h-8 w-8 place-items-center rounded-full text-fg-muted hover:bg-surface hover:text-fg transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.92]"
                    aria-label="Back"
                  >
                    <ArrowLeft size={15} />
                  </button>
                ) : null}
                <span className="flex items-center gap-2 text-[13px] font-medium tracking-[-0.26px] text-fg">
                  <Sparkles size={14} className="text-fg" strokeWidth={1.75} />
                  New AI Collection
                </span>
                <span className="rounded-full bg-fg/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-fg-muted">
                  Premium
                </span>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full text-fg-muted hover:bg-surface hover:text-fg transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.92]"
              >
                <X size={16} />
              </button>
            </header>

            <div className="relative flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {step === "brief" && (
                  <motion.div
                    key="brief"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.16 } }}
                    transition={{ duration: 0.22 }}
                    className="mx-auto max-w-[560px] px-6 py-8"
                  >
                    <BriefStep state={state} setState={setState} onSubmit={startGenerate} />
                  </motion.div>
                )}
                {step === "generating" && (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.16 } }}
                    transition={{ duration: 0.22 }}
                    className="px-8 py-8"
                  >
                    <GeneratingStep state={state} />
                  </motion.div>
                )}
                {step === "results" && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.16 } }}
                    transition={{ duration: 0.22 }}
                    className="px-8 py-6"
                  >
                    <ResultsStep
                      state={state}
                      setState={setState}
                      onSave={save}
                      onRegenerate={regenerate}
                      onBack={() => setStep("brief")}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
