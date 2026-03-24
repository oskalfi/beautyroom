// "use client";

import { IntroduceSection } from "@/sections/introduceSection";
import { WelcomeSection } from "@/sections/welcomeSection";
import { TreatmentsSection } from "@/sections/treatmentsSection";

export default function Home() {
  return (
    <main>
      <WelcomeSection />
      <IntroduceSection />
      <TreatmentsSection />
    </main>
  );
}
