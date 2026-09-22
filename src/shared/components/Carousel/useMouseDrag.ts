import { useEffect, type RefObject } from "react";

export function useMouseDrag(
  containerRef: RefObject<HTMLDivElement | null>,
  motionStopped: boolean,
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let drag: { pointerId: number; startX: number; scrollLeft: number; moved: boolean } | null = null;
    let suppressClick = false;
    let settleFrame = 0;
    const stopSettling = () => {
      cancelAnimationFrame(settleFrame);
      settleFrame = 0;
      delete container.dataset.settling;
    };

    const finish = () => {
      const current = drag;
      if (!current) return;
      drag = null;
      if (container.hasPointerCapture(current.pointerId)) {
        container.releasePointerCapture(current.pointerId);
      }
      if (!current.moved) return;

      // Measure before restoring mandatory snap, which may adjust scrollLeft.
      const bounds = container.getBoundingClientRect();
      const center = bounds.left + bounds.width / 2;
      let offset = Infinity;
      for (const child of container.children) {
        const rect = child.getBoundingClientRect();
        const distance = rect.left + rect.width / 2 - center;
        if (Math.abs(distance) < Math.abs(offset)) offset = distance;
      }
      const start = container.scrollLeft;
      const left = start + (Number.isFinite(offset) ? offset : 0);
      // Keep snap disabled throughout the animation so it cannot jump first.
      container.dataset.settling = "true";
      delete container.dataset.dragging;
      if (motionStopped) {
        container.scrollTo({ left, behavior: "instant" });
        stopSettling();
        return;
      }
      const startedAt = performance.now();
      const settle = (now: number) => {
        const progress = Math.min((now - startedAt) / 500, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        container.scrollTo({ left: start + (left - start) * eased, behavior: "instant" });
        if (progress < 1) settleFrame = requestAnimationFrame(settle);
        else stopSettling();
      };
      settleFrame = requestAnimationFrame(settle);
    };

    const down = (event: PointerEvent) => {
      suppressClick = false;
      stopSettling();
      // Hybrid laptops still support mouse dragging; touch/pen stay native.
      if (event.pointerType !== "mouse" || event.button !== 0 || !event.isPrimary) return;
      if (event.target instanceof Element && event.target.closest("a, button, input, select, textarea")) return;
      drag = { pointerId: event.pointerId, startX: event.clientX, scrollLeft: container.scrollLeft, moved: false };
    };

    const move = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      if (!(event.buttons & 1)) { finish(); return; }
      const delta = event.clientX - drag.startX;
      if (!drag.moved) {
        if (Math.abs(delta) < 5) return;
        drag.moved = true;
        suppressClick = true;
        container.dataset.dragging = "true";
        container.setPointerCapture(event.pointerId);
      }
      event.preventDefault();
      container.scrollTo({ left: drag.scrollLeft - delta, behavior: "instant" });
    };

    const up = (event: PointerEvent) => {
      if (drag?.pointerId === event.pointerId) finish();
    };
    const click = (event: MouseEvent) => {
      if (!suppressClick || event.detail === 0) return;
      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    };
    const nativeDrag = (event: DragEvent) => {
      if (drag) event.preventDefault();
    };

    container.addEventListener("wheel", stopSettling, { passive: true });
    container.addEventListener("keydown", stopSettling);
    container.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("blur", finish);
    container.addEventListener("lostpointercapture", up);
    container.addEventListener("click", click, true);
    container.addEventListener("dragstart", nativeDrag);
    return () => {
      stopSettling();
      container.removeEventListener("wheel", stopSettling);
      container.removeEventListener("keydown", stopSettling);
      container.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("blur", finish);
      container.removeEventListener("lostpointercapture", up);
      container.removeEventListener("click", click, true);
      container.removeEventListener("dragstart", nativeDrag);
      if (drag && container.hasPointerCapture(drag.pointerId)) container.releasePointerCapture(drag.pointerId);
      delete container.dataset.dragging;
    };
  }, [containerRef, motionStopped]);
}
