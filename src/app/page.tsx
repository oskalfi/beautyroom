import styles from "./page.module.css";

import { IntroduceSection } from "@/sections/introduceSection";
import { WelcomeSection } from "@/sections/welcomeSection";

export default function Home() {
  return (
    <main>
      <WelcomeSection />
      <IntroduceSection />
      <div className={styles.test}>
        <h2>Treatments</h2>
      </div>
    </main>
  );
}
