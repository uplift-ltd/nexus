import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

export enum KeyboardShowEvents {
  keyboardDidShow = "keyboardDidShow",
  keyboardWillShow = "keyboardWillShow",
}

export enum KeyboardHideEvents {
  keyboardDidHide = "keyboardDidHide",
  keyboardWillHide = "keyboardWillHide",
}

export interface UseKeyboardVisibleOptions {
  hideEvent?: KeyboardHideEvents;
  showEvent?: KeyboardShowEvents;
}

// Android does not support "will" events, but it's likely better UX for iOS
const defaultShowEvent =
  Platform.OS === "ios" ? KeyboardShowEvents.keyboardWillShow : KeyboardShowEvents.keyboardDidShow;

const defaultHideEvent =
  Platform.OS === "ios" ? KeyboardHideEvents.keyboardWillHide : KeyboardHideEvents.keyboardDidHide;

export function useKeyboardVisible({
  hideEvent = defaultHideEvent,
  showEvent = defaultShowEvent,
}: UseKeyboardVisibleOptions = {}) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showListener = Keyboard.addListener(showEvent, () => {
      setKeyboardVisible(true);
    });
    const hideListener = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
    });

    return () => {
      hideListener.remove();
      showListener.remove();
    };
  }, [showEvent, hideEvent]);

  return keyboardVisible;
}
