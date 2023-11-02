import React, { useMemo } from "react";

import { Subscription } from "./types.js";
import {
  UsePushNotificationsOptions,
  UsePushNotificationsResult,
  usePushNotifications,
} from "./usePushNotifications.js";

export const NotificationContext = React.createContext<UsePushNotificationsResult>({
  notificationReceivedListener: React.createRef<Subscription | undefined>(),
  notificationResponseReceivedListener: React.createRef<Subscription | undefined>(),
  permissionStatus: null,
  registerPushNotifications: () => Promise.resolve({ status: null, token: null }),
  setPermissionStatus: () => {
    // do nothing
  },
});

type NotificationProviderProps = {
  children: React.ReactNode | React.ReactNode[];
} & UsePushNotificationsOptions;

export function NotificationProvider({
  children,
  handler,
  onReceived,
  onRegisterPushNotifications,
  onResponseReceived,
  registerForPushNotifications,
}: NotificationProviderProps) {
  const {
    notificationReceivedListener,
    notificationResponseReceivedListener,
    permissionStatus,
    registerPushNotifications,
    setPermissionStatus,
  } = usePushNotifications({
    handler,
    onReceived,
    onRegisterPushNotifications,
    onResponseReceived,
    registerForPushNotifications,
  });

  const value = useMemo(() => {
    return {
      notificationReceivedListener,
      notificationResponseReceivedListener,
      permissionStatus,
      registerPushNotifications,
      setPermissionStatus,
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
