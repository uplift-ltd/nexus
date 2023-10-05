import { DocumentNode, useEnhancedQuery } from "@uplift-ltd/apollo";
import { setUser } from "@uplift-ltd/sentry";
import React, { useEffect, useMemo } from "react";
import { UserContext } from "./context.js";
import { CurrentUserShape } from "./types.js";

interface CurrentUserQueryShape {
  currentUser: CurrentUserShape | null;
  isAuthenticated: boolean;
}

interface UserContextProviderProps {
  children: React.ReactNode;
  currentUserQuery: DocumentNode;
  skip?: boolean;
}

export function UserContextProvider<CurrentUserQueryResult extends CurrentUserQueryShape>({
  children,
  currentUserQuery,
  skip = false,
}: UserContextProviderProps) {
  const { data, error, loading, refetch, refetching } = useEnhancedQuery<CurrentUserQueryResult>(
    currentUserQuery,
    { skip },
    { auth: false }
  );

  const isAuthenticated = data ? data.isAuthenticated : false;
  const currentUser = data ? data.currentUser : null;

  useEffect(() => {
    if (currentUser) {
      setUser({
        email: currentUser.email,
        id: currentUser.id,
      });
    }
  }, [currentUser]);

  const contextValue = useMemo(() => {
    return { currentUser, error, isAuthenticated, loading, refetch, refetching };
  }, [currentUser, error, isAuthenticated, loading, refetch, refetching]);

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}
