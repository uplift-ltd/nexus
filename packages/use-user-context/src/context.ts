import { ApolloError, ApolloQueryResult, NetworkStatus } from "@uplift-ltd/apollo";
import { createContext } from "react";

import { CurrentUserShape } from "./types.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UserContextShape<CurrentUser extends CurrentUserShape = any> {
  currentUser: CurrentUser | null;
  error?: ApolloError;
  isAuthenticated: boolean;
  loading: boolean;
  refetch(): Promise<ApolloQueryResult<CurrentUser>>;
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
