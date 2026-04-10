import gsap from "gsap";
import ScrollTrigger from "gsap/src/ScrollTrigger";
import SplitText from "gsap/src/SplitText";

export const revealTextAndSVG = (
  textClassName: string,
  topSVGClassName: string,
  bottomSVGClassName: string,
) => {
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: `.${textClassName}`,
      start: "bottom 99.9%",
      end: "bottom 99.9%",
    },
  });

  const text = SplitText.create(`.${textClassName}`, {
    type: "lines chars",
  });

  timeline
    .from(text.chars, {
      duration: 1,
      autoAlpha: 0,
      stagger: 0.01,
      y: 100,
      ease: "back.out",
    })
    .from(
      `.${topSVGClassName} path`,
      {
        strokeDashoffset: -3000,
        ease: "power1.out",
        duration: 3,
      },
      "<0.3",
    )
    .from(
      `.${bottomSVGClassName} path`,
      {
        strokeDashoffset: -3000,
        ease: "power1.out",
        duration: 3,
      },
      "<",
    );
};
