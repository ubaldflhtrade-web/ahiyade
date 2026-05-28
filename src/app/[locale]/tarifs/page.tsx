import { CheckCircle2, Crown, Package } from "lucide-react";
import { SubscriptionButton } from "@/components/forms/subscription-button";
import type { Locale } from "@/i18n/config";
import { formatCurrency } from "@/lib/utils";
import { planPrices } from "@/lib/constants";

export default function PricingPage({ params }: { params: { locale: Locale } }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase text-ahiyade-palm">Tarifs</p>
        <h1 className="mt-2 text-4xl font-black text-ahiyade-cocoa">Plans fournisseurs Ahiyade</h1>
        <p className="mt-3 text-ahiyade-cocoa/75">
          Commencez gratuitement, puis passez Premium quand vous voulez plus de visibilite et de capacite commerciale.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <article className="rounded-lg border border-ahiyade-sand/70 bg-white p-6 shadow-soft">
          <Package className="h-10 w-10 text-ahiyade-clay" />
          <h2 className="mt-4 text-2xl font-black text-ahiyade-cocoa">Fournisseur Gratuit</h2>
          <p className="mt-2 text-4xl font-black text-ahiyade-cocoa">0 XOF</p>
          <ul className="mt-6 grid gap-3 text-ahiyade-cocoa/75">
            {["Jusqu'a 10 produits", "Profil entreprise basique", "Reception des demandes de devis"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-ahiyade-palm" />
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-lg border-2 border-ahiyade-coral bg-white p-6 shadow-soft">
          <Crown className="h-10 w-10 text-ahiyade-coral" />
          <h2 className="mt-4 text-2xl font-black text-ahiyade-cocoa">Fournisseur Premium</h2>
          <p className="mt-2 text-4xl font-black text-ahiyade-coral">{formatCurrency(planPrices.monthly)}<span className="text-base text-ahiyade-cocoa/60"> / mois</span></p>
          <p className="mt-1 font-semibold text-ahiyade-palm">{formatCurrency(planPrices.annual)} / an</p>
          <ul className="mt-6 grid gap-3 text-ahiyade-cocoa/75">
            {["Produits illimites", "Priorite dans la recherche", "Badge fournisseur verifie", "Statistiques avancees", "Mise en avant sur la page d'accueil", "Paiement FedaPay, MTN MoMo ou Moov Money"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-ahiyade-palm" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <SubscriptionButton cadence="monthly" paymentMethod="FEDAPAY" />
            <SubscriptionButton cadence="annual" paymentMethod="MTN_MOMO" />
          </div>
        </article>
      </div>
    </section>
  );
}
