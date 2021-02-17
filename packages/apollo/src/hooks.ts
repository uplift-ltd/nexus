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
} from "@apollo/client";
import { DocumentNode } from "graphql";
import { GRAPHQL_AUTH_URL, GRAPHQL_UNAUTH_URL } from "./constants";

interface ExtraOptions {
  auth?: boolean;
}

type EnhancedQueryResult<TData, TVariables> = QueryResult<TData, TVariables> & {
  initialLoading: boolean;
  refetching: boolean;
  fetchingMore: boolean;
};

export function useEnhancedQuery<TData, TVariables = OperationVariables>(
  query: DocumentNode,
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
    initialLoading:
      result.networkStatus === NetworkStatus.loading ||
      result.networkStatus === NetworkStatus.setVariables,
    refetching: result.networkStatus === NetworkStatus.refetch,
    fetchingMore: result.networkStatus === NetworkStatus.fetchMore,
  };
}

export function useEnhancedLazyQuery<TData, TVariables = OperationVariables>(
  query: DocumentNode,
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

export function useEnhancedMutation<TData, TVariables = OperationVariables>(
  mutation: DocumentNode,
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
