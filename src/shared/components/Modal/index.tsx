"use client";

import { useEffect, useRef } from "react";
import styles from "./Modal.module.css";
import { useModalStore } from "@/shared/store/modalStore";

function animatedClose(dialog: HTMLDialogElement | null) {
  if (!dialog) return;
  dialog.classList.add(styles.closingModal);
  setTimeout(() => {
    dialog.classList.remove(styles.closingModal);
    dialog.close();
  }, 500);
}

function handleClick(e: React.MouseEvent<HTMLDialogElement>) {
  if (e.target === e.currentTarget) animatedClose(e.currentTarget);
}

function handleCancel(e: React.SyntheticEvent<HTMLDialogElement>) {
  e.preventDefault();
  animatedClose(e.currentTarget);
}

export const Modal = () => {
  const dialog = useRef<null | HTMLDialogElement>(null);
  const { isOpen, modalType, closeModal } = useModalStore();
  useEffect(() => {
    if (isOpen) dialog.current?.showModal();
    console.log(isOpen);
    return;
  }, [isOpen]);

  return (
    <dialog
      ref={dialog}
      id="modal-window"
      className={styles.modalWindow}
      onClick={(e) => {
        closeModal();
        handleClick(e);
      }}
      onCancel={(e) => {
        closeModal();
        handleCancel(e);
      }}
    >
      <div id="modal-content" className={styles.modalContent}>
        <button
          className={styles.closeButton}
          aria-label="Закрыть"
          onClick={(e) => {
            e.stopPropagation();
            closeModal();
            animatedClose(dialog.current);
          }}
        >
          ✕
        </button>
      </div>
    </dialog>
  );
};
