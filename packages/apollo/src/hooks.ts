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

// Will return true if a variable's value is empty
function isSkipVariableValueEmpty(_: unknown, value: unknown) {
  return !notEmpty(value);
}

type DeriveSkipFromSkipAndSkipVariablesArgs<
  Variables extends OperationVariables = OperationVariables
> = {
  skip?: QueryHookOptions["skip"];
  skipVariablesPredicate?: (key: keyof Variables, value: unknown) => boolean;
  skipVariables?: (keyof Variables)[];
  variables?: Variables;
};

/**
 * Derives whether the query should be skipped based on an explicit skip, or
 * the existence of query variables that should be notEmpty based on a provided
 * list of skipVariables (a list of variable keys).
 *
 * Predicate defaults to evaluating `notEmpty` on the value of the variable but can be customized
 *
 * If ANY variable evaluates to `true` in the predicate, the query will be skipped
 */
function deriveSkipFromSkipAndSkipVariables<Variables = OperationVariables>({
  skip,
  skipVariablesPredicate = isSkipVariableValueEmpty,
  skipVariables = [],
  variables,
}: DeriveSkipFromSkipAndSkipVariablesArgs<Variables>) {
  // early return if we have explicitly marked it as skip,
  // or if there are no variables defined
  if (skip) return skip;
  if (!variables) return false;

  return skipVariables.some((variable) => skipVariablesPredicate(variable, variables[variable]));
}

export interface ExtraOptions {
  auth?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EnhancedQueryHookOptions<TData = any, TVariables = OperationVariables>
  extends QueryHookOptions<TData, TVariables> {
  /**
   * list of variable keys to evaluate with skipVariablesPredicate. If the prediate
   * indicates that the variable value is missing, the query will be skipped.
   */
  skipVariables?: (keyof TVariables)[];

  /**
   * Returning true from this predicate indicates that the variable value
   * is missing and that the query should be skipped.
   */
  skipVariablesPredicate?: (key: keyof TVariables, value: unknown) => boolean;
}

export type EnhancedQueryResult<TData, TVariables> = QueryResult<TData, TVariables> & {
  fetchingMore: boolean;
  initialLoading: boolean;
  refetching: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useEnhancedQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  {
    skip,
    skipVariables,
    skipVariablesPredicate,
    ...options
  }: EnhancedQueryHookOptions<TData, TVariables> = {},
  extraOptions: ExtraOptions = { auth: true }
): EnhancedQueryResult<TData, TVariables> {
  const result = useQuery(query, {
    ...options,
    skip: deriveSkipFromSkipAndSkipVariables({
      skip,
      skipVariables,
      skipVariablesPredicate,
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
