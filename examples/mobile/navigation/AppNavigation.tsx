import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  AddToCalendarScreen,
  AddToCalendarScreens,
  AddToCalendarScreenOptions,
} from "@uplift-ltd/react-native-add-to-calendar";
import React from "react";

import AddToCalendar, { addToCalendarOptions } from "../components/AddToCalendar";
import HomeScreen, { homeScreenOptions } from "../components/HomeScreen";
import Screens from "./screens";
import { RootStackParamList } from "./types";

const AppNavigator = createStackNavigator<RootStackParamList>();

function AppNavigation() {
  return (
    <NavigationContainer>
      <AppNavigator.Navigator initialRouteName={Screens.HOME_SCREEN}>
        <AppNavigator.Screen
          name={Screens.HOME_SCREEN}
          component={HomeScreen}
          options={homeScreenOptions}
        />
        <AppNavigator.Screen
          name={Screens.ADD_TO_CALENDAR}
          component={AddToCalendar}
          options={addToCalendarOptions}
        />
        <AppNavigator.Screen
          name={AddToCalendarScreens.ADD_TO_CALENDAR}
          component={AddToCalendarScreen}
          options={AddToCalendarScreenOptions}
        />
      </AppNavigator.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
