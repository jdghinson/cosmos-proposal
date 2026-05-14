"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Ctx = {
  isOpen: boolean;
  openWizard: () => void;
  closeWizard: () => void;
};

const WizardContext = createContext<Ctx | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openWizard = useCallback(() => setIsOpen(true), []);
  const closeWizard = useCallback(() => setIsOpen(false), []);

  const value = useMemo<Ctx>(
    () => ({ isOpen, openWizard, closeWizard }),
    [isOpen, openWizard, closeWizard],
  );

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used inside WizardProvider");
  return ctx;
}
