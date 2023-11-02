import { captureException } from "@uplift-ltd/sentry-react-native";
import Constants from "expo-constants";
import { getPermissionsAsync } from "expo-notifications";
import { useCallback, useEffect, useState } from "react";

import {
  RegisterForPushNotifications,
  RegisterForPushNotificationsResult,
  registerForPushNotifications as defaultRegisterForPushNotifications,
} from "./registerForPushNotifications.js";
import { PermissionStatus } from "./types.js";

export type RegisterPushNotificationsResult = {
  status: PermissionStatus | null;
  token: null | string;
};

export type RegisterPushNotifications = () => Promise<RegisterPushNotificationsResult>;

export type OnRegisterPushNotifications = (result: RegisterPushNotificationsResult) => void;

export interface UseNotificationPermissionOptions {
  onRegisterPushNotifications?: OnRegisterPushNotifications;
  registerForPushNotifications?: RegisterForPushNotifications;
}

export interface UseNotificationPermissionResult {
  permissionStatus: PermissionStatus | null;
  registerPushNotifications: RegisterPushNotifications;
  setPermissionStatus: (status: PermissionStatus) => void;
}

export function useNotificationPermission({
  onRegisterPushNotifications,
  registerForPushNotifications = defaultRegisterForPushNotifications,
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
        await onRegisterPushNotifications({ status, token });
      }
    } catch (err) {
      captureException(err);
      throw err;
    }
    return { status, token };
  }, [registerForPushNotifications, onRegisterPushNotifications, updatePermissionStatus]);

  return { permissionStatus, registerPushNotifications, setPermissionStatus };
}
