"use client";

import { useTranslations } from "next-intl";
import { BOOKING_URL } from "@/shared/config/booking";
import styles from "./Header.module.css";
import { Link } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { BeautyRoomSVG } from "@/shared/assets/svg/BeautyRoom";
import { SilhouetteSVG } from "@/shared/assets/svg/Silhouette";
import { Button } from "@/shared/components/Button";
import { paintSilhouette } from "./animations/collapseHeader";
import { MenuButton } from "../menuButton";
import clsx from "clsx";
import { usePathname } from "@/i18n/navigation";

export const Header = () => {
  const t = useTranslations("Navigation");
  const [isOpen, setIsOpen] = useState(false);
  const header = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      paintSilhouette({
        silhouettePathClass: `.${styles.logoSilhouette} path`,
        logoTextClass: `.${styles.logoText}`,
        headerContentContainerClass: `.${styles.contentContainer}`,
      });
    },
    { scope: header },
  );

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 960px)");
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (!event.matches) setIsOpen(false);
    };
    mobileQuery.addEventListener("change", handleBreakpointChange);
    return () =>
      mobileQuery.removeEventListener("change", handleBreakpointChange);
  }, []);

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
        if (!e.shiftKey && document.activeElement === lastLink) {
          e.preventDefault();
          firstLink.focus();
        } else if (e.shiftKey && document.activeElement === firstLink) {
          e.preventDefault();
          lastLink.focus();
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
          <Link
            href="/"
            className={styles.headerTitle}
            onClick={() => setIsOpen(false)}
          >
            <img src="/headerTitle.svg" alt="Beauty Room" />
          </Link>
          <MenuButton isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>

        <Link href="/" className={styles.logo} onClick={() => setIsOpen(false)}>
          <BeautyRoomSVG className={styles.logoText} />
          <SilhouetteSVG className={styles.logoSilhouette} />
        </Link>

        <nav className={styles.navigation}>
          <ul className={styles.navigationList}>
            <li className={styles.navigationItem}>
              <Link
                data-press-feedback
                href="/procedures"
                className={clsx(
                  styles.navigationLink,
                  pathname === "/procedures" && styles.activeLink,
                )}
                onClick={() => setIsOpen(false)}
              >
                {t("procedures")}
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </Link>
            </li>
            <li className={styles.navigationItem}>
              <Link
                data-press-feedback
                href="/cosmetics"
                className={clsx(
                  styles.navigationLink,
                  pathname === "/cosmetics" && styles.activeLink,
                )}
                onClick={() => setIsOpen(false)}
              >
                {t("cosmetics")}
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </Link>
            </li>
            <li className={styles.navigationItem}>
              <Link
                data-press-feedback
                href="/address"
                className={clsx(
                  styles.navigationLink,
                  pathname === "/address" && styles.activeLink,
                )}
                onClick={() => setIsOpen(false)}
              >
                {t("address")}
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </Link>
            </li>
            <li className={styles.navigationItem}>
              <Link
                data-press-feedback
                href="/contacts"
                className={clsx(
                  styles.navigationLink,
                  pathname === "/contacts" && styles.activeLink,
                )}
                onClick={() => setIsOpen(false)}
              >
                {t("contacts")}
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </Link>
            </li>
            <li className={clsx(styles.navigationItem, styles.mobileBooking)}>
              <Button
                href={BOOKING_URL}
                className={styles.button}
                type="primary"
                onClick={() => setIsOpen(false)}
              >
                {t("booking")}
              </Button>
            </li>
          </ul>
        </nav>
        <div className={styles.desktopBooking}>
          <Button href={BOOKING_URL} className={styles.button} type="primary">
            {t("booking")}
          </Button>
        </div>
      </div>
    </header>
  );
};
