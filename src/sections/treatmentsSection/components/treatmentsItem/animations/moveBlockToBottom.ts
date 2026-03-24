export function moveBlockToBottom(
  movingBlock: HTMLElement,
  movingBlockText: HTMLElement,
): void {
  movingBlock.style.transform = "translateY(100%)";
  movingBlockText.style.transform = "translateY(-100%) translateX(0)";
}
