import { makeQueryString, QueryStringParametersMap, UrlTokens } from "@uplift-ltd/strings";
import { useCallback } from "react";
import { useRouterNavigation } from "./useRouterNavigation";

// prettier-ignore
export type RouterQueryResult<QueryStringParams extends never | string | Record<string, unknown> = never, Tokens extends never | string = never> =
    // set URL params to be string
    ([Tokens] extends never ? never : { [K in Tokens]: string }) &
    // Iterate through params union or shape and make values optional
    // Allows explicit overrides of value types if needed. example, for arrays
    (
        [QueryStringParams] extends [string]
            ? { [K in QueryStringParams]?: string }
            : { [K in keyof QueryStringParams]?: QueryStringParams[K] extends Array<unknown> ? string[] : string }
    )

export function useRouterQuery<
  QueryStringShape extends string | QueryStringParametersMap = QueryStringParametersMap,
  QueryResult = RouterQueryResult<QueryStringShape>,
  UpdateQueryShape = Partial<[QueryStringShape] extends [string] ? QueryResult : QueryStringShape>
>() {
  const routerNavigation = useRouterNavigation();

  const updateRouterQuery = useCallback(
    (newQuery: UpdateQueryShape) => {
      const q = makeQueryString({ ...routerNavigation.query, ...newQuery });

      if (q) {
        routerNavigation.replace(`${routerNavigation.pathname}?${q}`);
      } else {
        routerNavigation.replace(routerNavigation.pathname);
      }
    },
    [routerNavigation]
  );

  return {
    isReady: routerNavigation.isReady,
    routerQuery: (routerNavigation.query as unknown) as QueryResult,
    updateRouterQuery,
  };
}

export function useRouterQueryForUrl<
  URL extends string,
  QueryStringShape extends string | QueryStringParametersMap = QueryStringParametersMap,
  QueryResult = RouterQueryResult<QueryStringShape, UrlTokens<URL>>,
  UpdateQueryShape = Partial<[QueryStringShape] extends [string] ? QueryResult : QueryStringShape>
>() {
  return useRouterQuery<QueryStringShape, QueryResult, UpdateQueryShape>();
}
