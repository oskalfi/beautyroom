"use client";

import { MaleFaceSilhouetteSVG } from "@/shared/assets/svg/MaleFaceSilhouette";
import styles from "./RunningLineSection.module.css";
import { FemaleFaceSilhouetteSVG } from "@/shared/assets/svg/FemaleFaceSilhouette";
import { RunningLine } from "@/shared/components/RunningLine";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { revealTextAndSVG } from "./animations/revealText&SVG";

const mockFacts = [
  "12 лет в сфере эстетики и ухода за кожей в Израиле",
  "Клинический подход",
  "Профессиональные инструменты",
  "Сертифицированные препараты",
  "Экспертное сопровождение",
];

export const RunningLineSection = () => {
  const ref = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      revealTextAndSVG(styles.heading, styles.maleFace, styles.femaleFace);
    },
    { scope: ref },
  );
  return (
    <section className={styles.sectionContainer} ref={ref}>
      <RunningLine facts={mockFacts} />
      <div className={styles.headingContainer}>
        <MaleFaceSilhouetteSVG className={styles.maleFace} />
        <h2 className={styles.heading}>
          До и после: видимый результат благодаря регулярному уходу.
        </h2>
        <FemaleFaceSilhouetteSVG className={styles.femaleFace} />
      </div>
    </section>
  );
};
