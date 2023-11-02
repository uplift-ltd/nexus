import { captureException } from "@uplift-ltd/sentry-react-native";
import { IosAuthorizationStatus } from "expo-notifications";
import { useContext, useEffect } from "react";
import { Alert } from "react-native";

import { NotificationContext } from "./NotificationContext.js";
import { RegisterPushNotificationsResult } from "./useNotificationPermission.js";

interface NotificationAlertPromptProps {
  acceptLabel?: string;
  cancelLabel?: string;
  message?: string;
  onRegisterResult?: (result: RegisterPushNotificationsResult) => void;
  title?: string;
}

export function NotificationAlertPrompt({
  acceptLabel = "Enable",
  cancelLabel = "Not Now",
  message = "This application uses notifications to keep you up to date on new activity.",
  onRegisterResult,
  title = "Please Allow Notifications",
}: NotificationAlertPromptProps) {
  const { permissionStatus, registerPushNotifications } = useContext(NotificationContext);

  useEffect(() => {
    if (permissionStatus?.ios?.status === IosAuthorizationStatus.NOT_DETERMINED) {
      Alert.alert(title, message, [
        { style: "cancel", text: cancelLabel },
        {
          onPress: async () => {
            try {
              const result = await registerPushNotifications();
              onRegisterResult?.(result);
            } catch (err) {
              captureException(err);
            }
          },
          text: acceptLabel,
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
