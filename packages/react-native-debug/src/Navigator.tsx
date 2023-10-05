import { StackScreenProps, createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Home } from "./Home.js";
import { Info } from "./Info.js";
import { MagicLogin } from "./MagicLogin.js";
import { PushToken } from "./PushToken.js";
import { DebugScreens } from "./screens.js";
import { DebugNavigatorParamList } from "./types.js";

export const DebugStackNavigator = createStackNavigator<DebugNavigatorParamList>();

export type DebugNavigatorProps = StackScreenProps<DebugNavigatorParamList, DebugScreens.DEBUG>;

export function DebugNavigator({ route }: DebugNavigatorProps) {
  return (
    <DebugStackNavigator.Navigator screenOptions={{ headerShown: route.params.headerShown }}>
      <DebugStackNavigator.Screen
        component={Home}
        name={DebugScreens.DEBUG_HOME}
        options={{ title: "Debug" }}
      />
      <DebugStackNavigator.Screen
        component={Info}
        name={DebugScreens.DEBUG_INFO}
        options={{ title: "Info" }}
      />
      <DebugStackNavigator.Screen
        component={MagicLogin}
        initialParams={{ verifyScreen: route.params.verifyScreen }}
        name={DebugScreens.DEBUG_MAGIC_LOGIN}
        options={{ title: "Magic Login" }}
      />
      <DebugStackNavigator.Screen
        component={PushToken}
        name={DebugScreens.DEBUG_PUSH_TOKEN}
        options={{ title: "Push Token" }}
      />
    </DebugStackNavigator.Navigator>
  );
}
