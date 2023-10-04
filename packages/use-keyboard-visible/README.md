# @uplift-ltd/use-keyboard-visible

## Installation

    npm i --save @uplift-ltd/use-keyboard-visible

## API

### useKeyboardVisible

Hook for react-native keyboard visibility.

```ts
import { useKeyboardVisible } from "@uplift-ltd/use-keyboard-visible";

function MyComponent() {
  const keyboardVisible = useKeyboardVisible();
}
```

Defaults to using `keyboardWillShow` and `keyboardWillHide` events. Can pass in `keyboardDidShow`
and `keyboardDidHide` instead.

```ts
import {
  useKeyboardVisible,
  KeyboardShowEvents,
  KeyboardHideEvents,
} from "@uplift-ltd/use-keyboard-visible";

function MyComponent() {
  const keyboardVisible = useKeyboardVisible({
    showEvent: KeyboardShowEvents.keyboardDidShow,
    hideEvent: KeyboardHideEvents.keyboardDidHide,
  });
}
```
