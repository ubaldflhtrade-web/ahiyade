import { Boxes, CreditCard, Users, WalletCards } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { FeaturedToggle } from "@/components/forms/featured-toggle";
import { ModerationControls } from "@/components/forms/moderation-controls";
import { StatCard } from "@/components/stat-card";
import type { Locale } from "@/i18n/config";
import { db } from "@/lib/db";
import { getAdminStats } from "@/lib/queries";
import { requireRole } from "@/lib/session";
import { formatCurrency } from "@/lib/utils";

export default async function AdminPage({ params }: { params: { locale: Locale } }) {
  await requireRole(["ADMIN"], params.locale);
  const stats = await getAdminStats();

  let users: any[] = [];
  let categories: any[] = [];
  let subscriptions: any[] = [];

  try {
    [users, categories, subscriptions] = await Promise.all([
      db.user.findMany({
        include: { supplierProfile: true, buyerProfile: true },
        orderBy: { createdAt: "desc" },
        take: 20
      }),
      db.category.findMany({ orderBy: { nameFr: "asc" } }),
      db.subscription.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 12 })
    ]);
  } catch {
    users = [];
    categories = [];
    subscriptions = [];
  }

  return (
    <DashboardShell title="Administration" description="Moderation, categories, statistiques, abonnements et paiements de la plateforme.">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Utilisateurs" value={stats.users} icon={Users} />
        <StatCard label="Produits" value={stats.products} icon={Boxes} />
        <StatCard label="Demandes" value={stats.quotes} icon={WalletCards} />
        <StatCard label="Revenus" value={formatCurrency(stats.revenue)} icon={CreditCard} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border border-ahiyade-sand/70 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-black text-ahiyade-cocoa">Gestion des utilisateurs</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-ahiyade-sand text-ahiyade-cocoa">
                <tr>
                  <th className="py-3">Nom</th>
                  <th>Role</th>
                  <th>Entreprise</th>
                  <th>Statut</th>
                  <th>Accueil</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item.id} className="border-b border-ahiyade-sand/50">
                    <td className="py-3 font-bold text-ahiyade-cocoa">{item.name}</td>
                    <td>{item.role}</td>
                    <td>{item.supplierProfile?.companyName ?? item.buyerProfile?.companyName ?? "-"}</td>
                    <td>{item.status}</td>
                    <td>{item.supplierProfile ? <FeaturedToggle userId={item.id} isFeatured={item.supplierProfile.isFeatured} /> : "-"}</td>
                    <td>
                      <ModerationControls userId={item.id} isVerified={item.isVerified} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-ahiyade-sand/70 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-black text-ahiyade-cocoa">Categories</h2>
          <div className="mt-4 grid gap-2">
            {categories.map((category) => (
              <div key={category.id} className="rounded-md border border-ahiyade-sand/70 p-3">
                <p className="font-black text-ahiyade-cocoa">{category.nameFr}</p>
                <p className="text-sm text-ahiyade-cocoa/70">{category.nameEn}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-lg border border-ahiyade-sand/70 bg-white p-5 shadow-soft">
        <h2 className="text-xl font-black text-ahiyade-cocoa">Paiements et abonnements</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((subscription) => (
            <article key={subscription.id} className="rounded-md border border-ahiyade-sand/70 p-4">
              <p className="font-black text-ahiyade-cocoa">{subscription.user.name}</p>
              <p className="text-sm text-ahiyade-cocoa/70">{subscription.paymentMethod} - {subscription.status}</p>
              <p className="mt-2 text-sm font-semibold text-ahiyade-palm">{subscription.transactionId ?? "Transaction en attente"}</p>
            </article>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
