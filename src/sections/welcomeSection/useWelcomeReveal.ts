"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useAccessibility, useMotionStopped } from "@/shared/components/Accessibility/store";
import { loadElementFont } from "@/shared/utils/loadElementFont";
import styles from "./WelcomeSection.module.css";

const warmedKey = "beauty-room:welcome-reveal-warmed:v1";
const loadAnimation = () => import("./animations/revealWelcomeText");

function wasWarmed() {
  try { return localStorage.getItem(warmedKey) === "1"; }
  catch { return false; }
}

export function useWelcomeReveal(section: RefObject<HTMLElement | null>) {
  const stopped = useMotionStopped();
  // Keep the initial decision across Strict Mode effect replays and preference changes.
  const returning = useRef<boolean | undefined>(undefined);
  const played = useRef(false);

  useEffect(() => {
    returning.current ??= wasWarmed();
    let cancelled = false;
    let revert: (() => void) | undefined;
    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const motionStopped = () => useAccessibility.getState().motion ??
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const prepare = async () => {
      try {
        const animation = await loadAnimation();
        if (cancelled) return;
        // This is a readiness marker, not a replacement for the HTTP cache.
        try { localStorage.setItem(warmedKey, "1"); } catch { /* Storage may be disabled. */ }
        if (!returning.current || stopped || motionStopped() || played.current) return;

        const title = section.current?.querySelector<HTMLElement>("h1");
        const subtitle = section.current?.querySelector<HTMLElement>(`.${styles.address}`);
        const underline = section.current?.querySelector<SVGElement>(`.${styles.clip}`);
        if (!title || !subtitle || !underline) return;
        await Promise.all([loadElementFont(title), loadElementFont(subtitle)]);
        if (cancelled || motionStopped()) return;
        revert = animation.revealWelcomeText(title, subtitle, underline);
        played.current = true;
      } catch {
        // A missing chunk/font must never hide the server-rendered content.
      }
    };

    const warmInBackground = () => {
      if ("requestIdleCallback" in window) {
        idle = window.requestIdleCallback(() => { void prepare(); }, { timeout: 5000 });
      } else {
        timer = setTimeout(() => { void prepare(); }, 1500);
      }
    };

    if (returning.current) void prepare();
    else if (document.readyState === "complete") warmInBackground();
    else window.addEventListener("load", warmInBackground, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", warmInBackground);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      clearTimeout(timer);
      revert?.();
    };
  }, [section, stopped]);
}
