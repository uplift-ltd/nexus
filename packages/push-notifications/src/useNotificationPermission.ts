import { captureException } from "@uplift-ltd/sentry-react-native";
import Constants from "expo-constants";
import { getPermissionsAsync } from "expo-notifications";
import { useEffect, useState, useCallback } from "react";
import {
  registerForPushNotifications as defaultRegisterForPushNotifications,
  RegisterForPushNotifications,
  RegisterForPushNotificationsResult,
} from "./registerForPushNotifications.js";
import { PermissionStatus } from "./types.js";

export type RegisterPushNotificationsResult = {
  token: string | null;
  status: PermissionStatus | null;
};

export type RegisterPushNotifications = () => Promise<RegisterPushNotificationsResult>;

export type OnRegisterPushNotifications = (result: RegisterPushNotificationsResult) => void;

export interface UseNotificationPermissionOptions {
  registerForPushNotifications?: RegisterForPushNotifications;
  onRegisterPushNotifications?: OnRegisterPushNotifications;
}

export interface UseNotificationPermissionResult {
  permissionStatus: PermissionStatus | null;
  setPermissionStatus: (status: PermissionStatus) => void;
  registerPushNotifications: RegisterPushNotifications;
}

export function useNotificationPermission({
  registerForPushNotifications = defaultRegisterForPushNotifications,
  onRegisterPushNotifications,
}: UseNotificationPermissionOptions = {}): UseNotificationPermissionResult {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus | null>(null);

  const updatePermissionStatus = useCallback(async () => {
    let status = null;
    try {
      status = await getPermissionsAsync();
      setPermissionStatus(status);
    } catch (err) {
      captureException(err);
    }
    return status;
  }, []);

  useEffect(() => {
    if (Constants.isDevice) {
      updatePermissionStatus();
    }
  }, [updatePermissionStatus]);

  const registerPushNotifications: RegisterPushNotifications = useCallback(async () => {
    let token: RegisterForPushNotificationsResult;
    let status: PermissionStatus | null;
    try {
      token = await registerForPushNotifications();
      status = await updatePermissionStatus();
      if (onRegisterPushNotifications) {
        await onRegisterPushNotifications({ token, status });
      }
    } catch (err) {
      captureException(err);
      throw err;
    }
    return { token, status };
  }, [registerForPushNotifications, onRegisterPushNotifications, updatePermissionStatus]);

  return { permissionStatus, setPermissionStatus, registerPushNotifications };
}
