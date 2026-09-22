import { notFound } from "next/navigation";
import { initPageLocale } from "@/i18n/pageLocale";

export default async function UnknownPage({ params }: { params: Promise<{ locale: string; catchAll: string[] }> }) {
  await initPageLocale(params);
  notFound();
}
