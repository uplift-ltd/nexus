import { Operation, selectURI } from "@apollo/client";
import { GRAPHQL_UNAUTH_ENDPOINT } from "@uplift-ltd/constants";

export function defaultBatchKey(
  operation: Operation,
  fallbackURI: string = GRAPHQL_UNAUTH_ENDPOINT
) {
  const context = operation.getContext();
  const contextConfig = {
    http: context.http,
    options: context.fetchOptions,
    credentials: context.credentials,
    headers: context.headers,
  };
  return selectURI(operation, fallbackURI) + JSON.stringify(contextConfig);
}

export function getDefaultBatchKey(fallbackURI: string = GRAPHQL_UNAUTH_ENDPOINT) {
  return function batchKey(operation: Operation) {
    return defaultBatchKey(operation, fallbackURI);
  };
}
