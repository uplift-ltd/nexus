// Environment
export const IS_SSR = typeof window === "undefined";
export const IS_REACT_NATIVE =
  typeof navigator !== "undefined" && navigator.product === "ReactNative";
