import { useNavigation } from "@react-navigation/native";
import { setToken } from "@uplift-ltd/apollo";
import React from "react";
import { Clipboard, Text, Alert } from "react-native";
import { Button } from "./common";

const getClipboardValue = async () => {
  let value = "";
  try {
    value = await Clipboard.getString();
    if (!value) {
      throw new Error("Failed to get value");
    }
  } catch (err) {
    Alert.alert(err.message);
    throw err;
  }
  return value;
};

const getMagicLinkValues = (link: string) => {
  const pathWithParams = link?.split("/").pop();
  const params = pathWithParams?.split("?").pop()?.split("&");
  const [, ktoken] = params ? params[0].split("=") : [];
  const [, email] = params ? params[1].split("=") : [];
  return { email, ktoken };
};

const defaultOnToken: MagicLoginProps["onToken"] = ({ token }) => {
  setToken(token);
};

interface MagicLoginProps {
  onMagicLink?: ({ email, ktoken }: { email: string; ktoken: string }) => void;
  onToken?: ({ token }: { token: string }) => void;
}

export const MagicLogin: React.FC<MagicLoginProps> = ({
  onMagicLink,
  onToken = defaultOnToken,
} = {}) => {
  const navigation = useNavigation();

  // TODO: make apollo call directly and reload the app?
  const defaultOnMagicLink: MagicLoginProps["onMagicLink"] = ({ email, ktoken }) => {
    navigation.navigate("Login", { email, ktoken });
  };

  return (
    <>
      <Text>Copy the magic link or token to your clipboard then press one of the buttons!</Text>
      <Button
        onPress={async () => {
          const clipboardValue = await getClipboardValue();
          const { email, ktoken } = getMagicLinkValues(clipboardValue);
          (onMagicLink || defaultOnMagicLink)({ email, ktoken });
        }}
      >
        Login Magic Link
      </Button>
      <Button
        onPress={async () => {
          const clipboardValue = await getClipboardValue();
          onToken({ token: clipboardValue });
        }}
      >
        Login Magic Link
      </Button>
    </>
  );
};
