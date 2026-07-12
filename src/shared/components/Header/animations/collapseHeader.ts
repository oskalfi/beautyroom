import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type collapseHeaderProps = {
  silhouettePathClass: string;
  logoTextClass: string;
  headerContentContainerClass: string;
};

export function collapseHeader({
  silhouettePathClass,
  logoTextClass,
  headerContentContainerClass,
}: collapseHeaderProps): void {
  gsap.registerPlugin(ScrollTrigger);
  const scroll = gsap.timeline({ paused: true });

  scroll.to(silhouettePathClass, {
    strokeDashoffset: 1082,
  });

  ScrollTrigger.create({
    start: () => `${window.innerHeight * 0.5} top`,
    onEnter: () => scroll.play(),
    onLeaveBack: () => scroll.reverse(),
  });
}
