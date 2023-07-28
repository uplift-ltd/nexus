import { notEmpty } from "./notEmpty";

/**
 * Ensures that the provided data is an array, and if it's not, wraps it in an array
 */
export function ensureArray<T>(maybeXs: (T | null | undefined) | (T | null | undefined)[]): T[] {
  const xs = Array.isArray(maybeXs) ? maybeXs : [maybeXs];
  return xs.filter(notEmpty);
}
