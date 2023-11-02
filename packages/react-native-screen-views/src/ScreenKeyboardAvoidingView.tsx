import { useHeaderHeight } from "@react-navigation/stack";
import React from "react";
import { KeyboardAvoidingView, KeyboardAvoidingViewProps, Platform } from "react-native";

interface ScreenKeyboardAvoidingViewProps extends KeyboardAvoidingViewProps {
  androidBehavior?: KeyboardAvoidingViewProps["behavior"];
  children: React.ReactNode | React.ReactNode[];
  iosBehavior?: KeyboardAvoidingViewProps["behavior"];
}

export function ScreenKeyboardAvoidingView({
  androidBehavior = "height",
  children,
  iosBehavior = "padding",
  style = { flex: 1 },
  ...props
}: ScreenKeyboardAvoidingViewProps) {
  const headerHeight = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? iosBehavior : androidBehavior}
      keyboardVerticalOffset={headerHeight}
      style={style}
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
