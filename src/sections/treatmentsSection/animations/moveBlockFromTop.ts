export function moveBlockFromTop(
  movingBlock: HTMLElement,
  movingBlockText: HTMLElement,
): void {
  movingBlock.style.transform = "translateY(0)";
  movingBlockText.style.transform = "translateY(0) translateX(15px)";
}
