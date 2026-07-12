import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function enableScrollParallax(backgroundImageClass: string): void {
  gsap.registerPlugin(ScrollTrigger);
  gsap.to(backgroundImageClass, {
    yPercent: 32,
    ease: "none",
    scrollTrigger: {
      trigger: backgroundImageClass,
      start: "top top",
      end: "bottom top",
      scrub: 0.5,
      invalidateOnRefresh: true,
    },
  });
}
