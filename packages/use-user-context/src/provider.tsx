import { TypedDocumentNode, useEnhancedQuery } from "@uplift-ltd/apollo";
import React, { useEffect, useMemo } from "react";

import { UserContext } from "./context.js";
import { CurrentUser, CurrentUserQueryOptions } from "./types.js";

type UserContextProviderProps = {
  children: React.ReactNode;
  currentUserQuery: TypedDocumentNode<
    CurrentUserQueryOptions["query"],
    CurrentUserQueryOptions["variables"]
  >;
  currentUserQueryOptions: CurrentUserQueryOptions["variables"];
  setUser?: (user: CurrentUser) => void;
};

export function UserContextProvider({
  children,
  currentUserQuery,
  currentUserQueryOptions,
  setUser,
}: UserContextProviderProps) {
  const { data, error, loading, refetch, refetching } = useEnhancedQuery<
    CurrentUserQueryOptions["query"],
    CurrentUserQueryOptions["variables"]
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
