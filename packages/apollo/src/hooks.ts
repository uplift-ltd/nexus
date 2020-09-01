import {
  useQuery,
  useMutation,
  MutationHookOptions,
  MutationTuple,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
} from "@apollo/client";
import { DocumentNode } from "graphql";
import { GRAPHQL_AUTH_URL, GRAPHQL_UNAUTH_URL } from "./constants";

interface ExtraOptions {
  auth?: boolean;
}

export function useEnhancedQuery<TData, TVariables = OperationVariables>(
  query: DocumentNode,
  options: QueryHookOptions<TData, TVariables> = {},
  extraOptions: ExtraOptions = { auth: true }
): QueryResult<TData, TVariables> {
  return useQuery(query, {
    ...options,
    context: {
      uri: extraOptions.auth ? GRAPHQL_AUTH_URL : GRAPHQL_UNAUTH_URL,
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
    },
  });
}
