import { PermissionStatus } from "expo-permissions";
import React, { useContext } from "react";
import { NotificationContext } from "./NotificationContext";
import { UsePushNotificationsResult } from "./usePushNotifications";

export interface NotificationRenderPromptProps {
  children: ({
    permissionStatus,
    registerForNotifications,
  }: {
    permissionStatus: PermissionStatus;
    registerForNotifications: UsePushNotificationsResult["registerForNotifications"];
  }) => React.ReactNode;
}

export const NotificationRenderPrompt: React.FC<NotificationRenderPromptProps> = ({ children }) => {
  const { permissionStatus, registerForNotifications } = useContext(NotificationContext);

  if (permissionStatus === PermissionStatus.UNDETERMINED) {
    return <>{children({ permissionStatus, registerForNotifications })}</>;
  }

  return null;
};
