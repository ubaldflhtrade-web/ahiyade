"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { formatCurrency } from "@/lib/utils";

type ProductSummary = {
  id: string;
  name: string;
  price: number;
  category: {
    nameFr: string;
    nameEn: string;
  };
};

export function ProductsManagementList({ products, locale }: { products: ProductSummary[]; locale: Locale }) {
  const router = useRouter();
  const t = useTranslations("supplierDashboard");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function deleteProduct(productId: string) {
    if (!window.confirm(t("deleteConfirm"))) return;

    setError("");
    setDeletingId(productId);

    try {
      const response = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Suppression refusee");
      }

      // Recharge les produits et les compteurs relies au tableau de bord.
      router.refresh();
    } catch {
      setError(t("productDeleteError"));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="grid gap-3">
      {products.map((product) => {
        const isDeleting = deletingId === product.id;

        return (
          <article key={product.id} className="rounded-md border border-ahiyade-sand/70 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-black text-ahiyade-cocoa">{product.name}</p>
                <p className="text-sm text-ahiyade-cocoa/70">{locale === "fr" ? product.category.nameFr : product.category.nameEn}</p>
              </div>
              <p className="font-black text-ahiyade-coral">{formatCurrency(product.price)}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                disabled={isDeleting || deletingId !== null}
                onClick={() => deleteProduct(product.id)}
                className="focus-ring inline-flex h-10 items-center gap-2 rounded-md bg-red-700 px-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? t("deleting") : t("delete")}
              </button>
            </div>
          </article>
        );
      })}
      {error ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
    </div>
  );
}
