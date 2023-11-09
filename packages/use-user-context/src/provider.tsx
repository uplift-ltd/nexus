import {
  OperationVariables,
  QueryHookOptions,
  TypedDocumentNode,
  useEnhancedQuery,
} from "@uplift-ltd/apollo";
import React, { useEffect, useMemo } from "react";

import { UserContext } from "./context.js";
import { CurrentUser, CurrentUserQueryOptions } from "./types.js";

type UserContextProviderProps<TVariables extends OperationVariables> = {
  children: React.ReactNode;
  currentUserQuery: TypedDocumentNode<CurrentUserQueryOptions["query"], TVariables>;
  currentUserQueryOptions: QueryHookOptions<CurrentUserQueryOptions["query"], TVariables>;
  setUser?: (user: CurrentUser) => void;
};

export function UserContextProvider<TVariables extends OperationVariables>({
  children,
  currentUserQuery,
  currentUserQueryOptions,
  setUser,
}: UserContextProviderProps<TVariables>) {
  const { data, error, loading, refetch, refetching } = useEnhancedQuery<
    CurrentUserQueryOptions["query"],
    TVariables
  >(currentUserQuery, currentUserQueryOptions);

  const currentUser = data ? data.currentUser : null;

  useEffect(() => {
    if (currentUser) {
      setUser?.(currentUser);
    }
  }, [currentUser, setUser]);

  const contextValue = useMemo(() => {
    return { currentUser, error, isAuthenticated: !!currentUser, loading, refetch, refetching };
  }, [currentUser, error, loading, refetch, refetching]);

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}
