"use client";

import { Suspense, useEffect, useRef } from "react";
import styles from "./Modal.module.css";
import { useModalStore } from "@/shared/store/modalStore";
import { ModalTypes } from "./modalTypes";

function animatedClose(dialog: HTMLDialogElement | null, closeModal: Function) {
  if (!dialog) return;
  dialog.classList.add(styles.closingModal);
  setTimeout(() => {
    dialog.classList.remove(styles.closingModal);
    dialog.close();
    closeModal();
  }, 500);
}

function handleClick(
  e: React.MouseEvent<HTMLDialogElement>,
  closeModal: Function,
) {
  if (e.target === e.currentTarget) {
    animatedClose(e.currentTarget, closeModal);
    return true;
  }
  return false;
}

function handleCancel(
  e: React.SyntheticEvent<HTMLDialogElement>,
  closeModal: Function,
) {
  e.preventDefault();
  animatedClose(e.currentTarget, closeModal);
}

export const Modal = () => {
  const dialog = useRef<null | HTMLDialogElement>(null);
  const { isOpen, modalType, closeModal } = useModalStore();
  useEffect(() => {
    if (isOpen) {
      dialog.current?.showModal();
    }
    return;
  }, [isOpen, modalType]);

  const Content = ModalTypes[modalType.type];
  return (
    Content && (
      <dialog
        ref={dialog}
        id="modal-window"
        className={styles.modalWindow}
        onClick={(e) => {
          handleClick(e, closeModal);
        }}
        onCancel={(e) => {
          handleCancel(e, closeModal);
        }}
      >
        <div id="modal-content" className={styles.modalContent}>
          <button
            className={styles.closeButton}
            aria-label="Закрыть"
            onClick={(e) => {
              e.stopPropagation();
              animatedClose(dialog.current, closeModal);
            }}
          >
            ✕
          </button>
          <Suspense
            fallback={<div className={styles.suspense}>Загрузка...</div>}
          >
            <Content />
          </Suspense>
        </div>
      </dialog>
    )
  );
};
