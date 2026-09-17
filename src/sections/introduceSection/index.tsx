"use client";

import styles from "./IntroduceSection.module.css";
import { TopFlowerSVG } from "@/shared/assets/svg/TopFlower";
import { BottomFlowerSVG } from "@/shared/assets/svg/BottomFlower";
import { loadElementFont } from "@/shared/utils/loadElementFont";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { flowersNTextReveal } from "./animations/flowers&textReveal";

export const IntroduceSection = () => {
  const introduceSection = useRef<HTMLElement>(null);
  useGSAP(
    (_context, contextSafe) => {
      let cancelled = false;
      const reveal = contextSafe!(() => {
        if (cancelled) return;
        flowersNTextReveal(
          styles.topFlower,
          styles.bottomFlower,
          styles.heading,
          styles.letter,
        );
      });
      void loadElementFont(introduceSection.current?.querySelector(`.${styles.heading}`) ?? null).then(reveal, reveal);
      return () => { cancelled = true; };
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
