import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function enableScrollParallax(backgroundImageClass: string): void {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.normalizeScroll(true);
  gsap.to(backgroundImageClass, {
    yPercent: 80,
    ease: "none",
    scrollTrigger: {
      trigger: backgroundImageClass,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
}
