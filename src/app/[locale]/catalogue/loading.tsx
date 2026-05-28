export default function CatalogLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-10 w-80 max-w-full animate-pulse rounded-md bg-ahiyade-sand/60" />
      <div className="mt-6 h-24 animate-pulse rounded-lg bg-white shadow-soft" />
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-ahiyade-sand/70 bg-white p-4">
            <div className="aspect-[4/3] animate-pulse rounded-md bg-ahiyade-cream" />
            <div className="mt-4 h-5 animate-pulse rounded bg-ahiyade-sand/60" />
            <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-ahiyade-sand/40" />
          </div>
        ))}
      </div>
    </section>
  );
}
