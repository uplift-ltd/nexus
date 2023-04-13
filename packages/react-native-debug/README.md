# @uplift-ltd/react-native-debug

## Installation

    npm i --save @uplift-ltd/react-native-debug

## API

### DebugNavigator

Mount the navigator somewhere and navigate to it!

```tsx
import { DebugNavigator } from "@uplift-ltd/react-native-debug";

function Root() {
  return (
    <RootStackNavigator.Navigator>
      <RootStackNavigator.Screen
        name={DEV_ZONE}
        component={DebugNavigator}
        initialParams={{ headerShown: false, verifyScreen: "Verify" }}
      />
    </RootStackNavigator.Navigator>
  );
}

function SomeScreen({ navigation }) {
  return <Logo onLongPress={() => navigation.navigate(DEV_ZONE)} />;
}
```
