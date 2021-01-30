import React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { Button } from "./common";
import { DEBUG_INFO_SCREEN, DEBUG_MAGIC_LOGIN_SCREEN, DEBUG_PUSH_TOKEN_SCREEN } from "./screens";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HomeProps = StackScreenProps<any, any>;

export const Home: React.FC<HomeProps> = ({ navigation }) => {
  return (
    <>
      <Button onPress={() => navigation.navigate(DEBUG_INFO_SCREEN)}>Info</Button>
      <Button onPress={() => navigation.navigate(DEBUG_MAGIC_LOGIN_SCREEN)}>Magic Login</Button>
      <Button onPress={() => navigation.navigate(DEBUG_PUSH_TOKEN_SCREEN)}>
        Push Notifications
      </Button>
    </>
  );
};
