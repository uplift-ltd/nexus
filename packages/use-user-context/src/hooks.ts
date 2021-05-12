import { useContext } from "react";
import { UserContext, UserContextShape } from "./context";
import { CurrentUserShape } from "./types";

export function useUserContext<CurrentUser extends CurrentUserShape>() {
  const context = useContext<UserContextShape<CurrentUser>>(UserContext);
  return context;
}

export function useAssertUserContext<UserShape extends CurrentUserShape>() {
  const { currentUser } = useUserContext<UserShape>();

  if (!currentUser) {
    throw new Error("You must be logged in.");
  }

  return currentUser;
}
