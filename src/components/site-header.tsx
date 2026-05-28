import { LayoutDashboard, MessageSquare, Search, ShieldCheck, Store } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { LocaleSwitch } from "@/components/locale-switch";
import type { Locale } from "@/i18n/config";
import { getCurrentUser } from "@/lib/session";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-ahiyade-sand/50 bg-white/88 backdrop-blur">
      <div className="african-border h-1" />
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link href={`/${locale}`} className="flex items-center gap-2 text-ahiyade-cocoa">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ahiyade-cocoa text-lg font-black text-ahiyade-cream">
              A
            </span>
            <span className="text-2xl font-black">Ahiyade</span>
          </Link>

          <div className="flex items-center gap-2">
            <LocaleSwitch locale={locale} />
            {user ? (
              <Link
                href={`/${locale}/${user.role === "SUPPLIER" ? "tableau-de-bord/fournisseur" : user.role === "ADMIN" ? "admin" : "tableau-de-bord/acheteur"}`}
                className="focus-ring inline-flex items-center gap-2 rounded-full bg-ahiyade-palm px-4 py-2 text-sm font-semibold text-white shadow-soft"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            ) : (
              <Link
                href={`/${locale}/auth/connexion`}
                className="focus-ring rounded-full border border-ahiyade-cocoa px-4 py-2 text-sm font-semibold text-ahiyade-cocoa"
              >
                {t("login")}
              </Link>
            )}
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ahiyade-cocoa">
          <Link className="inline-flex items-center gap-2 rounded-full px-3 py-2 hover:bg-ahiyade-cream" href={`/${locale}/catalogue`}>
            <Search className="h-4 w-4" />
            {t("catalog")}
          </Link>
          <Link className="inline-flex items-center gap-2 rounded-full px-3 py-2 hover:bg-ahiyade-cream" href={`/${locale}/tarifs`}>
            <Store className="h-4 w-4" />
            {t("pricing")}
          </Link>
          <Link className="inline-flex items-center gap-2 rounded-full px-3 py-2 hover:bg-ahiyade-cream" href={`/${locale}/messagerie`}>
            <MessageSquare className="h-4 w-4" />
            {t("messages")}
          </Link>
          {user?.role === "ADMIN" ? (
            <Link className="inline-flex items-center gap-2 rounded-full px-3 py-2 hover:bg-ahiyade-cream" href={`/${locale}/admin`}>
              <ShieldCheck className="h-4 w-4" />
              {t("admin")}
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
