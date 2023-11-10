import { Operation, selectURI } from "@apollo/client";

export function defaultBatchKey(operation: Operation, fallbackURI: string) {
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
  return function batchKey(operation: Operation) {
    return defaultBatchKey(operation, fallbackURI);
  };
}
