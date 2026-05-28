import { Heart, MessageSquare, Send, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { EmptyState } from "@/components/empty-state";
import { StatCard } from "@/components/stat-card";
import type { Locale } from "@/i18n/config";
import { getBuyerDashboard } from "@/lib/queries";
import { requireRole } from "@/lib/session";

export default async function BuyerDashboardPage({ params }: { params: { locale: Locale } }) {
  const user = await requireRole(["BUYER"], params.locale);
  const dashboard = await getBuyerDashboard(user.id);

  const favorites = dashboard?.favorites ?? [];
  const quotes = dashboard?.quoteRequests ?? [];
  const messages = dashboard?.receivedMessages ?? [];

  return (
    <DashboardShell
      title="Espace acheteur"
      description="Suivez vos favoris, demandes de devis, messages et informations de profil."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Favoris" value={favorites.length} icon={Heart} />
        <StatCard label="Devis envoyes" value={quotes.length} icon={Send} />
        <StatCard label="Messages recents" value={messages.length} icon={MessageSquare} />
        <StatCard label="Departement" value={dashboard?.buyerProfile?.department ?? "Benin"} icon={ShoppingBag} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-ahiyade-sand/70 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-black text-ahiyade-cocoa">Demandes de devis</h2>
          <div className="mt-4 grid gap-3">
            {quotes.length ? (
              quotes.map((quote: any) => (
                <article key={quote.id} className="rounded-md border border-ahiyade-sand/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-ahiyade-cocoa">{quote.product.name}</p>
                      <p className="text-sm text-ahiyade-cocoa/70">{quote.supplier.supplierProfile?.companyName ?? quote.supplier.name}</p>
                    </div>
                    <span className="rounded-full bg-ahiyade-cream px-3 py-1 text-xs font-black text-ahiyade-cocoa">{quote.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-ahiyade-cocoa/70">{quote.message}</p>
                </article>
              ))
            ) : (
              <EmptyState title="Aucun devis" description="Les demandes envoyees aux fournisseurs apparaitront ici." />
            )}
          </div>
        </section>

        <section className="rounded-lg border border-ahiyade-sand/70 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-black text-ahiyade-cocoa">Favoris</h2>
          <div className="mt-4 grid gap-3">
            {favorites.length ? (
              favorites.map((favorite: any) => (
                <Link key={favorite.id} href={`/${params.locale}/produits/${favorite.productId}`} className="rounded-md border border-ahiyade-sand/70 p-4 font-bold text-ahiyade-cocoa hover:bg-ahiyade-cream">
                  {favorite.product.name}
                </Link>
              ))
            ) : (
              <EmptyState title="Aucun favori" description="Enregistrez des produits et fournisseurs depuis le catalogue." />
            )}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
