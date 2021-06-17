import React, { useCallback, useMemo, useState } from "react";
import { ToastContext } from "./context";
import { ToastDismiss } from "./dismiss";
import { AddToast, DismissToast, ToastProviderProps, ToastShape } from "./types";

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  containerComponent: ContainerComponent,
  toastComponent: ToastComponent,
  defaultTimeout = 5000,
  leaveDuration = 0,
}) => {
  const [toasts, setToasts] = useState<ToastShape[]>([]);

  const addToast = useCallback<AddToast>(
    (toast) => {
      const newToast: ToastShape = {
        ...toast,
        timeout: toast.timeout || defaultTimeout,
        leaveDuration,
        id: Math.floor(Math.random() * 1000000000).toString(),
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

  const value = useMemo(() => ({ toasts, addToast, dismissToast }), [
    toasts,
    addToast,
    dismissToast,
  ]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ContainerComponent>
        {toasts.map((toast) => (
          <ToastDismiss
            key={toast.id}
            toast={toast}
            toastComponent={ToastComponent}
            dismissToast={dismissToast}
          />
        ))}
      </ContainerComponent>
    </ToastContext.Provider>
  );
};
