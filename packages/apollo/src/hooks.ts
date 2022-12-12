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
import { notEmpty } from "@uplift-ltd/ts-helpers";
import { DocumentNode } from "graphql";
import { GRAPHQL_AUTH_URL, GRAPHQL_UNAUTH_URL } from "./constants";

export interface ExtraOptions {
  auth?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EnhancedQueryHookOptions<TData = any, TVariables = OperationVariables>
  extends QueryHookOptions<TData, TVariables> {
  skipVariables?: (keyof TVariables)[];
}

export type EnhancedQueryResult<TData, TVariables> = QueryResult<TData, TVariables> & {
  fetchingMore: boolean;
  initialLoading: boolean;
  refetching: boolean;
};

type DeriveSkipFromSkipAndSkipVariablesArgs<
  Variables extends OperationVariables = OperationVariables
> = {
  skip?: QueryHookOptions["skip"];
  predicate?: (value: unknown) => boolean;
  skipVariables?: (keyof Variables)[];
  variables?: Variables;
};

/**
 * Derives whether the query should be skipped based on an explicit skip, or
 * the existence of query variables that should be notEmpty based on a provided
 * list of skipVariables (a list of variable keys).
 *
 * Predicate defaults to `notEmpty` but can be customized
 */
function deriveSkipFromSkipAndSkipVariables<Variables = OperationVariables>({
  skip,
  predicate = notEmpty,
  skipVariables = [],
  variables,
}: DeriveSkipFromSkipAndSkipVariablesArgs<Variables>) {
  // early return if we have explicitly marked it as skip,
  // or if there are no variables defined
  if (skip) return skip;
  if (!variables) return false;

  return skipVariables.some((variable) => predicate(variables[variable]));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useEnhancedQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: EnhancedQueryHookOptions<TData, TVariables> = {},
  extraOptions: ExtraOptions = { auth: true }
): EnhancedQueryResult<TData, TVariables> {
  const result = useQuery(query, {
    ...options,
    skip: deriveSkipFromSkipAndSkipVariables({
      skip: options.skip,
      skipVariables: options.skipVariables,
      variables: options.variables,
    }),
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
