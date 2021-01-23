// trim :: String -> String`
export const trim = (x: string) => x.trim();

// safeJoin is a HOF to build fns to nicely join strings.
// the returned fn takes in variadic arguments, and returns all truthy components with the delimeter.
//

const isStringOrNumber = (variableToCheck: unknown): variableToCheck is string | number => {
  return (
    (typeof variableToCheck === "string" && variableToCheck.length > 0) ||
    typeof variableToCheck === "number"
  );
};

// safeJoin :: String -> [a] -> String
export const safeJoin = (delimiter: string) => (...xs: unknown[]) =>
  xs
    .filter(isStringOrNumber)
    .map((x) => {
      if (typeof x === "number") {
        return x.toString();
      }

      return trim(x);
    })
    .join(delimiter);

// fn to join all arguments with a single space
export const safeJoinWithSpace = safeJoin(" ");

// fn to join all arguments with a comma
export const safeJoinWithComma = safeJoin(", ");

// fn to join all arguments with En dash
export const safeJoinWithEnDash = safeJoin("–");

// fn to join all arguments with Em dash
export const safeJoinWithEmDash = safeJoin(" — ");

// capitalize :: String -> String'
export const capitalize = (str: string) => `${str[0].toUpperCase()}${str.substring(1)}`;

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
