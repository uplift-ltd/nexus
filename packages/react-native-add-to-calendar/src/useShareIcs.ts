import { captureException } from "@uplift-ltd/sentry-react-native";
import * as Calendar from "expo-calendar";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as Sharing from "expo-sharing";
import { DateArray, EventAttributes, createEvent } from "ics";
import { useCallback } from "react";
import { Platform } from "react-native";

const dateToDateArray = (date: Date): DateArray => [
  date.getFullYear(),
  date.getMonth() + 1,
  date.getDate(),
  date.getHours(),
  date.getMinutes(),
];

export const useShareIcs = () => {
  return useCallback(async (event: Calendar.Event) => {
    try {
      const icsFile = await generateIcsFile(calendarEventToEventAttributes(event));
      const filePath = `${FileSystem.cacheDirectory}-${event.title}-event.ics`;
      await saveToFile(filePath, icsFile);

      if (Platform.OS === "android") {
        const fileUri = await FileSystem.getContentUriAsync(filePath);
        return await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: fileUri,
          flags: 1,
        });
      }
      // assumed iOS
      return await Sharing.shareAsync(filePath);
    } catch (err) {
      captureException(err);
      throw err;
    }
  }, []);
};

function calendarEventToEventAttributes({
  endDate,
  location,
  notes,
  startDate,
  title,
  url,
  ...event
}: Calendar.Event): EventAttributes {
  return {
    description: notes,
    end: dateToDateArray(new Date(endDate)),
    location,
    start: dateToDateArray(new Date(startDate)),
    status: "CONFIRMED",
    title,
    url,
  };
}

function generateIcsFile(event: EventAttributes) {
  return new Promise<string>((resolve, reject) => {
    createEvent(event, (error, value) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(value);
    });
  });
}

function saveToFile(filePath: string, content: string) {
  return FileSystem.writeAsStringAsync(filePath, content);
}
