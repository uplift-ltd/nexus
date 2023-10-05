import { createContext } from "react";
import { ToastContextShape } from "./types.js";

export const ToastContext = createContext<ToastContextShape>({
  addToast: () => {
    // noop
    return "";
  },
  dismissToast: () => {
    // noop
  },
  toasts: [],
});
