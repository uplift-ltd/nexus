---
title: screen-views
---

## Installation

    yarn add @uplift-ltd/screen-views

## API

### ScreenSafeAreaView

Like `SafeAreaView` from `react-native-safe-area-context` but without the `top` edge. For use in
react-navigation screens.

```tsx
import { ScreenSafeAreaView } from "@uplift-ltd/screen-views";

function MyScreen() {
  return (
    <ScreenSafeAreaView>
      <View />
    </ScreenSafeAreaView>
  );
}
```
