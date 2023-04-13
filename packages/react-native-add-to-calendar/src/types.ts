import { AddToCalendarProps } from "./AddToCalendar.js";
import { AddToCalendarHeaderProps } from "./AddToCalendarHeader.js";
import { AddToCalendarScreens } from "./screens.js";

export type AddToCalendarNavigatorParamList = {
  [AddToCalendarScreens.ADD_TO_CALENDAR]: AddToCalendarProps & AddToCalendarHeaderProps;
};
