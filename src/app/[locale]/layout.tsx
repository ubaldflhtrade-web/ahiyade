import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isLocale, type Locale } from "@/i18n/config";

type Props = {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
};

type MetadataProps = {
  params: {
    locale: Locale;
  };
};

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "meta" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: params.locale
    }
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen">
        <SiteHeader locale={params.locale} />
        <main>{children}</main>
        <Footer locale={params.locale} />
      </div>
    </NextIntlClientProvider>
  );
}
