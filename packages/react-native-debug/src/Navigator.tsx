import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import {
  DEBUG_HOME_SCREEN,
  DEBUG_INFO_SCREEN,
  DEBUG_MAGIC_LOGIN_SCREEN,
  DEBUG_PUSH_TOKEN_SCREEN,
} from "./screens";
import { Home } from "./Home";
import { Info } from "./Info";
import { MagicLogin } from "./MagicLogin";
import { PushToken } from "./PushToken";

export const DebugStackNavigator = createStackNavigator();

interface DebugNavigatorProps {
  headerShown?: boolean;
}

export const DebugNavigator: React.FC<DebugNavigatorProps> = ({
  children,
  headerShown = false,
}) => {
  return (
    <DebugStackNavigator.Navigator screenOptions={{ headerShown }}>
      <DebugStackNavigator.Screen
        name={DEBUG_HOME_SCREEN}
        component={Home}
        options={{ title: "Debug Home" }}
      />
      <DebugStackNavigator.Screen
        name={DEBUG_INFO_SCREEN}
        component={Info}
        options={{ title: "Debug Info" }}
      />
      <DebugStackNavigator.Screen
        name={DEBUG_MAGIC_LOGIN_SCREEN}
        component={MagicLogin}
        options={{ title: "Debug Magic Login" }}
      />
      <DebugStackNavigator.Screen
        name={DEBUG_PUSH_TOKEN_SCREEN}
        component={PushToken}
        options={{ title: "Debug Push Token" }}
      />
      {children}
    </DebugStackNavigator.Navigator>
  );
};
