---
title: react-native-updates
---

## Installation

    yarn add @uplift-ltd/react-native-updates

## API

### useExpoUpdates

Use this hook to let users load the latest OTA updates.

```tsx
import { useExpoUpdates } from "@uplift-ltd/react-native-updates";

function MyComponent() {
  const { canUpdate, updateLoading, updateReady, reloadAsync } = useExpoUpdates();

  return (
    <>
      {updateReady && <Button onPress={reloadAsync}>Update available! Tap to reload.</Button>}
      <App />
    </>
  );
}
```
