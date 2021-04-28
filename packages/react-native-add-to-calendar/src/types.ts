import * as Calendar from "expo-calendar";
import { AddToCalendarProps } from "./AddToCalendar";
import { AddToCalendarHeaderProps } from "./AddToCalendarHeader";
import { AddToCalendarScreens } from "./screens";

export type AddToCalendarNavigatorParamList = {
  [AddToCalendarScreens.ADD_TO_CALENDAR]: AddToCalendarProps & AddToCalendarHeaderProps;
};
