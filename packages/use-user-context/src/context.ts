import { ApolloClient, ErrorLike, OperationVariables } from "@apollo/client";
import { createContext } from "react";

import { type CurrentUser, type CurrentUserQuery } from "./types.js";

export interface UserContextShape {
  currentUser: CurrentUser | null;
  error?: ErrorLike;
  isAuthenticated: boolean;
  loading: boolean;
  refetch(variables?: OperationVariables): Promise<ApolloClient.QueryResult<CurrentUserQuery>>;
  refetching: boolean;
}

export const UserContext = createContext<UserContextShape>({
  currentUser: null,
  isAuthenticated: false,
  loading: true,
  refetch: async () => {
    throw new Error("refetch called before context initialized");
  },
  refetching: false,
});
