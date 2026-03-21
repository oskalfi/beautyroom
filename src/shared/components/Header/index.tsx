"use client";

import styles from "./Header.module.css";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { BeautyRoomSVG } from "@/shared/assets/svg/BeautyRoom";
import { SilhouetteSVG } from "@/shared/assets/svg/Silhouette";
import { Button } from "@/shared/components/Button";
import { collapseHeader } from "./animations/collapseHeader";

export const Header = () => {
  const header = useRef(null);

  useGSAP(
    () => {
      //instant logo reveal
      const logoSilhouette = `.${styles.logoSilhouette} path`;
      gsap.to(logoSilhouette, {
        strokeDashoffset: 0,
      });

      const logoText = `.${styles.logoText}`;
      const contentContainer = `.${styles.contentContainer}`;

      collapseHeader({
        silhouettePathClass: logoSilhouette,
        logoTextClass: logoText,
        headerContentContainerClass: contentContainer,
      });
    },
    { scope: header },
  );

  return (
    <header className={styles.header} ref={header}>
      <div className={styles.contentContainer}>
        <Link href="/" className={styles.logo}>
          <BeautyRoomSVG className={styles.logoText} />
          <SilhouetteSVG className={styles.logoSilhouette} />
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
                  <rect width="100%" height="29" x=".5" y=".5" rx="14.5" />
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
