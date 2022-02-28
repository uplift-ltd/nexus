/**
 * typedIncludes
 *
 * Let's you work with a typed array (const, enum keys, etc) and assert whether
 * a variable is a member. Not only does this improve type safety, but you don't
 * get the error that "string" isn't a member of TYPE
 *
 * @example
 * const colors = ["blue", "green", "red"] as const;
 *
 * if(typedIncludes(colors, myColor)) {
 *     // typeof myColor = "blue" | "green" | "red"
 * }
 *
 */
export const typedIncludes = <S, R extends `${Extract<S, string>}`>(
  haystack: ReadonlyArray<R>,
  needle: S,
  fromIndex?: number
): needle is S & R => {
  return haystack.includes((needle as unknown) as R, fromIndex);
};
