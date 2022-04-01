import { makeQueryString, QueryStringParametersMap } from "@uplift-ltd/strings";
import { useRouter } from "next/router";

export function useRouterQuery<
  QueryShape extends QueryStringParametersMap = QueryStringParametersMap
>() {
  const router = useRouter();

  const updateRouterQuery = (newQuery: Partial<QueryShape>) => {
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
