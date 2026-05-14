"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { seededAICollections, type SavedCollection } from "./mock-data";

type Ctx = {
  collections: SavedCollection[];
  hydrated: boolean;
  addCollection: (c: SavedCollection) => void;
  getCollection: (id: string) => SavedCollection | undefined;
};

const CollectionsContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "cosmos:collections:v1";

export function CollectionsProvider({ children }: { children: React.ReactNode }) {
  const [collections, setCollections] = useState<SavedCollection[]>(seededAICollections);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SavedCollection[];
        if (Array.isArray(parsed) && parsed.length) setCollections(parsed);
      }
    } catch {}
    setHydrated(true);
  }, []);

  const persist = useCallback((next: SavedCollection[]) => {
    setCollections(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const addCollection = useCallback(
    (c: SavedCollection) => {
      setCollections((prev) => {
        const next = [c, ...prev.filter((p) => p.id !== c.id)];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [],
  );

  const getCollection = useCallback(
    (id: string) => collections.find((c) => c.id === id),
    [collections],
  );

  const value = useMemo<Ctx>(
    () => ({ collections, hydrated, addCollection, getCollection }),
    [collections, hydrated, addCollection, getCollection],
  );

  return <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>;
}

export function useCollections() {
  const ctx = useContext(CollectionsContext);
  if (!ctx) throw new Error("useCollections must be used inside CollectionsProvider");
  return ctx;
}
