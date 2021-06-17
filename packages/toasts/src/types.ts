import { ComponentType } from "react";

export type ToastTheme = "default" | "success" | "warning" | "danger";

export interface ToastInternalState {
  id: string;
  leaveDuration: number;
}

export interface ToastOptions {
  title: string;
  description?: string;
  theme?: ToastTheme;
  timeout?: number;
}

export type ToastShape = ToastOptions & ToastInternalState;

export type AddToast = (toast: ToastOptions) => ToastShape;
export type DismissToast = (toast: ToastShape) => void;

export interface ToastContextShape {
  toasts: ToastShape[];
  addToast: AddToast;
  dismissToast: DismissToast;
}

export interface ToastProps {
  show: boolean;
  toast: ToastShape;
  onRequestClose: () => void;
}

export interface ToastProviderProps {
  containerComponent: ComponentType<{ children: React.ReactNode }>;
  toastComponent: ComponentType<ToastProps>;
  defaultTimeout?: number;
  leaveDuration?: number;
}

export interface ToastDismissProps {
  toast: ToastShape;
  toastComponent: React.ComponentType<ToastProps>;
  dismissToast: DismissToast;
}
