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
  const { modalType, closeModal, contentId } = useModalStore();
  useEffect(() => {
    if (modalType) {
      dialog.current?.showModal();
      dialog.current?.focus();
    }
    return;
  }, [modalType]);

  const Content = modalType ? ModalTypes[modalType] : null;
  if (!Content || !contentId) return null;
  return (
    <dialog
      ref={dialog}
      id="modal-window"
      className={styles.modalWindow}
      tabIndex={-1}
      onClick={(e) => {
        handleClick(e, closeModal);
      }}
      onCancel={(e) => {
        handleCancel(e, closeModal);
      }}
    >
      <div id="modal-content" className={styles.contentWrapper}>
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
        <Suspense fallback={<div className={styles.suspense}>Загрузка...</div>}>
          <Content id={contentId} />
        </Suspense>
      </div>
    </dialog>
  );
};
