import { ApolloError } from "@uplift-ltd/apollo";
import { createContext } from "react";
import { CurrentUserShape } from "./types";

export interface UserContextShape<CurrentUser extends CurrentUserShape = any> {
  loading: boolean;
  error?: ApolloError;
  isAuthenticated: boolean;
  currentUser: CurrentUser | null;
}

export const UserContext = createContext<UserContextShape>({
  loading: true,
  isAuthenticated: false,
  currentUser: null,
});
