import React, { useMemo } from "react";
import { Subscription } from "./types";
import {
  usePushNotifications,
  UsePushNotificationsOptions,
  UsePushNotificationsResult,
} from "./usePushNotifications";

export const NotificationContext = React.createContext<UsePushNotificationsResult>({
  permissionStatus: null,
  setPermissionStatus: () => {
    // do nothing
  },
  notificationReceivedListener: React.createRef<Subscription | undefined>(),
  notificationResponseReceivedListener: React.createRef<Subscription | undefined>(),
  registerPushNotifications: () => Promise.resolve({ token: null, status: null }),
});

type NotificationProviderProps = {
  children: React.ReactNode | React.ReactNode[];
} & UsePushNotificationsOptions;

export function NotificationProvider({
  children,
  handler,
  onReceived,
  onResponseReceived,
  onRegisterPushNotifications,
  registerForPushNotifications,
}: NotificationProviderProps) {
  const {
    permissionStatus,
    setPermissionStatus,
    registerPushNotifications,
    notificationReceivedListener,
    notificationResponseReceivedListener,
  } = usePushNotifications({
    handler,
    onReceived,
    onResponseReceived,
    onRegisterPushNotifications,
    registerForPushNotifications,
  });

  const value = useMemo(() => {
    return {
      permissionStatus,
      setPermissionStatus,
      registerPushNotifications,
      notificationReceivedListener,
      notificationResponseReceivedListener,
    };
  }, [
    permissionStatus,
    setPermissionStatus,
    registerPushNotifications,
    notificationReceivedListener,
    notificationResponseReceivedListener,
  ]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
