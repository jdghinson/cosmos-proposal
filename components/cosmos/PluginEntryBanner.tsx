import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PluginEntryBanner() {
  return (
    <section className="px-8 pb-16">
      <Link
        href="/plugin"
        className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-5 py-4 transition-colors hover:bg-surface2"
      >
        <div className="flex items-center gap-4">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-surface2 text-fg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M8 8h4v4H8a2 2 0 010-4z" fill="currentColor" />
              <path d="M12 4h4a2 2 0 010 4h-4V4z" fill="currentColor" opacity=".7" />
              <path d="M12 8h4a2 2 0 010 4h-4V8z" fill="currentColor" opacity=".5" />
              <circle cx="14" cy="14" r="2" fill="currentColor" opacity=".7" />
              <path d="M8 16h4v4a2 2 0 11-4 0v-4z" fill="currentColor" opacity=".5" />
            </svg>
          </div>
          <div>
            <div className="text-[14px] font-medium text-fg">Open in Figma — preview the plugin</div>
            <div className="text-[12px] text-fg-muted">
              Search Cosmos and drop images straight onto your canvas without leaving Figma.
            </div>
          </div>
        </div>
        <ArrowRight size={16} className="text-fg-muted transition-transform group-hover:translate-x-0.5 group-hover:text-fg" />
      </Link>
    </section>
  );
}
