"use client";

import { Crown } from "lucide-react";
import { useState } from "react";

export function SubscriptionButton({
  cadence,
  paymentMethod
}: {
  cadence: "monthly" | "annual";
  paymentMethod: "FEDAPAY" | "MTN_MOMO" | "MOOV_MONEY" | "CARD";
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function subscribe() {
    setIsLoading(true);
    const response = await fetch("/api/subscriptions/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cadence, paymentMethod })
    });

    const data = await response.json();
    setIsLoading(false);

    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    }
  }

  return (
    <button
      type="button"
      onClick={subscribe}
      disabled={isLoading}
      className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ahiyade-coral px-5 font-bold text-white disabled:opacity-60"
    >
      <Crown className="h-5 w-5" />
      {isLoading ? "Preparation..." : "Souscrire"}
    </button>
  );
}
