import { MaterialIcons } from "@expo/vector-icons";
import { captureException } from "@uplift-ltd/sentry";
import { ensureError } from "@uplift-ltd/ts-helpers";
import * as Calendar from "expo-calendar";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCalendars } from "./useCalendars";

const reportAndDisplayError = (err: Error) => {
  captureException(err);
  Alert.alert(err.message);
};

export interface AddToCalendarProps {
  event: Calendar.Event;
  onEventAdded?: (calendar: Calendar.Calendar, event: Calendar.Event) => void;
  onRequestClose: () => void;
}

export const AddToCalendar: React.FC<AddToCalendarProps> = ({
  event,
  onEventAdded,
  onRequestClose,
}) => {
  const { writeableCalendars, primaryCalendar, addEventToCalendar } = useCalendars({
    onPermissionsError: reportAndDisplayError,
  });

  const [selectedCalendar, setSelectedCalendar] = useState<Calendar.Calendar | null>(null);

  useEffect(() => {
    const firstModifiableCalendar = writeableCalendars[0];
    setSelectedCalendar(primaryCalendar ?? firstModifiableCalendar ?? null);
  }, [primaryCalendar, writeableCalendars]);

  const dates = [event.startDate, event.endDate]
    .filter(Boolean)
    .map((d) => new Date(d as string | Date));

  return (
    <View style={styles.root}>
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContentContainer}>
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
                style={styles.calendarBody}
                onPress={() => setSelectedCalendar(calendar)}
                activeOpacity={0.7}
              >
                <View style={[styles.calendarColor, { backgroundColor: calendar.color }]} />
                <Text style={styles.calendarTitle}>{calendar.title}</Text>
                <MaterialIcons
                  style={styles.calendarSelectedIcon}
                  color={calendar === selectedCalendar ? "green" : "transparent"}
                  name="check"
                  size={24}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.button}
        disabled={!selectedCalendar}
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
      >
        <SafeAreaView edges={["bottom", "left", "right"]}>
          <Text style={styles.buttonText}>Add to Calendar</Text>
        </SafeAreaView>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    flex: 1,
  },
  middle: {
    flex: 1,
  },
  bodyContentContainer: {
    flex: 1,
  },
  body: {},
  eventMeta: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 24,
    marginBottom: 10,
  },
  eventDates: {
    color: "gray",
    marginBottom: 10,
  },
  eventLocation: {
    color: "gray",
    marginBottom: 10,
  },
  eventUrl: {
    color: "gray",
    marginBottom: 10,
  },
  eventNotes: {
    color: "gray",
  },
  calendars: {
    marginTop: 20,
  },
  calendar: {
    borderTopWidth: 1,
    borderTopColor: "lightgray",
  },
  calendarLast: {
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  calendarBody: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  calendarColor: {
    borderRadius: 100,
    height: 12,
    width: 12,
    marginRight: 10,
  },
  calendarTitle: {},
  calendarSelectedIcon: {
    marginLeft: "auto",
  },
  button: {
    backgroundColor: "#1a202c",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});
