import { GRAPHQL_TOKEN } from "@uplift-ltd/apollo";
import * as SecureStore from "expo-secure-store";

export const getToken = () => SecureStore.getItemAsync(GRAPHQL_TOKEN);

export const getAssertToken = async () => {
  const token = await getToken();

  if (!token) {
    throw new Error("Must be logged in for this action");
  }

  return token;
};

export const setToken = (token: string) => SecureStore.setItemAsync(GRAPHQL_TOKEN, token);

export const removeToken = () => SecureStore.deleteItemAsync(GRAPHQL_TOKEN);
