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
}: collapseHeaderProps) {
  gsap.registerPlugin(ScrollTrigger);
  const scroll = gsap.timeline({ paused: true });

  scroll
    .to(silhouettePathClass, {
      strokeDashoffset: -1082,
    })
    .to(
      headerContentContainerClass,
      {
        scale: 0.9,
        height: "80px",
        ease: "sine.inOut",
        duration: 1,
        delay: 0.5,
      },
      "<",
    )
    .to(
      logoTextClass,
      {
        bottom: "5px",
        duration: 0.5,
        delay: 0.5,
      },
      "<",
    );

  ScrollTrigger.create({
    start: () => `${window.innerHeight * 0.5} top`,
    onEnter: () => scroll.play(),
    onLeaveBack: () => scroll.reverse(),
  });
}
