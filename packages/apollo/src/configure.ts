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
import { IS_SSR } from "@uplift-ltd/constants";
import { captureException, captureMessage } from "@uplift-ltd/nexus-errors";
import { GraphQLError } from "graphql";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let globalApolloClient: ApolloClient<any>;

interface ExtraHeaders {
  authorization?: string;
  cookie?: string;
}

export interface ConfigureClientOptions extends Omit<ApolloClientOptions<unknown>, "cache"> {
  batch?: boolean;
  batchInterval?: BatchHttpLink.Options["batchInterval"];
  batchKey?: BatchHttpLink.Options["batchKey"];
  batchMax?: BatchHttpLink.Options["batchMax"];
  cache?: ApolloCache<unknown>;
  cookie?: string;
  extraLinks?: ApolloLink[];
  fetch?: BatchHttpLink.Options["fetch"];
  fetchOptions?: BatchHttpLink.Options["fetchOptions"];
  getToken?: () => Promise<null | string> | null | string;
  initialState?: NormalizedCacheObject;
  onForbidden?: (err: ApolloError["networkError"], operation: Operation) => void;
  onGraphqlErrors?: (errors: readonly GraphQLError[], operation: Operation) => void;
  onNetworkError?: (err: ApolloError["networkError"], operation: Operation) => void;
  onNotAuthorized?: (err: ApolloError["networkError"], operation: Operation) => void;
  removeToken?: () => void;
}

const defaultFetch = typeof window !== "undefined" ? window.fetch : undefined;

export const configureClient = ({
  batch = true,
  batchInterval,
  batchKey,
  batchMax,
  cache = new InMemoryCache(),
  cookie,
  credentials = "same-origin",
  extraLinks = [],
  fetch = defaultFetch,
  fetchOptions,
  getToken,
  initialState = {},
  onForbidden,
  onGraphqlErrors,
  onNetworkError,
  onNotAuthorized,
  removeToken,
  uri,
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
          errors,
          operationName: operation.operationName,
          query: operation.query,
        },
      });

      onNetworkError?.(networkError, operation);

      // If we get a 401, we log out the user
      if ((networkError as ServerError).statusCode === 401) {
        removeToken?.();
        onNotAuthorized?.(networkError, operation);
      } else if ((networkError as ServerError).statusCode === 403) {
        onForbidden?.(networkError, operation);
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
          const { locations, message, path } = graphqlError;
          console.warn(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          );
        }
      });

      captureMessage("GraphQL Errors", {
        extra: {
          errors: graphQLErrors,
          operationName: operation.operationName,
          query: operation.query,
        },
        level: "warning",
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
    credentials,
    link: ApolloLink.from(links),
    ssrMode: IS_SSR,
    uri,
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
