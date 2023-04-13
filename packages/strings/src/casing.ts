import { safeJoinWithSpace } from "./safeJoin.js";

// capitalize :: String -> String'
export const capitalize = (str: string) => (str ? `${str[0].toUpperCase()}${str.slice(1)}` : str);

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
