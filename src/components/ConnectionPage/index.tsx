"use client";

import { Logo } from "@/components/Logo";
import { Button } from "@/shared/components/Button";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import styles from "@/components/NotFoundPage/NotFoundPage.module.css";
import connectionStyles from "./ConnectionPage.module.css";

const copy = {
  ru: { title: "Проблема с соединением", message: "Слабое соединение или нет доступа к интернету. Проверьте подключение и попробуйте снова.", retry: "Попробовать снова", checking: "Проверяем соединение…" },
  en: { title: "Connection problem", message: "The connection is slow or unavailable. Check your internet connection and try again.", retry: "Try again", checking: "Checking connection…" },
  he: { title: "בעיה בחיבור", message: "החיבור איטי או שאין גישה לאינטרנט. בדקו את החיבור ונסו שוב.", retry: "נסו שוב", checking: "בודקים את החיבור…" },
};

export function ConnectionPage({ locale, onRetry, checking = false }: { locale: Locale; onRetry?: () => void; checking?: boolean }) {
  const text = copy[locale];
  const home = getPathname({ locale, href: "/" });
  return (
    <main className={`${styles.page} ${connectionStyles.page}`} data-connection-error dir={locale === "he" ? "rtl" : "ltr"}>
      <a className={styles.logoLink} href={home} aria-label="Beauty Room"><Logo /></a>
      {/* Plain SVG images are also usable in the script-free offline fallback. */}
      {/* eslint-disable @next/next/no-img-element */}
      <img className={styles.topLeaf} src="/not-found/topLeaf.svg" width="437" height="345" alt="" />
      <img className={styles.bottomLeaf} src="/not-found/bottomLeaf.svg" width="287" height="526" alt="" />
      <div className={styles.content}>
        <h1 className={connectionStyles.title}>
          <img className={connectionStyles.icon} src="/not-found/connection.svg" width="115" height="115" alt={text.title} />
        </h1>
        <p className={`${styles.message} ${connectionStyles.message}`} role="status">{checking ? text.checking : text.message}</p>
        {onRetry
          ? <Button type="secondary" className={styles.homeButton} onClick={onRetry}>{text.retry}</Button>
          : <Button type="secondary" className={styles.homeButton} href={home}>{text.retry}</Button>}
      </div>
    </main>
  );
}
