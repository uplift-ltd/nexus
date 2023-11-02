import { useSafeTimeout } from "@uplift-ltd/use-safe-timeout";
import React, { useCallback, useEffect, useState } from "react";

import { ToastDismissProps } from "./types.js";

export function ToastDismiss({
  dismissToast,
  toast,
  toastComponent: ToastComponent,
}: ToastDismissProps) {
  const [show, setShow] = useState(false);
  const setSafeTimeout = useSafeTimeout();
  const { leaveDuration, timeout } = toast;

  const onRequestClose = useCallback(() => {
    setShow(false);
    if (leaveDuration) {
      setSafeTimeout(() => dismissToast(toast.id), leaveDuration);
    } else {
      dismissToast(toast.id);
    }
  }, [toast, dismissToast, leaveDuration, setSafeTimeout]);

  useEffect(() => {
    setShow(true);
    if (timeout) {
      setSafeTimeout(onRequestClose, timeout);
    }
  }, [timeout, setSafeTimeout, onRequestClose]);

  return <ToastComponent onRequestClose={onRequestClose} show={show} toast={toast} />;
}
