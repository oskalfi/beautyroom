"use client";
import { useEffect, useState, type RefObject } from "react";

// Prepare media about one viewport ahead, including on reverse scroll.
export function useNearViewport(ref: RefObject<Element | null>, once = true, rootMargin = "1000px 0px") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setNear(entry.isIntersecting);
      if (once && entry.isIntersecting) observer.disconnect();
    }, { rootMargin });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, once, rootMargin]);
  return near;
}
