import { PackageOpen } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-ahiyade-sand bg-white p-8 text-center">
      <PackageOpen className="mx-auto h-10 w-10 text-ahiyade-clay" />
      <h3 className="mt-4 text-lg font-black text-ahiyade-cocoa">{title}</h3>
      <p className="mt-2 text-sm text-ahiyade-cocoa/70">{description}</p>
    </div>
  );
}
