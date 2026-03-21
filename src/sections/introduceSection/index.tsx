"use client";

import styles from "./IntroduceSection.module.css";
import { TopFlowerSVG } from "@/shared/assets/svg/TopFlower";
import { BottomFlowerSVG } from "@/shared/assets/svg/BottomFlower";

export const IntroduceSection = () => {
  return (
    <div className={styles.introduceSection}>
      <TopFlowerSVG className={styles.topFlower} />
      <BottomFlowerSVG className={styles.bottomFlower} />
    </div>
  );
};
