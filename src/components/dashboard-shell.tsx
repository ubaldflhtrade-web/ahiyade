export function DashboardShell({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase text-ahiyade-palm">Ahiyade</p>
        <h1 className="mt-2 text-3xl font-black text-ahiyade-cocoa md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-ahiyade-cocoa/75">{description}</p>
      </div>
      {children}
    </section>
  );
}
