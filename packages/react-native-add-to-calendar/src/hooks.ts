import Sentry from "@uplift-ltd/sentry";
import * as Calendar from "expo-calendar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

import { OptionalKeysEvent } from "./types";

export type UseCalendarsParams = {
  errorText?: string;
};

export type UseCalendarsResult = {
  calendars: Calendar.Calendar[];
  writeableCalendars: Calendar.Calendar[];
  primaryCalendar: Calendar.Calendar | undefined;
};

export const useCalendars = ({
  errorText = "We need access to your calendars to add the event.",
}: UseCalendarsParams = {}) => {
  const [calendars, setCalendars] = useState<Calendar.Calendar[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === "granted") {
          const cals = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
          setCalendars(cals);
        } else {
          throw new Error(errorText);
        }
      } catch (err) {
        Sentry.captureException(err);
        Alert.alert(err.message);
      }
    })();
  }, [errorText]);

  return useMemo(
    () => ({
      calendars,
      writeableCalendars: calendars.filter((cal) => cal.allowsModifications),
      primaryCalendar: calendars.filter((cal) => cal.isPrimary)[0],
    }),
    [calendars]
  );
};

export const useAddEventToCalendar = () => {
  return useCallback((event: OptionalKeysEvent, calendar: Calendar.Calendar) => {
    return Calendar.createEventAsync(calendar.id, event);
  }, []);
};
