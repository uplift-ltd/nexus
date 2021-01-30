import { useNotificationPermission } from "@uplift-ltd/push-notifications";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Button, Input } from "./common";

export const PushToken: React.FC = () => {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [data, setData] = useState("");
  const { registerPushNotifications } = useNotificationPermission();

  useEffect(() => {
    registerPushNotifications()
      .then(({ token }) => setPushToken(token))
      .catch((err) => Alert.alert(err.message));
  }, [registerPushNotifications]);

  return (
    <>
      <Input value={title} placeholder="title" onChangeText={setTitle} />
      <Input value={body} placeholder="body" onChangeText={setBody} />
      <Input value={data} placeholder="data" onChangeText={setData} />
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
                data: JSON.parse(data || "{}"),
              }),
            });
          } catch (err) {
            Alert.alert(err.message);
          }
        }}
      >
        Send Push
      </Button>
    </>
  );
};
