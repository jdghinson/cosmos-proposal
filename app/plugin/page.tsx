"use client";

import { Suspense } from "react";
import { PluginShell } from "@/components/plugin/PluginShell";

export default function PluginPage() {
  return (
    <Suspense fallback={null}>
      <PluginShell />
    </Suspense>
  );
}
