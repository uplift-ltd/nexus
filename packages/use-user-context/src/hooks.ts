import { useContext } from "react";

import { UserContext, UserContextShape } from "./context.js";

export function useUserContext() {
  const context = useContext<UserContextShape>(UserContext);
  return context;
}

export function useAssertUserContext() {
  const { currentUser } = useUserContext();

  if (!currentUser) {
    throw new Error("You must be logged in.");
  }

  return currentUser;
}
