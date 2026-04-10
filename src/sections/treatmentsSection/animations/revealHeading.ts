import gsap from "gsap";
import SplitText from "gsap/src/SplitText";

export const revealHeading = (
  headingClass: string,
  descriptionClass: string,
) => {
  const heading = SplitText.create(`.${headingClass}`, { type: "chars" });
  const decorativeDescription = SplitText.create(`.${descriptionClass}`, {
    type: "words",
  });

  const headingRevealAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: `.${headingClass}`,
      start: "bottom bottom",
      end: "bottom bottom",
    },
  });

  headingRevealAnimation
    .from(heading.chars, {
      autoAlpha: 0,
      duration: 1,
      stagger: 0.05,
      x: -20,
      ease: "power3",
    })
    .from(decorativeDescription.words, {
      opacity: 0,
      duration: 2,
      stagger: 0.05,
    });
};
