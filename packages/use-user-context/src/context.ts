import { ApolloError, ApolloQueryResult, NetworkStatus } from "@uplift-ltd/apollo";
import { createContext } from "react";
import { CurrentUserShape } from "./types.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UserContextShape<CurrentUser extends CurrentUserShape = any> {
  loading: boolean;
  error?: ApolloError;
  isAuthenticated: boolean;
  currentUser: CurrentUser | null;
  refetch(): Promise<ApolloQueryResult<CurrentUser>>;
  refetching: boolean;
}

export const UserContext = createContext<UserContextShape>({
  loading: true,
  isAuthenticated: false,
  currentUser: null,
  refetch: async () => {
    return {
      data: null,
      loading: false,
      networkStatus: NetworkStatus.ready,
    };
  },
  refetching: false,
});
