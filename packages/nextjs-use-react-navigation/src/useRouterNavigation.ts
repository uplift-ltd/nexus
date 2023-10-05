import { useRouter } from "next/router";
import type { NextRouter } from "next/router";
import { useRef, useState } from "react";

type RouterNavigationMethods = Pick<
  NextRouter,
  "asPath" | "back" | "events" | "isReady" | "pathname" | "push" | "query" | "reload" | "replace"
>;

/**
 * useRouter doesn't return stable navigation methods, this gives us something
 * stable to call, even as the router changes behind the scenes.
 *
 * Note, this uses state instead of memo in case the React implementation ends
 * up evicting memoized objects in the future
 * Inspired by: https://github.com/vercel/next.js/issues/18127#issuecomment-950907739
 */
export const useRouterNavigation = (): RouterNavigationMethods => {
  const router = useRouter();
  const routerRef = useRef(router);

  routerRef.current = router;

  const [routerNavigation] = useState<RouterNavigationMethods>({
    get asPath() {
      return routerRef.current.asPath;
    },
    back: (...args) => routerRef.current.back(...args),
    events: {
      emit: (...args) => routerRef.current.events.emit(...args),
      off: (...args) => routerRef.current.events.off(...args),
      on: (...args) => routerRef.current.events.on(...args),
    },
    get isReady() {
      return routerRef.current.isReady;
    },
    get pathname() {
      return routerRef.current.pathname;
    },
    push: (...args) => routerRef.current.push(...args),
    get query() {
      return routerRef.current.query;
    },
    reload: (...args) => routerRef.current.reload(...args),
    replace: (...args) => routerRef.current.replace(...args),
  });

  return routerNavigation;
};
