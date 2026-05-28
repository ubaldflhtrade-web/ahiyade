import { ArrowRight, BadgeCheck, Building2, Handshake, PackageSearch, ShieldCheck, ShoppingBag } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SupplierCard } from "@/components/supplier-card";
import type { Locale } from "@/i18n/config";
import { getCategories, getFeaturedProducts, getFeaturedSuppliers } from "@/lib/queries";

const amazonStatueImage = "https://upload.wikimedia.org/wikipedia/commons/0/04/L%27Amazone_statue.jpg";

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "home" });
  const [products, suppliers, categories] = await Promise.all([getFeaturedProducts(4), getFeaturedSuppliers(3), getCategories()]);

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-20">
          <Image
            src={amazonStatueImage}
            alt="Statue de l'Amazone a Cotonou"
            fill
            priority
            sizes="100vw"
            className="scale-105 object-cover blur-sm"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ahiyade-cocoa/78 via-ahiyade-clay/62 to-ahiyade-cream/78" />
        <div className="mx-auto flex min-h-[76svh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              Fournisseurs verifies dans les 12 departements
            </p>
            <h1 className="mt-6 text-5xl font-black md:text-7xl">Ahiyade</h1>
            <p className="mt-6 text-2xl font-bold text-ahiyade-cream md:text-3xl">{t("taglineFr")}</p>
            <p className="mt-3 max-w-2xl text-lg text-white/88">{t("taglineEn")}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/${params.locale}/auth/inscription?role=supplier`} className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ahiyade-sun px-6 font-black text-ahiyade-cocoa shadow-soft">
                <Building2 className="h-5 w-5" />
                {t("supplierCta")}
              </Link>
              <Link href={`/${params.locale}/auth/inscription?role=buyer`} className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-6 font-black text-ahiyade-cocoa shadow-soft">
                <ShoppingBag className="h-5 w-5" />
                {t("buyerCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase text-ahiyade-palm">Catalogue</p>
            <h2 className="text-3xl font-black text-ahiyade-cocoa">{t("categories")}</h2>
          </div>
          <Link href={`/${params.locale}/catalogue`} className="inline-flex items-center gap-2 text-sm font-black text-ahiyade-palm">
            Voir tout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.slice(0, 10).map((category, index) => (
            <Link
              key={category.slug}
              href={`/${params.locale}/catalogue?category=${category.slug}`}
              className="rounded-lg border border-ahiyade-sand/70 bg-white p-4 shadow-soft transition hover:-translate-y-1"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ahiyade-cream font-black text-ahiyade-cocoa">
                {index + 1}
              </span>
              <span className="mt-4 block font-black text-ahiyade-cocoa">{params.locale === "fr" ? category.nameFr : category.nameEn}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white/72 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase text-ahiyade-palm">Produits</p>
            <h2 className="text-3xl font-black text-ahiyade-cocoa">Opportunites du moment</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} locale={params.locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase text-ahiyade-palm">Process</p>
          <h2 className="mt-2 text-3xl font-black text-ahiyade-cocoa">{t("how")}</h2>
          <div className="mt-6 grid gap-4">
            {[
              { icon: PackageSearch, title: "Trouvez le bon produit", text: "Filtrez par categorie, prix et departement pour acheter localement." },
              { icon: Handshake, title: "Demandez un devis", text: "Envoyez vos besoins aux fournisseurs et suivez les reponses." },
              { icon: BadgeCheck, title: "Travaillez avec confiance", text: "Les fournisseurs Premium sont mis en avant et verifies." }
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-lg border border-ahiyade-sand/70 bg-white p-5 shadow-soft">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ahiyade-palm/10 text-ahiyade-palm">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-ahiyade-cocoa">{item.title}</h3>
                  <p className="mt-1 text-sm text-ahiyade-cocoa/70">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-bold uppercase text-ahiyade-palm">Fournisseurs</p>
          <h2 className="mt-2 text-3xl font-black text-ahiyade-cocoa">{t("suppliers")}</h2>
          <div className="mt-6 grid gap-4">
            {suppliers.map((supplier: any) => (
              <SupplierCard key={supplier.id} supplier={supplier} locale={params.locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-ahiyade-cocoa p-8 text-white shadow-soft md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <h2 className="text-3xl font-black">{t("cta")}</h2>
            <p className="mt-2 text-ahiyade-cream/85">Publiez, achetez, negociez et payez vos abonnements depuis une plateforme unique.</p>
          </div>
          <Link href={`/${params.locale}/auth/inscription`} className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-ahiyade-sun px-5 font-black text-ahiyade-cocoa md:mt-0">
            Commencer
          </Link>
        </div>
      </section>
    </>
  );
}
