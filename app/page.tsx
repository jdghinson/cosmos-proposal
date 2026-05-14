"use client";

import { useSearchParams } from "next/navigation";
import { TopNav } from "@/components/cosmos/TopNav";
import { CategoryChips } from "@/components/cosmos/CategoryChips";
import { SelectedRow } from "@/components/cosmos/SelectedRow";
import { ExploreGrid } from "@/components/cosmos/ExploreGrid";
import { PluginEntryBanner } from "@/components/cosmos/PluginEntryBanner";
import { Suspense, useEffect } from "react";

function ExploreInner() {
  const params = useSearchParams();
  const highlight = params.get("collection") ?? undefined;

  useEffect(() => {
    if (highlight) {
      const el = document.getElementById(`collection-${highlight}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlight]);

  return (
    <main className="min-h-screen">
      <TopNav />
      <CategoryChips />
      <SelectedRow highlightId={highlight} />
      <ExploreGrid />
      <PluginEntryBanner />
    </main>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <ExploreInner />
    </Suspense>
  );
}
