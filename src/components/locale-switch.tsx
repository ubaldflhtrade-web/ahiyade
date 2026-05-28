"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales } from "@/i18n/config";

export function LocaleSwitch({ locale }: { locale: string }) {
  const pathname = usePathname();

  return (
    <div className="flex rounded-full border border-ahiyade-sand bg-white/80 p-1 text-sm">
      {locales.map((item) => {
        const target = pathname.replace(/^\/(fr|en)/, `/${item}`);
        const active = locale === item;

        return (
          <Link
            key={item}
            href={target}
            className={`rounded-full px-3 py-1 font-medium transition ${
              active ? "bg-ahiyade-cocoa text-white" : "text-ahiyade-cocoa hover:bg-ahiyade-cream"
            }`}
          >
            {item.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
