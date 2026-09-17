"use client";

import styles from "./TreatmentsSection.module.css";

import { revealHeading } from "./animations/revealHeading";
import { useEffect, useRef } from "react";
import itemStyles from "./components/treatmentsItem/TreatmentItem.module.css";
import { moveBlockFromTop } from "./components/treatmentsItem/animations/moveBlockFromTop";
import { moveBlockFromBottom } from "./components/treatmentsItem/animations/moveBlockFromBottom";
import { moveBlockToTop } from "./components/treatmentsItem/animations/moveBlockToTop";
import { moveBlockToBottom } from "./components/treatmentsItem/animations/moveBlockToBottom";
import { setStartingPosition } from "./components/treatmentsItem/animations/setStartingPosition";
import { useGSAP } from "@gsap/react";
import { TreatmentsMenu } from "./components/treatmentsMenu";
import { mockTreatments as mockData } from "@/shared/mocks/treatments";
export let previousCursorYCoord = 0;

export const TreatmentsSection = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      revealHeading(styles.heading, styles.decorativeDescription);

      const section = ref.current;
      const trackCursor = (e: MouseEvent) => {
        previousCursorYCoord = e.clientY;
      };
      section?.addEventListener("mousemove", trackCursor);
      return () => section?.removeEventListener("mousemove", trackCursor);
    },
    { scope: ref },
  );

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const touch = window.matchMedia("(any-pointer: coarse)");
    let stopObserving = () => {};

    const configure = () => {
      stopObserving();
      if (!touch.matches && navigator.maxTouchPoints === 0) return;

      const items = Array.from(section.querySelectorAll<HTMLElement>("[data-treatment-item]"));
      let active: HTMLElement | undefined;
      let lastScrollY = window.scrollY;
      let direction: "down" | "up" = "down";
      let observer: IntersectionObserver;

      const parts = (item: HTMLElement) => ({
        block: item.querySelector<HTMLElement>(`.${itemStyles.movingBlock}`),
        text: item.querySelector<HTMLElement>(`.${itemStyles.text}`),
      });
      const trackScroll = () => {
        const nextY = window.scrollY;
        if (nextY !== lastScrollY) direction = nextY > lastScrollY ? "down" : "up";
        lastScrollY = nextY;
      };
      const updateActive = () => {
        // External keyboards on touch devices must not fight scroll activation.
        if (section.querySelector('[data-focus-active="true"] [data-treatment-link]:focus')) {
          active = undefined;
          return;
        }
        trackScroll();
        const viewport = window.visualViewport;
        const center = viewport
          ? viewport.offsetTop + viewport.height / 2
          : document.documentElement.clientHeight / 2;
        // A half-open interval selects exactly one row even at a shared edge.
        const next = items.find((item) => {
          const rect = item.getBoundingClientRect();
          return rect.top <= center && rect.bottom > center;
        });
        if (next === active) return;
        if (active) {
          const { block, text } = parts(active);
          if (block && text) {
            (direction === "down" ? moveBlockToBottom : moveBlockToTop)(block, text);
          }
          delete active.dataset.scrollActive;
        }
        active = next;
        if (!active) return;
        const { block, text } = parts(active);
        if (!block || !text) return;
        active.dataset.scrollActive = "true";
        if (direction === "down") {
          // Reset without a transition so re-entry always starts above the row.
          block.style.transition = text.style.transition = "none";
          moveBlockToTop(block, text);
          block.getBoundingClientRect();
          block.style.removeProperty("transition");
          text.style.removeProperty("transition");
          moveBlockFromTop(block, text);
        } else {
          setStartingPosition(block, text);
          moveBlockFromBottom(block, text);
        }
      };
      const observeCenter = () => {
        observer?.disconnect();
        const height = document.documentElement.clientHeight;
        // Pixel margins avoid vertical percentage margins resolving against width.
        const viewport = window.visualViewport;
        const center = viewport
          ? viewport.offsetTop + viewport.height / 2
          : height / 2;
        const topInset = Math.max(0, center - 1);
        const bottomInset = Math.max(0, height - center - 1);
        observer = new IntersectionObserver(updateActive, {
          rootMargin: `-${topInset}px 0px -${bottomInset}px 0px`,
          threshold: [0, 0.01],
        });
        items.forEach((item) => observer.observe(item));
        updateActive();
      };
      let focusFrame = 0;
      const syncAfterFocus = () => {
        cancelAnimationFrame(focusFrame);
        focusFrame = requestAnimationFrame(updateActive);
      };
      section.addEventListener("focusin", syncAfterFocus);
      section.addEventListener("focusout", syncAfterFocus);
      document.addEventListener("pointerdown", syncAfterFocus);
      // Back/forward cache may restore the old DOM and focused link without mounting.
      window.addEventListener("pageshow", observeCenter);
      window.addEventListener("scroll", trackScroll, { passive: true });
      window.addEventListener("resize", observeCenter);
      window.visualViewport?.addEventListener("resize", observeCenter);
      window.visualViewport?.addEventListener("scroll", observeCenter);
      observeCenter();

      stopObserving = () => {
        cancelAnimationFrame(focusFrame);
        section.removeEventListener("focusin", syncAfterFocus);
        section.removeEventListener("focusout", syncAfterFocus);
        document.removeEventListener("pointerdown", syncAfterFocus);
        window.removeEventListener("pageshow", observeCenter);
        observer.disconnect();
        window.removeEventListener("scroll", trackScroll);
        window.removeEventListener("resize", observeCenter);
        window.visualViewport?.removeEventListener("resize", observeCenter);
        window.visualViewport?.removeEventListener("scroll", observeCenter);
        items.forEach((item) => {
          delete item.dataset.scrollActive;
          const { block, text } = parts(item);
          [block, text].forEach((element) => {
            element?.style.removeProperty("transform");
            element?.style.removeProperty("transition");
          });
        });
      };
    };
    configure();
    touch.addEventListener("change", configure);
    return () => {
      stopObserving();
      touch.removeEventListener("change", configure);
    };
  }, []);

  return (
    <section className={styles.treatmentsSection} ref={ref} id="treatmentsList">
      <div className={styles.decorativeDescription}>
        During your consultation, we’ll create a personalized care plan.
      </div>
      <h2 className={styles.heading}>Treatments</h2>
      <TreatmentsMenu data={mockData} />
    </section>
  );
};
