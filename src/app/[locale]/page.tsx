import { pageMetadata, businessStructuredData } from "@/shared/config/seo";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await initPageLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({ locale, title: t("title"), description: t("description") });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await initPageLocale(params);
  return (
    <main id="main-content" tabIndex={-1} className={styles.mainPage}>
      <link
        rel="preload"
        href="/main_bg_phone.avif"
        as="image"
        media="(width <= 440px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        href="/main_bg_tablet.avif"
        as="image"
        media="(440px < width <= 1024px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        href="/main_bg.avif"
        as="image"
        media="(width > 1024px)"
        fetchPriority="high"
      />
      {locale !== "he" && <><link
        rel="preload"
        href="/fonts/MontserratAlternates/MontserratAlternates-Light.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/MontserratVariable/Montserrat-Variable.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      </>}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessStructuredData).replace(/</g, "\\u003c") }} />
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
