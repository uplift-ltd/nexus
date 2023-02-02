import { RefObject } from "react";
import { PermissionStatus, Subscription } from "./types";
import { useNotificationHandler, UseNotificationHandlerOptions } from "./useNotificationHandler";
import { useNotificationListener, UseNotificationListenerOptions } from "./useNotificationListener";
import {
  useNotificationPermission,
  UseNotificationPermissionOptions,
  RegisterPushNotifications,
} from "./useNotificationPermission";

export type UsePushNotificationsOptions = UseNotificationHandlerOptions &
  UseNotificationListenerOptions &
  UseNotificationPermissionOptions;

export type UsePushNotificationsResult = {
  permissionStatus: PermissionStatus | null;
  setPermissionStatus: (status: PermissionStatus) => void;
  notificationReceivedListener: RefObject<Subscription | undefined>;
  notificationResponseReceivedListener: RefObject<Subscription | undefined>;
  registerPushNotifications: RegisterPushNotifications;
};

export function usePushNotifications({
  handler,
  onReceived,
  onResponseReceived,
  registerForPushNotifications,
  onRegisterPushNotifications,
}: UsePushNotificationsOptions): UsePushNotificationsResult {
  useNotificationHandler({ handler });

  const { notificationReceivedListener, notificationResponseReceivedListener } =
    useNotificationListener({ onReceived, onResponseReceived });

  const { permissionStatus, setPermissionStatus, registerPushNotifications } =
    useNotificationPermission({ registerForPushNotifications, onRegisterPushNotifications });

  return {
    notificationReceivedListener,
    notificationResponseReceivedListener,
    permissionStatus,
    setPermissionStatus,
    registerPushNotifications,
  };
}
