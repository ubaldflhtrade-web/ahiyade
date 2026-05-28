import { BadgeCheck, MapPin, MessageSquare, Package, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QuoteRequestForm } from "@/components/forms/quote-request-form";
import type { Locale } from "@/i18n/config";
import { departmentLabel } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { getProduct } from "@/lib/queries";

export default async function ProductDetailPage({ params }: { params: { locale: Locale; id: string } }) {
  const product = await getProduct(params.id);
  if (!product) {
    notFound();
  }

  const supplier = product.supplier.supplierProfile;

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-ahiyade-cream shadow-soft">
          <Image
            src={product.images[0] ?? "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop"}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {product.images.slice(0, 4).map((image) => (
            <div key={image} className="relative aspect-square overflow-hidden rounded-md border border-ahiyade-sand bg-white">
              <Image src={image} alt={product.name} fill sizes="20vw" className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-lg border border-ahiyade-sand/70 bg-white p-6 shadow-soft">
          <p className="text-sm font-bold uppercase text-ahiyade-palm">{params.locale === "fr" ? product.category.nameFr : product.category.nameEn}</p>
          <h1 className="mt-2 text-4xl font-black text-ahiyade-cocoa">{product.name}</h1>
          <p className="mt-4 text-3xl font-black text-ahiyade-coral">{formatCurrency(product.price)}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-ahiyade-cocoa/75">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {departmentLabel(product.department)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Package className="h-4 w-4" />
              Stock {product.stock}
            </span>
          </div>
          <p className="mt-5 text-ahiyade-cocoa/75">{product.description}</p>
        </div>

        <div className="rounded-lg border border-ahiyade-sand/70 bg-white p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase text-ahiyade-palm">Fournisseur</p>
              <Link href={`/${params.locale}/fournisseurs/${product.supplier.id}`} className="mt-1 inline-flex items-center gap-2 text-2xl font-black text-ahiyade-cocoa">
                {supplier?.companyName ?? product.supplier.name}
                {product.supplier.isVerified ? <BadgeCheck className="h-6 w-6 text-ahiyade-palm" /> : null}
              </Link>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-ahiyade-sun/20 px-3 py-1 text-sm font-black text-ahiyade-cocoa">
              <Star className="h-4 w-4 fill-ahiyade-sun text-ahiyade-sun" />
              {supplier?.rating.toFixed(1) ?? "0.0"}
            </span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link href={`/${params.locale}/messagerie?peerId=${product.supplier.id}`} className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md border border-ahiyade-cocoa font-bold text-ahiyade-cocoa">
              <MessageSquare className="h-5 w-5" />
              Contacter
            </Link>
          </div>
        </div>

        <QuoteRequestForm productId={product.id} supplierId={product.supplier.id} />
      </div>
    </section>
  );
}
