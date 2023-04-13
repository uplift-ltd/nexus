import { GRAPHQL_HOST } from "@uplift-ltd/constants";
import { notEmpty } from "@uplift-ltd/ts-helpers";
import { replaceAll } from "./formatters.js";
import { safeJoin } from "./safeJoin.js";

// Polyfill process.env for non-node environments
const process = "process" in globalThis ? globalThis.process : ({ env: {} } as NodeJS.Process);

const safeJoinWithQuestionMark = safeJoin("?");

/**
 * This type parses out the path tokens :token from a url
 * It handles tokens with/without trailing slashes
 *
 * @example
 * type tokens = UrlTokens<"https://example.com/:orgId/:userId">
 * // "orgId" | "userId"
 *
 */

// Root is ignored on purpose
// prettier-ignore
/* eslint-disable @typescript-eslint/no-unused-vars */
export type UrlTokens<T extends string> = T extends
  // express style urls
  | `${infer Root}/:${infer Token}/${infer Rest}`
  // or next.js style urls
  | `${infer Root}/[${infer Token}]/${infer Rest}`
  ? Token | UrlTokens<Rest>
  : T extends `:${infer Token}/${infer Rest}` | `[${infer Token}]/${infer Rest}`
  ? Token | UrlTokens<Rest>
  : T extends `${infer Root}/:${infer Token}` | `${infer Root}/[${infer Token}]`
  ? Token
  : T extends `:${infer Token}/` | `[${infer Token}]/`
  ? Token
  : T extends `:${infer Token}` | `[${infer Token}]`
  ? Token
  : never;
/* eslint-enable @typescript-eslint/no-unused-vars */

/**
 * Takes a URL and returns a Record with all tokens as required keys
 *
 * @example
 * type tokensMap = UrlTokensMap<"https://example.com/:orgId/:userId">
 * // { orgId: string | number, userId: string | number }
 *
 */

// prettier-ignore
export type UrlTokensMap<Url extends string, K extends string = UrlTokens<Url>> = [K] extends [never]
  ? never
  : [K] extends [string]
  ? { [P in K]: string | number }
  : never;

/**
 * Given a union of possible URLs, return a union of TokensMap.
 *
 * This is very handy when retrieving parameters from a union of possibly matching
 * URLs. Probably for a component rendering part of a route
 *
 * @example
 * type tokensMap = UrlTokensMap<"https://example.com/:orgId/:userId" | "https://example.com/:orgId/:userId/:itemId">
 * // | { orgId: string | number, userId: string | number }
 * // | { orgId: string | number, userId: string | number, itemId: string | number }
 */
// prettier-ignore
export type MultipleUrlsTokensMap<Urls extends string> = Urls extends infer U
  ? U extends string
    ? UrlTokensMap<U>
    : never
  : never;

type QueryStringParameterValue = string | number;

export type QueryStringParametersMap = Record<
  string,
  QueryStringParameterValue[] | QueryStringParameterValue | null | undefined
>;

// Used for express style URLs
export const getExpressTokenForParamName = (paramName: string) => `:${paramName}`;
// Used for next.js style URLs
// We need to escape the brackets because this string is used as a regexp for better
// backward-compatibility on node <15
export const getNextJsTokenForParamName = (paramName: string) => `\\[${paramName}\\]`;

/**
 * Takes a urlTemplate and a tokens map to replace all instances of the token
 * with the value needed. Also supports custom token formats by customizing the
 * getTokenStringForKey callback. This defaults to an express style parameter using
 * ":keyName" but can be updated to support next.js by supplying a return value of "[keyName]"
 */
export const replaceTokens = <
  UrlTemplate extends string,
  TokensMap extends Record<string, string | number> = UrlTokensMap<UrlTemplate>
>(
  urlTemplate: UrlTemplate,
  tokens: TokensMap,
  getTokenStringForParamName = getExpressTokenForParamName
) => {
  return Object.entries(tokens).reduce((url, [key, value]) => {
    if (!notEmpty(value)) return url;

    const paramName = getTokenStringForParamName(key);
    return replaceAll(url, paramName, value.toString());
  }, urlTemplate as string);
};

/**
 * defaultGetAbsoluteUrlHttpSetting
 *
 * Determine whether we should be https based on
 * some common configurations, defaults to `true`
 *
 */
function defaultGetAbsoluteUrlHttpSetting(_url: string, host: string) {
  if (host.includes("localhost")) return false;
  if (host.includes("127.0.0.1")) return false;
  if (host.includes("::1")) return false;
  if (process.env.NODE_ENV !== "production") return false;
  if (process.env.ENV === "local") return false;

  return true;
}

/**
 * defaultGetAbsoluteUrlHost
 *
 * Tries to get the window.host if we're not SSR,
 * otherwise defaults to the GRAPHQL_HOST.host if that's set
 *
 */
function defaultGetAbsoluteUrlHost() {
  if (typeof window !== "undefined") return window.location.host;
  if (GRAPHQL_HOST) {
    const hostUrl = new URL(GRAPHQL_HOST);
    return hostUrl.host;
  }

  return "";
}

/**
 * ensureHostOnly
 *
 * Make sure the URL doesn't have a protocol prefix
 */
function ensureHostOnly(url: string) {
  if (url.startsWith("http")) {
    return url.replace(/^https?:\/\//, "");
  }

  return url;
}

/**
 * Given an object of key/values, returns a properly encoded querystring for appending to a URL after
 * removing any falsey/missing values. Values as arrays will be appended multiple times. If you want to
 * add an array as comma separated, you will need to pass it as a string for the value.
 *
 * @example
 * makeQueryString({
 *   userId: 1234,
 *   search: null,
 *   repoName: "hello world",
 *   message: ""
 * }) // => "userId=1234&repoName=hello%20world"
 *
 * @example
 * // with array value
 * makeQueryString({
 *   term: ["hello", "world"],
 *   repoName: "hello world",
 * }) // => "repoName=hello%20world&term=hello&term=world"
 *
 * // for comma separated values, join first
 * makeQueryString({
 *   terms: ["hello", "world"].join(","),
 *   repoName: "hello world",
 * }) // => "repoName=hello%20world&terms=hello%2Cworld"
 *
 */
export function makeQueryString<Params extends QueryStringParametersMap = QueryStringParametersMap>(
  params: Params | undefined | null
) {
  const searchParams = Object.entries(params ?? {}).reduce((qs, [key, value]) => {
    // skip falsey/empty values
    if (!notEmpty(value) || !value) return qs;

    const keyStr = key.toString();

    if (Array.isArray(value)) {
      value.forEach((val) => qs.append(keyStr, val.toString()));
    } else {
      qs.append(keyStr, value.toString());
    }

    return qs;
  }, new URLSearchParams());

  return searchParams.toString();
}

export type MakeUrlAbsoluteUrlOptions = {
  /**
   * If we're constructing absolute urls, this controls whether
   * the protocol will be https or http. Can define as a constant or
   * by passing a callback predicate
   */
  https?: boolean | ((url: string, host: string) => boolean);

  /**
   * What host should be used for the absolute URL? By default
   * we will try to determine the host based on window.location
   */
  host?: string | ((url: string) => string);
};

export type MakeUrlOptions = {
  /** should we create absolute URLs instead of relative?
   *
   * passing `true` will enable absoluteUrls with default config
   */
  absoluteUrl?: boolean | MakeUrlAbsoluteUrlOptions;

  /**
   * Customize pathname replacement, defaults to express style params (:paramName)
   */
  dynamicUrlStyle?: "express" | "nextjs";

  /**
   * Controls how the trailing slash on our URLs will be handled,
   * - "ignore" will leave the URL as-is
   * - "ensure" will append a trailing slash if the slash is not already present
   * - "remove" will remove a trailing slash if it exists
   */
  trailingSlash?: "ignore" | "ensure" | "remove";
};

const DEFAULT_ABSOLUTE_URL_OPTIONS: MakeUrlAbsoluteUrlOptions = {
  https: defaultGetAbsoluteUrlHttpSetting,
  host: defaultGetAbsoluteUrlHost,
};

/**
 * MakeUrlArgsList
 *
 * This Type is a tuple switched on the existance of Tokens found in the URL
 *
 * This is necessary because our makeUrl function signature changes depending on the
 * contents of the URL. If the URL does not contain any tokens (:userId),
 * then the tokens argument must not be populated (and can be left out)
 * to prevent confusion.
 *
 */
// prettier-ignore
export type MakeUrlArgsList<Url extends string, TokensMap = UrlTokensMap<Url>> = [TokensMap] extends [never]
  ? [(null | undefined)?, (null | QueryStringParametersMap)?, MakeUrlOptions?]
  : [UrlTokensMap<Url>, (null | QueryStringParametersMap)?, MakeUrlOptions?];

/**
 * createMakeUrl
 *
 * HOF that builds our `makeUrl` instances. This wrapper allows us to have
 * project-level configuration easily, or several helpers per project
 * (eg, one for relative and one for absolute URLs)
 *
 * The original `makeUrl` function is exported below, created
 * by calling `createMakeUrl` without any arguments
 */
export function createMakeUrl(defaultOptions: MakeUrlOptions = {}) {
  /**
   * returns new function with our defaultOptions baked in
   */
  return function makeUrl<Url extends string, TokensMap = UrlTokensMap<Url>>(
    url: Url,
    ...args: MakeUrlArgsList<Url, TokensMap>
  ) {
    const [tokens, params, optionOverrides] = args;

    // Combine provided defaults and any instance options
    const {
      absoluteUrl = false,
      dynamicUrlStyle = "express",
      trailingSlash = "ignore",
    } = {
      ...defaultOptions,
      ...optionOverrides,
    };

    const getDynamicPathnameForParam =
      dynamicUrlStyle === "nextjs" ? getNextJsTokenForParamName : getExpressTokenForParamName;

    // construct the main portion of our URL by replacing tokens, if provided
    let baseUrl = tokens ? replaceTokens(url, tokens, getDynamicPathnameForParam) : url;

    if (trailingSlash === "ensure" && !baseUrl.endsWith("/")) {
      // Ensure we have a trailing slash
      baseUrl = `${baseUrl}/`;
    }

    if (trailingSlash === "remove" && baseUrl.endsWith("/")) {
      // remove any trailing slashes
      baseUrl = baseUrl.slice(0, -1);
    }

    if (absoluteUrl) {
      // We're constructing an absoluteUrl,
      // https and host configuration will be determined by merging any provided options
      // on top of the default callbacks
      const { host = defaultGetAbsoluteUrlHost, https = defaultGetAbsoluteUrlHttpSetting } =
        typeof absoluteUrl === "boolean" ? DEFAULT_ABSOLUTE_URL_OPTIONS : absoluteUrl;

      // these settings can be defined as a constant or by the result of a callback
      const hostUrl = ensureHostOnly(typeof host === "function" ? host(baseUrl) : host);
      const shouldUseHttps = typeof https === "function" ? https(baseUrl, hostUrl) : https;
      const protocol = shouldUseHttps ? "https" : "http";

      baseUrl = url.startsWith(protocol) ? url : (`${protocol}://${hostUrl}${baseUrl}` as const);
    }

    const qs = makeQueryString(params);
    return safeJoinWithQuestionMark(baseUrl, qs);
  };
}

// export our default `makeUrl` function as before
export const makeUrl = createMakeUrl();
