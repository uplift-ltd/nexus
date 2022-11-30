import { QueryStringParametersMap, MultipleUrlsTokensMap, makeUrl } from "@uplift-ltd/strings";
import { useCallback } from "react";
import { nextQueryToParamsAndSearch } from "./nextQueryToParamsAndSearch";
import { useRouterNavigation } from "./useRouterNavigation";

export type RouterQueryResult<
  QueryStringParams extends never | string | Record<string, unknown> = never,
  Tokens extends never | string | Record<string, unknown> = never
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
      /**
       * Next.js processes all "dynamic URLs" by appending any dynamic parts as url.search
       * onto the next.js dynamic pathname style. Eg, /users/[userId]/items/[itemId]?userId=654&itemId=1&sidebar=items
       * this URL is then processed by next.js to move any dynamic URL path params from url.search
       * and into the pathname itself. The issue is that these values have already been URI encoded
       * even though they don't need to be when used as a pathname parameter. This is breaking our
       * use of base64 ids. To fix this, we're going to split up the variables into pathname params
       * and search params. We will then preprocess the URL, directly rendering the pathname params
       * into the string so that Next.js does not modify it.
       */
      const { params, search } = nextQueryToParamsAndSearch(routerNavigation.pathname, {
        ...routerNavigation.query,
        ...newQuery,
      });

      // Replace dynamic path params with the values
      const baseUrl = Object.entries(params).reduce((acc, entry) => {
        const [key, value] = entry;

        return acc.replaceAll(`[${key}]`, String(value));
      }, routerNavigation.pathname);

      // give next.js a fully prepared URL so that they don't interpret it
      // as a "dynamic" URL, which would modify it out from under us
      routerNavigation.replace(makeUrl(baseUrl, null, search));
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
