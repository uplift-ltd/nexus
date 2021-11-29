import { DocumentNode, useEnhancedQuery } from "@uplift-ltd/apollo";
import { setUser } from "@uplift-ltd/sentry";
import React, { useEffect } from "react";
import { UserContext } from "./context";
import { CurrentUserShape } from "./types";

interface CurrentUserQueryShape {
  isAuthenticated: boolean;
  currentUser: CurrentUserShape | null;
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
  const { loading, error, data, refetch, refetching } = useEnhancedQuery<CurrentUserQueryResult>(
    currentUserQuery,
    {
      skip,
    },
    {
      auth: false,
    }
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

  return (
    <UserContext.Provider
      value={{ loading, error, isAuthenticated, currentUser, refetch, refetching }}
    >
      {children}
    </UserContext.Provider>
  );
}
