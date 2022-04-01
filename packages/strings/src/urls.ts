import { notEmpty } from "@uplift-ltd/ts-helpers";
import { replaceAll } from "./formatters";
import { safeJoin } from "./safeJoin";

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type UrlTokens<T extends string> = T extends `${infer Root}/:${infer Token}/${infer Rest}`
  ? Token | UrlTokens<Rest>
  : T extends `:${infer Token}/${infer Rest}`
  ? Token | UrlTokens<Rest>
  : // Root is ignored on purpose
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends `${infer Root}/:${infer Token}`
  ? Token
  : T extends `:${infer Token}/`
  ? Token
  : T extends `:${infer Token}`
  ? Token
  : never;

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

type QueryStringParameterValue = string | number;
export type QueryStringParametersMap = Record<
  string,
  QueryStringParameterValue[] | QueryStringParameterValue | null | undefined
>;

export const replaceTokens = <UrlTemplate extends string, TokensMap = UrlTokensMap<UrlTemplate>>(
  urlTemplate: UrlTemplate,
  tokens: TokensMap
) => {
  return Object.entries(tokens).reduce((url, [key, value]) => {
    if (!notEmpty(value)) return url;

    return replaceAll(url, `:${key}`, value.toString());
  }, urlTemplate as string);
};

export type MakeUrlOptions = {
  trailingSlash?: "ignore" | "ensure" | "remove";
};

// prettier-ignore
export type MakeUrlArgsList<Url extends string, TokensMap = UrlTokensMap<Url>> = [TokensMap] extends [never]
  ? [(null | undefined)?, (null | QueryStringParametersMap)?, MakeUrlOptions?]
  : [UrlTokensMap<Url>, (null | QueryStringParametersMap)?, MakeUrlOptions?];

export function makeUrl<Url extends string, TokensMap = UrlTokensMap<Url>>(
  url: Url,
  ...args: MakeUrlArgsList<Url, TokensMap>
) {
  const [tokens, params, { trailingSlash = "ignore" } = {}] = args;

  let baseUrl = tokens ? replaceTokens(url, tokens) : url;

  if (trailingSlash === "ensure" && !baseUrl.endsWith("/")) {
    baseUrl = `${baseUrl}/`;
  }

  if (trailingSlash === "remove" && baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }

  const qs = makeQueryString(params);

  return safeJoinWithQuestionMark(baseUrl, qs);
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
