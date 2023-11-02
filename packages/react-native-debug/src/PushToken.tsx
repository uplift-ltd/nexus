import { StackScreenProps } from "@react-navigation/stack";
import { useNotificationPermission } from "@uplift-ltd/push-notifications";
import { ensureError } from "@uplift-ltd/ts-helpers";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";

import { Button, Input } from "./common.js";
import { DebugScreens } from "./screens.js";
import { DebugNavigatorParamList } from "./types.js";

export type PushTokenProps = StackScreenProps<
  DebugNavigatorParamList,
  DebugScreens.DEBUG_PUSH_TOKEN
>;

export function PushToken(_props: PushTokenProps) {
  const [values, setValues] = useState(() => ({
    body: "",
    category: "",
    channelId: "",
    data: "",
    pushToken: "",
    title: "",
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

  const { body, category, channelId, data, pushToken, title } = values;

  return (
    <>
      <Input onChangeText={makeChangeHandler("title")} placeholder="title" value={title} />
      <Input onChangeText={makeChangeHandler("body")} placeholder="body" value={body} />
      <Input onChangeText={makeChangeHandler("data")} placeholder="data" value={data} />
      <Input
        onChangeText={makeChangeHandler("category")}
        placeholder="iOS Category"
        value={category}
      />
      <Input
        onChangeText={makeChangeHandler("channelId")}
        placeholder="Android ChannelId"
        value={channelId}
      />
      <Button
        onPress={async () => {
          try {
            await fetch("https://exp.host/--/api/v2/push/send", {
              body: JSON.stringify({
                _category: category,
                body,
                channelId,
                data: JSON.parse(data || "{}"),
                sound: "default",
                title,
                to: pushToken,
              }),
              headers: {
                Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
              },
              method: "POST",
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
}
