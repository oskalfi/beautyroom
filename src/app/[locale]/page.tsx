import { getTranslations } from "next-intl/server";
import { initPageLocale } from "@/i18n/pageLocale";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { IntroduceSection } from "@/sections/introduceSection";
import { WelcomeSection } from "@/sections/welcomeSection";
import { TreatmentsSection } from "@/sections/treatmentsSection";
import { RunningLineSection } from "@/sections/runningLineSection";
import { BeforeAfterSection } from "@/sections/beforeAfterSection";
import { InstagramSection } from "@/sections/instagramSection";
import { AddressSection } from "@/sections/addressSection";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await initPageLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("title"), description: t("description") };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  await initPageLocale(params);
  return (
    <main dir="ltr" className={styles.mainPage}>
      <link rel="preload" href="/main_bg.avif" as="image" fetchPriority="high" />
      <link rel="preload" href="/fonts/MontserratAlternates/MontserratAlternates-Light.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/fonts/MontserratVariable/Montserrat-Variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <WelcomeSection />
      <IntroduceSection />
      <TreatmentsSection />
      <RunningLineSection />
      <BeforeAfterSection />
      <InstagramSection />
      <AddressSection />
    </main>
  );
}
