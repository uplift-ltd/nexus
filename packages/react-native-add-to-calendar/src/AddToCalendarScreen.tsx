import { StackNavigationOptions, StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, View } from "react-native";
import { AddToCalendar } from "./AddToCalendar";
import { AddToCalendarHeader } from "./AddToCalendarHeader";
import { AddToCalendarScreens } from "./screens";
import { AddToCalendarNavigatorParamList } from "./types";

export type AddToCalendarScreenProps = StackScreenProps<
  AddToCalendarNavigatorParamList,
  AddToCalendarScreens.ADD_TO_CALENDAR
>;

export const AddToCalendarScreen: React.FC<AddToCalendarScreenProps> = ({ navigation, route }) => {
  return (
    <View style={styles.root}>
      <AddToCalendarHeader
        sharePath={route.params.sharePath}
        onRequestClose={() => navigation.pop()}
      />
      <AddToCalendar event={route.params.event} onRequestClose={() => navigation.pop()} />
    </View>
  );
};

export const AddToCalendarScreenOptions: StackNavigationOptions = {
  title: "Add Event",
  headerShown: false,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
