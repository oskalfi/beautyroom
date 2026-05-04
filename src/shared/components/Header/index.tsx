"use client";

import styles from "./Header.module.css";
import Link from "next/link";
import { useRef } from "react";
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
            <li className={styles.navigationItem}>
              <Link href="/studio" className={styles.navigationLink}>
                Процедуры
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="15" />
                </svg>
              </Link>
            </li>
            <li className={styles.navigationItem}>
              <Link href="/studio" className={styles.navigationLink}>
                Косметика
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="15" />
                </svg>
              </Link>
            </li>
            <li className={styles.navigationItem}>
              <Link href="/studio" className={styles.navigationLink}>
                Расположение
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="15" />
                </svg>
              </Link>
            </li>
            <li className={styles.navigationItem}>
              <Link href="/studio" className={styles.navigationLink}>
                Связаться
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="15" />
                </svg>
              </Link>
            </li>
          </ul>
        </nav>
        <Button type="primary">ЗАПИСЬ</Button>
      </div>
    </header>
  );
};
