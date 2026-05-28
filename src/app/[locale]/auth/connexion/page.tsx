import { LoginForm } from "@/components/forms/login-form";
import type { Locale } from "@/i18n/config";

export default function LoginPage({ params }: { params: { locale: Locale } }) {
  return (
    <section className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div>
        <p className="text-sm font-bold uppercase text-ahiyade-palm">Connexion</p>
        <h1 className="mt-2 text-4xl font-black text-ahiyade-cocoa">Acceder a votre espace Ahiyade</h1>
        <p className="mt-4 text-ahiyade-cocoa/75">
          Connectez-vous pour gerer vos devis, produits, favoris, messages et abonnements.
        </p>
        <div className="mt-6 rounded-lg bg-ahiyade-cream p-4 text-sm font-semibold text-ahiyade-cocoa">
          Comptes de demo apres seed: admin@ahiyade.bj, fournisseur@ahiyade.bj, acheteur@ahiyade.bj. Mot de passe: Ahiyade2026!
        </div>
      </div>
      <LoginForm locale={params.locale} />
    </section>
  );
}
