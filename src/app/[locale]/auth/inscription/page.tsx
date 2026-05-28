import { RegisterForm } from "@/components/forms/register-form";
import type { Locale } from "@/i18n/config";

export default function RegisterPage({ params }: { params: { locale: Locale } }) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-bold uppercase text-ahiyade-palm">Inscription</p>
        <h1 className="mt-2 text-4xl font-black text-ahiyade-cocoa">Creer un compte professionnel</h1>
        <p className="mt-4 text-ahiyade-cocoa/75">
          Choisissez votre role, renseignez votre entreprise et demarrez vos relations commerciales locales.
        </p>
      </div>
      <RegisterForm locale={params.locale} />
    </section>
  );
}
