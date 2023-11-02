import { useEffect, useRef } from "react";

export interface UseOnPageScrollParams {
  onScrollDown: ([newYPosition, lastYPosition]: [number, number]) => void;
  onScrollUp: ([newYPosition, lastYPosition]: [number, number]) => void;
}

export const useOnPageScroll = ({ onScrollDown, onScrollUp }: UseOnPageScrollParams) => {
  const lastYPosition = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const scrollHandler = () => {
      if (ticking.current) return;

      ticking.current = true;
      window.requestAnimationFrame(() => {
        const newYPosition = window.scrollY;

        if (lastYPosition.current > newYPosition) {
          onScrollUp?.([newYPosition, lastYPosition.current]);
        } else if (lastYPosition.current < newYPosition) {
          onScrollDown?.([newYPosition, lastYPosition.current]);
        }

        lastYPosition.current = newYPosition;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [onScrollDown, onScrollUp]);
};
