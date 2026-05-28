import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <section className="mx-auto grid max-w-4xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div>
        <p className="text-sm font-bold uppercase text-ahiyade-palm">Securite</p>
        <h1 className="mt-2 text-4xl font-black text-ahiyade-cocoa">Mot de passe oublie</h1>
        <p className="mt-4 text-ahiyade-cocoa/75">Recevez une instruction de reinitialisation sur votre adresse email professionnelle.</p>
      </div>
      <ForgotPasswordForm />
    </section>
  );
}
