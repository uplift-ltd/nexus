import {
  ApolloCache,
  DefaultContext,
  DocumentNode,
  MutationHookOptions,
  MutationTuple,
  NetworkStatus,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  QueryTuple,
  TypedDocumentNode,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ExtraOptions {}

export type EnhancedQueryResult<TData, TVariables extends OperationVariables> = QueryResult<
  TData,
  TVariables
> & {
  fetchingMore: boolean;
  initialLoading: boolean;
  refetching: boolean;
};

export function useEnhancedQuery<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TData = any,
  TVariables extends OperationVariables = OperationVariables
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: QueryHookOptions<TData, TVariables> = {},
  _extraOptions: ExtraOptions = {}
): EnhancedQueryResult<TData, TVariables> {
  const result = useQuery(query, {
    ...options,
  });

  return {
    ...result,
    fetchingMore: result.networkStatus === NetworkStatus.fetchMore,
    initialLoading: result.networkStatus === NetworkStatus.loading,
    refetching: result.networkStatus === NetworkStatus.refetch,
  };
}

export function useEnhancedLazyQuery<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TData = any,
  TVariables extends OperationVariables = OperationVariables
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: QueryHookOptions<TData, TVariables> = {},
  _extraOptions: ExtraOptions = {}
): QueryTuple<TData, TVariables> {
  return useLazyQuery(query, {
    ...options,
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
  _extraOptions: ExtraOptions = {}
): MutationTuple<TData, TVariables, TContext, TCache> {
  return useMutation(mutation, {
    ...options,
    // context: {
    //   ...options.context,
    // } as TContext,
    // TODO: figure out a way to remove this cast
  });
}
