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

  const title = SplitText.create(titleClass, { type: " lines" });
  const subtitle = SplitText.create(subtitleClass, {
    type: "lines words",
  });

  const timeline = gsap.timeline();
  timeline
    .from(title.lines, {
      duration: 1,
      x: 10,
      autoAlpha: 0,
      stagger: 0.1,
    })
    .from(
      subtitle.lines,
      {
        duration: 1,
        autoAlpha: 0,
        stagger: 0.01,
      },
      "<1",
    )
    .to(
      underlineClipPathClass,
      {
        width: "100%",
        duration: 3,
        ease: "power1.inOut",
      },
      "<",
    );
}
