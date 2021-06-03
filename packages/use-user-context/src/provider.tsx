import { DocumentNode, useEnhancedQuery } from "@uplift-ltd/apollo";
import Sentry from "@uplift-ltd/sentry";
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
  const { loading, error, data } = useEnhancedQuery<CurrentUserQueryResult>(
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
      Sentry.setUser({
        id: currentUser.id,
        email: currentUser.email,
      });
    }
  }, [currentUser]);

  return (
    <UserContext.Provider value={{ loading, error, isAuthenticated, currentUser }}>
      {children}
    </UserContext.Provider>
  );
}
