"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PageLoader } from "@/shared/components/PageLoader";

function ScreenLoadingState() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let started = performance.now();
    let finished = false;
    let slowReported = false;
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    function check() {
      if (cancelled) return;
      clearTimeout(timer);
      const content = document.querySelector("[data-page-content]");
      const main = content?.querySelector("main");
      const images = Array.from(main?.querySelectorAll("img") ?? []).filter(image => {
        const rect = image.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
      });
      const pending = !main || !!content?.querySelector("[data-page-loading]") ||
        !!main.querySelector('[data-first-screen-ready="false"]') ||
        document.fonts.status === "loading" ||
        images.some(image => !image.currentSrc || !image.complete);

      if (!pending) {
        finished = true;
        slowReported = false;
        window.dispatchEvent(new Event("beauty:screen-ready"));
        setVisible(false);
        return;
      }
      if (finished) {
        started = performance.now();
        finished = false;
      }
      if (!slowReported && performance.now() - started >= 15000) {
        slowReported = true;
        window.dispatchEvent(new Event("beauty:screen-slow"));
      }
      if (performance.now() - started >= 1000) setVisible(true);
      timer = setTimeout(check, 100);
    }

    // Let the new page mount and request its visible images/fonts first.
    const frame = requestAnimationFrame(check);
    const observer = new MutationObserver(() => { if (finished) check(); });
    const content = document.querySelector("[data-page-content]");
    if (content) observer.observe(content, {
      childList: true, subtree: true, attributes: true,
      attributeFilter: ["src", "srcset", "data-first-screen-ready"],
    });
    document.fonts.addEventListener("loading", check);
    return () => {
      cancelled = true;
      observer.disconnect();
      document.fonts.removeEventListener("loading", check);
      window.dispatchEvent(new Event("beauty:screen-ready"));
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, []);

  return visible ? <PageLoader delayed={false} /> : null;
}

export function FirstScreenLoader() {
  const pathname = usePathname();
  return <ScreenLoadingState key={pathname} />;
}
