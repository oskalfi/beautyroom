import { moveBlockFromTop } from "./moveBlockFromTop";
import { moveBlockFromBottom } from "./moveBlockFromBottom";
import { moveBlockToBottom } from "./moveBlockToBottom";
import { moveBlockToTop } from "./moveBlockToTop";

import { setStartingPosition } from "./setStartingPosition";
import { isCursorEnteredFromTop } from "../../utils/isCursorEnteredFromTop";

export const animateButtonHover = (
  section: HTMLDivElement | null,
  button: HTMLElement,
  movingBlockClass: string,
  movingTextClass: string,
) => {
  if (!section) return;
  let previousCursorYCoord = 0;
  section.addEventListener("mousemove", (e: MouseEvent) => {
    previousCursorYCoord = e.clientY;
  });
  const movingBlock = button.querySelector(
    `.${movingBlockClass}`,
  ) as HTMLElement;
  const movingBlockText = movingBlock.querySelector(
    `.${movingTextClass}`,
  ) as HTMLElement;
  button.addEventListener("mouseenter", () => {
    if (isCursorEnteredFromTop(button, previousCursorYCoord)) {
      moveBlockFromTop(movingBlock, movingBlockText);
    } else {
      setStartingPosition(movingBlock, movingBlockText);
      moveBlockFromBottom(movingBlock, movingBlockText);
    }
  });

  button.addEventListener("mouseleave", (event: MouseEvent) => {
    if (event.y > previousCursorYCoord) {
      moveBlockToBottom(movingBlock, movingBlockText);
    } else {
      moveBlockToTop(movingBlock, movingBlockText);
    }
  });
};
