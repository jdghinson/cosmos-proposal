"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWizard } from "@/lib/wizard-store";

export default function CreatePage() {
  const router = useRouter();
  const { openWizard } = useWizard();

  useEffect(() => {
    openWizard();
    router.replace("/");
  }, [openWizard, router]);

  return null;
}
