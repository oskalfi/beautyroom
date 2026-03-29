import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/src/SplitText";

type introduceSectionAnimProps = {};

export function flowersNTextReveal(
  topFlowerClass: string,
  bottomFlowerClass: string,
  headingTextClass: string,
): void {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(SplitText);
  const heading = SplitText.create(`.${headingTextClass}`, {
    type: "lines chars",
  });

  gsap.from(heading.chars, {
    duration: 1,
    stagger: 0.01,
    autoAlpha: 0,
    y: 70,
    ease: "bounce",
    scrollTrigger: {
      trigger: `.${topFlowerClass}`,
      start: "bottom 99.9%",
      end: "bottom 99.9%",
    },
  });

  gsap.to(`.${topFlowerClass} path`, {
    strokeDashoffset: 0,
    ease: "power1.out",
    scrollTrigger: {
      trigger: `.${topFlowerClass}`,
      start: "center 99.9%",
      end: "center 99.9%",
    },
  });
  gsap.to(`.${bottomFlowerClass} path`, {
    strokeDashoffset: 0,
    ease: "power1.out",
    scrollTrigger: {
      trigger: `.${bottomFlowerClass}`,
      start: "top 99.9%",
      end: "top 99.9%",
    },
  });
}
