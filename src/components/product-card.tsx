import { BadgeCheck, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/forms/favorite-button";
import type { Locale } from "@/i18n/config";
import type { CatalogProduct } from "@/lib/demo-data";
import { departmentLabel } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product, locale }: { product: CatalogProduct; locale: Locale }) {
  const supplier = product.supplier.supplierProfile;

  return (
    <article className="group overflow-hidden rounded-lg border border-ahiyade-sand/70 bg-white shadow-soft transition hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-ahiyade-cream">
        <Link href={`/${locale}/produits/${product.id}`} className="absolute inset-0">
          <Image
            src={product.images[0] ?? "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop"}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute right-3 top-3">
          <FavoriteButton productId={product.id} />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-ahiyade-palm">{locale === "fr" ? product.category.nameFr : product.category.nameEn}</p>
            <Link href={`/${locale}/produits/${product.id}`} className="mt-1 block text-lg font-black text-ahiyade-cocoa hover:text-ahiyade-clay">
              {product.name}
            </Link>
          </div>
          <p className="shrink-0 text-right text-lg font-black text-ahiyade-coral">{formatCurrency(product.price)}</p>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-ahiyade-cocoa/70">{product.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ahiyade-cocoa/75">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {departmentLabel(product.department)}
          </span>
          <span>Stock: {product.stock}</span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-ahiyade-sand/50 pt-4">
          <Link href={`/${locale}/fournisseurs/${product.supplier.id}`} className="text-sm font-bold text-ahiyade-cocoa hover:text-ahiyade-palm">
            {supplier?.companyName ?? product.supplier.name}
          </Link>
          {product.supplier.isVerified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-ahiyade-palm/10 px-2 py-1 text-xs font-bold text-ahiyade-palm">
              <BadgeCheck className="h-4 w-4" />
              Verifie
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
