import { ParsedUrlQuery } from "querystring";
import { makeQueryString } from "@uplift-ltd/strings";
import { useRouter } from "next/router";

export type ParsedRouterQueryStrings = Record<string, string | undefined>;

export function useRouterQuery<QueryShape extends ParsedUrlQuery = ParsedRouterQueryStrings>() {
  const router = useRouter();

  const updateRouterQuery = (newQuery: ParsedUrlQuery) => {
    const q = makeQueryString({ ...router.query, ...newQuery });

    if (q) {
      router.replace(`${router.pathname}?${q}`);
    } else {
      router.replace(router.pathname);
    }
  };

  return {
    routerQuery: router.query as QueryShape,
    updateRouterQuery,
  };
}
