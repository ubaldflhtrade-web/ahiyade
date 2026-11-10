import { Crown, Eye, MessageSquare, Package, Send } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { EmptyState } from "@/components/empty-state";
import { ProductForm } from "@/components/forms/product-form";
import { ProductsManagementList } from "@/components/products-management-list";
import { StatCard } from "@/components/stat-card";
import type { Locale } from "@/i18n/config";
import { getCategories, getSupplierDashboard } from "@/lib/queries";
import { requireRole } from "@/lib/session";

export default async function SupplierDashboardPage({ params }: { params: { locale: Locale } }) {
  const user = await requireRole(["SUPPLIER"], params.locale);
  const [dashboard, categories] = await Promise.all([getSupplierDashboard(user.id), getCategories()]);

  const products = dashboard?.products ?? [];
  const quotes = dashboard?.receivedQuotes ?? [];
  const messages = dashboard?.receivedMessages ?? [];
  const views = dashboard?.supplierProfile?.views ?? 0;

  return (
    <DashboardShell
      title="Espace fournisseur"
      description="Gerez vos produits, demandes de devis, messages, statistiques et abonnement Premium."
    >
      <div className="grid gap-4 md:grid-cols-5">
        <StatCard label="Produits" value={products.length} icon={Package} />
        <StatCard label="Vues profil" value={views} icon={Eye} />
        <StatCard label="Devis recus" value={quotes.length} icon={Send} />
        <StatCard label="Messages" value={messages.length} icon={MessageSquare} />
        <StatCard label="Plan" value={user.plan} icon={Crown} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <ProductForm categories={categories} />

        <section className="rounded-lg border border-ahiyade-sand/70 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black text-ahiyade-cocoa">Produits publies</h2>
            <span className="rounded-full bg-ahiyade-cream px-3 py-1 text-sm font-bold text-ahiyade-cocoa">
              {user.plan === "FREE" ? `${products.length}/10` : "Illimite"}
            </span>
          </div>
          <div className="mt-4">
            {products.length ? (
              <ProductsManagementList
                locale={params.locale}
                products={products.map((product: any) => ({
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  category: {
                    nameFr: product.category.nameFr,
                    nameEn: product.category.nameEn
                  }
                }))}
              />
            ) : (
              <EmptyState title="Aucun produit" description="Ajoutez votre premier produit pour recevoir des demandes de devis." />
            )}
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-lg border border-ahiyade-sand/70 bg-white p-5 shadow-soft">
        <h2 className="text-xl font-black text-ahiyade-cocoa">Demandes de devis recues</h2>
        <div className="mt-4 grid gap-3">
          {quotes.length ? (
            quotes.map((quote: any) => (
              <article key={quote.id} className="rounded-md border border-ahiyade-sand/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-ahiyade-cocoa">{quote.product.name}</p>
                    <p className="text-sm text-ahiyade-cocoa/70">Acheteur: {quote.buyer.name}</p>
                  </div>
                  <span className="rounded-full bg-ahiyade-cream px-3 py-1 text-xs font-black text-ahiyade-cocoa">{quote.status}</span>
                </div>
                <p className="mt-2 text-sm text-ahiyade-cocoa/70">{quote.message}</p>
              </article>
            ))
          ) : (
            <EmptyState title="Aucune demande" description="Les demandes de devis de vos acheteurs seront listees ici." />
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
