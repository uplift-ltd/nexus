import { useSafeTimeout } from "@uplift-ltd/use-safe-timeout";
import React, { useCallback, useEffect, useState } from "react";
import { ToastDismissProps } from "./types";

export const ToastDismiss: React.FC<ToastDismissProps> = ({
  toast,
  toastComponent: ToastComponent,
  dismissToast,
}) => {
  const [show, setShow] = useState(false);
  const setSafeTimeout = useSafeTimeout();
  const { leaveDuration, timeout } = toast;

  const onRequestClose = useCallback(() => {
    setShow(false);
    if (leaveDuration) {
      setSafeTimeout(() => dismissToast(toast), leaveDuration);
    } else {
      dismissToast(toast);
    }
  }, [toast, dismissToast, leaveDuration, setSafeTimeout]);

  useEffect(() => {
    setShow(true);
    if (timeout) {
      setSafeTimeout(onRequestClose, timeout);
    }
  }, [timeout, setSafeTimeout, onRequestClose]);

  return <ToastComponent show={show} toast={toast} onRequestClose={onRequestClose} />;
};
