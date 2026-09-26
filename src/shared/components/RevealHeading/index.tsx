"use client";
import { useNearViewport } from "@/shared/hooks/useNearViewport";
import { useRef, type ComponentProps } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function RevealHeading(props: ComponentProps<"h2">) {
  const ref = useRef<HTMLHeadingElement>(null);
  const near = useNearViewport(ref, true, "200px 0px");
  useGSAP(() => {
    if (!near) return;
    gsap.fromTo(ref.current, { autoAlpha: 0, y: 20 }, {
      autoAlpha: 1, y: 0, duration: 0.8,
      scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
    });
  }, { scope: ref, dependencies: [near], revertOnUpdate: true });
  return <h2 {...props} ref={ref} style={{ ...props.style, visibility: "hidden" }} />;
}
