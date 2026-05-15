"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TopNav } from "@/components/cosmos/TopNav";
import { ProfileHeader } from "@/components/cosmos/ProfileHeader";
import { ProfileEmpty } from "@/components/cosmos/ProfileEmpty";
import { ProfileCollections } from "@/components/cosmos/ProfileCollections";
import { UserAvatar } from "@/components/cosmos/UserAvatar";
import { useCollections } from "@/lib/collections-store";
import { currentUser } from "@/lib/user";

function ProfileInner() {
  const params = useSearchParams();
  const initialTab = params.get("tab") === "collections" ? "collections" : "elements";
  const { collections } = useCollections();
  const [tab, setTab] = useState<"elements" | "collections">(initialTab);

  const userCollections = collections.filter((c) => !c.id.startsWith("seed-"));
  const elementsCount = 0;

  return (
    <main className="min-h-screen">
      <TopNav
        searchScope={{
          name: currentUser.handle,
          avatar: <UserAvatar size={28} className="h-full w-full" />,
          placeholder: "Search your profile…",
        }}
      />

      <ProfileHeader
        elementsCount={elementsCount}
        collectionsCount={userCollections.length}
        activeTab={tab}
        onTabChange={setTab}
      />

      {tab === "elements" && elementsCount === 0 && <ProfileEmpty />}

      {tab === "collections" &&
        (userCollections.length === 0 ? (
          <ProfileEmpty />
        ) : (
          <ProfileCollections collections={userCollections} />
        ))}
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfileInner />
    </Suspense>
  );
}
