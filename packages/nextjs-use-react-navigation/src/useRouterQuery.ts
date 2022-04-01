import { ParsedUrlQuery } from "querystring";
import { makeQueryString, QueryStringParametersMap } from "@uplift-ltd/strings";
import { useRouter } from "next/router";

export function useRouterQuery<QueryShape extends ParsedUrlQuery = QueryStringParametersMap>() {
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
