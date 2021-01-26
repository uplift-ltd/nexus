import * as Notifications from "expo-notifications";
import { useEffect } from "react";

const DEFAULT_HANDLER: Notifications.NotificationHandler = {
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
};

export type UseNotificationHandlerOptions = {
  handler?: Notifications.NotificationHandler;
};

export function useNotificationHandler({
  handler = DEFAULT_HANDLER,
}: UseNotificationHandlerOptions = {}) {
  useEffect(() => {
    Notifications.setNotificationHandler(handler);
  }, [handler]);
}
