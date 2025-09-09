import { ApolloLink, selectURI } from "@apollo/client";

export function defaultBatchKey(operation: ApolloLink.Operation, fallbackURI: string) {
  const context = operation.getContext();
  const contextConfig = {
    credentials: context.credentials,
    headers: context.headers,
    http: context.http,
    options: context.fetchOptions,
  };
  return selectURI(operation, fallbackURI) + JSON.stringify(contextConfig);
}

export function getDefaultBatchKey(fallbackURI: string) {
  return function batchKey(operation: ApolloLink.Operation) {
    return defaultBatchKey(operation, fallbackURI);
  };
}
