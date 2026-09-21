import { initPageLocale } from "@/i18n/pageLocale";
import type { Metadata } from "next";
import { AddressSection } from "@/sections/addressSection";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Расположение | Beauty Room",
  description: "Студия Beauty Room: Jerusalem Blvd 33, Tel Aviv-Yafo. Карта и маршрут до студии.",
};

export default async function AddressPage({ params }: { params: Promise<{ locale: string }> }) {
  await initPageLocale(params);
  return (
    <main dir="ltr" className={styles.page}>
      <AddressSection />
    </main>
  );
}
