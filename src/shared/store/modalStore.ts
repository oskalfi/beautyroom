import { create } from "zustand";

type modalType = null | "TREATMENT";

interface modalStore {
  isOpen: boolean;
  modalType: modalType;
  contentId: number | undefined;
  openModal: (type: modalType, contentId: number) => void;
  closeModal: () => void;
}

export const useModalStore = create<modalStore>((set) => ({
  isOpen: false,
  modalType: null,
  contentId: undefined,
  openModal: (type: modalType, contentId) => {
    set({ isOpen: true, modalType: type, contentId: contentId });
  },
  closeModal: () => {
    set({ isOpen: false, modalType: null });
  },
}));
