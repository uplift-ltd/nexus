export const IS_SSR = typeof window === "undefined";
export const IS_REACT_NATIVE =
  typeof navigator !== "undefined" && navigator.product === "ReactNative";

export const GRAPHQL_HOST = process.env.REACT_APP_GRAPHQL_HOST || "http://localhost:5000";

export const GRAPHQL_BATCHING = process.env.REACT_APP_GRAPHQL_BATCHING !== "false";

const GRAPHQL_AUTH_ENDPOINT = GRAPHQL_BATCHING ? "/batch/auth/graphql/" : "/auth/graphql/";
const GRAPHQL_UNAUTH_ENDPOINT = GRAPHQL_BATCHING ? "/batch/graphql/" : "/graphql/";

export const GRAPHQL_AUTH_URL =
  IS_SSR || IS_REACT_NATIVE ? `${GRAPHQL_HOST}${GRAPHQL_AUTH_ENDPOINT}` : GRAPHQL_AUTH_ENDPOINT;

export const GRAPHQL_UNAUTH_URL =
  IS_SSR || IS_REACT_NATIVE ? `${GRAPHQL_HOST}${GRAPHQL_UNAUTH_ENDPOINT}` : GRAPHQL_UNAUTH_ENDPOINT;
