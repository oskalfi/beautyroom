import styles from "./page.module.css";
import { IntroduceSection } from "@/sections/introduceSection";
import { WelcomeSection } from "@/sections/welcomeSection";
import { TreatmentsSection } from "@/sections/treatmentsSection";
import { RunningLineSection } from "@/sections/runningLineSection";
import { BeforeAfterSection } from "@/sections/beforeAfterSection";
import { InstagramSection } from "@/sections/instagramSection";

export default function Home() {
  return (
    <main>
      <WelcomeSection />
      <IntroduceSection />
      <TreatmentsSection />
      <RunningLineSection />
      <BeforeAfterSection />
      <InstagramSection />
    </main>
  );
}
