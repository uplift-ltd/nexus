import { trim } from "./pointFree.js";

export type MakePluralizerParams = {
  includeCount?: boolean;
  plural?: string;
  singular: string;
};
export const makePluralizer =
  ({ includeCount = true, plural: providedPlural, singular }: MakePluralizerParams) =>
  (count: number) => {
    const plural = providedPlural ?? `${singular}s`;
    const word = count === 1 ? singular : plural;

    return includeCount ? `${count} ${word}` : word;
  };

/**
 * @deprecated: use makePluralizer instead
 */
export const pluralize = (singular: string, plural: string) =>
  makePluralizer({ includeCount: true, plural, singular });

export const formatUsCurrency = (dollars: number, hideCents = false) => {
  const hasCents = dollars % 1 !== 0;
  const digits = hasCents && hideCents ? 0 : 2;

  const formatter = new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
    style: "currency",
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

export const replaceAll = (str: string, needle: string, replace: string) =>
  str.replace(new RegExp(needle, "g"), replace);
