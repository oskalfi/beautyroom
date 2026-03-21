import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/shared/components/Header";
import { Footer } from "@/shared/components/Footer";

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
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
