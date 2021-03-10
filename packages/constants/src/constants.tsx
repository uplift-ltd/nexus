// GraphQL / Apollo constants
export const GRAPHQL_TOKEN = process.env.REACT_APP_GRAPHQL_TOKEN || "GRAPHQL_TOKEN";
export const GRAPHQL_HOST = process.env.REACT_APP_GRAPHQL_HOST || "http://localhost:5000";
export const GRAPHQL_BATCHING = process.env.REACT_APP_GRAPHQL_BATCHING !== "false";

export const GRAPHQL_AUTH_ENDPOINT = GRAPHQL_BATCHING ? "/batch/auth/graphql/" : "/auth/graphql/";
export const GRAPHQL_UNAUTH_ENDPOINT = GRAPHQL_BATCHING ? "/batch/graphql/" : "/graphql/";

// GitHub Actions
export const GITHUB_SHA = process.env.GITHUB_SHA || "";
export const GITHUB_RUN_NUMBER = process.env.GITHUB_RUN_NUMBER || "";

// Environment
export const IS_SSR = typeof window === "undefined";
export const IS_REACT_NATIVE =
  typeof navigator !== "undefined" && navigator.product === "ReactNative";
