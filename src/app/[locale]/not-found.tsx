import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <h1 className="text-5xl font-black text-ahiyade-cocoa">Page introuvable</h1>
      <p className="mt-4 text-ahiyade-cocoa/75">Le contenu demande n'existe pas ou n'est plus disponible.</p>
      <Link href="/fr" className="mt-6 inline-flex h-12 items-center rounded-md bg-ahiyade-cocoa px-5 font-bold text-white">
        Retour a l'accueil
      </Link>
    </section>
  );
}
