"use client";

import { Suspense, useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import styles from "./Modal.module.css";

export const Modal = ({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  useLayoutEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!element.open) element.showModal();

    return () => {
      if (closeTimer.current !== null) clearTimeout(closeTimer.current);
      closeTimer.current = null;
      element.close();
    };
  }, []);

  const close = () => {
    const element = dialog.current;
    if (!element || closeTimer.current !== null) return;
    element.classList.add(styles.closingModal);
    closeTimer.current = setTimeout(() => {
      router.back();
    }, 500);
  };

  return (
    <dialog
      ref={dialog}
      id="modal-window"
      className={styles.modalWindow}
      tabIndex={-1}
      aria-label={label}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          close();
      }}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <div id="modal-content" className={styles.contentWrapper}>
        <button
          data-press-feedback
          className={styles.closeButton}
          aria-label="Закрыть"
          onClick={close}
        >
          ✕
        </button>
        <Suspense fallback={<div className={styles.suspense}>Загрузка...</div>}>
          {children}
        </Suspense>
      </div>
    </dialog>
  );
};
