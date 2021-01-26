import { useContext, useEffect } from "react";
import { NotificationContext } from "./NotificationContext";

export const NotificationPrompt: React.FC = () => {
  const { registerForNotifications } = useContext(NotificationContext);
  useEffect(() => {
    registerForNotifications();
  }, [registerForNotifications]);
  return null;
};
