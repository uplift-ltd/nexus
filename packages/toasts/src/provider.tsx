import React, { useCallback, useMemo, useState } from "react";

import { ToastContext } from "./context.js";
import { ToastDismiss } from "./dismiss.js";
import { AddToast, DismissToast, ToastProviderProps, ToastShape } from "./types.js";

export function ToastProvider({
  children,
  containerComponent: ContainerComponent,
  defaultTimeout = 5000,
  leaveDuration = 0,
  toastComponent: ToastComponent,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastShape[]>([]);

  const addToast = useCallback<AddToast>(
    (toast) => {
      const newToast: ToastShape = {
        ...toast,
        id: Math.floor(Math.random() * 1000000000).toString(),
        leaveDuration,
        timeout: toast.timeout || defaultTimeout,
      };
      setToasts((existingToasts) => [...existingToasts, newToast]);
      return newToast.id;
    },
    [defaultTimeout, leaveDuration]
  );

  const dismissToast = useCallback<DismissToast>((toastId) => {
    setToasts((existingToasts) =>
      existingToasts.filter((exisitingToast) => exisitingToast.id !== toastId)
    );
  }, []);

  const value = useMemo(
    () => ({ addToast, dismissToast, toasts }),
    [toasts, addToast, dismissToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ContainerComponent>
        {toasts.map((toast) => (
          <ToastDismiss
            dismissToast={dismissToast}
            key={toast.id}
            toast={toast}
            toastComponent={ToastComponent}
          />
        ))}
      </ContainerComponent>
    </ToastContext.Provider>
  );
}
