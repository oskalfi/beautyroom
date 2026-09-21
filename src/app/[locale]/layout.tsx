import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import "@/app/styles/globals.css";
import "@/app/styles/accessibility.css";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { Accessibility } from "@/shared/components/Accessibility";
import styles from "@/app/layout.module.css";
import { Header } from "@/shared/components/Header";
import { Footer } from "@/shared/components/Footer";

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("title"), description: t("description") };
}

export default async function RootLayout({
  children,
  modal,
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <html lang={locale} dir={locale === "he" ? "rtl" : "ltr"}>
      <body className={styles.body}>
        <NextIntlClientProvider>
        <Accessibility />
        <LanguageSwitcher />
        <div id="site-content" className={styles.siteContent}>
        <Header />
        <div className={styles.pageContent}>{children}</div>
        <Footer />
        {modal}
        </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
