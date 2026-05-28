"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function FeaturedToggle({ userId, isFeatured }: { userId: string; isFeatured: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch("/api/admin/suppliers/featured", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, isFeatured: !isFeatured })
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={toggle}
      className={`focus-ring inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-bold disabled:opacity-60 ${
        isFeatured ? "bg-ahiyade-sun text-ahiyade-cocoa" : "border border-ahiyade-sand text-ahiyade-cocoa"
      }`}
    >
      <Star className={`h-4 w-4 ${isFeatured ? "fill-ahiyade-cocoa" : ""}`} />
      {isFeatured ? "En avant" : "Mettre en avant"}
    </button>
  );
}
