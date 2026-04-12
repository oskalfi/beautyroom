"use client";

import styles from "./TreatmentsSection.module.css";

import { revealHeading } from "./animations/revealHeading";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { TreatmentsMenu } from "./components/treatmentsMenu";
import { mockData } from "./mockData";
export let previousCursorYCoord = 0;

export const TreatmentsSection = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      revealHeading(styles.heading, styles.decorativeDescription);

      ref.current?.addEventListener("mousemove", (e: MouseEvent) => {
        previousCursorYCoord = e.clientY;
      });
    },
    { scope: ref },
  );

  return (
    <section className={styles.treatmentsSection} ref={ref}>
      <div className={styles.decorativeDescription}>
        In my studio, we can create an individual care plan specifically for
        you.
      </div>
      <h2 className={styles.heading}>Treatments</h2>
      <TreatmentsMenu data={mockData} />
    </section>
  );
};
