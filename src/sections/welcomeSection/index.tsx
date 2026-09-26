"use client";

import { useAccessibility, useMotionStopped } from "@/shared/components/Accessibility/store";
import { WelcomeBookingButton } from "./WelcomeBookingButton";
import styles from "./WelcomeSection.module.css";
import { useEffect, useRef } from "react";
import { UnderlineSVG } from "@/shared/assets/svg/Underline";
import { enableScrollParallax } from "./animations/enableScrollParallax";

export const WelcomeSection = () => {
  const background = useRef<HTMLDivElement>(null);
  const motionStopped = useMotionStopped();

  useEffect(() => {
    // Read the persisted setting too: hydration may precede the hook's next render.
    const stopped = useAccessibility.getState().motion ?? window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (motionStopped || stopped) return;
    return enableScrollParallax(background.current!);
  }, [motionStopped]);

  return (
    <section className={styles.welcomeSection} data-first-screen-ready="true">
      <div ref={background} className={styles.backgroundImage} />
      <div className={styles.welcomeText}>
        <h1 className={styles.h1}>
          <span className={styles.nowrap}>Beautiful skin</span>{" "}
          <span className={styles.nowrap}>is not a dream</span>{" "}
          <span>— it&apos;s a result</span>
        </h1>
        <div className={styles.address}>
          Facial skin care and{" "}
          <span className={styles.nowrap}>treatment studio</span> based{" "}
          <span className={styles.underlinedText}>
            in Tel Aviv - Yafo.
            <UnderlineSVG
              svgClassName={styles.underline}
              clipClassName={styles.clip}
            />
          </span>
        </div>
        <WelcomeBookingButton />
      </div>
    </section>
  );
};
