import { ApolloError, ApolloQueryResult, NetworkStatus } from "@uplift-ltd/apollo";
import { createContext } from "react";

import { type CurrentUser, type CurrentUserQuery } from "./types.js";

export interface UserContextShape {
  currentUser: CurrentUser | null;
  error?: ApolloError;
  isAuthenticated: boolean;
  loading: boolean;
  refetch(): Promise<ApolloQueryResult<CurrentUserQuery | null>>;
  refetching: boolean;
}

export const UserContext = createContext<UserContextShape>({
  currentUser: null,
  isAuthenticated: false,
  loading: true,
  refetch: async () => {
    return {
      data: null,
      loading: false,
      networkStatus: NetworkStatus.ready,
    };
  },
  refetching: false,
});
