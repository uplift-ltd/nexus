import { useRouter } from "next/router";
import type { NextRouter } from "next/router";
import { useRef, useState } from "react";

type RouterNavigationMethods = Pick<NextRouter, "back" | "push" | "reload" | "replace" | "events">;

/**
 * useRouter doesn't return stable navigation methods, this gives us something
 * stable to call, even as the router changes behind the scenes.
 *
 * Note, this uses state instead of memo in case the React implementation ends
 * up evicting memoized objects in the future
 * Inspired by: https://github.com/vercel/next.js/issues/18127#issuecomment-950907739
 */
const useRouterNavigation = (): RouterNavigationMethods => {
  const router = useRouter();
  const routerRef = useRef(router);

  routerRef.current = router;

  const [routerNavigation] = useState<RouterNavigationMethods>({
    back: (...args) => routerRef.current.back(...args),
    push: (...args) => routerRef.current.push(...args),
    reload: (...args) => routerRef.current.reload(...args),
    replace: (...args) => routerRef.current.replace(...args),
    events: {
      on: (...args) => routerRef.current.events.on(...args),
      off: (...args) => routerRef.current.events.off(...args),
      emit: (...args) => routerRef.current.events.emit(...args),
    },
  });

  return routerNavigation;
};

export default useRouterNavigation;
