import { StackScreenProps } from "@react-navigation/stack";
import { useNotificationPermission } from "@uplift-ltd/push-notifications";
import { ensureError } from "@uplift-ltd/ts-helpers";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Button, Input } from "./common";
import { DebugScreens } from "./screens";
import { DebugNavigatorParamList } from "./types";

type PushTokenProps = StackScreenProps<DebugNavigatorParamList, DebugScreens.DEBUG_PUSH_TOKEN>;

export const PushToken: React.FC<PushTokenProps> = () => {
  const [values, setValues] = useState(() => ({
    pushToken: "",
    title: "",
    body: "",
    data: "",
    category: "",
    channelId: "",
  }));

  const makeChangeHandler = (name: keyof typeof values) => (value: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { registerPushNotifications } = useNotificationPermission();

  useEffect(() => {
    registerPushNotifications()
      .then(({ token }) =>
        setValues((prev) => ({
          ...prev,
          pushToken: token || "",
        }))
      )
      .catch((err) => Alert.alert(err.message));
  }, [registerPushNotifications]);

  const { pushToken, title, body, data, category, channelId } = values;

  return (
    <>
      <Input value={title} placeholder="title" onChangeText={makeChangeHandler("title")} />
      <Input value={body} placeholder="body" onChangeText={makeChangeHandler("body")} />
      <Input value={data} placeholder="data" onChangeText={makeChangeHandler("data")} />
      <Input
        value={category}
        placeholder="iOS Category"
        onChangeText={makeChangeHandler("category")}
      />
      <Input
        value={channelId}
        placeholder="Android ChannelId"
        onChangeText={makeChangeHandler("channelId")}
      />
      <Button
        onPress={async () => {
          try {
            await fetch("https://exp.host/--/api/v2/push/send", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                to: pushToken,
                sound: "default",
                title,
                body,
                _category: category,
                channelId,
                data: JSON.parse(data || "{}"),
              }),
            });
          } catch (err) {
            const error = ensureError(err);
            Alert.alert(error.message);
          }
        }}
      >
        Send Push
      </Button>
    </>
  );
};
