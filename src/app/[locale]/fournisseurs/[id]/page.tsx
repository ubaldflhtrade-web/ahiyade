import { BadgeCheck, MapPin, MessageSquare, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import type { Locale } from "@/i18n/config";
import { departmentLabel } from "@/lib/constants";
import { getSupplierProfile, mapProduct } from "@/lib/queries";

export default async function SupplierProfilePage({ params }: { params: { locale: Locale; id: string } }) {
  const supplier = await getSupplierProfile(params.id);
  if (!supplier) {
    notFound();
  }

  const profile = (supplier as any).supplierProfile;
  const products = ((supplier as any).products ?? []).map((product: any) => (product.supplier ? mapProduct(product) : product));

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-ahiyade-sand/70 bg-white p-6 shadow-soft md:flex md:items-start md:justify-between md:gap-8">
        <div className="flex gap-5">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-ahiyade-cream">
            {profile?.logo ? (
              <Image src={profile.logo} alt={profile.companyName} fill sizes="96px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-black text-ahiyade-cocoa">
                {(profile?.companyName ?? supplier.name).slice(0, 1)}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-bold uppercase text-ahiyade-palm">Profil fournisseur</p>
            <h1 className="mt-1 flex flex-wrap items-center gap-2 text-4xl font-black text-ahiyade-cocoa">
              {profile?.companyName ?? supplier.name}
              {(supplier as any).isVerified ? <BadgeCheck className="h-7 w-7 text-ahiyade-palm" /> : null}
            </h1>
            <p className="mt-3 max-w-3xl text-ahiyade-cocoa/75">{profile?.description ?? "Fournisseur local Ahiyade."}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-ahiyade-cocoa/75">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {departmentLabel(profile?.department)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-ahiyade-sun text-ahiyade-sun" />
                {Number(profile?.rating ?? 0).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <Link href={`/${params.locale}/messagerie?peerId=${supplier.id}`} className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ahiyade-palm px-5 font-bold text-white md:mt-0">
          <MessageSquare className="h-5 w-5" />
          Contacter
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-black text-ahiyade-cocoa">Produits du fournisseur</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} locale={params.locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
