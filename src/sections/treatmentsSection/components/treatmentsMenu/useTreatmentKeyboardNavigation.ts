import { useEffect, useRef, type FocusEvent, type KeyboardEvent } from "react";
import itemStyles from "../treatmentsItem/TreatmentItem.module.css";
import { moveBlockFromTop } from "../treatmentsItem/animations/moveBlockFromTop";
import { moveBlockFromBottom } from "../treatmentsItem/animations/moveBlockFromBottom";
import { moveBlockToTop } from "../treatmentsItem/animations/moveBlockToTop";
import { moveBlockToBottom } from "../treatmentsItem/animations/moveBlockToBottom";
import { setStartingPosition } from "../treatmentsItem/animations/setStartingPosition";

type Direction = "up" | "down";

function parts(item: HTMLElement) {
  return {
    block: item.querySelector<HTMLElement>(`.${itemStyles.movingBlock}`),
    text: item.querySelector<HTMLElement>(`.${itemStyles.text}`),
  };
}

export function useTreatmentKeyboardNavigation() {
  const direction = useRef<Direction>("down");
  const keyboardInput = useRef(false);
  const keyboardItem = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Capture Tab before focus moves, including entry from outside the menu.
    const trackTab = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Tab") {
        keyboardInput.current = true;
        direction.current = event.shiftKey ? "up" : "down";
      }
    };
    const releaseKeyboardHighlight = () => {
      keyboardInput.current = false;
      const item = keyboardItem.current;
      keyboardItem.current = null;
      if (!item) return;
      delete item.dataset.focusActive;
      const { block, text } = parts(item);
      if (block && text) {
        (direction.current === "down" ? moveBlockToBottom : moveBlockToTop)(block, text);
      }
    };
    document.addEventListener("keydown", trackTab, true);
    // A touch gesture can leave the link focused. Keep focus for accessibility,
    // but release keyboard ownership so scroll highlighting can resume.
    document.addEventListener("pointerdown", releaseKeyboardHighlight, true);
    window.addEventListener("pagehide", releaseKeyboardHighlight);
    return () => {
      document.removeEventListener("keydown", trackTab, true);
      document.removeEventListener("pointerdown", releaseKeyboardHighlight, true);
      window.removeEventListener("pagehide", releaseKeyboardHighlight);
      releaseKeyboardHighlight();
    };
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    const links = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>("[data-treatment-link]"));
    const index = links.indexOf(event.target as HTMLAnchorElement);
    if (index < 0) return;
    event.preventDefault();
    keyboardInput.current = true;
    direction.current = event.key === "ArrowUp" ? "up" : "down";
    const next = links[index + (direction.current === "up" ? -1 : 1)];
    // Stop at the edges. Tab/Shift+Tab retain normal navigation out of the list.
    if (!next) return;
    next.focus({ preventScroll: true });
    next.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
  };

  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (!keyboardInput.current) return;
    const item = (event.target as HTMLElement).closest<HTMLElement>("[data-treatment-item]");
    if (!item || item.contains(event.relatedTarget as Node | null)) return;
    const { block, text } = parts(item);
    if (!block || !text) return;

    // Keyboard focus takes priority over the touch scroll highlight.
    event.currentTarget.querySelectorAll<HTMLElement>('[data-scroll-active="true"]').forEach((previous) => {
      delete previous.dataset.scrollActive;
      if (previous === item) return;
      const old = parts(previous);
      if (old.block && old.text) {
        (direction.current === "down" ? moveBlockToBottom : moveBlockToTop)(old.block, old.text);
      }
    });
    item.dataset.focusActive = "true";
    keyboardItem.current = item;
    if (direction.current === "up") {
      setStartingPosition(block, text);
      moveBlockFromBottom(block, text);
    } else {
      block.style.transition = text.style.transition = "none";
      moveBlockToTop(block, text);
      block.getBoundingClientRect();
      block.style.removeProperty("transition");
      text.style.removeProperty("transition");
      moveBlockFromTop(block, text);
    }
  };

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    const item = (event.target as HTMLElement).closest<HTMLElement>("[data-treatment-item]");
    if (!item || item.contains(event.relatedTarget as Node | null)) return;
    if (item.dataset.focusActive !== "true") return;
    delete item.dataset.focusActive;
    keyboardItem.current = null;
    const { block, text } = parts(item);
    if (block && text) {
      (direction.current === "down" ? moveBlockToBottom : moveBlockToTop)(block, text);
    }
  };

  return { onKeyDown, onFocus, onBlur };
}
