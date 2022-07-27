// expo-notifications doesn't export these

import { NotificationPermissionsStatus, IosAuthorizationStatus } from "expo-notifications";

export type PermissionStatus = NotificationPermissionsStatus;

export { IosAuthorizationStatus };

export type Subscription = {
  remove: () => void;
};
