import { DocumentNode, useEnhancedQuery } from "@uplift-ltd/apollo";
import Sentry from "@uplift-ltd/sentry";
import React, { useEffect } from "react";
import { UserContext } from "./context";
import { CurrentUserShape } from "./types";

interface AuthenticatedQueryShape {
  isAuthenticated: boolean;
}

interface CurrentUserQueryShape {
  currentUser: CurrentUserShape | null;
}

interface UserContextProviderProps {
  children: React.ReactNode;
  getToken?: () => string | undefined;
  authenticatedQuery: DocumentNode;
  currentUserQuery: DocumentNode;
}

export function UserContextProvider<
  AuthenticatedQueryResult extends AuthenticatedQueryShape,
  CurrentUserQueryResult extends CurrentUserQueryShape
>({
  children,
  getToken = () => "token", // return truthy so we don't disable the query if this is not passed in
  authenticatedQuery,
  currentUserQuery,
}: UserContextProviderProps) {
  const {
    loading: authenticatedLoading,
    error: authenticatedError,
    data: authenticatedData,
  } = useEnhancedQuery<AuthenticatedQueryResult>(authenticatedQuery, {}, { auth: false });

  const {
    loading: currentUserLoading,
    error: currentUserError,
    data: currentUserData,
  } = useEnhancedQuery<CurrentUserQueryResult>(currentUserQuery, {
    skip: Boolean(getToken()),
  });

  const loading = authenticatedLoading || currentUserLoading;
  const error = authenticatedError || currentUserError;

  const isAuthenticated = authenticatedData ? authenticatedData.isAuthenticated : false;
  const currentUser = currentUserData ? currentUserData.currentUser : null;

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
