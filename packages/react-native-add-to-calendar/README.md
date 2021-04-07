# @uplift-ltd/react-native-add-to-calendar

## Installation

    yarn add @uplift-ltd/react-native-add-to-calendar

## API

### AddToCalendarScreen

Add the screen to the Main/Root stack navigator (as a react-navigation modal).

```tsx
import {
  AddToCalendarScreen,
  AddToCalendarScreenOptions,
} from "@uplift-ltd/react-native-add-to-calendar";

<RootStackNavigator.Screen
  name={Routes.AddToCalendar}
  component={AddToCalendarScreen}
  options={AddToCalendarScreenOptions}
/>;
```

Then navigate to it:

```ts
navigation.navigate(Routes.AddToCalendar, {
  event: {
    title: "Event Title",
    startDate: new Date("2020-04-01").toISOString(),
    endDate: new Date("2021-04-01").toISOString(),
    location: "Boulder, CO",
    url: "https://www.uplift.ltd",
    notes: "That's my purse! I don't know you!",
  },
});
```

You can define the screen types like this in RootStackParamList:

```ts
import {
  AddToCalendarNavigatorParamList,
  AddToCalendarScreens,
} from "@uplift-ltd/react-native-add-to-calendar";

type RootStackParamList = {
  [Routes.AddToCalendar]: AddToCalendarNavigatorParamList[AddToCalendarScreens.ADD_TO_CALENDAR];
};
```

Add the calendar permissions for Android in `app.config.*.ts`:

```ts
{
  android: {
    permissions: ["READ_CALENDAR", "WRITE_CALENDAR"];
  }
}
```
