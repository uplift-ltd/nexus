import * as Notifications from "expo-notifications";
import { useEffect } from "react";

const DEFAULT_HANDLER: Notifications.NotificationHandler = {
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
};

export function useNotificationHandler(
  handler: Notifications.NotificationHandler = DEFAULT_HANDLER
) {
  useEffect(() => {
    Notifications.setNotificationHandler(handler);
  }, [handler]);
}
