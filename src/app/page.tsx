import { IntroduceSection } from "@/sections/introduceSection";
import { WelcomeSection } from "@/sections/welcomeSection";

export default function Home() {
  return (
    <main>
      <WelcomeSection />
      <IntroduceSection />
    </main>
  );
}
