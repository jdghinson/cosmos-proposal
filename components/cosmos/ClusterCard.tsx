import type { ClusterCard as ClusterCardType, SavedCollection } from "@/lib/mock-data";

type Props = {
  cluster: ClusterCardType | SavedCollection;
  highlight?: boolean;
};

function isSaved(c: ClusterCardType | SavedCollection): c is SavedCollection {
  return "imageUrls" in c;
}

function VerifiedCheck({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path
        fill="currentColor"
        d="M12 2.125a4.63 4.63 0 0 1 4.205 2.683q.18-.015.363-.015c2.53 0 4.623 2.034 4.623 4.597a4.55 4.55 0 0 1-.814 2.607c.513.738.814 1.635.814 2.608 0 2.564-2.095 4.597-4.623 4.597q-.182 0-.361-.014A4.63 4.63 0 0 1 12 21.876a4.63 4.63 0 0 1-4.201-2.672h-.367c-2.53 0-4.623-2.035-4.623-4.597 0-.972.301-1.868.814-2.607a4.55 4.55 0 0 1-.814-2.608c0-2.562 2.092-4.598 4.623-4.598q.183 0 .363.015A4.63 4.63 0 0 1 12 2.125m2.774 5.804a51 51 0 0 0-4.579 6.187l-2.027-1.94-1.211 1.264 2.813 2.692a.876.876 0 0 0 1.356-.183 49 49 0 0 1 4.975-6.878z"
      />
    </svg>
  );
}

export function ClusterCard({ cluster, highlight }: Props) {
  const title = "title" in cluster ? cluster.title : "Untitled";
  const author = isSaved(cluster) ? "you" : cluster.author;
  const verified = isSaved(cluster) ? true : cluster.verified;
  const count = isSaved(cluster) ? cluster.imageUrls.length : cluster.elements;
  const images = isSaved(cluster) ? cluster.imageUrls.slice(0, 3) : cluster.images.slice(0, 3);

  return (
    <div
      id={isSaved(cluster) ? `collection-${cluster.id}` : undefined}
      className={
        "group shrink-0 snap-start " +
        (highlight ? "rounded-2xl ring-2 ring-fg/40 ring-offset-4 ring-offset-bg" : "")
      }
    >
      <div className="flex flex-col gap-2">
        <div
          className="flex h-[151px] w-[365px] items-stretch overflow-hidden rounded-2xl bg-surface3 ring-1 ring-inset ring-border"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.10)", gap: 2 }}
        >
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative h-full flex-1 overflow-hidden bg-surface3">
              {images[i] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images[i]}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.01]"
                />
              )}
            </div>
          ))}
        </div>

        <div className="px-1">
          <div className="flex items-center gap-1.5 text-[16px] font-medium leading-[125%] tracking-[-0.32px] text-fg">
            <span className="truncate">{title}</span>
            {isSaved(cluster) && (
              <span className="rounded-full bg-fg/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-fg-muted">
                AI
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center text-[14px] tracking-[-0.28px] text-fg-muted">
            <span className="flex min-w-0 items-center gap-0.5">
              <span className="truncate">@{author}</span>
              {verified && <VerifiedCheck size={14} />}
            </span>
            <span className="ml-1">· {count.toLocaleString()} elements</span>
          </div>
        </div>
      </div>
    </div>
  );
}
