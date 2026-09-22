"use client";

import { useAccessibility, useMotionStopped } from "@/shared/components/Accessibility/store";
import { WelcomeBookingButton } from "./WelcomeBookingButton";
import styles from "./WelcomeSection.module.css";
import gsap from "gsap";
import { loadElementFont } from "@/shared/utils/loadElementFont";
import { useEffect, useRef, useState } from "react";
import { loadBackground } from "./loadBackground";
import { UnderlineSVG } from "@/shared/assets/svg/Underline";
import { revealWelcomeText } from "./animations/revealWelcomeText";
import { enableScrollParallax } from "./animations/enableScrollParallax";

export const WelcomeSection = () => {
  const welcomeSection = useRef<HTMLElement>(null);
  const background = useRef<HTMLDivElement>(null);
  const motionStopped = useMotionStopped();
  const [backgroundLoading, setBackgroundLoading] = useState(true);

  useEffect(() => {
    // Read the persisted setting too: hydration may precede the hook's next render.
    const stopped = useAccessibility.getState().motion ?? window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (motionStopped || stopped) return;
    return enableScrollParallax(background.current!);
  }, [motionStopped]);

  useEffect(() => {
    let cancelled = false;
    const context = gsap.context(() => {}, welcomeSection);
    const controller = new AbortController();
    let objectUrl: string | undefined;
    const imageReady = loadBackground(controller.signal).then(async blob => {
      if (cancelled) return;
      objectUrl = URL.createObjectURL(blob);
      const image = new Image();
      image.src = objectUrl;
      await image.decode();
      if (!cancelled && background.current) {
        background.current.style.backgroundImage = `url("${objectUrl}")`;
      }
    });
    void Promise.allSettled([
      imageReady,
      loadElementFont(
        welcomeSection.current?.querySelector(`.${styles.h1}`) ?? null,
      ),
      loadElementFont(
        welcomeSection.current?.querySelector(`.${styles.address}`) ?? null,
      ),
    ]).then(() => {
      if (cancelled) return;
      // An image error must not leave the page behind a permanent loader.
      setBackgroundLoading(false);
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
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      context.revert();
    };
  }, []);


  return (
    <section className={styles.welcomeSection} ref={welcomeSection} data-first-screen-ready={!backgroundLoading}>
      <div ref={background} className={styles.backgroundImage} />
      <div className={styles.welcomeText} inert={backgroundLoading} style={{ opacity: backgroundLoading ? 0 : 1 }}>
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
        {!backgroundLoading && <WelcomeBookingButton backdropRef={background} />}
      </div>
    </section>
  );
};
