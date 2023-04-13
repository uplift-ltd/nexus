import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { Button } from "./common.js";
import { DebugScreens } from "./screens.js";
import { DebugNavigatorParamList } from "./types.js";

export type HomeProps = StackScreenProps<DebugNavigatorParamList, DebugScreens.DEBUG_MAGIC_LOGIN>;

export function Home({ navigation }: HomeProps) {
  return (
    <>
      <Button onPress={() => navigation.navigate(DebugScreens.DEBUG_INFO)}>Info</Button>
      <Button onPress={() => navigation.navigate(DebugScreens.DEBUG_MAGIC_LOGIN)}>
        Magic Login
      </Button>
      <Button onPress={() => navigation.navigate(DebugScreens.DEBUG_PUSH_TOKEN)}>
        Push Notifications
      </Button>
    </>
  );
}
