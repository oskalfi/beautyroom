import gsap from "gsap";

export const revealMenu = (menuClass: string, menuCoverBlock: string) => {
  const menuRevealAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: `.${menuClass}`,
      start: "70% bottom",
      end: "70% bottom",
    },
  });

  menuRevealAnimation
    .to(`.${menuClass}`, {
      duration: 1,
      ease: "none",
      opacity: 1,
    })
    .to(
      `.${menuCoverBlock}`,
      {
        duration: 3,
        rotate: "-3deg",
        translateY: "100%",
        ease: "none",
      },
      "<",
    );
};
