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

  useEffect(() => {
    // Capture Tab before focus moves, including entry from outside the menu.
    const trackTab = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Tab") direction.current = event.shiftKey ? "up" : "down";
    };
    document.addEventListener("keydown", trackTab, true);
    return () => document.removeEventListener("keydown", trackTab, true);
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    const links = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>("[data-treatment-link]"));
    const index = links.indexOf(event.target as HTMLAnchorElement);
    if (index < 0) return;
    event.preventDefault();
    direction.current = event.key === "ArrowUp" ? "up" : "down";
    const next = links[index + (direction.current === "up" ? -1 : 1)];
    // Stop at the edges. Tab/Shift+Tab retain normal navigation out of the list.
    if (!next) return;
    next.focus({ preventScroll: true });
    next.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
  };

  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
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
    delete item.dataset.focusActive;
    const { block, text } = parts(item);
    if (block && text) {
      (direction.current === "down" ? moveBlockToBottom : moveBlockToTop)(block, text);
    }
  };

  return { onKeyDown, onFocus, onBlur };
}
