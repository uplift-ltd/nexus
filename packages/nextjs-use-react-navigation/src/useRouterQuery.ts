import { makeQueryString, QueryStringParametersMap, UrlTokens } from "@uplift-ltd/strings";
import { useRouter } from "next/router";

// prettier-ignore
type RouterQueryResult<Tokens extends string, QueryStringParams extends never | string | Record<string, unknown> = never> =
    // set URL params to be string
    { [K in Tokens]: string } &
    // Iterate through params union or shape and make values optional
    // Allows explicit overrides of value types if needed. example, for arrays
    (
        [QueryStringParams] extends [string]
            ? { [K in QueryStringParams]?: string }
            : { [K in keyof QueryStringParams]?: QueryStringParams[K] extends Array<unknown> ? string[] : string }
    )

export function useRouterQuery<
  URL extends string,
  QueryStringShape extends string | QueryStringParametersMap = QueryStringParametersMap,
  QueryResult = RouterQueryResult<UrlTokens<URL>, QueryStringShape>,
  UpdateQueryShape = Partial<[QueryStringShape] extends [string] ? QueryResult : QueryStringShape>
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
