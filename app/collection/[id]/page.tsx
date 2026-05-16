"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { TopNav } from "@/components/cosmos/TopNav";
import { CollectionHeader } from "@/components/cosmos/CollectionHeader";
import { CollectionEmpty } from "@/components/cosmos/CollectionEmpty";
import { CollectionGrid } from "@/components/cosmos/CollectionGrid";
import { SeeSimilar } from "@/components/cosmos/SeeSimilar";
import { useCollections } from "@/lib/collections-store";

export default function CollectionPage() {
  const params = useParams<{ id: string }>();
  const { getCollection, hydrated } = useCollections();
  const collection = getCollection(params.id);

  if (!hydrated) {
    return (
      <main className="min-h-screen">
        <TopNav />
      </main>
    );
  }

  if (!collection) {
    return (
      <main className="min-h-screen">
        <TopNav />
        <div className="flex flex-col items-center px-8 pt-24 text-center">
          <p className="text-[16px] font-medium text-fg">Collection not found.</p>
          <Link
            href="/"
            className="mt-4 rounded-full bg-surface px-4 py-2 text-[13px] text-fg-muted ring-1 ring-inset ring-border hover:text-fg"
          >
            Back to Cosmos
          </Link>
        </div>
      </main>
    );
  }

  const hasImages = collection.imageUrls.length > 0;

  return (
    <main className="min-h-screen">
      <TopNav
        searchScope={{
          name: collection.title,
          thumbnail: collection.imageUrls[0],
        }}
      />

      <CollectionHeader
        id={collection.id}
        title={collection.title}
        author="jdghinson"
        isPrivate={collection.isPrivate ?? true}
        collaborators={collection.collaborators ?? []}
      />

      {hasImages ? (
        <CollectionGrid images={collection.imageUrls} collectionName={collection.title} />
      ) : (
        <CollectionEmpty brief={collection.brief} />
      )}

      {hasImages && (
        <SeeSimilar
          brief={collection.brief}
          collectionName={collection.title}
          collectionThumbnail={collection.imageUrls[0]}
        />
      )}
    </main>
  );
}
