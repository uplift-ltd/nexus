import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { Button } from "./common";
import { DebugScreens } from "./screens";
import { DebugNavigatorParamList } from "./types";

type HomeProps = StackScreenProps<DebugNavigatorParamList, DebugScreens.DEBUG_MAGIC_LOGIN>;

export const Home: React.FC<HomeProps> = ({ navigation }) => {
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
};
