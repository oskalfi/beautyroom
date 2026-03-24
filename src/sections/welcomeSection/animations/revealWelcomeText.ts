import gsap from "gsap";
import SplitText from "gsap/src/SplitText";

type revealWelcomeTextProps = {
  titleClass: string;
  subtitleClass: string;
  underlineClipPathClass: string;
};

export function revealWelcomeText({
  titleClass,
  subtitleClass,
  underlineClipPathClass,
}: revealWelcomeTextProps): void {
  gsap.registerPlugin(SplitText);

  const title = SplitText.create(titleClass, { type: " lines chars" });
  const subtitle = SplitText.create(subtitleClass, {
    type: "lines chars",
  });

  const timeline = gsap.timeline();
  timeline
    .from(title.lines, {
      duration: 1,
      y: -20, // animate from 100px below
      autoAlpha: 0, // fade in from opacity: 0 and visibility: hidden
      stagger: 0.1, // 0.05 seconds between each
    })
    .from(
      subtitle.lines,
      {
        duration: 0.5,

        autoAlpha: 0,
        stagger: 0.01,
      },
      "<0.5",
    )
    .to(underlineClipPathClass, {
      width: "100%",
      duration: 3,
      ease: "power1.inOut",
    });
}
