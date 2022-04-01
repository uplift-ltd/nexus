import { makeQueryString, QueryStringParametersMap } from "@uplift-ltd/strings";
import { useRouter } from "next/router";

// prettier-ignore
type RouterQueryResult<Shape extends string | Record<string, unknown>> =
    [Shape] extends [string]
        ? { [K in Shape]: string }
        : { [K in keyof Shape]: Shape[K] extends Array<unknown> ? string[] : string };

export function useRouterQuery<
  QueryShape extends string | QueryStringParametersMap = QueryStringParametersMap,
  QueryResult = RouterQueryResult<QueryShape>,
  UpdateQueryShape = Partial<[QueryShape] extends [string] ? QueryResult : QueryShape>
>() {
  const router = useRouter();

  const updateRouterQuery = (newQuery: UpdateQueryShape) => {
    const q = makeQueryString({ ...router.query, ...newQuery });

    if (q) {
      router.replace(`${router.pathname}?${q}`);
    } else {
      router.replace(router.pathname);
    }
  };

  return {
    routerQuery: (router.query as unknown) as QueryResult,
    updateRouterQuery,
  };
}
