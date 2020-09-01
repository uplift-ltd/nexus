import {
  ApolloClient,
  ApolloLink,
  NormalizedCacheObject,
  Observable,
  ApolloCache,
  ServerError,
  ApolloClientOptions,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import Sentry from "@uplift-ltd/sentry";
import { GRAPHQL_AUTH_URL, IS_SSR } from "./constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let globalApolloClient: ApolloClient<any>;

interface ExtraHeaders {
  authorization?: string;
  cookie?: string;
}

interface ConfigureClientOptions extends ApolloClientOptions<unknown> {
  initialState: NormalizedCacheObject;
  cache: ApolloCache<unknown>;
  cookie?: string;
  getToken?: () => string | null | Promise<string | null>;
  removeToken?: () => void;
  onNotAuthorized?: () => void;
  onForbidden?: () => void;
}

export const configureClient = ({
  initialState,
  cache = new InMemoryCache(),
  cookie,
  getToken,
  removeToken,
  onNotAuthorized,
  onForbidden,
  ...otherOptions
}: ConfigureClientOptions) => {
  cache.restore(initialState);

  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (networkError) {
      if (operation.operationName === "CurrentUser") {
        // response.errors = null;
        // response is undefined for networkError so we return a fake store
        // https://github.com/apollographql/apollo-link/issues/855
        return Observable.of({ data: { currentUser: null } });
      }
      Sentry.captureException(networkError);
      console.warn(`[Network error]: ${networkError}`);

      // If we get a 401, we log out the user
      if ((networkError as ServerError).statusCode === 401) {
        removeToken && removeToken();
        onNotAuthorized && onNotAuthorized();
      } else if ((networkError as ServerError).statusCode === 403) {
        onForbidden && onForbidden();
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

  return new ApolloClient({
    ssrMode: IS_SSR,
    link: ApolloLink.from([
      errorLink,
      authLink,
      new BatchHttpLink({
        uri: GRAPHQL_AUTH_URL,
        credentials: "same-origin",
        fetch,
      }),
    ]),
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
