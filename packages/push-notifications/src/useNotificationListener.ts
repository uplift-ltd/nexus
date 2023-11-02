import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";

import { Subscription } from "./types.js";

export type NotificationReceivedListener = (event: Notifications.Notification) => void;

export type NotificationResponseReceivedListener = (
  event: Notifications.NotificationResponse
) => void;

export interface UseNotificationListenerOptions {
  onReceived?: NotificationReceivedListener;
  onResponseReceived?: NotificationResponseReceivedListener;
}

export interface UseNotificationListenerResult {
  notificationReceivedListener: React.MutableRefObject<Subscription | undefined>;
  notificationResponseReceivedListener: React.MutableRefObject<Subscription | undefined>;
}

export function useNotificationListener({
  onReceived,
  onResponseReceived,
}: UseNotificationListenerOptions): UseNotificationListenerResult {
  const notificationReceivedListener = useRef<Subscription>();
  const notificationResponseReceivedListener = useRef<Subscription>();

  useEffect(() => {
    if (onReceived) {
      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationReceivedListener.current =
        Notifications.addNotificationReceivedListener(onReceived);
    }

    if (onResponseReceived) {
      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      notificationResponseReceivedListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          onResponseReceived(response);
        });
    }

    return () => {
      if (notificationReceivedListener.current) {
        Notifications.removeNotificationSubscription(notificationReceivedListener.current);
      }
      if (notificationResponseReceivedListener.current) {
        Notifications.removeNotificationSubscription(notificationResponseReceivedListener.current);
      }
    };
  }, [onReceived, onResponseReceived]);

  return {
    notificationReceivedListener,
    notificationResponseReceivedListener,
  };
}
