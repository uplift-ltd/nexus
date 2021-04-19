import * as Calendar from "expo-calendar";
import { AddToCalendarProps } from "./AddToCalendar";
import { AddToCalendarHeaderProps } from "./AddToCalendarHeader";
import { AddToCalendarScreens } from "./screens";

export type AddToCalendarNavigatorParamList = {
  [AddToCalendarScreens.ADD_TO_CALENDAR]: AddToCalendarProps & AddToCalendarHeaderProps;
};

// expo-calendar doesn't export this
type OptionalKeys<T> = {
  [P in keyof T]?: T[P] | null;
};

export type OptionalKeysEvent = OptionalKeys<Calendar.Event>;
