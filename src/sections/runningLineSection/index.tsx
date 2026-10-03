"use client";
import { useTranslations } from "next-intl";


import { useNearViewport } from "@/shared/hooks/useNearViewport";



import { MaleFaceSilhouetteSVG } from "@/shared/assets/svg/MaleFaceSilhouette";
import styles from "./RunningLineSection.module.css";
import { FemaleFaceSilhouetteSVG } from "@/shared/assets/svg/FemaleFaceSilhouette";
import { RunningLine } from "@/shared/components/RunningLine";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { revealTextAndSVG } from "./animations/revealText&SVG";



export const RunningLineSection = () => {
  const t = useTranslations("Home");
  const ref = useRef<HTMLElement | null>(null);
  const near = useNearViewport(ref, true, "200px 0px");
  useGSAP(
    () => {
      if (!near) return;
      revealTextAndSVG(styles.heading, styles.maleFace, styles.femaleFace);
    },
    { scope: ref, dependencies: [near], revertOnUpdate: true },
  );
  return (
    <section className={styles.sectionContainer} ref={ref}>
      <RunningLine facts={t.raw("facts") as string[]} />
      <div className={styles.headingContainer}>
        <MaleFaceSilhouetteSVG className={styles.maleFace} />
        <h2 className={styles.heading}>
          {t("results")}
        </h2>
        <FemaleFaceSilhouetteSVG className={styles.femaleFace} />
      </div>
    </section>
  );
};
