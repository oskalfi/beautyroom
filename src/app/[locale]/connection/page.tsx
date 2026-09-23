import type { Metadata } from "next";
import { initPageLocale } from "@/i18n/pageLocale";
import { ConnectionPage } from "@/components/ConnectionPage";

export const metadata: Metadata = { title: "Connection | Beauty Room", robots: { index: false, follow: false } };
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initPageLocale(params);
  return <ConnectionPage locale={locale} />;
}
