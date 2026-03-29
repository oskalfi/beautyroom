import { create } from "zustand";

type modalType = { type: "none" } | { type: "TREATMENT"; treatmentId: string };

interface modalStore {
  isOpen: boolean;
  modalType: modalType;
  openModal: (type: modalType) => void;
  closeModal: () => void;
}

export const useModalStore = create<modalStore>((set) => ({
  isOpen: false,
  modalType: { type: "none" },
  openModal: (type: modalType) => {
    set({ isOpen: true, modalType: type });
  },
  closeModal: () => {
    set({ isOpen: false, modalType: { type: "none" } });
  },
}));
