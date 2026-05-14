"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Minimize2, X } from "lucide-react";
import { Logo } from "@/components/cosmos/Logo";
import { SearchTab } from "./SearchTab";
import { AICollectionsTab } from "./AICollectionsTab";
import { Toaster, useToaster } from "./Toaster";

type Tab = "search" | "ai";

export function PluginShell() {
  const params = useSearchParams();
  const fromCollection = params.get("collection");
  const [tab, setTab] = useState<Tab>(fromCollection ? "ai" : "search");
  const toaster = useToaster();

  useEffect(() => {
    if (fromCollection) {
      toaster.push("Opened AI Collection from web.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromCollection]);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col items-center justify-center gap-8 px-6 py-12">
        <div className="text-center">
          <p className="text-[12px] uppercase tracking-[0.18em] text-fg-subtle">Figma plugin</p>
          <h1 className="mt-1 text-[20px] font-medium text-fg">Cosmos · in Figma</h1>
          <p className="mt-1 text-[13px] text-fg-muted">
            Search the feed and drag images onto the canvas without leaving Figma.
          </p>
        </div>

        <div
          className="relative flex h-[640px] w-[380px] flex-col overflow-hidden rounded-[10px] bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.55)] ring-1 ring-border"
        >
          <PluginHeader />
          <TabBar tab={tab} setTab={setTab} />
          <div className="relative flex-1 overflow-hidden">
            {tab === "search" && <SearchTab toaster={toaster} />}
            {tab === "ai" && (
              <AICollectionsTab toaster={toaster} initialCollectionId={fromCollection ?? undefined} />
            )}
            <Toaster toaster={toaster} />
          </div>
          <PluginFooter />
        </div>

        <div className="text-[11px] text-fg-subtle">
          Prototype · click an image to simulate drag-to-canvas
        </div>
      </div>
    </div>
  );
}

function PluginHeader() {
  return (
    <div className="flex items-center justify-between border-b border-border bg-[#1B1B1A] px-3 py-2">
      <div className="flex items-center gap-2">
        <Logo size={10} />
        <span className="text-[12px] font-medium text-fg">Cosmos</span>
      </div>
      <div className="flex items-center gap-1 text-fg-muted">
        <button className="grid h-6 w-6 place-items-center rounded-sm hover:bg-surface2 hover:text-fg">
          <Minimize2 size={11} strokeWidth={1.75} />
        </button>
        <button className="grid h-6 w-6 place-items-center rounded-sm hover:bg-surface2 hover:text-fg">
          <X size={12} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <div className="flex gap-1 border-b border-border bg-surface px-2 pt-2">
      <TabButton active={tab === "search"} onClick={() => setTab("search")}>Search</TabButton>
      <TabButton active={tab === "ai"} onClick={() => setTab("ai")}>AI Collections</TabButton>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "relative px-3 pb-2 pt-1.5 text-[12px] transition-colors " +
        (active ? "text-fg" : "text-fg-muted hover:text-fg")
      }
    >
      {children}
      {active && (
        <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-fg" />
      )}
    </button>
  );
}

function PluginFooter() {
  return (
    <div className="flex items-center justify-between border-t border-border bg-[#1B1B1A] px-3 py-2 text-[11px] text-fg-muted">
      <div className="flex items-center gap-1.5">
        <div
          className="h-4 w-4 rounded-full"
          style={{ background: "radial-gradient(circle at 30% 30%, #f7c2a5, #d99172)" }}
        />
        <span>@jeff</span>
        <span className="rounded-pill bg-fg/10 px-1.5 py-px text-[9px] uppercase tracking-wider text-fg">
          Premium
        </span>
      </div>
      <button className="text-fg-muted hover:text-fg">Settings</button>
    </div>
  );
}
