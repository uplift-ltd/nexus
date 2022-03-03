import { notEmpty } from "@uplift-ltd/ts-helpers";
import { replaceAll } from "./formatters";

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

export type QueryStringParametersMap = Record<string, string | number | null | undefined>;

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

  const filteredParams = params
    ? Object.fromEntries(
        Object.entries(params)
          .filter(([_, value]) => notEmpty(value))
          .map(([key, value]) => [key.toString(), (value as string | number).toString()])
      )
    : {};

  const qs = new URLSearchParams(filteredParams).toString();
  return [baseUrl, qs].filter(Boolean).join("?");
}
