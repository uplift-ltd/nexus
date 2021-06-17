import { createContext } from "react";
import { ToastContextShape } from "./types";

export const ToastContext = createContext<ToastContextShape>({
  toasts: [],
  addToast: () => {
    // noop
    return { id: "", title: "", leaveDuration: 0 };
  },
  dismissToast: () => {
    // noop
  },
});
