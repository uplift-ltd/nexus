import {
  ApolloCache,
  ApolloClient,
  ApolloClientOptions,
  ApolloError,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
  Operation,
  ServerError,
} from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { HttpLink } from "@apollo/client/link/http";
import { RetryLink } from "@apollo/client/link/retry";
import { GRAPHQL_AUTH_URL, GRAPHQL_BATCHING, IS_SSR } from "@uplift-ltd/constants";
import { captureException, captureMessage } from "@uplift-ltd/sentry";
import { GraphQLError } from "graphql";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let globalApolloClient: ApolloClient<any>;

interface ExtraHeaders {
  authorization?: string;
  cookie?: string;
}

export interface ConfigureClientOptions extends Omit<ApolloClientOptions<unknown>, "cache"> {
  initialState?: NormalizedCacheObject;
  cache?: ApolloCache<unknown>;
  fetch?: BatchHttpLink.Options["fetch"];
  fetchOptions?: BatchHttpLink.Options["fetchOptions"];
  batch?: boolean;
  batchInterval?: BatchHttpLink.Options["batchInterval"];
  batchKey?: BatchHttpLink.Options["batchKey"];
  batchMax?: BatchHttpLink.Options["batchMax"];
  extraLinks?: ApolloLink[];
  cookie?: string;
  getToken?: () => string | null | Promise<string | null>;
  removeToken?: () => void;
  onNetworkError?: (err: ApolloError["networkError"], operation: Operation) => void;
  onGraphqlErrors?: (errors: readonly GraphQLError[], operation: Operation) => void;
  onNotAuthorized?: (err: ApolloError["networkError"], operation: Operation) => void;
  onForbidden?: (err: ApolloError["networkError"], operation: Operation) => void;
}

const defaultFetch = typeof window !== "undefined" ? window.fetch : undefined;

export const configureClient = ({
  initialState = {},
  cache = new InMemoryCache(),
  fetch = defaultFetch,
  fetchOptions,
  batch = GRAPHQL_BATCHING,
  batchInterval,
  batchKey,
  batchMax,
  credentials = "same-origin",
  extraLinks = [],
  cookie,
  getToken,
  removeToken,
  onNetworkError,
  onGraphqlErrors,
  onNotAuthorized,
  onForbidden,
  ...otherOptions
}: ConfigureClientOptions) => {
  cache.restore(initialState);

  // eslint-disable-next-line consistent-return
  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (networkError) {
      if (operation.operationName === "CurrentUser") {
        // response.errors = null;
        // response is undefined for networkError so we return a fake store
        // https://github.com/apollographql/apollo-link/issues/855
        return Observable.of({ data: { currentUser: null } });
      }

      console.warn(`[Network error]: ${networkError}`);

      // pluck errors out of the result and send to sentry
      // typing says result is an object but since we use batch http link it's actually an array
      const serverError = networkError as ServerError;
      const errors =
        serverError.result?.errors ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        serverError.result?.map?.((result: Record<string, any>) => result.errors);

      captureException(networkError, {
        extra: {
          operationName: operation.operationName,
          query: operation.query,
          errors,
        },
      });

      onNetworkError && onNetworkError(networkError, operation);

      // If we get a 401, we log out the user
      if ((networkError as ServerError).statusCode === 401) {
        removeToken && removeToken();
        onNotAuthorized && onNotAuthorized(networkError, operation);
      } else if ((networkError as ServerError).statusCode === 403) {
        onForbidden && onForbidden(networkError, operation);
      }
    }

    if (graphQLErrors) {
      graphQLErrors.forEach((graphqlError) => {
        // This is not supposed to be a string, but it is sometimes?
        // Maybe it's a graphene thang? Anyway, we'll handle it.
        if (typeof graphqlError === "string") {
          console.warn(`[GraphQL error]: Message: ${graphqlError}`);
        }
        // Default apollo handling
        else {
          const { message, locations, path } = graphqlError;
          console.warn(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          );
        }
      });

      captureMessage("GraphQL Errors", {
        extra: {
          operationName: operation.operationName,
          query: operation.query,
          errors: graphQLErrors,
        },
      });

      if (graphQLErrors.length > 0 && onGraphqlErrors) {
        onGraphqlErrors(graphQLErrors, operation);
      }
    }
  });

  const authLink = setContext(async (_, { headers }) => {
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

  if (batch) {
    links.push(
      new BatchHttpLink({
        uri: GRAPHQL_AUTH_URL,
        credentials,
        fetch,
        fetchOptions,
        batchInterval,
        batchKey,
        batchMax,
      })
    );
  } else {
    links.push(
      new HttpLink({
        uri: GRAPHQL_AUTH_URL,
        credentials,
        fetch,
        fetchOptions,
      })
    );
  }

  return new ApolloClient({
    ssrMode: IS_SSR,
    credentials,
    link: ApolloLink.from(links),
    cache,
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
