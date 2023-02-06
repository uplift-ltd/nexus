import { StackNavigationOptions, StackScreenProps } from "@react-navigation/stack";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { AddToCalendar } from "./AddToCalendar";
import { AddToCalendarHeader } from "./AddToCalendarHeader";
import { AddToCalendarScreens } from "./screens";
import { AddToCalendarNavigatorParamList } from "./types";

export type AddToCalendarScreenProps = StackScreenProps<
  AddToCalendarNavigatorParamList,
  AddToCalendarScreens.ADD_TO_CALENDAR
>;

export function AddToCalendarScreen({ navigation, route }: AddToCalendarScreenProps) {
  const { event } = route.params;
  const handleClose = useCallback(() => navigation.pop(), [navigation]);

  return (
    <View style={styles.root}>
      <AddToCalendarHeader event={event} onRequestClose={handleClose} />
      <AddToCalendar event={event} onRequestClose={handleClose} />
    </View>
  );
}

export const AddToCalendarScreenOptions: StackNavigationOptions = {
  title: "Add Event",
  headerShown: false,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
