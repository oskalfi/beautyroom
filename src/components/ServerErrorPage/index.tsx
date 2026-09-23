import { Logo } from "@/components/Logo";
import { Button } from "@/shared/components/Button";
import type { Locale } from "@/i18n/routing";
import styles from "@/components/NotFoundPage/NotFoundPage.module.css";
import errorStyles from "./ServerErrorPage.module.css";

const copy = {
  ru: { title: "Ошибка сервера", message: "У нас возникли неполадки. Сообщите по телефону", home: "На главную", retry: "Попробовать снова" },
  en: { title: "Server error", message: "We are experiencing technical difficulties. Please let us know by calling", home: "Back to home", retry: "Try again" },
  he: { title: "שגיאת שרת", message: "אירעה תקלה באתר. אנא הודיעו לנו בטלפון", home: "לעמוד הבית", retry: "נסו שוב" },
};

// No translation provider or image optimizer is required by the error UI.
export function ServerErrorPage({ locale = "en", reset }: { locale?: Locale; reset?: () => void }) {
  const text = copy[locale];
  const home = locale === "en" ? "/" : `/${locale}`;
  return (
    <main className={styles.page} data-server-error dir={locale === "he" ? "rtl" : "ltr"}>
      <a href={home} className={styles.logoLink} aria-label={`Beauty Room — ${text.home}`} data-press-feedback><Logo /></a>
      {/* eslint-disable @next/next/no-img-element */}
      <img src="/not-found/topLeaf.svg" className={styles.topLeaf} width="437" height="345" alt="" />
      <img src="/not-found/bottomLeaf.svg" className={styles.bottomLeaf} width="287" height="526" alt="" />
      <div className={styles.content}>
        <h1 className={styles.title}><img src="/not-found/500.svg" className={styles.number} width="251" height="89" alt={`500 — ${text.title}`} /></h1>
        <p className={`${styles.message} ${errorStyles.message}`}>
          {text.message}{" "}<a href="tel:+972532258055" className={errorStyles.phone} data-press-feedback><bdi dir="ltr">+972-53-225-80-55</bdi></a>.
        </p>
        <div className={errorStyles.actions}>
          {reset && <Button type="secondary" className={styles.homeButton} onClick={reset}>{text.retry}</Button>}
          <Button type="secondary" className={styles.homeButton} href={home}>{text.home}</Button>
        </div>
      </div>
    </main>
  );
}
