import { useEffect, useRef } from "react";

export function useInterval(callback: () => void, delay: null | number) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }

    return () => {
      /* no-op to make sure we consistently return something */
    };
  }, [delay]);
}
