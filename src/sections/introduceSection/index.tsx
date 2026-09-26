"use client";

import { useNearViewport } from "@/shared/hooks/useNearViewport";

import styles from "./IntroduceSection.module.css";
import { TopFlowerSVG } from "@/shared/assets/svg/TopFlower";
import { BottomFlowerSVG } from "@/shared/assets/svg/BottomFlower";
import { loadElementFont } from "@/shared/utils/loadElementFont";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { flowersNTextReveal } from "./animations/flowers&textReveal";

export const IntroduceSection = () => {
  const introduceSection = useRef<HTMLElement>(null);
  const near = useNearViewport(introduceSection, true, "0px");
  useGSAP(
    (_context, contextSafe) => {
      if (!near) return;
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
    { scope: introduceSection, dependencies: [near], revertOnUpdate: true },
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
