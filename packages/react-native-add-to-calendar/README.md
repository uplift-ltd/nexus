# @uplift-ltd/react-native-add-to-calendar

## Installation

    yarn add @uplift-ltd/react-native-add-to-calendar

## API

### useCalendars

Hook that exposes some common calendaring helpers and automatically requests the proper permissions.

```tsx
import { useCalendars } from "uplift-ltd/react-native-add-to-calendar";

const Event = ({ event }) => {
  const { writeableCalendars, addEventToCalendar } = useCalendars();

  const handleAddEvent = useCallback(
    async (calendar: Calendar.Calendar) => {
      try {
        await addEventToCalendar(event, calendar);
        Alert.alert("Event added!");
      } catch (err) {
        Alert.alert(err.message);
      }
    },
    [addEventToCalendar, event]
  );

  return (
    <View>
      {writeableCalendars.map((cal) => (
        <Pressable key={cal.id} onPress={() => handleAddEvent(cal)}>
          <Text>{cal.title}</Text>
        </Pressable>
      ))}
    </View>
  );
};
```

### useShareIcs

Hook that gives convenient access to sharing an ICS file. This is a nicer method of adding events to
the calendar for Android that doesn't require extra permissions.

```tsx
import { useShareIcs } from "uplift-ltd/react-native-add-to-calendar";

const Event = ({ event }) => {
  const shareIcs = useShareIcs();

  const handleAddEvent = useCallback(
    async (event: Calendar.Event) => {
      try {
        await shareIcs(event);
        Alert.alert("Event added!");
      } catch (err) {
        Alert.alert(err.message);
      }
    },
    [shareIcs, event]
  );

  return (
    <View>
      {events.map((e) => (
        <Pressable key={e.id} onPress={() => handleAddEvent(e)}>
          <Text>{e.title}</Text>
        </Pressable>
      ))}
    </View>
  );
};
```

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
