"use client";

import styles from "./IntroduceSection.module.css";
import { TopFlowerSVG } from "@/shared/assets/svg/TopFlower";
import { BottomFlowerSVG } from "@/shared/assets/svg/BottomFlower";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { flowersNTextReveal } from "./animations/flowers&textReveal";

export const IntroduceSection = () => {
  const introduceSection = useRef(null);
  useGSAP(
    () => {
      flowersNTextReveal(styles.topFlower, styles.bottomFlower, styles.heading);
    },
    { scope: introduceSection },
  );

  return (
    <section ref={introduceSection} className={styles.introduceSection}>
      <TopFlowerSVG className={styles.topFlower} />
      <h2 className={styles.heading}>
        Let me introduce you to professional care with clinically proven
        results.
      </h2>
      <BottomFlowerSVG className={styles.bottomFlower} />
    </section>
  );
};
