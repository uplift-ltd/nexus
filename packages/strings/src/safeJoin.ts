import { trim } from "./pointFree";

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
