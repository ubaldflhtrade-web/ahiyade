"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

export function FavoriteButton({ productId, supplierId }: { productId?: string; supplierId?: string }) {
  const [saved, setSaved] = useState(false);

  async function saveFavorite() {
    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, supplierId })
    });

    setSaved(response.ok);
  }

  return (
    <button
      type="button"
      onClick={saveFavorite}
      className={`focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ahiyade-cocoa ${saved ? "text-ahiyade-coral" : ""}`}
      aria-label="Ajouter aux favoris"
      title="Ajouter aux favoris"
    >
      <Heart className={`h-5 w-5 ${saved ? "fill-ahiyade-coral" : ""}`} />
    </button>
  );
}
