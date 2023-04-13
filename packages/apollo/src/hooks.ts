import {
  useQuery,
  useLazyQuery,
  useMutation,
  MutationHookOptions,
  MutationTuple,
  NetworkStatus,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  QueryTuple,
  TypedDocumentNode,
  DefaultContext,
  ApolloCache,
  DocumentNode,
} from "@apollo/client";
import { GRAPHQL_AUTH_URL, GRAPHQL_UNAUTH_URL } from "./constants.js";

export interface ExtraOptions {
  auth?: boolean;
}

export type EnhancedQueryResult<TData, TVariables extends OperationVariables> = QueryResult<
  TData,
  TVariables
> & {
  initialLoading: boolean;
  refetching: boolean;
  fetchingMore: boolean;
};

export function useEnhancedQuery<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TData = any,
  TVariables extends OperationVariables = OperationVariables
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: QueryHookOptions<TData, TVariables> = {},
  extraOptions: ExtraOptions = { auth: true }
): EnhancedQueryResult<TData, TVariables> {
  const result = useQuery(query, {
    ...options,
    context: {
      uri: extraOptions.auth ? GRAPHQL_AUTH_URL : GRAPHQL_UNAUTH_URL,
      ...options.context,
    },
  });

  return {
    ...result,
    initialLoading: result.networkStatus === NetworkStatus.loading,
    refetching: result.networkStatus === NetworkStatus.refetch,
    fetchingMore: result.networkStatus === NetworkStatus.fetchMore,
  };
}

export function useEnhancedLazyQuery<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TData = any,
  TVariables extends OperationVariables = OperationVariables
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: QueryHookOptions<TData, TVariables> = {},
  extraOptions: ExtraOptions = { auth: true }
): QueryTuple<TData, TVariables> {
  return useLazyQuery(query, {
    ...options,
    context: {
      uri: extraOptions.auth ? GRAPHQL_AUTH_URL : GRAPHQL_UNAUTH_URL,
      ...options.context,
    },
  });
}

export interface EnhancedDefaultContext extends DefaultContext {
  uri?: string;
}

export function useEnhancedMutation<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
  TContext extends EnhancedDefaultContext = EnhancedDefaultContext,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TCache extends ApolloCache<any> = ApolloCache<any>
>(
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: MutationHookOptions<TData, TVariables, TContext, TCache> = {},
  extraOptions: ExtraOptions = { auth: true }
): MutationTuple<TData, TVariables, TContext, TCache> {
  return useMutation(mutation, {
    ...options,
    context: {
      uri: extraOptions.auth ? GRAPHQL_AUTH_URL : GRAPHQL_UNAUTH_URL,
      ...options.context,
    } as TContext,
    // TODO: figure out a way to remove this cast
  });
}
