import Sentry from "@uplift-ltd/sentry";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { PermissionStatus } from "expo-permissions";
import { useEffect, useState, useCallback } from "react";
import { registerForPushNotifications } from "./registerForPushNotifications";

export type RegisterForNotificationsResult = {
  token: string | null;
  status: PermissionStatus | null;
};

export type RegisterForNotifications = () => Promise<RegisterForNotificationsResult>;

export interface UseNotificationPermissionOptions {
  onRegisterForNotifications?: (result: RegisterForNotificationsResult) => void;
}

export function useNotificationPermission({
  onRegisterForNotifications,
}: UseNotificationPermissionOptions) {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus | null>(null);

  const updatePermissionStatus = useCallback(async () => {
    let status = null;
    try {
      status = (await Notifications.getPermissionsAsync()).status;
      setPermissionStatus(status);
    } catch (err) {
      Sentry.captureException(err);
    }
    return status;
  }, []);

  useEffect(() => {
    if (Constants.isDevice) {
      updatePermissionStatus();
    }
  }, [updatePermissionStatus]);

  const registerForNotifications: RegisterForNotifications = useCallback(async () => {
    const token = await registerForPushNotifications();
    const status = await updatePermissionStatus();
    if (onRegisterForNotifications) {
      await onRegisterForNotifications({ token, status });
    }
    return { token, status };
  }, [onRegisterForNotifications, updatePermissionStatus]);

  return { permissionStatus, setPermissionStatus, registerForNotifications };
}
