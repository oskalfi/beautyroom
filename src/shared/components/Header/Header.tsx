"use client";

import styles from "./Header.module.css";
import Link from "next/link";
import { Button } from "@/shared/components/Button";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BeautyRoom } from "@/shared/assets/svg/BeautyRoom";
import { SilhouetteSVG } from "@/shared/assets/svg/Silhouette";

export const Header = () => {
  const header = useRef(null);

  useGSAP(
    () => {
      const logoSilhouette = `.${styles.logoSilhouette} path`;
      const logoText = `.${styles.logoText}`;
      const contentContainer = `.${styles.contentContainer}`;

      gsap.to(logoSilhouette, {
        delay: 2.5,
        strokeDashoffset: 0,
      });

      gsap.registerPlugin(ScrollTrigger);

      const timeline = gsap.timeline({ paused: true });

      timeline
        .to(
          contentContainer,
          {
            scale: 0.9,
            height: "80px",
            ease: "sine.inOut",
          },
          "<",
        )
        .to(
          logoSilhouette,
          {
            strokeDashoffset: -1082,
          },
          "<",
        )
        .to(
          logoText,
          {
            bottom: "5px",
          },
          "<",
        );

      ScrollTrigger.create({
        trigger: logoSilhouette,
        start: () => `${window.innerHeight * 0.5} ${window.innerHeight * 0.2}`,
        end: () => `${window.innerHeight * 0.5} ${window.innerHeight * 0.2}`,
        onEnter: () => timeline.play(),
        onLeaveBack: () => timeline.reverse(),
      });
    },
    { scope: header },
  );

  return (
    <header className={styles.header} ref={header}>
      <div className={styles.contentContainer}>
        <Link href="/" className={styles.logo}>
          <BeautyRoom className={styles.logoText}></BeautyRoom>
          <SilhouetteSVG className={styles.logoSilhouette}></SilhouetteSVG>
        </Link>

        <nav className={styles.navigation}>
          <ul className={styles.navigationList}>
            <li>
              <Link href="/studio" className={styles.navigationLink}>
                Процедуры
                <svg
                  className={styles.svg}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 30"
                  preserveAspectRatio="none"
                >
                  <rect width="99" height="29" x=".5" y=".5" rx="14.5" />
                </svg>
              </Link>
            </li>
            <li>
              <Link href="/studio" className={styles.navigationLink}>
                Косметика
                <svg
                  className={styles.svg}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 30"
                  preserveAspectRatio="none"
                >
                  <rect width="99" height="29" x=".5" y=".5" rx="14.5" />
                </svg>
              </Link>
            </li>
            <li>
              <Link href="/studio" className={styles.navigationLink}>
                Расположение
                <svg
                  className={styles.svg}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 30"
                  preserveAspectRatio="none"
                >
                  <rect width="99" height="29" x=".5" y=".5" rx="14.5" />
                </svg>
              </Link>
            </li>
            <li>
              <Link href="/studio" className={styles.navigationLink}>
                Связаться
                <svg
                  className={styles.svg}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 30"
                  preserveAspectRatio="none"
                >
                  <rect width="99" height="29" x=".5" y=".5" rx="14.5" />
                </svg>
              </Link>
            </li>
          </ul>
        </nav>
        <Button>ЗАПИСЬ</Button>
      </div>
    </header>
  );
};
