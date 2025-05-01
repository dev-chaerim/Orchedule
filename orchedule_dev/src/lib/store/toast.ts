import { create } from "zustand";

interface ToastPayload {
  message: string;
  type: "success" | "error";
}

interface ToastState {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  showToast: (payload: ToastPayload) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: "",
  type: "success",
  isVisible: false,
  showToast: ({ message, type }) =>
    set({ message, type, isVisible: true }),
  hideToast: () => set({ isVisible: false }),
}));
