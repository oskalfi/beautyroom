"use client";

import { FingerprintSVG } from "@/shared/assets/svg/Fingerprint";
import { BOOKING_URL } from "@/shared/config/booking";
import styles from "./WelcomeSection.module.css";

export function WelcomeBookingButton() {
  return (
    <a
      data-press-feedback
      href={BOOKING_URL}
      className={styles.bookingButton}
    >
      <span className={styles.glassSurface} aria-hidden="true" />
      <span className={styles.bookingFingerprint} aria-hidden="true">
        <FingerprintSVG className={styles.fingerprint} />
      </span>
      <span className={styles.bookingLabel}>Запись</span>
    </a>
  );
}
