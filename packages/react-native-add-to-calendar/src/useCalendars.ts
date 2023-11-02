import { captureException } from "@uplift-ltd/sentry-react-native";
import { ensureError } from "@uplift-ltd/ts-helpers";
import * as Calendar from "expo-calendar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

const defaultOnPermissionsErrorHandler = (err: Error) => {
  Alert.alert(err.message);
};

export type UseCalendarsParams = {
  onPermissionsError?: (err: Error) => void;
  permissionsErrorText?: string;
};

export type UseCalendarsResult = {
  addEventToCalendar: (
    event: Calendar.Event,
    calendar: Calendar.Calendar
  ) => ReturnType<typeof Calendar.createEventAsync>;
  calendars: Calendar.Calendar[];
  primaryCalendar: Calendar.Calendar | undefined;
  writeableCalendars: Calendar.Calendar[];
};

export const useCalendars = ({
  onPermissionsError = defaultOnPermissionsErrorHandler,
  permissionsErrorText = "We need access to your calendars to add the event.",
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
          throw new Error(permissionsErrorText);
        }
      } catch (err) {
        captureException(err);
        onPermissionsError(ensureError(err));
      }
    })();
  }, [onPermissionsError, permissionsErrorText]);

  const addEventToCalendar = useCallback((event: Calendar.Event, calendar: Calendar.Calendar) => {
    return Calendar.createEventAsync(calendar.id, event);
  }, []);

  return useMemo(
    () => ({
      addEventToCalendar,
      calendars,
      primaryCalendar: calendars.filter((cal) => cal.isPrimary)[0],
      writeableCalendars: calendars.filter((cal) => cal.allowsModifications),
    }),
    [calendars, addEventToCalendar]
  );
};
