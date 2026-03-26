"use client";

import { useRef } from "react";
import styles from "./Modal.module.css";

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
  return (
    <dialog
      ref={dialog}
      id="modal-window"
      className={styles.modalWindow}
      onClick={handleClick}
      onCancel={handleCancel}
    >
      <div className={styles.image} />
      <div className={styles.contentContainer}>
        <header>
          <button
            className={styles.closeButton}
            aria-label="Закрыть"
            onClick={() => animatedClose(dialog.current)}
          >
            ✕
          </button>
        </header>

        <article id="modal-body"></article>

        <footer>
          <button className={styles.submitButton}>Подтвердить</button>
        </footer>
      </div>
    </dialog>
  );
};
