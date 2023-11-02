import { MultipleUrlsTokensMap, QueryStringParametersMap } from "@uplift-ltd/strings";
import { useCallback } from "react";

import { useRouterNavigation } from "./useRouterNavigation.js";

export type RouterQueryResult<
  QueryStringParams extends Record<string, unknown> | never | string = never,
  Tokens extends Record<string, unknown> | never | string = never
> =
  // prettier-ignore
  (
      [Tokens] extends never
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

interface NextTransitionOptions {
  scroll?: boolean;
  shallow?: boolean;
}

/**
 * Access to the routerQuery object as well as a callback that makes it easy to modify the
 * querystring from a component.
 */
export function useRouterQuery<
  QueryStringShape extends QueryStringParametersMap | string = QueryStringParametersMap,
  QueryResult = RouterQueryResult<QueryStringShape>,
  UpdateQueryShape = Partial<[QueryStringShape] extends [string] ? QueryResult : QueryStringShape>
>() {
  const routerNavigation = useRouterNavigation();

  const updateRouterQuery = useCallback(
    (
      newQuery: UpdateQueryShape,
      { scroll = false, shallow = true }: NextTransitionOptions = {}
    ) => {
      const query = {
        ...routerNavigation.query,
        ...newQuery,
      };
      Object.keys(query).forEach((key) => {
        if (query[key] === undefined) {
          delete query[key];
        }
      });
      routerNavigation.replace(
        {
          pathname: routerNavigation.pathname,
          query,
        },
        undefined,
        {
          scroll,
          shallow,
        }
      );
    },
    [routerNavigation]
  );

  return {
    isReady: routerNavigation.isReady,
    routerQuery: routerNavigation.query as unknown as QueryResult,
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
  QueryStringShape extends QueryStringParametersMap | string = QueryStringParametersMap,
  QueryResult = RouterQueryResult<QueryStringShape, RouterParamMapFromURLs<URL>>,
  UpdateQueryShape = Partial<[QueryStringShape] extends [string] ? QueryResult : QueryStringShape>
>() {
  return useRouterQuery<QueryStringShape, QueryResult, UpdateQueryShape>();
}
