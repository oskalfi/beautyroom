"use client";

import { useMotionStopped } from "@/shared/components/Accessibility/store";
import dynamic from "next/dynamic";
import { useSyncExternalStore, type RefObject } from "react";
import { FingerprintSVG } from "@/shared/assets/svg/Fingerprint";
import { BOOKING_URL } from "@/shared/config/booking";
import styles from "./WelcomeSection.module.css";

const GlassSurface = dynamic(() => import("./WelcomeGlassSurface"), { ssr: false });
const mobileQuery = "(max-width: 960px)";
function subscribe(listener: () => void) {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}
const getSnapshot = () => window.matchMedia(mobileQuery).matches;
const getServerSnapshot = () => false;

export function WelcomeBookingButton({ backdropRef }: { backdropRef: RefObject<HTMLDivElement | null> }) {
  const motionStopped = useMotionStopped();
  const isMobile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <a
      data-press-feedback
      href={BOOKING_URL}
      className={styles.bookingButton}
    >
      <span className={styles.glassSurface} aria-hidden="true">
        {isMobile && !motionStopped && <GlassSurface backdropRef={backdropRef} />}
      </span>
      <span className={styles.bookingFingerprint} aria-hidden="true">
        <FingerprintSVG className={styles.fingerprint} />
      </span>
      <span className={styles.bookingLabel}>Запись</span>
    </a>
  );
}
