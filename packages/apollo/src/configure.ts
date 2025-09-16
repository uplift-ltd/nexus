import {
  ApolloCache,
  ApolloClient,
  ApolloLink,
  CombinedGraphQLErrors,
  InMemoryCache,
  NormalizedCacheObject,
  ServerError,
} from "@apollo/client";
import { of } from "rxjs";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { HttpLink } from "@apollo/client/link/http";
import { RetryLink } from "@apollo/client/link/retry";
import { IS_SSR } from "@uplift-ltd/constants";
import { type CaptureExceptionHandler, type CaptureMessageHandler } from "@uplift-ltd/nexus-types";
import { FormattedExecutionResult, GraphQLFormattedError } from "graphql";

let globalApolloClient: ApolloClient;

interface ExtraHeaders {
  authorization?: string;
  cookie?: string;
}

export interface ConfigureClientOptions extends Omit<ApolloClient.Options, "cache" | "link"> {
  batch?: boolean;
  batchInterval?: BatchHttpLink.Options["batchInterval"];
  batchKey?: BatchHttpLink.Options["batchKey"];
  batchMax?: BatchHttpLink.Options["batchMax"];
  cache?: ApolloCache;
  captureException?: CaptureExceptionHandler;
  captureMessage?: CaptureMessageHandler;
  cookie?: string;
  credentials?: HttpLink.Options["credentials"];
  extraLinks?: ApolloLink[];
  fetch?: BatchHttpLink.Options["fetch"];
  fetchOptions?: BatchHttpLink.Options["fetchOptions"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getServerResultErrors?: (result: ApolloLink.Result | undefined) => any;
  getToken?: () => Promise<null | string> | null | string;
  initialState?: NormalizedCacheObject;
  link?: ApolloLink;
  onForbidden?: (err: ServerError, operation: ApolloLink.Operation) => void;
  onGraphqlErrors?: (
    errors: readonly GraphQLFormattedError[],
    operation: ApolloLink.Operation
  ) => void;
  onNotAuthorized?: (err: ServerError, operation: ApolloLink.Operation) => void;
  onServerError?: (err: ServerError, operation: ApolloLink.Operation) => void;
  removeToken?: () => void;
  terminatingLink?: ApolloLink;
  uri?: HttpLink.Options["uri"];
}

function defaultGetServerResultErrors(serverErrorResult: ApolloLink.Result | undefined) {
  // if (typeof serverErrorResult === "string") {
  //   return [serverErrorResult];
  // }
  // typing says result is an object but when batch http link is used it's actually an array
  if (Array.isArray(serverErrorResult)) {
    return (serverErrorResult as unknown as FormattedExecutionResult[])?.map?.(
      (result) => result.errors
    );
  }
  return serverErrorResult?.errors;
}

const defaultFetch = typeof window !== "undefined" ? window.fetch : undefined;

export const configureClient = ({
  batch = true,
  batchInterval,
  batchKey,
  batchMax,
  cache = new InMemoryCache(),
  captureException,
  captureMessage,
  cookie,
  credentials = "same-origin",
  extraLinks = [],
  fetch = defaultFetch,
  fetchOptions,
  getServerResultErrors = defaultGetServerResultErrors,
  getToken,
  initialState = {},
  onForbidden,
  onGraphqlErrors,
  onNotAuthorized,
  onServerError,
  removeToken,
  terminatingLink,
  uri,
  ...otherOptions
}: ConfigureClientOptions) => {
  cache.restore(initialState);

  const errorLink = new ErrorLink(({ error, operation, result }) => {
    if (ServerError.is(error)) {
      const serverError = error;
      if (operation.operationName === "CurrentUser") {
        // response.errors = null;
        // response is undefined for networkError so we return a fake store
        // https://github.com/apollographql/apollo-link/issues/855
        return of({ data: { currentUser: null } });
      }

      console.warn(`[Server error]: ${serverError}`);

      // pluck errors out of the result and send to sentry
      const errors = getServerResultErrors(result);

      captureException?.(serverError, {
        extra: {
          errors,
          operationName: operation.operationName,
          query: operation.query,
        },
      });

      onServerError?.(serverError, operation);

      // If we get a 401, we log out the user
      if (serverError.statusCode === 401) {
        removeToken?.();
        onNotAuthorized?.(serverError, operation);
      } else if (serverError.statusCode === 403) {
        onForbidden?.(serverError, operation);
      }
    }

    if (CombinedGraphQLErrors.is(error)) {
      const graphQLErrors = error.errors;
      graphQLErrors.forEach((graphqlError) => {
        // This is not supposed to be a string, but it is sometimes?
        // Maybe it's a graphene thang? Anyway, we'll handle it.
        if (typeof graphqlError === "string") {
          console.warn(`[GraphQL error]: Message: ${graphqlError}`);
        }
        // Default apollo handling
        else {
          const { locations, message, path } = graphqlError;
          console.warn(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          );
        }
      });

      captureMessage?.("GraphQL Errors", {
        extra: {
          errors: graphQLErrors,
          operationName: operation.operationName,
          query: operation.query,
        },
        level: "warning",
      });

      if (Array.isArray(graphQLErrors) && graphQLErrors.length > 0 && onGraphqlErrors) {
        onGraphqlErrors(graphQLErrors, operation);
      }
    }
  });

  const authLink = new SetContextLink(async ({ headers }) => {
    const extraHeaders: ExtraHeaders = {};
    const token = getToken && (await getToken());
    if (token) {
      extraHeaders.authorization = `Bearer ${token}`;
    }
    if (cookie) {
      extraHeaders.cookie = cookie;
    }
    return {
      headers: {
        ...headers,
        ...extraHeaders,
      },
    };
  });

  const retryLink = new RetryLink({
    attempts: {
      max: IS_SSR ? 1 : 5,
    },
  });

  const links: ApolloLink[] = [errorLink, retryLink, authLink, ...extraLinks];

  if (terminatingLink) {
    links.push(terminatingLink);
  } else if (batch) {
    links.push(
      new BatchHttpLink({
        batchInterval,
        batchKey,
        batchMax,
        credentials,
        fetch,
        fetchOptions,
        uri,
      })
    );
  } else {
    links.push(
      new HttpLink({
        credentials,
        fetch,
        fetchOptions,
        uri,
      })
    );
  }

  return new ApolloClient({
    cache,
    link: ApolloLink.from(links),
    ssrMode: IS_SSR,
    ...otherOptions,
  });
};

export const initClient = (options: ConfigureClientOptions) => {
  if (IS_SSR) {
    return configureClient(options);
  }

  if (!globalApolloClient) {
    globalApolloClient = configureClient(options);
  }

  return globalApolloClient;
};
