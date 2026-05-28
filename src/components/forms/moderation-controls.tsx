"use client";

import { CheckCircle, PauseCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ModerationControls({ userId, isVerified }: { userId: string; isVerified: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function update(status: "ACTIVE" | "SUSPENDED") {
    setLoading(true);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, status, isVerified: status === "ACTIVE" ? true : isVerified })
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={loading}
        onClick={() => update("ACTIVE")}
        className="focus-ring inline-flex h-10 items-center gap-2 rounded-md bg-ahiyade-palm px-3 text-sm font-bold text-white disabled:opacity-60"
      >
        <CheckCircle className="h-4 w-4" />
        Valider
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={() => update("SUSPENDED")}
        className="focus-ring inline-flex h-10 items-center gap-2 rounded-md bg-red-700 px-3 text-sm font-bold text-white disabled:opacity-60"
      >
        <PauseCircle className="h-4 w-4" />
        Suspendre
      </button>
    </div>
  );
}
