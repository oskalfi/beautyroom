import type { Metadata } from "next";
import { initPageLocale } from "@/i18n/pageLocale";
import { ServerErrorPage } from "@/components/ServerErrorPage";
export const metadata: Metadata = { title: "500 | Beauty Room", robots: { index: false, follow: false } };

// A preview of the error design, without deliberately crashing the application.
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initPageLocale(params);
  return <ServerErrorPage locale={locale} />;
}
