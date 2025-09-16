import { NetworkStatus, OperationVariables, TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import React, { useEffect, useMemo } from "react";

import { UserContext } from "./context.js";
import { CurrentUser, CurrentUserQuery } from "./types.js";

type UserContextProviderProps<TVariables extends OperationVariables> = {
  children: React.ReactNode;
  currentUserQuery: TypedDocumentNode<CurrentUserQuery, TVariables>;
  currentUserQueryOptions: useQuery.Options<CurrentUserQuery, TVariables>;
  setUser?: (user: CurrentUser) => void;
};

export function UserContextProvider<TVariables extends OperationVariables>({
  children,
  currentUserQuery,
  currentUserQueryOptions,
  setUser,
}: UserContextProviderProps<TVariables>) {
  const { data, error, loading, networkStatus, refetch } = useQuery<CurrentUserQuery, TVariables>(
    currentUserQuery,
    currentUserQueryOptions
  );
  const refetching = networkStatus === NetworkStatus.refetch;

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
