import { RefObject } from "react";

import { PermissionStatus, Subscription } from "./types.js";
import { UseNotificationHandlerOptions, useNotificationHandler } from "./useNotificationHandler.js";
import {
  UseNotificationListenerOptions,
  useNotificationListener,
} from "./useNotificationListener.js";
import {
  RegisterPushNotifications,
  UseNotificationPermissionOptions,
  useNotificationPermission,
} from "./useNotificationPermission.js";

export type UsePushNotificationsOptions = UseNotificationHandlerOptions &
  UseNotificationListenerOptions &
  UseNotificationPermissionOptions;

export type UsePushNotificationsResult = {
  notificationReceivedListener: RefObject<Subscription | undefined>;
  notificationResponseReceivedListener: RefObject<Subscription | undefined>;
  permissionStatus: PermissionStatus | null;
  registerPushNotifications: RegisterPushNotifications;
  setPermissionStatus: (status: PermissionStatus) => void;
};

export function usePushNotifications({
  handler,
  onReceived,
  onRegisterPushNotifications,
  onResponseReceived,
  registerForPushNotifications,
}: UsePushNotificationsOptions): UsePushNotificationsResult {
  useNotificationHandler({ handler });

  const { notificationReceivedListener, notificationResponseReceivedListener } =
    useNotificationListener({ onReceived, onResponseReceived });

  const { permissionStatus, registerPushNotifications, setPermissionStatus } =
    useNotificationPermission({ onRegisterPushNotifications, registerForPushNotifications });

  return {
    notificationReceivedListener,
    notificationResponseReceivedListener,
    permissionStatus,
    registerPushNotifications,
    setPermissionStatus,
  };
}
