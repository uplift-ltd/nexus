import { useContext, useEffect } from "react";
import { NotificationContext } from "./NotificationContext";

export const NotificationPrompt: React.FC = () => {
  const { registerPushNotifications } = useContext(NotificationContext);
  useEffect(() => {
    registerPushNotifications();
  }, [registerPushNotifications]);
  return null;
};
