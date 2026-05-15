"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TopNav } from "@/components/cosmos/TopNav";
import { ElementDetail } from "@/components/cosmos/ElementDetail";

function ElementInner() {
  const params = useSearchParams();
  const src = params.get("src");

  if (!src) {
    return (
      <main className="min-h-screen">
        <TopNav />
        <div className="px-8 pt-24 text-center text-[14px] text-fg-muted">
          No element selected.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <TopNav />
      <ElementDetail src={src} />
    </main>
  );
}

export default function ElementPage() {
  return (
    <Suspense fallback={null}>
      <ElementInner />
    </Suspense>
  );
}
