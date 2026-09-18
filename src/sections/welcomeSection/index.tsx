"use client";

import styles from "./WelcomeSection.module.css";
import gsap from "gsap";
import { loadElementFont } from "@/shared/utils/loadElementFont";
import { useEffect, useRef } from "react";
import { UnderlineSVG } from "@/shared/assets/svg/Underline";
import { revealWelcomeText } from "./animations/revealWelcomeText";
import { enableScrollParallax } from "./animations/enableScrollParallax";

export const WelcomeSection = () => {
  const welcomeSection = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;
    const context = gsap.context(() => {
      enableScrollParallax(`.${styles.backgroundImage}`);
    }, welcomeSection);
    void Promise.allSettled([
      loadElementFont(
        welcomeSection.current?.querySelector(`.${styles.h1}`) ?? null,
      ),
      loadElementFont(
        welcomeSection.current?.querySelector(`.${styles.address}`) ?? null,
      ),
    ]).then(() => {
      if (cancelled) return;
      context.add(() => {
        revealWelcomeText({
          titleClass: `.${styles.h1}`,
          subtitleClass: `.${styles.address}`,
          underlineClipPathClass: `.${styles.clip}`,
        });
      });
    });
    return () => {
      cancelled = true;
      context.revert();
    };
  }, []);

  return (
    <section className={styles.welcomeSection} ref={welcomeSection}>
      <div className={styles.backgroundImage} />
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
      </div>
    </section>
  );
};
