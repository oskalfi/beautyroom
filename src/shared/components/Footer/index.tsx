"use client";
import { useTranslations } from "next-intl";
import { BOOKING_URL } from "@/shared/config/booking";
import { LazyImage } from "@/shared/components/LazyImage";

import styles from "./Footer.module.css";
import { Link } from "@/i18n/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { usePathname } from "@/i18n/navigation";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger);

export const Footer = () => {
  const t = useTranslations("Navigation");
  const logoRef = useRef(null);
  const footerRef = useRef(null);
  const pathname = usePathname();

  useGSAP(() => {
    gsap.from(logoRef.current, {
      yPercent: -100,
      duration: 2,
      ease: "bounce.inOut",
      scrollTrigger: {
        trigger: footerRef.current,
        start: "1% bottom",
        toggleActions: "play none none none",
      },
    });
  });

  return (
    <footer className={styles.footer} ref={footerRef}>
      <LazyImage
        src="/flag.svg"
        width={212}
        height={295}
        alt="Logo"
        className={styles.logo}
        ref={logoRef}
      />
      <div className={styles.linksWrapper}>
        <nav aria-labelledby="site-navigation-title">
          <h2 className={styles.heading} id="site-navigation-title">
            {t("navigation")}
          </h2>
          <ul className={styles.linksList}>
            <li className={styles.navigationItem}>
              <a
                data-press-feedback
                href={BOOKING_URL}
                className={styles.navigationLink}
              >
                {t("booking")}
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </a>
            </li>
            <li className={styles.navigationItem}>
              <Link
                data-press-feedback
                href="/procedures"
                className={clsx(
                  styles.navigationLink,
                  pathname === "/procedures" && styles.activeLink,
                )}
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
                href="/accessibility"
                className={clsx(
                  styles.navigationLink,
                  pathname === "/accessibility" && styles.activeLink,
                )}
              >
                {t("accessibility")}
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </Link>
            </li>
          </ul>
        </nav>
        <section aria-labelledby="contact-title">
          <h2 className={styles.heading} id="contact-title">
            {t("questions")}
          </h2>
          <ul className={styles.linksList}>
            <li className={styles.navigationItem}>
              <a
                data-press-feedback
                href="tel:+972532258055"
                className={styles.navigationLink}
              >
                +972-53-225-80-55
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </a>
            </li>
            <li className={styles.navigationItem}>
              <a
                data-press-feedback
                href="mailto:beautyroom@gmail.com"
                className={styles.navigationLink}
              >
                beautyroom@gmail.com
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </a>
            </li>
          </ul>
        </section>
        <section aria-labelledby="social-title" className={styles.socialWebs}>
          <h2 className={styles.heading} id="social-title">
            {t("social")}
          </h2>
          <ul className={styles.linksList}>
            <li className={styles.navigationItem}>
              <a
                data-press-feedback
                href="..."
                className={styles.navigationLink}
              >
                Instagram
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </a>
            </li>
            <li className={styles.navigationItem}>
              <a
                data-press-feedback
                href="..."
                className={styles.navigationLink}
              >
                Facebook
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </a>
            </li>
            <li className={styles.navigationItem}>
              <a
                data-press-feedback
                href="..."
                className={styles.navigationLink}
              >
                Whatsapp
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </a>
            </li>
          </ul>
        </section>
      </div>
      <p className={styles.copyright}>
        <small>{t("copyright", { year: 2026 })}</small>
      </p>
    </footer>
  );
};
