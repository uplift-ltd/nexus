import * as Notifications from "expo-notifications";
import { PermissionStatus } from "expo-permissions";
import { RefObject } from "react";
import { useNotificationHandler } from "./useNotificationHandler";
import { useNotificationListener, UseNotificationListenerOptions } from "./useNotificationListener";
import {
  useNotificationPermission,
  UseNotificationPermissionOptions,
} from "./useNotificationPermission";
import { Subscription } from "./types";

export type UsePushNotificationsOptions = {
  handler?: Notifications.NotificationHandler;
} & UseNotificationListenerOptions &
  UseNotificationPermissionOptions;

export type UsePushNotificationsResult = {
  notificationReceivedListener: RefObject<Subscription | undefined>;
  notificationResponseReceivedListener: RefObject<Subscription | undefined>;
  permissionStatus: PermissionStatus | null;
  setPermissionStatus: (status: PermissionStatus) => void;
  registerForNotifications: () => Promise<{
    token: string | null;
    status: PermissionStatus | null;
  }>;
};

export function usePushNotifications({
  handler,
  onReceived,
  onResponseReceived,
  onRegisterForNotifications,
}: UsePushNotificationsOptions): UsePushNotificationsResult {
  useNotificationHandler(handler);

  const {
    notificationReceivedListener,
    notificationResponseReceivedListener,
  } = useNotificationListener({ onReceived, onResponseReceived });

  const {
    permissionStatus,
    setPermissionStatus,
    registerForNotifications,
  } = useNotificationPermission({ onRegisterForNotifications });

  return {
    notificationReceivedListener,
    notificationResponseReceivedListener,
    permissionStatus,
    setPermissionStatus,
    registerForNotifications,
  };
}
