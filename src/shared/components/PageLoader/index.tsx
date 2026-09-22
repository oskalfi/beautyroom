"use client";

import { useTranslations } from "next-intl";
import { DelayedLoading } from "@/shared/components/DelayedLoading";
import { MediaLoader } from "@/shared/components/MediaLoader";
import styles from "./PageLoader.module.css";

export function PageLoader({ delayed = true }: { delayed?: boolean }) {
  const t = useTranslations("Navigation");
  const loader = (
    <div className={styles.container}>
      <div className={styles.indicator}>
        <div className={styles.spinner}><MediaLoader label={t("loadingAssets")} /></div>
        <p className={styles.label} aria-hidden="true">
          {t("loadingAssets")}<span className={styles.dots} dir="ltr"><span>.</span><span>.</span><span>.</span></span>
        </p>
      </div>
    </div>
  );
  return delayed ? <DelayedLoading>{loader}</DelayedLoading> : loader;
}
