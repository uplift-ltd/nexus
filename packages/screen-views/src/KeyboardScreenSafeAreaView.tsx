import { useKeyboardVisible } from "@uplift-ltd/use-keyboard-visible";
import React from "react";
import { ScreenSafeAreaView, ScreenSafeAreaViewProps } from "./ScreenSafeAreaView";
import { KEYBOARD_SCREEN_EDGES } from "./constants";

interface KeyboardScreenSafeAreaViewProps extends ScreenSafeAreaViewProps {
  keyboardEdges?: ScreenSafeAreaViewProps["edges"];
}

export const KeyboardScreenSafeAreaView: React.FC<KeyboardScreenSafeAreaViewProps> = ({
  edges,
  keyboardEdges = KEYBOARD_SCREEN_EDGES,
  ...props
}) => {
  const keyboardVisible = useKeyboardVisible();
  return <ScreenSafeAreaView edges={keyboardVisible ? keyboardEdges : edges} {...props} />;
};
