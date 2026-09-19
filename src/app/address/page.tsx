import type { Metadata } from "next";
import { AddressSection } from "@/sections/addressSection";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Расположение | Beauty Room",
  description: "Студия Beauty Room: Jerusalem Blvd 33, Tel Aviv-Yafo. Карта и маршрут до студии.",
};

export default function AddressPage() {
  return (
    <main className={styles.page}>
      <AddressSection />
    </main>
  );
}
