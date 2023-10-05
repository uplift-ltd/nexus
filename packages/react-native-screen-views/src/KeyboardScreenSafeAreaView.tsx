import { UseKeyboardVisibleOptions, useKeyboardVisible } from "@uplift-ltd/use-keyboard-visible";
import React from "react";
import { ScreenSafeAreaView, ScreenSafeAreaViewProps } from "./ScreenSafeAreaView.js";
import { KEYBOARD_SCREEN_EDGES } from "./constants.js";

type KeyboardScreenSafeAreaViewProps = ScreenSafeAreaViewProps &
  UseKeyboardVisibleOptions & {
    keyboardEdges?: ScreenSafeAreaViewProps["edges"];
  };

export function KeyboardScreenSafeAreaView({
  edges,
  hideEvent,
  keyboardEdges = KEYBOARD_SCREEN_EDGES,
  showEvent,
  ...props
}: KeyboardScreenSafeAreaViewProps) {
  const keyboardVisible = useKeyboardVisible({ hideEvent, showEvent });
  return <ScreenSafeAreaView edges={keyboardVisible ? keyboardEdges : edges} {...props} />;
}
