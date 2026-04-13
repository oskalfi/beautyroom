"use client";

import styles from "./WelcomeSection.module.css";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { UnderlineSVG } from "@/shared/assets/svg/Underline";
import { revealWelcomeText } from "./animations/revealWelcomeText";
import { enableScrollParallax } from "./animations/enableScrollParallax";

export const WelcomeSection = () => {
  const welcomeSection = useRef(null);

  useGSAP(
    () => {
      document.fonts.ready.then(() => {});
      revealWelcomeText({
        titleClass: `.${styles.h1}`,
        subtitleClass: `.${styles.address}`,
        underlineClipPathClass: `.${styles.clip}`,
      });
      enableScrollParallax(`.${styles.backgroundImage}`);
    },
    { scope: welcomeSection },
  );

  return (
    <section className={styles.welcomeSection} ref={welcomeSection}>
      <div className={styles.backgroundImage}></div>
      <div className={styles.welcomeText}>
        <h1 className={styles.h1}>
          Beautiful skin is not a dream — it's a result
        </h1>
        <div className={styles.address}>
          Facial skin care and treatment studio based{" "}
          <span className={styles.underlinedText}>
            in Tel Aviv - Yafo.
            <UnderlineSVG
              svgClassName={styles.underline}
              clipClassName={styles.clip}
            />
          </span>
        </div>
      </div>
    </section>
  );
};
