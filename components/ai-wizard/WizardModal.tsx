"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, Sparkles, ArrowLeft, RefreshCw } from "lucide-react";
import { BriefStep } from "./BriefStep";
import { GeneratingStep } from "./GeneratingStep";
import { CreateStep } from "./CreateStep";
import { ElementPicker } from "./ElementPicker";
import { resultsForBrief, suggestTitle } from "@/lib/mock-data";
import { useCollections } from "@/lib/collections-store";
import { useWizard } from "@/lib/wizard-store";
import type { WizardState } from "./types";

type Step =
  | "create-form"
  | "create-picker"
  | "ai-brief"
  | "ai-generating"
  | "ai-results";

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

const EASE = [0.2, 0.6, 0.2, 1] as const;

// Signature of the only inputs that affect AI generation. Order-independent
// and normalized so reordering chips/keywords or whitespace isn't a "change".
// Name, collaborators and privacy are deliberately excluded.
function genKey(s: WizardState): string {
  return [
    s.brief.trim().toLowerCase(),
    [...s.projectTypes].sort().join(","),
    [...s.keywords].map((k) => k.trim().toLowerCase()).sort().join(","),
  ].join("|");
}

export function WizardModal() {
  const router = useRouter();
  const { isOpen, mode, closeWizard } = useWizard();
  const { addCollection } = useCollections();
  const prefersReduced = useReducedMotion();
  const [step, setStep] = useState<Step>("ai-brief");
  const [state, setState] = useState<WizardState>(initial);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  // Inputs (brief + details) that produced the current imageUrls. Lets us keep
  // the same generation when the user goes back and only edited name/privacy/
  // collaborators, and re-generate only when the brief or details change.
  const generatedKeyRef = useRef<string | null>(null);

  // Initialise the step machine whenever the modal opens.
  useEffect(() => {
    if (isOpen) {
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
      setStep(mode === "create" ? "create-form" : "ai-brief");
    }
  }, [isOpen, mode]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
    setStep(mode === "create" ? "create-form" : "ai-brief");
    generatedKeyRef.current = null;
  }

  function handleClose() {
    // Close always abandons — nothing is persisted until Done/Skip.
    closeWizard();
    restoreFocusRef.current?.focus?.();
    setTimeout(reset, 350);
  }

  function toggle(url: string) {
    setState((s) => {
      const next = new Set(s.selected);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return { ...s, selected: next };
    });
  }

  // ---- Create flow ----
  function goToSuggested() {
    // CreateStep guarantees a non-empty name before calling this.
    const name = state.name.trim();
    const imgs = resultsForBrief(name);
    setState((s) => ({ ...s, name, imageUrls: imgs, selected: new Set() }));
    setStep("create-picker");
  }

  function finalizeCreate(skip: boolean) {
    const id = "manual-" + Date.now().toString(36);
    const selectedImages = skip
      ? []
      : state.imageUrls.filter((u) => state.selected.has(u));
    addCollection({
      id,
      title: state.name.trim() || "Untitled collection",
      brief: "",
      createdAt: Date.now(),
      imageUrls: selectedImages,
      source: "manual",
      isPrivate: state.isPrivate,
      collaborators: state.collaborators,
    });
    closeWizard();
    setTimeout(reset, 350);
    router.push(`/collection/${id}`);
  }

  // ---- AI flow ----
  function startGenerate() {
    const key = genKey(state);
    // BriefStep guarantees a non-empty name before calling this.
    const name = state.name.trim();
    if (state.imageUrls.length > 0 && generatedKeyRef.current === key) {
      // Brief & details unchanged since the last generation — keep the exact
      // same collection (and the user's current selection). Name, privacy and
      // collaborator edits don't regenerate, so skip the generating step too.
      setState((s) => ({ ...s, name }));
      setStep("ai-results");
      return;
    }
    const imgs = resultsForBrief(state.brief, [...state.keywords, ...state.projectTypes]);
    generatedKeyRef.current = key;
    setState((s) => ({ ...s, imageUrls: imgs, selected: new Set(imgs), name }));
    setStep("ai-generating");
    setTimeout(() => setStep("ai-results"), 2500);
  }

  function regenerate() {
    setStep("ai-generating");
    setTimeout(() => {
      const imgs = resultsForBrief(state.brief + " " + Math.random(), [
        ...state.keywords,
        ...state.projectTypes,
      ]);
      // The regenerated set becomes the current one for this brief+details,
      // so going back/forward keeps it until the inputs actually change.
      generatedKeyRef.current = genKey(state);
      setState((s) => ({ ...s, imageUrls: imgs, selected: new Set(imgs) }));
      setStep("ai-results");
    }, 1800);
  }

  function saveAI() {
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

  const selectedCount = state.selected.size;
  const isWide = step !== "create-form" && step !== "ai-brief";

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
          <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-6">
            <motion.div
              key="panel"
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={
                prefersReduced
                  ? { opacity: 0, transition: { duration: 0.14 } }
                  : { opacity: 0, scale: 0.96, y: -4, transition: { duration: 0.16, ease: EASE } }
              }
              transition={{ duration: 0.22, ease: EASE }}
              role="dialog"
              aria-modal="true"
              aria-label={mode === "create" ? "New collection" : "New Moodboard"}
              onClick={(e) => e.stopPropagation()}
              style={{ boxShadow: "#F7F5F31F 0 0 0 0.5px, rgba(0,0,0,0.05) 0 1px 8px" }}
              className={
                "relative flex max-h-full w-full flex-col overflow-hidden bg-bg transition-[max-width] duration-300 ease-out " +
                "max-sm:h-full max-sm:max-h-full sm:max-h-[88vh] sm:rounded-3xl " +
                (isWide ? "sm:max-w-[1120px] sm:h-[88vh]" : "sm:max-w-[420px]")
              }
            >
              <Header
                step={step}
                name={state.name}
                selectedCount={selectedCount}
                total={state.imageUrls.length}
                onClose={handleClose}
                right={
                  step === "create-picker" ? (
                    <HeaderAction
                      label="Done"
                      onClick={() => finalizeCreate(false)}
                      disabled={selectedCount === 0}
                    />
                  ) : step === "ai-results" ? (
                    <HeaderAction
                      label="Done"
                      onClick={saveAI}
                      disabled={selectedCount === 0}
                    />
                  ) : null
                }
              />

              <div className="relative flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {step === "create-form" && (
                    <StepShell key="create-form" className="mx-auto max-w-[460px] px-6 py-8">
                      <CreateStep state={state} setState={setState} onSubmit={goToSuggested} />
                    </StepShell>
                  )}

                  {step === "create-picker" && (
                    <StepShell key="create-picker" className="px-6 py-6 sm:px-8">
                      <ElementPicker
                        items={state.imageUrls}
                        selected={state.selected}
                        onToggle={toggle}
                      />
                      <StepFooter
                        onPrevious={() => setStep("create-form")}
                        secondaryLabel="Skip for now"
                        onSecondary={() => finalizeCreate(true)}
                      />
                    </StepShell>
                  )}

                  {step === "ai-brief" && (
                    <StepShell key="ai-brief" className="mx-auto max-w-[460px] px-6 py-8">
                      <BriefStep state={state} setState={setState} onSubmit={startGenerate} />
                    </StepShell>
                  )}

                  {step === "ai-generating" && (
                    <StepShell key="ai-generating" className="px-8 py-8" fade>
                      <GeneratingStep state={state} />
                    </StepShell>
                  )}

                  {step === "ai-results" && (
                    <StepShell key="ai-results" className="px-6 py-6 sm:px-8">
                      <ElementPicker
                        items={state.imageUrls}
                        selected={state.selected}
                        onToggle={toggle}
                      />
                      <StepFooter
                        onPrevious={() => setStep("ai-brief")}
                        secondaryLabel="Regenerate"
                        secondaryIcon={<RefreshCw size={13} />}
                        onSecondary={regenerate}
                      />
                    </StepShell>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function StepShell({
  children,
  className,
  fade,
}: {
  children: React.ReactNode;
  className: string;
  fade?: boolean;
}) {
  return (
    <motion.div
      initial={fade ? { opacity: 0 } : { opacity: 0, y: 6 }}
      animate={fade ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={fade ? { opacity: 0, transition: { duration: 0.16 } } : { opacity: 0, y: -6, transition: { duration: 0.16 } }}
      transition={{ duration: 0.22, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Header({
  step,
  name,
  selectedCount,
  total,
  onClose,
  right,
}: {
  step: Step;
  name: string;
  selectedCount: number;
  total: number;
  onClose: () => void;
  right: React.ReactNode;
}) {
  let title = "New collection";
  let subtitle: string | null = null;
  if (step === "ai-brief") title = "New Moodboard";
  if (step === "ai-generating") title = "Generating";
  if (step === "create-picker") {
    title = "Suggested elements";
    subtitle = `Connect elements to your collection${name ? ` ‘${name}’` : ""}`;
  }
  if (step === "ai-results") {
    title = name || "Your collection";
    subtitle = `${selectedCount} of ${total} selected`;
  }

  // First step of either flow (the form) places the close on the right,
  // matching the V0-0 reference. Later steps keep it on the left so the
  // right slot can hold the primary "Done" action.
  const isFirstStep = step === "create-form" || step === "ai-brief";
  const closeBtn = (
    <button
      onClick={onClose}
      aria-label="Close"
      className="grid h-8 w-8 place-items-center rounded-full text-fg-muted hover:bg-surface hover:text-fg transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.92]"
    >
      <X size={16} />
    </button>
  );

  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3.5">
      <div className="flex w-24 items-center">{!isFirstStep && closeBtn}</div>

      <div className="flex min-w-0 flex-1 flex-col items-center text-center">
        <span className="flex items-center gap-2 text-[13px] font-medium tracking-[-0.26px] text-fg">
          {step === "ai-brief" && <Sparkles size={14} strokeWidth={1.75} />}
          <span className="truncate">{title}</span>
          {step === "ai-brief" && (
            <span className="rounded-full bg-fg/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-fg-muted">
              Premium
            </span>
          )}
        </span>
        {subtitle && (
          <span className="mt-0.5 truncate text-[12px] text-fg-muted">{subtitle}</span>
        )}
      </div>

      <div className="flex w-24 items-center justify-end">
        {isFirstStep ? closeBtn : right}
      </div>
    </header>
  );
}

/** Primary action rendered in the modal header's right slot (picker steps). */
function HeaderAction({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-full bg-fg px-5 py-2 text-[13px] font-medium tracking-[-0.26px] text-[#0D0D0D] disabled:opacity-30 active:scale-[0.97] transition-transform duration-150 ease-out"
    >
      {label}
    </button>
  );
}

/**
 * Sticky footer shared by both second steps: Previous on the left, the
 * flow-specific secondary action (Skip / Regenerate) on the right.
 */
function StepFooter({
  onPrevious,
  secondaryLabel,
  secondaryIcon,
  onSecondary,
}: {
  onPrevious: () => void;
  secondaryLabel: string;
  secondaryIcon?: React.ReactNode;
  onSecondary: () => void;
}) {
  const cls =
    "flex items-center gap-1.5 rounded-full bg-surface px-4 py-2.5 text-[13px] text-fg-muted ring-1 ring-inset ring-border hover:text-fg active:scale-[0.97] transition-transform duration-150 ease-out";
  return (
    <div className="sticky bottom-0 -mx-6 -mb-6 mt-6 flex items-center justify-between gap-3 border-t border-border bg-bg/95 px-6 pb-6 pt-4 backdrop-blur sm:-mx-8 sm:px-8">
      <button onClick={onPrevious} className={cls}>
        <ArrowLeft size={13} />
        Previous
      </button>
      <button onClick={onSecondary} className={cls}>
        {secondaryIcon}
        {secondaryLabel}
      </button>
    </div>
  );
}
