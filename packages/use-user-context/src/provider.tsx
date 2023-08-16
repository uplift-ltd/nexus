import { DocumentNode, ErrorPolicy, useEnhancedQuery } from "@uplift-ltd/apollo";
import { setUser } from "@uplift-ltd/sentry";
import React, { useEffect, useMemo } from "react";
import { UserContext } from "./context";
import { CurrentUserShape } from "./types";

interface CurrentUserQueryShape {
  isAuthenticated: boolean;
  currentUser: CurrentUserShape | null;
}

interface UserContextProviderProps {
  children: React.ReactNode;
  currentUserQuery: DocumentNode;
  errorPolicy?: ErrorPolicy;
  skip?: boolean;
}

export function UserContextProvider<CurrentUserQueryResult extends CurrentUserQueryShape>({
  children,
  currentUserQuery,
  errorPolicy,
  skip = false,
}: UserContextProviderProps) {
  const { loading, error, data, refetch, refetching } = useEnhancedQuery<CurrentUserQueryResult>(
    currentUserQuery,
    { skip, errorPolicy },
    { auth: false }
  );

  const isAuthenticated = data ? data.isAuthenticated : false;
  const currentUser = data ? data.currentUser : null;

  useEffect(() => {
    if (currentUser) {
      setUser({
        id: currentUser.id,
        email: currentUser.email,
      });
    }
  }, [currentUser]);

  const contextValue = useMemo(() => {
    return { currentUser, error, isAuthenticated, loading, refetch, refetching };
  }, [currentUser, error, isAuthenticated, loading, refetch, refetching]);

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}
