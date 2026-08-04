"use client";

import styles from "./Header.module.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/all";
import { BeautyRoomSVG } from "@/shared/assets/svg/BeautyRoom";
import { SilhouetteSVG } from "@/shared/assets/svg/Silhouette";
import { Button } from "@/shared/components/Button";
import { paintSilhouette } from "./animations/collapseHeader";
import { MenuButton } from "../menuButton";
import clsx from "clsx";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

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

      const container = document.querySelector(`.${styles.contentContainer}`);
      const links = `.${styles.navigationLink}`;

      if (!container) return;

      const state = Flip.getState(container);

      container.classList.toggle(styles.openContainer, isOpen);

      Flip.from(state, {
        duration: 0.5,
        ease: "power2.inOut",
        scale: true,
        onStart: () => {
          if (isOpen) {
            gsap.to(links, {
              opacity: 1,
              stagger: 0.1,
              duration: 0.35,
              delay: 0.15,
              ease: "power2.out",
            });
          } else {
            gsap.to(links, {
              opacity: 0,
              duration: 0.2,
              ease: "power2.in",
            });
          }
        },
      });
    },
    { dependencies: [isOpen], scope: header },
  );

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);

      if (e.key === "Tab") {
        const navList = header.current?.querySelector(
          `.${styles.navigationList}`,
        );
        const links = navList?.querySelectorAll<HTMLElement>("a, button");

        if (!links || links.length === 0) return;

        const firstLink = links[0];
        const lastLink = links[links.length - 1];

        // Если фокус на последней ссылке — принудительно переносим на ПЕРВУЮ ссылку списка
        if (document.activeElement === lastLink) {
          e.preventDefault();
          firstLink.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

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
