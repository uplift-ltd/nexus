// expo-notifications doesn't export these

import { IosAuthorizationStatus, NotificationPermissionsStatus } from "expo-notifications";

export type PermissionStatus = NotificationPermissionsStatus;

export { IosAuthorizationStatus };

export type Subscription = {
  remove: () => void;
};
