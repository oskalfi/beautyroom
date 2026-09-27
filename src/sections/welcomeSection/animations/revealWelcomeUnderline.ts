import gsap from "gsap";

export function revealWelcomeUnderline(mask: SVGElement) {
  const context = gsap.context(() => {
    gsap
      .timeline()
      .to(mask, { width: "100%", duration: 3, ease: "power1.inOut" }, "<");
  });
  return () => context.revert();
}
