import { notEmpty } from "@uplift-ltd/ts-helpers";

// trim :: String -> String`
export const trim = (x: string) => x.trim();

const isStringOrNumber = (variableToCheck: unknown): variableToCheck is string | number => {
  return (
    (typeof variableToCheck === "string" && variableToCheck.length > 0) ||
    typeof variableToCheck === "number"
  );
};

// safeJoin is a HOF to build fns to nicely join strings.
// the returned fn takes in variadic arguments, and returns all truthy components with the delimeter.
//
// safeJoin :: String -> [a] -> String
export const safeJoin = (delimiter: string) => (...xs: unknown[]) =>
  xs
    .flat()
    .filter(isStringOrNumber)
    .map((x) => {
      if (typeof x === "number") {
        return x.toString();
      }

      return trim(x);
    })
    .join(delimiter);

// fn to join all arguments with an empty string
export const safeJoinTogether = safeJoin("");

// fn to join all arguments with a single space
export const safeJoinWithSpace = safeJoin(" ");

// fn to join all arguments with a comma
export const safeJoinWithComma = safeJoin(", ");

// fn to join all arguments with En dash
export const safeJoinWithEnDash = safeJoin("–");

// fn to join all arguments with Em dash
export const safeJoinWithEmDash = safeJoin(" — ");

// capitalize :: String -> String'
export const capitalize = (str: string) => (str ? `${str[0].toUpperCase()}${str.slice(1)}` : str);

// pluralize :: String -> String -> Number -> String
export const pluralize = (singular: string, plural: string) => (count: number) =>
  count === 1 ? `${count} ${singular}` : `${count} ${plural}`;

// prettier-ignore
export const defaultAlwaysLowerCaseList = [ "a", "an", "and", "as if", "as long as", "as", "at", "but", "by", "down", "en", "even if", "for", "from", "if only", "if", "in", "into", "like", "near", "nor", "now that", "of", "off", "on top of", "on", "once", "onto", "or", "out of", "over", "past", "per", "so that", "so", "than", "that", "the", "till", "to", "up", "upon", "v.", "via", "vs.", "when", "with", "yet"];

// titleCase :: String -> String`
export const titleCase = (
  str: string,
  alwaysLowerCaseWords = defaultAlwaysLowerCaseList
): string => {
  return safeJoinWithSpace(
    ...str.split(" ").map((_word, idx, allWords) => {
      const word = _word.toLowerCase();

      // we always capitalize the first/last words in the sentence
      if (idx === 0 || idx === allWords.length - 1) {
        return capitalize(word);
      }

      return alwaysLowerCaseWords.includes(word) ? word : capitalize(word);
    })
  );
};

export type JsonParseReviverCallback = Parameters<typeof JSON.parse>[1];
export function safeJsonParse<Shape extends unknown>(
  jsonStr: string,
  fallback?: Shape,
  reviver?: JsonParseReviverCallback
): Shape | undefined {
  try {
    return JSON.parse(jsonStr, reviver);
  } catch (err) {
    return fallback;
  }
}

export const formatUsCurrency = (dollars: number, hideCents = false) => {
  const hasCents = dollars % 1 !== 0;
  const digits = hasCents && hideCents ? 0 : 2;

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  return formatter.format(dollars);
};

// formatPhoneNumber :: String -> String
// converts 10 digit
export const formatPhoneNumber = (phoneNumber: string): string => {
  const rawPhoneNumber = phoneNumber.replace(/\D/g, "");
  const lastTenIndex = rawPhoneNumber.length - 10;

  const [countryCode, lastTenDigits] = [
    rawPhoneNumber.substring(0, lastTenIndex),
    rawPhoneNumber.substring(lastTenIndex),
  ];

  const [areaCode, nextThree, lastFour] = [
    lastTenDigits.substring(0, 3),
    lastTenDigits.substring(3, 6),
    lastTenDigits.substring(6),
  ];

  return trim(`${countryCode} (${areaCode}) ${nextThree}-${lastFour}`);
};

export type UrlTokensMap = Record<string, string | number | null | undefined>;

const replaceAll = (str: string, needle: string, replace: string) =>
  str.replace(new RegExp(needle, "g"), replace);

export const replaceTokens = (urlTemplate: string, tokens: UrlTokensMap) => {
  return Object.entries(tokens).reduce((url, [key, value]) => {
    if (!notEmpty(value)) return url;

    return replaceAll(url, `:${key}`, value.toString());
  }, urlTemplate);
};

export type MakeUrlOptions = {
  trailingSlash?: "ignore" | "ensure" | "remove";
};

export type MakeUrlConfig = {
  url: string;
  tokens?: UrlTokensMap | null;
  params?: UrlTokensMap | null;
  options?: MakeUrlOptions;
};

export function makeUrl(config: MakeUrlConfig): string;
export function makeUrl(
  url: MakeUrlConfig["url"],
  tokens?: MakeUrlConfig["tokens"],
  params?: MakeUrlConfig["params"],
  options?: MakeUrlConfig["options"]
): string;
export function makeUrl(
  urlOrConfig: MakeUrlConfig["url"] | MakeUrlConfig,
  providedTokens?: MakeUrlConfig["tokens"],
  providedParams?: MakeUrlConfig["params"],
  providedOptions?: MakeUrlConfig["options"]
): string {
  const url = typeof urlOrConfig === "string" ? urlOrConfig : urlOrConfig.url;
  const tokens = typeof urlOrConfig === "string" ? providedTokens : urlOrConfig.tokens;
  const params = typeof urlOrConfig === "string" ? providedParams : urlOrConfig.params;
  const { trailingSlash = "ignore" } =
    (typeof urlOrConfig === "string" ? providedOptions : urlOrConfig.options) || {};

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
          .filter(([_, value]) => notEmpty<string | number>(value))
          .map(([key, value]) => [key.toString(), (value as string | number).toString()])
      )
    : {};

  const qs = new URLSearchParams(filteredParams).toString();
  return [baseUrl, qs].filter(Boolean).join("?");
}
