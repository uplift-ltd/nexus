import {
  GRAPHQL_TOKEN,
  GRAPHQL_HOST,
  GRAPHQL_BATCHING,
  GRAPHQL_AUTH_ENDPOINT,
  GRAPHQL_UNAUTH_ENDPOINT,
} from "@uplift-ltd/constants";

export const IS_SSR = typeof window === "undefined";
export const IS_REACT_NATIVE =
  typeof navigator !== "undefined" && navigator.product === "ReactNative";

export const GRAPHQL_AUTH_URL =
  IS_SSR || IS_REACT_NATIVE ? `${GRAPHQL_HOST}${GRAPHQL_AUTH_ENDPOINT}` : GRAPHQL_AUTH_ENDPOINT;

export const GRAPHQL_UNAUTH_URL =
  IS_SSR || IS_REACT_NATIVE ? `${GRAPHQL_HOST}${GRAPHQL_UNAUTH_ENDPOINT}` : GRAPHQL_UNAUTH_ENDPOINT;

export {
  GRAPHQL_TOKEN,
  GRAPHQL_HOST,
  GRAPHQL_BATCHING,
  GRAPHQL_AUTH_ENDPOINT,
  GRAPHQL_UNAUTH_ENDPOINT,
};
