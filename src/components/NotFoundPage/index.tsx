import Image from "next/image";
import { Logo } from "@/components/Logo";
import { Button } from "@/shared/components/Button";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import styles from "./NotFoundPage.module.css";

const copy = {
  ru: { title: "Страница не найдена", message: "Не существует страницы по данному адресу.", home: "На главную" },
  en: { title: "Page not found", message: "There is no page at this address.", home: "Back to home" },
  he: { title: "העמוד לא נמצא", message: "לא קיים עמוד בכתובת הזו.", home: "לעמוד הבית" },
};

export function NotFoundPage({ locale = "en" }: { locale?: Locale }) {
  const text = copy[locale];
  const home = getPathname({ locale, href: "/" });
  return (
    <main className={styles.page} data-not-found dir={locale === "he" ? "rtl" : "ltr"}>
      <a className={styles.logoLink} href={home} aria-label={`Beauty Room — ${text.home}`} data-press-feedback>
        <Logo />
      </a>
      <Image className={styles.topLeaf} src="/not-found/topLeaf.svg" width={437} height={345} alt="" aria-hidden="true" />
      <Image className={styles.bottomLeaf} src="/not-found/bottomLeaf.svg" width={287} height={526} alt="" aria-hidden="true" />
      <div className={styles.content}>
        <h1 className={styles.title}>
          <Image className={styles.number} src="/not-found/404.svg" width={654} height={232} alt={`404 — ${text.title}`} priority />
        </h1>
        <p className={styles.message}>{text.message}</p>
        <Button href={home} className={styles.homeButton} type="secondary">{text.home}</Button>
      </div>
    </main>
  );
}
