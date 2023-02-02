import { captureException } from "@uplift-ltd/sentry-react-native";
import { IosAuthorizationStatus } from "expo-notifications";
// Note: I think this should stay put for React <v18
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useContext, useEffect } from "react";
import { Alert } from "react-native";
import { NotificationContext } from "./NotificationContext";
import { RegisterPushNotificationsResult } from "./useNotificationPermission";

interface NotificationAlertPromptProps {
  title?: string;
  message?: string;
  acceptLabel?: string;
  cancelLabel?: string;
  onRegisterResult?: (result: RegisterPushNotificationsResult) => void;
}

export function NotificationAlertPrompt({
  title = "Please Allow Notifications",
  message = "This application uses notifications to keep you up to date on new activity.",
  acceptLabel = "Enable",
  cancelLabel = "Not Now",
  onRegisterResult,
}: NotificationAlertPromptProps) {
  const { permissionStatus, registerPushNotifications } = useContext(NotificationContext);

  useEffect(() => {
    if (permissionStatus?.ios?.status === IosAuthorizationStatus.NOT_DETERMINED) {
      Alert.alert(title, message, [
        { text: cancelLabel, style: "cancel" },
        {
          text: acceptLabel,
          onPress: async () => {
            try {
              const result = await registerPushNotifications();
              onRegisterResult?.(result);
            } catch (err) {
              captureException(err);
            }
          },
        },
      ]);
    }
  }, [
    title,
    message,
    acceptLabel,
    cancelLabel,
    permissionStatus,
    registerPushNotifications,
    onRegisterResult,
  ]);

  return null;
}
