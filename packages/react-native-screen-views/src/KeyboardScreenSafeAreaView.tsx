import { useKeyboardVisible, UseKeyboardVisibleOptions } from "@uplift-ltd/use-keyboard-visible";
import React from "react";
import { ScreenSafeAreaView, ScreenSafeAreaViewProps } from "./ScreenSafeAreaView";
import { KEYBOARD_SCREEN_EDGES } from "./constants";

type KeyboardScreenSafeAreaViewProps = ScreenSafeAreaViewProps &
  UseKeyboardVisibleOptions & {
    keyboardEdges?: ScreenSafeAreaViewProps["edges"];
  };

export function KeyboardScreenSafeAreaView({
  edges,
  keyboardEdges = KEYBOARD_SCREEN_EDGES,
  showEvent,
  hideEvent,
  ...props
}: KeyboardScreenSafeAreaViewProps) {
  const keyboardVisible = useKeyboardVisible({ showEvent, hideEvent });
  return <ScreenSafeAreaView edges={keyboardVisible ? keyboardEdges : edges} {...props} />;
}
