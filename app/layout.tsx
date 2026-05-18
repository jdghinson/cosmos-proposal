import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CollectionsProvider } from "@/lib/collections-store";
import { WizardProvider } from "@/lib/wizard-store";
import { WizardModal } from "@/components/ai-wizard/WizardModal";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
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
            <WizardModal />
          </WizardProvider>
        </CollectionsProvider>
        <Analytics />
      </body>
    </html>
  );
}
