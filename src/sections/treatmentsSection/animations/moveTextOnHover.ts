export function moveTextOnHover(linkText: HTMLElement): void {
  linkText.style.transform = "translateX(0px)";
  linkText.style.transition = "transform 0.2s cubic-bezier(0, 0, 0.2, 1)";
  linkText.style.transform = "translateX(15px)";
}
