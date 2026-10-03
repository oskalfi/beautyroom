"use client";
import { useTranslations, useLocale } from "next-intl";


import { FingerprintSVG } from "@/shared/assets/svg/Fingerprint";
import { getBookingUrl } from "@/shared/config/booking";
import styles from "./WelcomeSection.module.css";

export function WelcomeBookingButton() {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  return (
    <a
      data-press-feedback
      href={getBookingUrl(locale)}
      className={styles.bookingButton}
    >
      <span className={styles.glassSurface} aria-hidden="true" />
      <span className={styles.bookingFingerprint} aria-hidden="true">
        <FingerprintSVG className={styles.fingerprint} />
      </span>
      <span className={styles.bookingLabel}>{t("booking")}</span>
    </a>
  );
}
