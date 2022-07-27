import { useNavigation } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { setToken } from "@uplift-ltd/apollo";
import { ensureError } from "@uplift-ltd/ts-helpers";
import { getStringAsync } from "expo-clipboard";
import { reloadAsync } from "expo-updates";
import React from "react";
import { Alert, Text, StyleSheet } from "react-native";
import { Button } from "./common";
import { DebugScreens } from "./screens";
import { DebugNavigatorParamList } from "./types";

const getClipboardValue = async () => {
  let value = "";
  try {
    value = await getStringAsync();
    if (!value) {
      throw new Error("Failed to get value");
    }
  } catch (err) {
    const error = ensureError(err);
    Alert.alert(error.message);
    throw error;
  }
  return value;
};

const getQueryParams = (link: string) => {
  const result: Record<string, string> = {};
  const params = link?.split("?").pop()?.split("&");
  params?.forEach((param) => {
    const [key, value] = param.split("=");
    result[key] = value;
  });
  return result;
};

type MagicLoginProps = StackScreenProps<DebugNavigatorParamList, DebugScreens.DEBUG_MAGIC_LOGIN>;

export const MagicLogin: React.FC<MagicLoginProps> = ({ route }) => {
  const navigation = useNavigation();

  return (
    <>
      <Text style={styles.text}>
        Copy the magic link or token to your clipboard then press one of the buttons!
      </Text>
      <Button
        onPress={async () => {
          const clipboardValue = await getClipboardValue();
          const queryParams = getQueryParams(clipboardValue);
          navigation.navigate(route.params?.verifyScreen || "Verify", queryParams);
        }}
      >
        Verify Magic Link
      </Button>
      <Button
        onPress={async () => {
          const clipboardValue = await getClipboardValue();
          setToken(clipboardValue);
        }}
      >
        Set Token
      </Button>
      <Button onPress={reloadAsync}>Reload</Button>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    padding: 20,
  },
});
