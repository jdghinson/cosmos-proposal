import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CollectionsProvider } from "@/lib/collections-store";
import { WizardProvider } from "@/lib/wizard-store";
import { WizardDrawer } from "@/components/ai-wizard/WizardDrawer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Cosmos — AI Collection",
  description: "Prototype for Cosmos AI brief-to-collection and Figma plugin.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <CollectionsProvider>
          <WizardProvider>
            {children}
            <WizardDrawer />
          </WizardProvider>
        </CollectionsProvider>
      </body>
    </html>
  );
}
