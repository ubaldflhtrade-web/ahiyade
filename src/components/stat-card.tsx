import type { LucideIcon } from "lucide-react";

export function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: LucideIcon }) {
  return (
    <div className="rounded-lg border border-ahiyade-sand/60 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ahiyade-clay">{label}</p>
          <p className="mt-2 text-3xl font-black text-ahiyade-cocoa">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ahiyade-cream text-ahiyade-cocoa">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
