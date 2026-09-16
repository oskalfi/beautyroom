"use client";
import { useRef, type ComponentProps } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function RevealHeading(props: ComponentProps<"h2">) {
  const ref = useRef<HTMLHeadingElement>(null);
  useGSAP(() => {
    gsap.fromTo(ref.current, { autoAlpha: 0, y: 20 }, {
      autoAlpha: 1, y: 0, duration: 0.8,
      scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
    });
  }, { scope: ref });
  return <h2 {...props} ref={ref} style={{ ...props.style, visibility: "hidden" }} />;
}
