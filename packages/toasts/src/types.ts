import { ComponentType } from "react";

export type ToastTheme = "danger" | "default" | "success" | "warning";

export interface ToastInternalState {
  id: string;
  leaveDuration: number;
}

export interface ToastOptions {
  description?: string;
  theme?: ToastTheme;
  timeout?: number;
  title: string;
}

export type ToastShape = ToastOptions & ToastInternalState;

export type AddToast = (toast: ToastOptions) => ToastShape["id"];
export type DismissToast = (toastId: ToastShape["id"]) => void;

export interface ToastContextShape {
  addToast: AddToast;
  dismissToast: DismissToast;
  toasts: ToastShape[];
}

export interface ToastProps {
  onRequestClose: () => void;
  show: boolean;
  toast: ToastShape;
}

export interface ToastProviderProps {
  children: React.ReactNode | React.ReactNode[];
  containerComponent: ComponentType<{ children: React.ReactNode }>;
  defaultTimeout?: number;
  leaveDuration?: number;
  toastComponent: ComponentType<ToastProps>;
}

export interface ToastDismissProps {
  dismissToast: DismissToast;
  toast: ToastShape;
  toastComponent: React.ComponentType<ToastProps>;
}
