import { GRAPHQL_TOKEN } from "./constants.js";

export const getToken = () => localStorage.getItem(GRAPHQL_TOKEN);

export const getAssertToken = () => {
  const token = getToken();

  if (!token) {
    throw new Error("Must be logged in for this action");
  }

  return token;
};

export const setToken = (token: string) => localStorage.setItem(GRAPHQL_TOKEN, token);

export const removeToken = () => localStorage.removeItem(GRAPHQL_TOKEN);
