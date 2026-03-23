export function moveBlockFromBottom(
  movingBlock: HTMLElement,
  movingBlockText: HTMLElement,
): void {
  movingBlock.style.transition = movingBlockText.style.transition =
    "transform 0.6s cubic-bezier(0, 0, 0.2, 1)";
  movingBlock.style.transform = "translateY(0)";
  movingBlockText.style.transform = "translateY(0) translateX(15px)";
}
