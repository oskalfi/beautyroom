import styles from "./Footer.module.css";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <img src="/flag.svg"></img>
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
            <li>
              <a className={styles.contact} href="tel:+972532258055">
                +972-53-225-80-55
              </a>
            </li>
            <li>
              <a href="mailto:beautyroom@gmail.com">beautyroom@gmail.com</a>
            </li>
          </ul>
        </section>
        <section aria-labelledby="social-title">
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
