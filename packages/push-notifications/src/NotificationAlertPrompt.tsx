import { captureException } from "@uplift-ltd/sentry";
import { PermissionStatus } from "expo-permissions";
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

export const NotificationAlertPrompt: React.FC<NotificationAlertPromptProps> = ({
  title = "Please Allow Notifications",
  message = "This application uses notifications to keep you up to date on new activity.",
  acceptLabel = "Enable",
  cancelLabel = "Not Now",
  onRegisterResult,
}) => {
  const { permissionStatus, registerPushNotifications } = useContext(NotificationContext);

  useEffect(() => {
    if (permissionStatus === PermissionStatus.UNDETERMINED) {
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
};
