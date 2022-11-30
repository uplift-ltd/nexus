import { ParsedUrlQuery } from "querystring";
import { notEmpty } from "@uplift-ltd/ts-helpers";

// Finds tokens in a next.js style URL. eg, /users/[userId]/items/[itemId]
const NEXTJS_URL_PARAM_REGEX = /\[(\w+)\]/g;

export type UrlParamsAndSearchParams = {
  params: ParsedUrlQuery;
  search: ParsedUrlQuery;
};

/**
 * nextQueryToParamsAndSearch
 *
 * Next.js treats all dynamic sections of a URL as "query" params. This is an issue for us
 * because we use base64 IDs frequently. Querystring parameters (url.search) need to be URI
 * encoded because any base64 padding ("=" characters) are already used in url.search to
 * assign values to keys. However, in the URL path (url.pathname), we don't need these
 * URI encoded, and URI encoding them causes other issues for us when matching on IDs,
 * as we expect them to be stable.
 *
 * This function finds URL pathname parameters in the given Next.JS style pathname, which
 * uses square brackets around the variable name, eg: `/users/[userId]`, and separates
 * those key/value pairs from the querystring parameters so we can work with them separately.
 *
 */
export function nextQueryToParamsAndSearch(pathname: string, query: ParsedUrlQuery) {
  // find dynamic URL parameters by processing the next.js pathname, pull out the match
  // and remove any empty matches
  const urlParamKeys = Array.from(pathname.matchAll(NEXTJS_URL_PARAM_REGEX))
    .map((match) => match[1])
    .filter(notEmpty);

  return Object.entries(query).reduce(
    (acc, entry) => {
      const [key, value] = entry;

      if (urlParamKeys.includes(key)) {
        // eslint-disable-next-line no-param-reassign
        acc.params[key] = value;
      } else {
        // eslint-disable-next-line no-param-reassign
        acc.search[key] = value;
      }

      return acc;
    },
    { params: {}, search: {} } as UrlParamsAndSearchParams
  );
}
