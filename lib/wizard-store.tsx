"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type WizardMode = "ai" | "create";

type Ctx = {
  isOpen: boolean;
  mode: WizardMode;
  openWizard: (mode?: WizardMode) => void;
  closeWizard: () => void;
};

const WizardContext = createContext<Ctx | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<WizardMode>("ai");

  const openWizard = useCallback((m: WizardMode = "ai") => {
    setMode(m);
    setIsOpen(true);
  }, []);
  const closeWizard = useCallback(() => setIsOpen(false), []);

  const value = useMemo<Ctx>(
    () => ({ isOpen, mode, openWizard, closeWizard }),
    [isOpen, mode, openWizard, closeWizard],
  );

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used inside WizardProvider");
  return ctx;
}
