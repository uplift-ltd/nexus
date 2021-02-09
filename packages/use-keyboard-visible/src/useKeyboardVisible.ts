import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export enum KeyboardShowEvents {
  keyboardWillShow = "keyboardWillShow",
  keyboardDidShow = "keyboardDidShow",
}

export enum KeyboardHideEvents {
  keyboardWillHide = "keyboardWillHide",
  keyboardDidHide = "keyboardDidHide",
}

export interface UseKeyboardVisibleOptions {
  showEvent?: KeyboardShowEvents;
  hideEvent?: KeyboardHideEvents;
}

export function useKeyboardVisible({
  showEvent = KeyboardShowEvents.keyboardWillShow,
  hideEvent = KeyboardHideEvents.keyboardWillHide,
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
