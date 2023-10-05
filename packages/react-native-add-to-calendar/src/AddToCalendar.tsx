import { MaterialIcons } from "@expo/vector-icons";
import { captureException } from "@uplift-ltd/sentry-react-native";
import { ensureError } from "@uplift-ltd/ts-helpers";
import * as Calendar from "expo-calendar";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCalendars } from "./useCalendars.js";

const reportAndDisplayError = (err: Error) => {
  captureException(err);
  Alert.alert(err.message);
};

export interface AddToCalendarProps {
  event: Calendar.Event;
  onEventAdded?: (calendar: Calendar.Calendar, event: Calendar.Event) => void;
  onRequestClose: () => void;
}

export function AddToCalendar({ event, onEventAdded, onRequestClose }: AddToCalendarProps) {
  const { addEventToCalendar, primaryCalendar, writeableCalendars } = useCalendars({
    onPermissionsError: reportAndDisplayError,
  });

  const [selectedCalendar, setSelectedCalendar] = useState<Calendar.Calendar | null>(null);

  useEffect(() => {
    const firstModifiableCalendar = writeableCalendars[0];
    setSelectedCalendar(primaryCalendar ?? firstModifiableCalendar ?? null);
  }, [primaryCalendar, writeableCalendars]);

  const dates = [event.startDate, event.endDate]
    .filter(Boolean)
    .map((d) => new Date(d as Date | string));

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.bodyContentContainer} style={styles.body}>
        <View style={styles.eventMeta}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDates}>
            {dates.map((date) => date?.toLocaleString()).join(" – ")}
          </Text>
          {!!event.location && <Text style={styles.eventLocation}>{event.location}</Text>}
          {!!event.url && <Text style={styles.eventUrl}>{event.location}</Text>}
          {!!event.notes && <Text style={styles.eventNotes}>{event.notes}</Text>}
        </View>
        <View style={styles.calendars}>
          {writeableCalendars.map((calendar, i) => (
            <View
              key={calendar.id}
              style={[styles.calendar, i === writeableCalendars.length - 1 && styles.calendarLast]}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSelectedCalendar(calendar)}
                style={styles.calendarBody}
              >
                <View style={[styles.calendarColor, { backgroundColor: calendar.color }]} />
                <Text style={styles.calendarTitle}>{calendar.title}</Text>
                <MaterialIcons
                  color={calendar === selectedCalendar ? "green" : "transparent"}
                  name="check"
                  size={24}
                  style={styles.calendarSelectedIcon}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={async () => {
          try {
            if (!selectedCalendar) {
              throw new Error("Please select a calendar to add the event to.");
            }

            await addEventToCalendar(event, selectedCalendar);
            onEventAdded?.(selectedCalendar, event);
            onRequestClose();
          } catch (err) {
            reportAndDisplayError(ensureError(err));
          }
        }}
        disabled={!selectedCalendar}
        style={styles.button}
      >
        <SafeAreaView edges={["bottom", "left", "right"]}>
          <Text style={styles.buttonText}>Add to Calendar</Text>
        </SafeAreaView>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {},
  bodyContentContainer: {
    flex: 1,
  },
  button: {
    backgroundColor: "#1a202c",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  calendar: {
    borderTopColor: "lightgray",
    borderTopWidth: 1,
  },
  calendarBody: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  calendarColor: {
    borderRadius: 100,
    height: 12,
    marginRight: 10,
    width: 12,
  },
  calendarLast: {
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
  },
  calendarSelectedIcon: {
    marginLeft: "auto",
  },
  calendarTitle: {},
  calendars: {
    marginTop: 20,
  },
  eventDates: {
    color: "gray",
    marginBottom: 10,
  },
  eventLocation: {
    color: "gray",
    marginBottom: 10,
  },
  eventMeta: {
    padding: 16,
  },
  eventNotes: {
    color: "gray",
  },
  eventTitle: {
    fontSize: 24,
    marginBottom: 10,
  },
  eventUrl: {
    color: "gray",
    marginBottom: 10,
  },
  middle: {
    flex: 1,
  },
  root: {
    backgroundColor: "white",
    flex: 1,
  },
});
