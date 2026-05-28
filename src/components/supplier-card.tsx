import { BadgeCheck, MapPin, Package, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/forms/favorite-button";
import type { Locale } from "@/i18n/config";
import { departmentLabel } from "@/lib/constants";

export function SupplierCard({ supplier, locale }: { supplier: any; locale: Locale }) {
  const profile = supplier.supplierProfile;

  return (
    <article className="rounded-lg border border-ahiyade-sand/70 bg-white p-5 shadow-soft">
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-ahiyade-cream">
          {profile?.logo ? (
            <Image src={profile.logo} alt={profile.companyName} fill sizes="64px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-black text-ahiyade-cocoa">
              {(profile?.companyName ?? supplier.name).slice(0, 1)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/${locale}/fournisseurs/${supplier.id}`} className="text-lg font-black text-ahiyade-cocoa hover:text-ahiyade-palm">
              {profile?.companyName ?? supplier.name}
            </Link>
            {supplier.isVerified ? <BadgeCheck className="h-5 w-5 text-ahiyade-palm" /> : null}
          </div>
          <p className="mt-1 text-sm text-ahiyade-cocoa/70 line-clamp-2">{profile?.description ?? "Fournisseur local Ahiyade"}</p>
        </div>
        <FavoriteButton supplierId={supplier.id} />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 text-sm text-ahiyade-cocoa/75">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {departmentLabel(profile?.department)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Package className="h-4 w-4" />
          {supplier._count?.products ?? 0}
        </span>
        <span className="inline-flex items-center gap-1">
          <Star className="h-4 w-4 fill-ahiyade-sun text-ahiyade-sun" />
          {Number(profile?.rating ?? 0).toFixed(1)}
        </span>
      </div>
    </article>
  );
}
