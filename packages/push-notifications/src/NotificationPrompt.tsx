import { useContext, useEffect } from "react";
import { NotificationContext } from "./NotificationContext";

export function NotificationPrompt() {
  const { registerPushNotifications } = useContext(NotificationContext);

  useEffect(() => {
    registerPushNotifications();
  }, [registerPushNotifications]);

  return null;
}
