import React, { useContext, useMemo, useReducer } from "react";

// ### AuthContext

// Stores token and providers functions for setting and removing.

// ```tsx
// import { AuthContext, useAuthContext } from "@uplift-ltd/apollo";

// // call this for app init, in SSR call for every render
// const restoreToken = () => {
//   return localStorage.getItem("GRAPHQL_TOKEN");
// };

// // call this when user logs in
// const setToken = (token: string) => {
//   localStorage.setItem("GRAPHQL_TOKEN", token);
// };

// // call this on logout
// const removeToken = (token: string) => {
//   localStorage.removeItem("GRAPHQL_TOKEN");
// };

// const Root: React.FC = () => {
//   return (
//     <AuthProvider restoreToken={restoreToken} setToken={setToken} removeToken={removeToken}>
//       <ChildComponent />
//     </AuthProvider>
//   );
// };

// const ChildComponent: React.FC = () => {
//   // these functions set the value in the context and the callbacks defined by the consumer
//   const { restoreToken, setToken, removeToken, token, loading } = useAuthContext();
//   return <h1>Hello world</h1>;
// };
// ```

// Loading is `true` until `restoreToken` is called.

// #### Clearing the Token

// If Apollo receives a 401 (Unauthorized), the recommended pattern is to redirect to logout.

// ```tsx
// import { useAuthContext } from "@uplift-ltd/apollo";
// import { Redirect } from "react-router-dom";

// const LogoutRoute: React.FC = () => {
//   const { removeToken } = useAuthContext();
//   return <Redirect to="/" />;
// };
// ```

// On React Native you might do something like this:

// ```tsx
// import { useNavigation } from "@react-navigation/native";
// import React, { useEffect } from "react";
// import { Text } from "react-native";

// export const LogoutAndRedirect: React.FC = () => {
//   const navigation = useNavigation();
//   const { removeToken } = useAuthContext();

//   useEffect(() => {
//     async function removeTokenAndRedirect() {
//       await removeToken();
//       navigation.navigate("Home");
//     }
//     removeTokenAndRedirect();
//   }, [navigation, signOut]);

//   return <Text>Logging you out...</Text>;
// };
// ```

export const AuthContext = React.createContext<AuthContextShape>({
  removeToken: () => null,
  setToken: () => null,
  token: undefined,
});

export interface AuthContextShape {
  removeToken: () => void;
  setToken: (token: string) => void;
  token?: null | string;
}

interface AuthState {
  token: null | string;
}

type AuthToken = null | string;

type AuthAction = { token: AuthToken; type: "SET_TOKEN" } | { type: "REMOVE_TOKEN" };

const reducer = (prevState: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_TOKEN":
      return {
        ...prevState,
        token: action.token,
      };
    case "REMOVE_TOKEN":
      return {
        ...prevState,
        token: null,
      };
    default:
      return prevState;
  }
};

interface AuthProviderProps {
  children: React.ReactNode | React.ReactNode[];
  onRemoveToken: () => Promise<void> | void;
  onSetToken: (token: null | string) => Promise<void> | void;
  removeToken: () => Promise<void> | void;
  setToken: (token: string) => Promise<void> | void;
}

export function AuthProvider({
  children,
  onRemoveToken,
  onSetToken,
  removeToken,
  setToken,
}: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    token: null,
  });

  const value = useMemo(
    () => ({
      removeToken: async () => {
        await removeToken();
        onRemoveToken && (await onRemoveToken());
        dispatch({ type: "REMOVE_TOKEN" });
      },
      setToken: async (token: string) => {
        await setToken(token);
        onSetToken && (await onSetToken(token));
        dispatch({ token, type: "SET_TOKEN" });
      },
      token: state.token,
    }),
    [onRemoveToken, onSetToken, removeToken, setToken, state.token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  return useContext<AuthContextShape>(AuthContext);
};
