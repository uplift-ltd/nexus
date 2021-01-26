import { PermissionStatus } from "expo-permissions";
import React, { useContext } from "react";
import { NotificationContext } from "./NotificationContext";
import { UsePushNotificationsResult } from "./usePushNotifications";

export interface NotificationRenderPromptProps {
  children: ({
    permissionStatus,
    registerPushNotifications,
  }: {
    permissionStatus: PermissionStatus;
    registerPushNotifications: UsePushNotificationsResult["registerPushNotifications"];
  }) => React.ReactNode;
}

export const NotificationRenderPrompt: React.FC<NotificationRenderPromptProps> = ({ children }) => {
  const { permissionStatus, registerPushNotifications } = useContext(NotificationContext);

  if (permissionStatus === PermissionStatus.UNDETERMINED) {
    return <>{children({ permissionStatus, registerPushNotifications })}</>;
  }

  return null;
};
