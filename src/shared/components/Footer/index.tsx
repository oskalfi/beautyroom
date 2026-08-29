"use client";

import styles from "./Footer.module.css";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Footer = () => {
  const logoRef = useRef(null);
  const footerRef = useRef(null);

  useGSAP(() => {
    gsap.from(logoRef.current, {
      y: "-100%",
      duration: 2,
      ease: "bounce.inOut",
      scrollTrigger: {
        trigger: footerRef.current,
        start: "center bottom",
        toggleActions: "play none none none",
      },
    });
  });

  return (
    <footer className={styles.footer} ref={footerRef}>
      <img src="/flag.svg" alt="Logo" className={styles.logo} ref={logoRef} />
      <div className={styles.linksWrapper}>
        <nav aria-labelledby="site-navigation-title">
          <h2 className={styles.heading} id="site-navigation-title">
            Navigation
          </h2>
          <ul className={styles.linksList}>
            <li className={styles.navigationItem}>
              <Link href="/book" className={styles.navigationLink}>
                Запись
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </Link>
            </li>
            <li className={styles.navigationItem}>
              <Link href="/procedures" className={styles.navigationLink}>
                Процедуры
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </Link>
            </li>
            <li className={styles.navigationItem}>
              <Link href="/treatments" className={styles.navigationLink}>
                Косметика
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </Link>
            </li>
            <li className={styles.navigationItem}>
              <Link href="/address" className={styles.navigationLink}>
                Расположение
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </Link>
            </li>
          </ul>
        </nav>
        <section aria-labelledby="contact-title">
          <h2 className={styles.heading} id="contact-title">
            For any questions
          </h2>
          <ul className={styles.linksList}>
            <li className={styles.navigationItem}>
              <a href="tel:+972532258055" className={styles.navigationLink}>
                +972-53-225-80-55
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </a>
            </li>
            <li className={styles.navigationItem}>
              <a
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
            Social webs
          </h2>
          <ul className={styles.linksList}>
            <li className={styles.navigationItem}>
              <a href="..." className={styles.navigationLink}>
                Instagram
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </a>
            </li>
            <li className={styles.navigationItem}>
              <a href="..." className={styles.navigationLink}>
                Facebook
                <svg className={styles.border}>
                  <rect x="0" y="0" width="100%" height="100%" rx="16" />
                </svg>
              </a>
            </li>
            <li className={styles.navigationItem}>
              <a href="..." className={styles.navigationLink}>
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
        <small>Copyright © 2026 Beauty Room. All rights reserved.</small>
      </p>
    </footer>
  );
};
