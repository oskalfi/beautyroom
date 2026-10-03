import { getTranslations } from "next-intl/server";
import { initPageLocale } from "@/i18n/pageLocale";
import type { Metadata } from "next";
import { AddressSection } from "@/sections/addressSection";
import styles from "./page.module.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await initPageLocale(params);
  const t = await getTranslations({ locale, namespace: "AddressPage" });
  return { title: `${t("title")} | Beauty Room`, description: t("description") };
}

export default async function AddressPage({ params }: { params: Promise<{ locale: string }> }) {
  await initPageLocale(params);
  return (
    <main id="main-content" tabIndex={-1} className={styles.page}>
      <AddressSection />
    </main>
  );
}
