import {
  makeQueryString,
  QueryStringParametersMap,
  MultipleUrlsTokensMap,
} from "@uplift-ltd/strings";
import { useCallback } from "react";
import { useRouterNavigation } from "./useRouterNavigation";

export type RouterQueryResult<
  QueryStringParams extends never | string | Record<string, unknown> = never,
  Tokens extends never | string | Record<string, unknown> = never
> =
  // prettier-ignore
  (
      [Tokens] extends [never]
        ? // No Tokens, return never
        never
        : // Tokens is a string union, create a simple object of item in union to string
        [Tokens] extends [string]
        ? { [K in Tokens]: string }
        : // Tokens is actually already a object type or union of object types, just return
        Tokens
  )
  & // AND
  // Iterate through params union or shape and make values optional
  // Allows explicit overrides of value types if needed. example, for arrays
  (
      [QueryStringParams] extends [string]
        ? { [K in QueryStringParams]?: string }
        : {
            [K in keyof QueryStringParams]?: QueryStringParams[K] extends Array<unknown>
              ? string[]
              : string;
          }
    );

/**
 * Access to the routerQuery object as well as a callback that makes it easy to modify the
 * querystring from a component.
 */
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

/**
 * When passing values to makeUrl, we can stringify numbers, so its OK to pass,
 * but when parsing URLs for params/tokens, the value will always be a string
 */
type TokenMapToRouterParamMap<TokenMaps> = TokenMaps extends infer TokenMap
  ? { [K in keyof TokenMap]: string }
  : never;

/**
 * Wrapper to convert from URL(s) to the RouterParamMap
 */
export type RouterParamMapFromURLs<URLs extends string> = TokenMapToRouterParamMap<
  MultipleUrlsTokensMap<URLs>
>;

/**
 * useRouterQueryForUrl
 * Gives type-safe access to useRouterQuery of a URL or union of URLs
 *
 */
export function useRouterQueryForUrl<
  URL extends string,
  QueryStringShape extends string | QueryStringParametersMap = QueryStringParametersMap,
  QueryResult = RouterQueryResult<QueryStringShape, RouterParamMapFromURLs<URL>>,
  UpdateQueryShape = Partial<[QueryStringShape] extends [string] ? QueryResult : QueryStringShape>
>() {
  return useRouterQuery<QueryStringShape, QueryResult, UpdateQueryShape>();
}
