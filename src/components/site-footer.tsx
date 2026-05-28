import Link from "next/link";
import type { Locale } from "@/i18n/config";

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="mt-16 border-t border-ahiyade-sand/60 bg-ahiyade-cocoa text-ahiyade-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="text-2xl font-black">Ahiyade</p>
          <p className="mt-3 max-w-sm text-sm text-ahiyade-cream/80">
            Marketplace B2B locale pour rapprocher fournisseurs, acheteurs et distributeurs dans tout le Benin.
          </p>
        </div>
        <div className="grid gap-2 text-sm">
          <Link href={`/${locale}/catalogue`}>Catalogue</Link>
          <Link href={`/${locale}/tarifs`}>Tarifs</Link>
          <Link href={`/${locale}/auth/inscription`}>Inscription</Link>
        </div>
        <div className="text-sm text-ahiyade-cream/80">
          <p>Cotonou, Benin</p>
          <p>support@ahiyade.bj</p>
          <p className="mt-3">Fait pour les entreprises locales, du Littoral a l'Alibori.</p>
        </div>
      </div>
    </footer>
  );
}
