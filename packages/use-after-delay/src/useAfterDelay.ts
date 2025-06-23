import { useEffect, useState } from "react";

export const useAfterDelay = (delayMs?: number) => {
  const [pastDelay, setPastDelay] = useState(!delayMs);

  // set a timeout on mount to delay showing the loader. By setting delayMs to
  // a number greater than 0 we can reduce the number of flashes and only show
  // the loader when waiting a long time. Studies show that a loader that flashes
  // for just a split second will make the app feel slower than not showing a loader
  // during a very small wait
  useEffect(() => {
    if (delayMs) {
      const timeoutId = setTimeout(() => {
        setPastDelay(true);
      }, delayMs);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [delayMs]);

  return pastDelay;
};
