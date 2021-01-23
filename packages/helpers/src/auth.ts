import { GQL_TOKEN } from "./constants";

export const getToken = () => localStorage.getItem(GQL_TOKEN);
export const getAssertToken = () => {
  const token = getToken();

  if (!token) {
    throw new Error("Must be logged in for this action");
  }

  return token;
};
export const removeToken = () => localStorage.removeItem(GQL_TOKEN);
