"use client";

import { useTranslations } from "next-intl";
import { DelayedLoading } from "@/shared/components/DelayedLoading";
import { MediaLoader } from "@/shared/components/MediaLoader";
import styles from "./PageLoader.module.css";

export function PageLoader() {
  const t = useTranslations("Navigation");
  return (
    <DelayedLoading>
    <div className={styles.container}>
      <MediaLoader label={t("loading")} />
      <p className={styles.label} aria-hidden="true">{t("loading")}</p>
    </div>
    </DelayedLoading>
  );
}
