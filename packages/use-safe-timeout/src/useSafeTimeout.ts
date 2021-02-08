import { useEffect, useRef } from "react";

export function useSafeTimeout() {
  const timeoutIds = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timeoutIds.current.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      timeoutIds.current = [];
    };
  }, []);

  const startTimeout = (callback: () => void, ms = 0) => {
    const timeoutId = setTimeout(callback, ms);

    timeoutIds.current = [...timeoutIds.current, timeoutId];

    const cancelTimeout = () => {
      if (timeoutIds.current.includes(timeoutId)) {
        clearTimeout(timeoutId);
        timeoutIds.current = timeoutIds.current.filter((id) => id !== timeoutId);
      }
    };

    return cancelTimeout;
  };

  return startTimeout;
}
