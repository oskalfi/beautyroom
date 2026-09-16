import styles from "./page.module.css";
import { IntroduceSection } from "@/sections/introduceSection";
import { WelcomeSection } from "@/sections/welcomeSection";
import { TreatmentsSection } from "@/sections/treatmentsSection";
import { RunningLineSection } from "@/sections/runningLineSection";
import { BeforeAfterSection } from "@/sections/beforeAfterSection";
import { InstagramSection } from "@/sections/instagramSection";
import { AddressSection } from "@/sections/addressSection";

export default function Home() {
  return (
    <main className={styles.mainPage}>
      <link rel="preload" href="/main_bg.avif" as="image" fetchPriority="high" />
      <link rel="preload" href="/fonts/MontserratAlternates/MontserratAlternates-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
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
