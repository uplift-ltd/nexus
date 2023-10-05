import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export interface RegisterForPushNotificationsOptions {
  channel?: Notifications.NotificationChannelInput;
  channelId?: string;
}

export type RegisterForPushNotificationsResult = null | string;

export type RegisterForPushNotifications = (
  options?: RegisterForPushNotificationsOptions
) => Promise<RegisterForPushNotificationsResult>;

export const registerForPushNotifications: RegisterForPushNotifications = async ({
  channel = {
    importance: Notifications.AndroidImportance.MAX,
    lightColor: "#FF231F7C",
    name: channelId,
    vibrationPattern: [0, 250, 250, 250],
  },
  channelId = "default",
} = {}) => {
  let token = null;

  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return null;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(channelId, channel);
  }

  return token;
};
