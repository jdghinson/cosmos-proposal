"use client";

import Link from "next/link";
import type { SavedCollection } from "@/lib/mock-data";

export function ProfileCollections({ collections }: { collections: SavedCollection[] }) {
  return (
    <section className="px-8 pb-24">
      <div className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {collections.map((c) => (
          <ProfileCollectionCard key={c.id} collection={c} />
        ))}
      </div>
    </section>
  );
}

function ProfileCollectionCard({ collection }: { collection: SavedCollection }) {
  const cover = collection.imageUrls[0];
  const isPrivate = collection.isPrivate ?? true;

  return (
    <Link href={`/collection/${collection.id}`} className="group flex flex-col gap-2">
      <div
        className="aspect-square overflow-hidden rounded-3xl bg-surface3 ring-[0.5px] ring-inset ring-border transition-transform duration-300 ease-out [@media(hover:hover)]:group-hover:scale-[1.005]"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.1)" }}
      >
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex flex-col gap-0.5 overflow-hidden">
        <span className="truncate text-[16px] font-medium leading-[125%] tracking-[-0.32px] text-fg">
          {collection.title}
        </span>
        <span className="text-[12px] leading-[125%] tracking-[-0.24px] text-fg-muted">
          {collection.imageUrls.length} elements · {isPrivate ? "Private" : "Public"}
        </span>
      </div>
    </Link>
  );
}
