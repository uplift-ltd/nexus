import * as SecureStore from "expo-secure-store";
import { GQL_TOKEN } from "./constants";

export const getToken = () => SecureStore.getItemAsync(GQL_TOKEN);
export const getAssertToken = async () => {
  const token = await getToken();

  if (!token) {
    throw new Error("Must be logged in for this action");
  }

  return token;
};
export const removeToken = () => SecureStore.deleteItemAsync(GQL_TOKEN);
