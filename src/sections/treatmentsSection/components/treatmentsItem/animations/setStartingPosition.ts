export function setStartingPosition(
  movingBlock: HTMLElement,
  movingBlockText: HTMLElement,
): void {
  movingBlock.style.transition = "none";
  movingBlock.style.transform = "translateY(100%)";
  movingBlock.getBoundingClientRect();

  movingBlockText.style.transition = "none";
  movingBlockText.style.transform = "translateY(-100%)";
  movingBlockText.getBoundingClientRect();
}
