---
title: react-native-screen-views
---

## Installation

    yarn add @uplift-ltd/react-native-screen-views

## API

### ScreenSafeAreaView

Like `SafeAreaView` from `react-native-safe-area-context` but without the `top` edge. For use in
react-navigation screens.

```tsx
import { ScreenSafeAreaView } from "@uplift-ltd/react-native-screen-views";

function MyScreen() {
  return (
    <ScreenSafeAreaView>
      <View />
    </ScreenSafeAreaView>
  );
}
```

### KeyboardScreenSafeAreaView

Like `ScreenSafeAreaView` but can provide different edges when keyboard is open. Defaults to `left`
and `right`.

```tsx
import { KeyboardScreenSafeAreaView } from "@uplift-ltd/react-native-screen-views";

function MyScreen() {
  return (
    <KeyboardScreenSafeAreaView
      // defaults shown
      edges={["bottom", "left", "right"]}
      keyboardEdges={["left", "right"]}
    >
      <View />
    </KeyboardScreenSafeAreaView>
  );
}
```

### ScreenKeyboardAvoidingView

Keyboard avoiding view that takes into account the height of the react-navigation stack header.
Defaults to `flex: 1` for convenience. Uses `padding` on iOS and `height` on Android.

**Note:** The value of `useHeaderHeight` from `@react-navigation/stack` must be correct. That means
the header height must be set according to react-navigation docs.

```tsx
import { ScreenKeyboardAvoidingView } from "@uplift-ltd/react-native-screen-views";

function MyScreen() {
  return (
    <ScreenKeyboardAvoidingView>
      <View />
    </ScreenKeyboardAvoidingView>
  );
}
```
