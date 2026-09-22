"use client";

import { useEffect } from "react";

/** One click event covers mouse, tap-to-click, touch and keyboard activation. */
export const PressFeedback = () => {
  useEffect(() => {
    const animations = new Map<HTMLElement, Animation>();

    const handleClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>("[data-press-feedback]");
      if (!target || target.matches(":disabled, [aria-disabled='true']"))
        return;

      const motionSetting = document.documentElement.dataset.a11yMotion;
      if (
        motionSetting === "true" ||
        (motionSetting !== "false" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      )
        return;

      animations.get(target)?.cancel();
      const animation = target.animate(
        [{ scale: 1 }, { scale: 0.97, offset: 0.35 }, { scale: 1 }],
        { duration: 240, easing: "ease-out" },
      );
      animations.set(target, animation);
      const release = () => {
        if (animations.get(target) === animation) animations.delete(target);
      };
      animation.onfinish = release;
      animation.oncancel = release;
    };

    // Capture runs before navigation handlers, including links inside dialogs.
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };
  }, []);

  return null;
};
