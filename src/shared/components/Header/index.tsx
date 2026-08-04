"use client";

import styles from "./Header.module.css";
import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect } from "react";
import { BeautyRoomSVG } from "@/shared/assets/svg/BeautyRoom";
import { SilhouetteSVG } from "@/shared/assets/svg/Silhouette";
import { Button } from "@/shared/components/Button";
import { paintSilhouette } from "./animations/collapseHeader";
import { MenuButton } from "../menuButton";
import clsx from "clsx";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const header = useRef<HTMLElement | null>(null);

  // Флаг, чтобы пропустить анимацию закрытия при первом рендере
  const isFirstRender = useRef(true);

  useGSAP(
    () => {
      if (isFirstRender.current) {
        const logoSilhouette = `.${styles.logoSilhouette} path`;
        const logoText = `.${styles.logoText}`;
        const contentContainer = `.${styles.contentContainer}`;

        paintSilhouette({
          silhouettePathClass: logoSilhouette,
          logoTextClass: logoText,
          headerContentContainerClass: contentContainer,
        });
      }

      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      if (isOpen) {
        gsap.to(`.${styles.navigationLink}`, {
          opacity: 1,
          stagger: 0.15,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.5,
        });
      } else {
        gsap.to(`.${styles.navigationLink}`, {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        });
      }
    },
    { dependencies: [isOpen], scope: header },
  );

  return (
    <header
      className={clsx(styles.header, { [styles.isOpen]: isOpen })}
      ref={header}
    >
      <div className={styles.contentContainer}>
        <div className={styles.mobileLayout}>
          <Link href="/" className={styles.headerTitle}>
            <img src="headerTitle.svg" alt="Beauty Room" />
          </Link>
          <MenuButton isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>

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
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </Link>
            </li>
            <li className={styles.navigationItem}>
              <Link href="/studio" className={styles.navigationLink}>
                Косметика
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </Link>
            </li>
            <li className={styles.navigationItem}>
              <Link href="/studio" className={styles.navigationLink}>
                Расположение
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </Link>
            </li>
            <li className={styles.navigationItem}>
              <Link href="/studio" className={styles.navigationLink}>
                Связаться
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </Link>
            </li>
          </ul>
        </nav>
        <Button className={styles.button} type="primary">
          ЗАПИСЬ
        </Button>
      </div>
    </header>
  );
};
