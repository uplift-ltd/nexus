import * as Calendar from "expo-calendar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

// expo-calendar doesn't export this
type OptionalKeys<T> = {
  [P in keyof T]?: T[P] | null;
};

export type OptionalKeysEvent = OptionalKeys<Calendar.Event>;

const defaultOnPermissionsErrorHandler = (err: Error) => {
  Alert.alert(err.message);
};

export type UseCalendarsParams = {
  permissionsErrorText?: string;
  onPermissionsError?: (err: Error) => void;
};

export type UseCalendarsResult = {
  calendars: Calendar.Calendar[];
  writeableCalendars: Calendar.Calendar[];
  primaryCalendar: Calendar.Calendar | undefined;
  addEventToCalendar: (
    event: OptionalKeysEvent,
    calendar: Calendar.Calendar
  ) => ReturnType<typeof Calendar.createEventAsync>;
};

export const useCalendars = ({
  permissionsErrorText = "We need access to your calendars to add the event.",
  onPermissionsError = defaultOnPermissionsErrorHandler,
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
        onPermissionsError(err);
      }
    })();
  }, [onPermissionsError, permissionsErrorText]);

  const addEventToCalendar = useCallback(
    (event: OptionalKeysEvent, calendar: Calendar.Calendar) => {
      return Calendar.createEventAsync(calendar.id, event);
    },
    []
  );

  return useMemo(
    () => ({
      calendars,
      writeableCalendars: calendars.filter((cal) => cal.allowsModifications),
      primaryCalendar: calendars.filter((cal) => cal.isPrimary)[0],
      addEventToCalendar,
    }),
    [calendars, addEventToCalendar]
  );
};
