"use client";

import styles from "./page.module.css";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitText from "gsap/src/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import { UnderlineSVG } from "@/shared/assets/svg/Underline";
import { TopLeafSVG } from "@/shared/assets/svg/TopLeaf";
import { BottomLeafSVG } from "@/shared/assets/svg/BottomLeaf";

export default function Home() {
  const container = useRef(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.registerPlugin(SplitText);

      // Text appearance animation
      const h1 = SplitText.create(`.${styles.h1}`, { type: " lines chars" });
      const address = SplitText.create(`.${styles.address}`, {
        type: "lines chars",
      });
      const timeline = gsap.timeline();
      timeline
        .from(
          h1.chars,
          {
            duration: 0.5,
            y: 10, // animate from 100px below
            autoAlpha: 0, // fade in from opacity: 0 and visibility: hidden
            stagger: 0.03, // 0.05 seconds between each
          },
          "<",
        )
        .from(address.chars, {
          duration: 0.4,
          y: 10,
          autoAlpha: 0,
          stagger: 0.01,
        })
        .to(`.${styles.clip}`, {
          width: "100%",
          duration: 3,
          ease: "power1.inOut",
        });

      //Scroll animation
      const scroll = gsap.timeline({
        scrollTrigger: {
          trigger: `.${styles.backgroundImage}`,
          start: "top top",
          end: "+=700",
          scrub: true,
        },
      });
      scroll
        .to(
          `.${styles.secondScreen}`,
          {
            y: -400,
          },
          "<",
        )
        .to(
          `.${styles.welcomeText}`,
          {
            y: -400,
          },
          "<",
        )
        .to(
          `.${styles.backgroundImage}`,
          {
            y: -100,
          },
          "<",
        );
    },
    { scope: container },
  );

  return (
    <main ref={container}>
      <div className={styles.welcomeSection}>
        <img
          src="/main_bg.avif"
          alt="pretty female face"
          className={styles.backgroundImage}
        />
        <div className={styles.flowHeight}>
          <div className={styles.welcomeText}>
            <div className={styles.h1}>
              Beautiful skin is not a dream — it's a result
            </div>

            <div className={styles.address}>
              Facial skin care and treatment studio based{" "}
              <span className={styles.underlinedText}>
                in Tel Aviv - Yafo.
                <UnderlineSVG
                  svgClassName={styles.underline}
                  clipClassName={styles.clip}
                ></UnderlineSVG>
              </span>
            </div>
          </div>
        </div>
        <div className={styles.secondScreen}>
          <TopLeafSVG className={styles.topLeaf} />
          <BottomLeafSVG className={styles.bottomLeaf} />
        </div>
      </div>
    </main>
  );
}
