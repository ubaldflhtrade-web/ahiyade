"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

export function QuoteRequestForm({ productId, supplierId }: { productId: string; supplierId: string }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/quote-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        supplierId,
        message: formData.get("message")
      })
    });

    setState(response.ok ? "success" : "error");
    if (response.ok) {
      event.currentTarget.reset();
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border border-ahiyade-sand bg-white p-4">
      <label className="grid gap-2 text-sm font-semibold text-ahiyade-cocoa">
        Message au fournisseur
        <textarea
          name="message"
          minLength={10}
          required
          rows={4}
          placeholder="Quantite souhaitee, delai, lieu de livraison..."
          className="focus-ring rounded-md border border-ahiyade-sand px-3 py-2"
        />
      </label>
      <button disabled={state === "loading"} type="submit" className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ahiyade-palm font-bold text-white disabled:opacity-60">
        <Send className="h-5 w-5" />
        {state === "loading" ? "Envoi..." : "Demander un devis"}
      </button>
      {state === "success" ? <p className="text-sm font-semibold text-ahiyade-palm">Demande envoyee au fournisseur.</p> : null}
      {state === "error" ? <p className="text-sm font-semibold text-red-700">Connectez-vous comme acheteur pour envoyer une demande.</p> : null}
    </form>
  );
}
