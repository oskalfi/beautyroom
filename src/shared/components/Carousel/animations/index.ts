import { RefObject } from "react";
import gsap from "gsap";

export const animateAppearance = (
  mediaContainer: RefObject<HTMLDivElement | null>,
  activeIndex: number,
) => {
  const container = mediaContainer.current;
  if (!container) return;

  const middleItem = container.children[activeIndex];
  middleItem.scrollIntoView({
    inline: "center",
    block: "nearest",
  });

  const items = Array.from(container.children);
  const scrollTrigger = {
    trigger: container,
    start: "25% bottom",
    once: true,
  };

  const tl = gsap.timeline({
    scrollTrigger,
    defaults: {
      ease: "power2.out",
    },
  });

  tl.from(items, {
    yPercent: 10,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
  });

  gsap.to(container, {
    opacity: 1,
    duration: 0.5,
    scrollTrigger,
  });
};
