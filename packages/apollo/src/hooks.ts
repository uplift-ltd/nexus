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
} from "@apollo/client";
import { DocumentNode } from "graphql";
import { GRAPHQL_AUTH_URL, GRAPHQL_UNAUTH_URL } from "./constants";

export interface ExtraOptions {
  auth?: boolean;
}

export type EnhancedQueryResult<TData, TVariables> = QueryResult<TData, TVariables> & {
  initialLoading: boolean;
  refetching: boolean;
  fetchingMore: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useEnhancedQuery<TData = any, TVariables = OperationVariables>(
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useEnhancedLazyQuery<TData = any, TVariables = OperationVariables>(
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useEnhancedMutation<TData = any, TVariables = OperationVariables>(
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: MutationHookOptions<TData, TVariables> = {},
  extraOptions: ExtraOptions = { auth: true }
): MutationTuple<TData, TVariables> {
  return useMutation(mutation, {
    ...options,
    context: {
      uri: extraOptions.auth ? GRAPHQL_AUTH_URL : GRAPHQL_UNAUTH_URL,
      ...options.context,
    },
  });
}
