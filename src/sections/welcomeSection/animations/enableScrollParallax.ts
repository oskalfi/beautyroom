import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function enableScrollParallax(backgroundImageClass: string): void {
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    gsap.to(backgroundImageClass, {
      yPercent: 32,
      ease: "none",
      scrollTrigger: {
        trigger: backgroundImageClass,
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  });
}
