import { create } from "zustand";

type SnackbarSeverity = "success" | "error" | "info";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
  showSnackbar: (message: string, severity?: SnackbarSeverity) => void;
  closeSnackbar: () => void;
}

export const useSnackbarStore = create<SnackbarState>((set) => ({
  open: false,
  message: "Action completed",
  severity: "success",
  showSnackbar: (message, severity = "success") =>
    set({ open: true, message, severity }),
  closeSnackbar: () => set({ open: false }),
}));
