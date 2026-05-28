import type { Department } from "@prisma/client";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SearchFilters } from "@/components/search-filters";
import type { Locale } from "@/i18n/config";
import { getCatalogProducts, getCategories } from "@/lib/queries";

type Props = {
  params: { locale: Locale };
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function CatalogPage({ params, searchParams }: Props) {
  const page = Number(searchParams.page ?? 1);
  const pageHref = (targetPage: number) => {
    const nextParams = new URLSearchParams();

    for (const [key, value] of Object.entries(searchParams)) {
      if (Array.isArray(value)) {
        value.forEach((item) => nextParams.append(key, item));
      } else if (value) {
        nextParams.set(key, value);
      }
    }

    nextParams.set("page", String(targetPage));
    return `/${params.locale}/catalogue?${nextParams.toString()}`;
  };

  const [categories, result] = await Promise.all([
    getCategories(),
    getCatalogProducts({
      q: typeof searchParams.q === "string" ? searchParams.q : undefined,
      category: typeof searchParams.category === "string" ? searchParams.category : undefined,
      department: typeof searchParams.department === "string" ? (searchParams.department as Department) : undefined,
      minPrice: typeof searchParams.minPrice === "string" && searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
      maxPrice: typeof searchParams.maxPrice === "string" && searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
      page
    })
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase text-ahiyade-palm">Catalogue</p>
        <h1 className="mt-2 text-4xl font-black text-ahiyade-cocoa">Produits B2B au Benin</h1>
        <p className="mt-3 max-w-3xl text-ahiyade-cocoa/75">
          Recherchez des produits et services professionnels par categorie, departement et budget.
        </p>
      </div>

      <SearchFilters locale={params.locale} categories={categories} searchParams={searchParams} />

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="font-bold text-ahiyade-cocoa">{result.total} resultat(s)</p>
        <p className="text-sm text-ahiyade-cocoa/70">
          Page {result.page} / {result.pageCount}
        </p>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {result.products.map((product) => (
          <ProductCard key={product.id} product={product} locale={params.locale} />
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        {result.page > 1 ? (
          <Link className="rounded-md border border-ahiyade-sand bg-white px-4 py-2 font-bold text-ahiyade-cocoa" href={pageHref(result.page - 1)}>
            Precedent
          </Link>
        ) : null}
        {result.page < result.pageCount ? (
          <Link className="rounded-md bg-ahiyade-cocoa px-4 py-2 font-bold text-white" href={pageHref(result.page + 1)}>
            Suivant
          </Link>
        ) : null}
      </div>
    </section>
  );
}
