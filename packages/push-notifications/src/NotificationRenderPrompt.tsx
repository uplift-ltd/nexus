import React, { useContext } from "react";
import { NotificationContext } from "./NotificationContext.js";
import { IosAuthorizationStatus, PermissionStatus } from "./types.js";
import { UsePushNotificationsResult } from "./usePushNotifications.js";

export interface NotificationRenderPromptProps {
  children: ({
    permissionStatus,
    registerPushNotifications,
  }: {
    permissionStatus: PermissionStatus;
    registerPushNotifications: UsePushNotificationsResult["registerPushNotifications"];
  }) => React.ReactNode;
}

export function NotificationRenderPrompt({ children }: NotificationRenderPromptProps) {
  const { permissionStatus, registerPushNotifications } = useContext(NotificationContext);

  if (permissionStatus?.ios?.status === IosAuthorizationStatus.NOT_DETERMINED) {
    return <>{children({ permissionStatus, registerPushNotifications })}</>;
  }

  return null;
}
