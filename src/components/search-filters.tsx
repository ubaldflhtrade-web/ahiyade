import { Search } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { departments } from "@/lib/constants";

export function SearchFilters({
  locale,
  categories,
  searchParams
}: {
  locale: Locale;
  categories: Array<{ slug: string; nameFr: string; nameEn: string }>;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  return (
    <form action={`/${locale}/catalogue`} className="grid gap-3 rounded-lg border border-ahiyade-sand/70 bg-white p-4 shadow-soft md:grid-cols-[1.5fr_1fr_1fr_0.8fr_0.8fr_auto]">
      <label className="relative">
        <span className="sr-only">Recherche</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ahiyade-clay" />
        <input
          name="q"
          defaultValue={String(searchParams.q ?? "")}
          placeholder="Produit, fournisseur..."
          className="focus-ring h-12 w-full rounded-md border border-ahiyade-sand bg-white pl-10 pr-3 text-ahiyade-cocoa"
        />
      </label>
      <select name="category" defaultValue={String(searchParams.category ?? "")} className="focus-ring h-12 rounded-md border border-ahiyade-sand bg-white px-3 text-ahiyade-cocoa">
        <option value="">Toutes categories</option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {locale === "fr" ? category.nameFr : category.nameEn}
          </option>
        ))}
      </select>
      <select name="department" defaultValue={String(searchParams.department ?? "")} className="focus-ring h-12 rounded-md border border-ahiyade-sand bg-white px-3 text-ahiyade-cocoa">
        <option value="">Tous departements</option>
        {departments.map((department) => (
          <option key={department.value} value={department.value}>
            {department.label}
          </option>
        ))}
      </select>
      <input
        name="minPrice"
        defaultValue={String(searchParams.minPrice ?? "")}
        placeholder="Prix min"
        inputMode="numeric"
        className="focus-ring h-12 rounded-md border border-ahiyade-sand bg-white px-3 text-ahiyade-cocoa"
      />
      <input
        name="maxPrice"
        defaultValue={String(searchParams.maxPrice ?? "")}
        placeholder="Prix max"
        inputMode="numeric"
        className="focus-ring h-12 rounded-md border border-ahiyade-sand bg-white px-3 text-ahiyade-cocoa"
      />
      <button className="focus-ring inline-flex h-12 items-center justify-center rounded-md bg-ahiyade-cocoa px-5 font-bold text-white" type="submit">
        Filtrer
      </button>
    </form>
  );
}
