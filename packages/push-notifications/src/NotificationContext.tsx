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
  registerForNotifications: () => Promise.resolve({ token: null, status: null }),
});

type NotificationProviderProps = UsePushNotificationsOptions;

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  handler,
  onReceived,
  onResponseReceived,
  onRegisterForNotifications,
}) => {
  const {
    permissionStatus,
    setPermissionStatus,
    registerForNotifications,
    notificationReceivedListener,
    notificationResponseReceivedListener,
  } = usePushNotifications({
    handler,
    onReceived,
    onResponseReceived,
    onRegisterForNotifications,
  });

  const value = useMemo(() => {
    return {
      permissionStatus,
      setPermissionStatus,
      registerForNotifications,
      notificationReceivedListener,
      notificationResponseReceivedListener,
    };
  }, [
    permissionStatus,
    setPermissionStatus,
    registerForNotifications,
    notificationReceivedListener,
    notificationResponseReceivedListener,
  ]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
