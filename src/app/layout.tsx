import { SpeedInsights } from "@vercel/speed-insights/next";

import type { Metadata } from "next";
import "./styles/globals.css";
import styles from "./layout.module.css";
import { Header } from "@/shared/components/Header";
import { Footer } from "@/shared/components/Footer";
import { Modal } from "@/shared/components/Modal";

export const metadata: Metadata = {
  title: "Beauty Room",
  description:
    "Профессиональный уход за кожей лица. Лечение проблем кожи и anti-aging уход. Tel Aviv - Yafo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={styles.body}>
        <Header />
        {children}
        <Footer />
        <Modal />
        <SpeedInsights />
      </body>
    </html>
  );
}
