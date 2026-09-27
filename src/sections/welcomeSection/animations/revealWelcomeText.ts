import gsap from "gsap";
import SplitText from "gsap/SplitText";

export function revealWelcomeText(title: HTMLElement, subtitle: HTMLElement, underline: SVGElement) {
  gsap.registerPlugin(SplitText);
  const context = gsap.context(() => {
    const heading = SplitText.create(title, { type: "lines" });
    const address = SplitText.create(subtitle, { type: "lines words" });
    // SplitText may clone nested markup while wrapping lines.
    const mask = subtitle.querySelector<SVGElement>("clipPath rect") ?? underline;
    gsap.timeline()
      .from(heading.lines, { duration: 1, x: 10, autoAlpha: 0, stagger: 0.1 })
      .from(address.lines, { duration: 1, autoAlpha: 0, stagger: 0.01 }, "<0.8")
      .fromTo(mask, { width: 0 }, { width: "100%", duration: 3, ease: "power1.inOut" }, "<");
  });
  return () => context.revert();
}
