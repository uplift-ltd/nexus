import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export interface RegisterForPushNotificationsOptions {
  channelId?: string;
  channel?: Notifications.NotificationChannelInput;
}

export type RegisterForPushNotificationsResult = string | null;

export type RegisterForPushNotifications = (
  options?: RegisterForPushNotificationsOptions
) => Promise<RegisterForPushNotificationsResult>;

export const registerForPushNotifications: RegisterForPushNotifications = async ({
  channelId = "default",
  channel = {
    name: channelId,
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
  },
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
