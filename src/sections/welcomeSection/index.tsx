"use client";
import { useLocale, useTranslations } from "next-intl";


import { useAccessibility, useMotionStopped } from "@/shared/components/Accessibility/store";
import { WelcomeBookingButton } from "./WelcomeBookingButton";
import styles from "./WelcomeSection.module.css";
import { useEffect, useRef } from "react";
import { UnderlineSVG } from "@/shared/assets/svg/Underline";
import { enableScrollParallax } from "./animations/enableScrollParallax";
import { revealWelcomeUnderline } from "./animations/revealWelcomeUnderline";

export const WelcomeSection = () => {
  const t = useTranslations("Home");
  const locale = useLocale();
  const section = useRef<HTMLElement>(null);
  const background = useRef<HTMLDivElement>(null);
  const motionStopped = useMotionStopped();

  useEffect(() => {
    const stopped = useAccessibility.getState().motion ?? window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (motionStopped || stopped) return;
    const mask = section.current?.querySelector<SVGElement>(`.${styles.clip}`);
    if (mask) return revealWelcomeUnderline(mask);
  }, [motionStopped]);

  useEffect(() => {
    // Read the persisted setting too: hydration may precede the hook's next render.
    const stopped = useAccessibility.getState().motion ?? window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (motionStopped || stopped) return;
    return enableScrollParallax(background.current!);
  }, [motionStopped]);

  return (
    <section ref={section} className={styles.welcomeSection} data-first-screen-ready="true">
      <div ref={background} className={styles.backgroundImage} />
      <div className={styles.welcomeText}>
        <h1 className={styles.h1}>
          <span className={styles.nowrap}>{t("hero1")}</span>{" "}
          <span className={styles.nowrap}>{t("hero2")}</span>{" "}
          <span className={styles.nowrap}>{t("hero3")}</span>
        </h1>
        <div className={styles.address}>
          {t("locationIntro")}{" "}
          <span className={styles.underlinedText}>
            {t("locationCity")}
            <UnderlineSVG
              rtl={locale === "he"}
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
