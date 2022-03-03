import { trim } from "./pointFree";

// pluralize :: String -> String -> Number -> String
export const pluralize = (singular: string, plural: string) => (count: number) =>
  count === 1 ? `${count} ${singular}` : `${count} ${plural}`;

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

export const replaceAll = (str: string, needle: string, replace: string) =>
  str.replace(new RegExp(needle, "g"), replace);
