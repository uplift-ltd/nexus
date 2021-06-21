import { useContext } from "react";
import { ToastContext } from "./context";

export const useToasts = () => {
  const { addToast, dismissToast } = useContext(ToastContext);
  return { addToast, dismissToast };
};
