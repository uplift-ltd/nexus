import { useCallback, useEffect, useRef } from "react";

export function useSafeTimeout() {
  const timeoutIds = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timeoutIds.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      timeoutIds.current = [];
    };
  }, []);

  const startTimeout = useCallback((callback: () => void, ms = 0) => {
    const timeoutId = window.setTimeout(callback, ms);

    timeoutIds.current = [...timeoutIds.current, timeoutId];

    const cancelTimeout = () => {
      if (timeoutIds.current.includes(timeoutId)) {
        window.clearTimeout(timeoutId);
        timeoutIds.current = timeoutIds.current.filter((id) => id !== timeoutId);
      }
    };

    return cancelTimeout;
  }, []);

  return startTimeout;
}
