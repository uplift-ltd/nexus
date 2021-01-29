// get values from environment with default fallback
export function env(key: string): string | undefined;
export function env(key: string, defaultValue: string): string;
export function env(key: string, defaultValue?: string) {
  return process.env[key] || defaultValue;
}

// GraphQL / Apollo constants
export const GRAPHQL_TOKEN = env("REACT_APP_GRAPHQL_TOKEN", "GRAPHQL_TOKEN");
export const GRAPHQL_HOST = env("REACT_APP_GRAPHQL_HOST", "http://localhost:5000");
export const GRAPHQL_BATCHING = env("REACT_APP_GRAPHQL_BATCHING") !== "false";

export const GRAPHQL_AUTH_ENDPOINT = GRAPHQL_BATCHING ? "/batch/auth/graphql/" : "/auth/graphql/";
export const GRAPHQL_UNAUTH_ENDPOINT = GRAPHQL_BATCHING ? "/batch/graphql/" : "/graphql/";
